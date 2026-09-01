"use client"

import { useEffect, useRef, useState, type ChangeEvent } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { cn } from "@/lib/utils"
import { toast } from "sonner"
import { ApiError } from "@/lib/api/client"
import { getWaypoints, createWaypoint, updateWaypoint, deleteWaypoint, getWaypoint } from "@/lib/api/waypoints"
import type { WaypointListItem } from "@/lib/api/types"
import { X, Plus, MapPin, Camera, ImageOff } from "lucide-react"

const MAX_PHOTOS_PER_WAYPOINT = 4
const RECENT_WAYPOINT_COUNT = 3

interface WaypointSectionProps {
  userExplorationId: number
  canEdit: boolean // STARTED 상태일 때만 추가/수정/삭제 가능
}

function nowLocalDateTime() {
  const now = new Date()
  const pad = (n: number) => String(n).padStart(2, "0")
  return `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}T${pad(now.getHours())}:${pad(now.getMinutes())}:00`
}

function formatWaypointTime(iso: string) {
  const d = new Date(iso)
  return `${d.getMonth() + 1}/${d.getDate()} ${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`
}

function WaypointThumb({ url }: { url: string | null }) {
  if (!url) {
    return (
      <div className="flex h-full w-full items-center justify-center text-muted-foreground">
        <ImageOff className="h-5 w-5" />
      </div>
    )
  }
  // eslint-disable-next-line @next/next/no-img-element
  return <img src={url} alt="" className="h-full w-full object-cover" />
}

export function WaypointSection({ userExplorationId, canEdit }: WaypointSectionProps) {
  const viewOnly = !canEdit // 완료 후엔 수정은 막되, 눌러서 내용 조회는 항상 가능해야 함

  const [waypoints, setWaypoints] = useState<WaypointListItem[]>([])
  const [loading, setLoading] = useState(true)
  const [showAll, setShowAll] = useState(false)
  const [newlyAddedId, setNewlyAddedId] = useState<number | null>(null)

  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [draftPhotos, setDraftPhotos] = useState<File[]>([])
  const [draftPhotoPreviews, setDraftPhotoPreviews] = useState<string[]>([])
  const [existingImages, setExistingImages] = useState<{ imageId: number; url: string }[]>([])
  const [deleteImageIds, setDeleteImageIds] = useState<number[]>([])
  const [draftMemo, setDraftMemo] = useState("")
  const [draftPlace, setDraftPlace] = useState("")
  const [draftCheckedAt, setDraftCheckedAt] = useState("")
  const [timeMode, setTimeMode] = useState<"now" | "custom">("now")
  const [saving, setSaving] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const loadWaypoints = () => {
    setLoading(true)
    getWaypoints({ userExplorationId, sortOrder: "newest", size: 50 })
      .then((res) => setWaypoints(res.items))
      .catch((err) => {
        toast.error(err instanceof ApiError ? err.message : "여정을 불러오지 못했어요.")
      })
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    loadWaypoints()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userExplorationId])

  useEffect(() => {
    return () => {
      draftPhotoPreviews.forEach((url) => URL.revokeObjectURL(url))
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // 미리보기/전체보기 둘 다 checked_at 기준으로 통일 — 화면마다 기준이 다르면 같은 항목이
  // 자리를 옮겨다녀서 오히려 헷갈림. "저장됐다"는 확인은 위치 대신 토스트로 알려줌.

  const openNewForm = () => {
    setEditingId(null)
    setDraftPhotos([])
    setDraftPhotoPreviews([])
    setExistingImages([])
    setDeleteImageIds([])
    setDraftMemo("")
    setDraftPlace("")
    setDraftCheckedAt(nowLocalDateTime())
    setTimeMode("now")
    setShowForm(true)
  }

  const openEditForm = async (waypoint: WaypointListItem) => {
    setEditingId(waypoint.waypointId)
    setDraftPhotos([])
    setDraftPhotoPreviews([])
    setDeleteImageIds([])
    setDraftMemo(waypoint.memo ?? "")
    setDraftPlace(waypoint.placeName ?? "")
    setDraftCheckedAt(waypoint.checkedAt.slice(0, 19))
    setShowForm(true)
    setExistingImages([])
    try {
      const detail = await getWaypoint(waypoint.waypointId)
      setExistingImages(detail.images)
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : "사진을 불러오지 못했어요.")
    }
  }

  const handlePhotoSelect = (e: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? [])
    if (files.length === 0) return
    const remainingSlots = MAX_PHOTOS_PER_WAYPOINT - (existingImages.length - deleteImageIds.length) - draftPhotos.length
    const toAdd = files.slice(0, Math.max(0, remainingSlots))
    setDraftPhotos((prev) => [...prev, ...toAdd])
    setDraftPhotoPreviews((prev) => [...prev, ...toAdd.map((f) => URL.createObjectURL(f))])
    e.target.value = ""
  }

  const removeDraftPhoto = (index: number) => {
    setDraftPhotos((prev) => prev.filter((_, i) => i !== index))
    setDraftPhotoPreviews((prev) => {
      URL.revokeObjectURL(prev[index])
      return prev.filter((_, i) => i !== index)
    })
  }

  const toggleDeleteExistingImage = (imageId: number) => {
    setDeleteImageIds((prev) =>
      prev.includes(imageId) ? prev.filter((id) => id !== imageId) : [...prev, imageId]
    )
  }

  const saveWaypoint = async () => {
    setSaving(true)
    try {
      if (editingId !== null) {
        await updateWaypoint(
          editingId,
          {
            memo: draftMemo,
            placeName: draftPlace,
            checkedAt: draftCheckedAt,
            deleteImageIds,
          },
          draftPhotos
        )
        toast.success("여정이 수정됐어요.")
      } else {
        const checkedAt = timeMode === "now" ? nowLocalDateTime() : draftCheckedAt
        const created = await createWaypoint(
          { userExplorationId, memo: draftMemo, placeName: draftPlace, checkedAt },
          draftPhotos
        )
        // 위치(리스트 맨 위)가 아니라 토스트로 "저장됐다"를 알림 — backdate한 항목은
        // 리스트에서 최신순 기준 자리에 그대로 들어가고, 화면 위치와 무관하게 항상 확인 가능
        toast.success("여정이 저장됐어요.")
        setNewlyAddedId(created.waypointId)
        window.setTimeout(() => {
          setNewlyAddedId((cur) => (cur === created.waypointId ? null : cur))
        }, 1500)
      }
      setShowForm(false)
      loadWaypoints()
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : "여정을 저장하지 못했어요.")
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (waypointId: number) => {
    const confirmed = window.confirm("이 여정을 삭제할까요?")
    if (!confirmed) return
    try {
      await deleteWaypoint(waypointId)
      loadWaypoints()
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : "여정을 삭제하지 못했어요.")
    }
  }

  const remainingExistingImages = existingImages.filter((img) => !deleteImageIds.includes(img.imageId))
  const totalPhotoCount = remainingExistingImages.length + draftPhotos.length

  return (
    <Card className="shadow-lg">
      <CardContent className="p-5">
        <div className="mb-1 flex items-center justify-between">
          <h3 className="font-bold text-foreground">여정</h3>
          {canEdit && (
            <Button size="sm" className="gap-1.5" onClick={openNewForm}>
              <Plus className="h-4 w-4" />
              여정 남기기
            </Button>
          )}
        </div>
        <p className="mb-3 text-xs text-muted-foreground">
          탐험하다가 생각날 때 사진 한 장 남겨보세요. 안 남겨도 괜찮아요.
        </p>

        {loading ? (
          <div className="space-y-2">
            <div className="h-16 animate-pulse rounded-xl bg-secondary" />
            <div className="h-16 animate-pulse rounded-xl bg-secondary" />
          </div>
        ) : waypoints.length === 0 ? (
          <p className="py-6 text-center text-sm text-muted-foreground">
            아직 아무것도 안 남겼어요. 생각날 때 가볍게 남겨보세요.
          </p>
        ) : (
          <div className="relative">
            <div
              className={cn(
                "space-y-2",
                !showAll && waypoints.length > RECENT_WAYPOINT_COUNT && "max-h-[168px] overflow-hidden"
              )}
            >
              {(showAll ? waypoints : waypoints.slice(0, RECENT_WAYPOINT_COUNT + (waypoints.length > RECENT_WAYPOINT_COUNT ? 1 : 0))).map((w) => (
                <div
                  key={w.waypointId}
                  className={cn(
                    "group flex items-center gap-3 rounded-xl border border-border p-3 transition-colors duration-1000",
                    w.waypointId === newlyAddedId && "border-primary/50 bg-primary/10"
                  )}
                >
                  <button
                    onClick={() => openEditForm(w)}
                    className="flex flex-1 items-center gap-3 text-left min-w-0"
                  >
                    <div className="h-14 w-14 shrink-0 overflow-hidden rounded-lg bg-gradient-to-br from-primary/10 to-accent/10">
                      <WaypointThumb url={w.thumbnailUrl} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-[11px] text-muted-foreground">
                        {formatWaypointTime(w.checkedAt)}{w.placeName && ` · ${w.placeName}`}
                      </p>
                      <p className="line-clamp-2 text-xs text-foreground">{w.memo || "(메모 없음)"}</p>
                    </div>
                  </button>
                  {canEdit && (
                    <button
                      onClick={() => handleDelete(w.waypointId)}
                      className="shrink-0 rounded-full p-1 text-muted-foreground/60 hover:text-destructive"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  )}
                </div>
              ))}
            </div>
            {!showAll && waypoints.length > RECENT_WAYPOINT_COUNT && (
              <div className="pointer-events-none absolute inset-x-0 bottom-0 h-14 bg-gradient-to-t from-card to-transparent" />
            )}
          </div>
        )}

        {waypoints.length > RECENT_WAYPOINT_COUNT && (
          <button
            onClick={() => setShowAll((v) => !v)}
            className="mt-2 w-full rounded-lg py-2 text-center text-xs font-medium text-primary hover:bg-primary/5"
          >
            {showAll ? "최근 것만 보기" : "전체 여정 보기"}
          </button>
        )}

        <Sheet open={showForm} onOpenChange={setShowForm}>
            <SheetContent side="bottom" className="max-h-[85vh] overflow-y-auto p-0">
              <div className="mx-auto w-full max-w-lg">
                <SheetHeader>
                  <SheetTitle>{viewOnly ? "여정 보기" : editingId !== null ? "여정 수정" : "새 여정"}</SheetTitle>
                </SheetHeader>

                <div className="space-y-5 px-4 pb-6">
                  {(remainingExistingImages.length > 0 || !viewOnly) && (
                    <div>
                      <div className="mb-2 flex items-center justify-between">
                        <p className="text-xs text-muted-foreground">사진 {!viewOnly && `(선택, 최대 ${MAX_PHOTOS_PER_WAYPOINT}장)`}</p>
                        {!viewOnly && (
                          <span className="text-xs text-muted-foreground">{totalPhotoCount}/{MAX_PHOTOS_PER_WAYPOINT}</span>
                        )}
                      </div>
                      <input ref={fileInputRef} type="file" accept="image/*" multiple hidden onChange={handlePhotoSelect} />
                      <div className="grid grid-cols-2 gap-2">
                        {remainingExistingImages.map((img) => (
                          <div key={img.imageId} className="relative aspect-square">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img src={img.url} alt="" className="h-full w-full rounded-xl object-cover" />
                            {!viewOnly && (
                              <button
                                onClick={() => toggleDeleteExistingImage(img.imageId)}
                                className="absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full bg-foreground text-background shadow"
                              >
                                <X className="h-3.5 w-3.5" />
                              </button>
                            )}
                          </div>
                        ))}
                        {!viewOnly && draftPhotoPreviews.map((url, i) => (
                          <div key={url} className="relative aspect-square">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img src={url} alt="" className="h-full w-full rounded-xl object-cover" />
                            <button
                              onClick={() => removeDraftPhoto(i)}
                              className="absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full bg-foreground text-background shadow"
                            >
                              <X className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        ))}
                        {!viewOnly && totalPhotoCount < MAX_PHOTOS_PER_WAYPOINT && (
                          <button
                            onClick={() => fileInputRef.current?.click()}
                            className="flex aspect-square w-full flex-col items-center justify-center gap-1.5 rounded-xl border-2 border-dashed border-border text-muted-foreground hover:border-primary/40 hover:text-primary"
                          >
                            <Camera className="h-6 w-6" />
                            <span className="text-xs">사진 추가</span>
                          </button>
                        )}
                      </div>
                    </div>
                  )}

                  {!viewOnly && editingId === null ? (
                    <div>
                      <p className="mb-2 text-xs text-muted-foreground">언제 남길까요?</p>
                      <div className="flex w-fit gap-2 rounded-full bg-secondary p-1">
                        <button
                          type="button"
                          onClick={() => setTimeMode("now")}
                          className={cn(
                            "rounded-full px-4 py-1.5 text-sm font-medium transition-all",
                            timeMode === "now" ? "bg-primary text-primary-foreground shadow" : "text-muted-foreground"
                          )}
                        >
                          지금
                        </button>
                        <button
                          type="button"
                          onClick={() => setTimeMode("custom")}
                          className={cn(
                            "rounded-full px-4 py-1.5 text-sm font-medium transition-all",
                            timeMode === "custom" ? "bg-primary text-primary-foreground shadow" : "text-muted-foreground"
                          )}
                        >
                          다른 시간
                        </button>
                      </div>
                      {timeMode === "now" ? (
                        <Input type="datetime-local" value={nowLocalDateTime().slice(0, 16)} disabled className="mt-2" />
                      ) : (
                        <Input
                          type="datetime-local"
                          value={draftCheckedAt.slice(0, 16)}
                          onChange={(e) => setDraftCheckedAt(e.target.value + ":00")}
                          className="mt-2"
                          autoFocus
                        />
                      )}
                    </div>
                  ) : (
                    <div>
                      <p className="mb-2 text-xs text-muted-foreground">날짜·시간</p>
                      <Input
                        type="datetime-local"
                        value={draftCheckedAt.slice(0, 16)}
                        onChange={(e) => setDraftCheckedAt(e.target.value + ":00")}
                        disabled={viewOnly}
                      />
                    </div>
                  )}

                  {(draftPlace || !viewOnly) && (
                    <div>
                      <p className="mb-2 text-xs text-muted-foreground">장소{!viewOnly && " (선택)"}</p>
                      <div className="relative">
                        <MapPin className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        <Input
                          value={draftPlace}
                          onChange={(e) => setDraftPlace(e.target.value)}
                          placeholder="예: 프릳츠, 우리집, 성수동 카페..."
                          className="pl-9"
                          disabled={viewOnly}
                        />
                      </div>
                    </div>
                  )}

                  {(draftMemo || !viewOnly) && (
                    <div>
                      <p className="mb-2 text-xs text-muted-foreground">한마디{!viewOnly && " (선택, 길게 써도 돼요)"}</p>
                      <Textarea
                        placeholder="오늘 어땠나요? 짧게 한 줄이어도 되고, 길게 풀어써도 돼요."
                        value={draftMemo}
                        onChange={(e) => setDraftMemo(e.target.value)}
                        className="min-h-[160px] resize-y"
                        disabled={viewOnly}
                      />
                    </div>
                  )}

                  <div className="flex gap-2 pt-2">
                    {viewOnly ? (
                      <Button variant="outline" size="lg" className="flex-1" onClick={() => setShowForm(false)}>
                        닫기
                      </Button>
                    ) : (
                      <>
                        <Button variant="outline" size="lg" className="flex-1" onClick={() => setShowForm(false)}>
                          취소
                        </Button>
                        <Button size="lg" className="flex-1" onClick={saveWaypoint} disabled={saving}>
                          {saving ? "저장 중..." : "저장"}
                        </Button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </SheetContent>
        </Sheet>
      </CardContent>
    </Card>
  )
}
