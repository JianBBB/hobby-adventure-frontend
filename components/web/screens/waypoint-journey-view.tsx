"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CheckCircle2, ImageOff, BookOpen, ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"
import { toast } from "sonner"
import { ApiError } from "@/lib/api/client"
import { getWaypoints } from "@/lib/api/waypoints"
import type { WaypointListItem } from "@/lib/api/types"

// 완료한 탐험을 돌아보는 화면 — 방금 완료했을 때뿐 아니라, 완료 탭에서 다시 들어와도 항상 이 화면을 보여줌
// (기록은 별도 기능이지만, "이 탐험의 완료 상태"를 보여주는 화면이 곧 이 회고 화면이라 기록 남기기/보러가기 버튼만 안에 얹음)
interface WaypointJourneyViewProps {
  userExplorationId: number
  explorationName: string
  explorationCategory: string
  hasRecord: boolean
  recordId: number | null
  onWriteRecord: (data: {
    mode: "create"
    userExplorationId: number
    explorationName: string
    explorationCategory: string
    draftContent: string
  }) => void
  onBack: () => void
}

function formatWaypointTime(iso: string) {
  const d = new Date(iso)
  return `${d.getMonth() + 1}/${d.getDate()} ${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`
}

function formatDateLabel(dateKey: string) {
  const [, month, day] = dateKey.split("-")
  return `${Number(month)}/${Number(day)}`
}

// 정렬 방향과 무관하게 "n일차" 번호는 항상 가장 오래된 날짜 기준으로 고정
function buildChapters(orderedWaypoints: WaypointListItem[], allWaypoints: WaypointListItem[]) {
  const distinctDatesAsc = Array.from(new Set(allWaypoints.map((w) => w.checkedAt.split("T")[0]))).sort()
  const dayNumberByDate = new Map(distinctDatesAsc.map((d, i) => [d, i + 1]))

  const chapters: { key: string; dayNumber: number; dateLabel: string; entries: WaypointListItem[] }[] = []
  for (const w of orderedWaypoints) {
    const dateKey = w.checkedAt.split("T")[0]
    const last = chapters[chapters.length - 1]
    if (last && last.key === dateKey) {
      last.entries.push(w)
    } else {
      chapters.push({
        key: dateKey,
        dayNumber: dayNumberByDate.get(dateKey) ?? 0,
        dateLabel: formatDateLabel(dateKey),
        entries: [w],
      })
    }
  }
  return chapters
}

function buildDraftSummary(waypoints: WaypointListItem[]) {
  const distinctDatesAsc = Array.from(new Set(waypoints.map((w) => w.checkedAt.split("T")[0]))).sort()
  return waypoints
    .slice()
    .sort((a, b) => a.checkedAt.localeCompare(b.checkedAt))
    .map((w) => {
      const dayNumber = distinctDatesAsc.indexOf(w.checkedAt.split("T")[0]) + 1
      return `${dayNumber}일차(${formatWaypointTime(w.checkedAt)}${w.placeName ? `, ${w.placeName}` : ""}): ${w.memo || "(메모 없음)"}`
    })
    .join("\n")
}

function WaypointThumb({ url }: { url: string | null }) {
  if (!url) {
    return (
      <div className="flex h-full w-full items-center justify-center text-muted-foreground">
        <ImageOff className="h-4 w-4" />
      </div>
    )
  }
  // eslint-disable-next-line @next/next/no-img-element
  return <img src={url} alt="" className="h-full w-full object-cover" />
}

export function WaypointJourneyView({
  userExplorationId,
  explorationName,
  explorationCategory,
  hasRecord,
  recordId,
  onWriteRecord,
  onBack,
}: WaypointJourneyViewProps) {
  const router = useRouter()
  const [waypoints, setWaypoints] = useState<WaypointListItem[]>([])
  const [loading, setLoading] = useState(true)
  const [sortOrder, setSortOrder] = useState<"oldest" | "newest">("oldest")
  const [expandedMemoIds, setExpandedMemoIds] = useState<Set<number>>(new Set())

  useEffect(() => {
    setLoading(true)
    getWaypoints({ userExplorationId, sortOrder: "oldest", size: 100 })
      .then((res) => setWaypoints(res.items))
      .catch((err) => {
        toast.error(err instanceof ApiError ? err.message : "여정을 불러오지 못했어요.")
      })
      .finally(() => setLoading(false))
  }, [userExplorationId])

  const hasWaypoints = waypoints.length > 0
  const orderedWaypoints = [...waypoints].sort((a, b) =>
    sortOrder === "oldest" ? a.checkedAt.localeCompare(b.checkedAt) : b.checkedAt.localeCompare(a.checkedAt)
  )
  const chapters = buildChapters(orderedWaypoints, waypoints)
  const draftSummary = buildDraftSummary(waypoints)

  const toggleMemoExpanded = (id: number) => {
    setExpandedMemoIds((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  const handleWriteRecord = () => {
    onWriteRecord({
      mode: "create",
      userExplorationId,
      explorationName,
      explorationCategory,
      draftContent: draftSummary,
    })
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <div className="mx-auto mb-3 flex h-16 w-16 items-center justify-center rounded-full bg-quest-success/20">
          <CheckCircle2 className="h-8 w-8 text-quest-success" />
        </div>
        <h2 className="text-xl font-bold text-foreground">탐험 완료!</h2>
        <p className="text-sm text-muted-foreground">그동안의 여정을 돌아볼까요?</p>
      </div>

      <div className="flex justify-center gap-2 rounded-full bg-secondary p-1 w-fit mx-auto">
        <button
          onClick={() => setSortOrder("oldest")}
          className={cn(
            "rounded-full px-4 py-1.5 text-sm font-medium transition-all",
            sortOrder === "oldest" ? "bg-primary text-primary-foreground shadow" : "text-muted-foreground"
          )}
        >
          오래된순
        </button>
        <button
          onClick={() => setSortOrder("newest")}
          className={cn(
            "rounded-full px-4 py-1.5 text-sm font-medium transition-all",
            sortOrder === "newest" ? "bg-primary text-primary-foreground shadow" : "text-muted-foreground"
          )}
        >
          최신순
        </button>
      </div>

      <Card className="shadow-lg">
        <CardContent className="p-5">
          {loading ? (
            <div className="space-y-2">
              <div className="h-16 animate-pulse rounded-xl bg-secondary" />
              <div className="h-16 animate-pulse rounded-xl bg-secondary" />
            </div>
          ) : hasWaypoints ? (
            <div className="max-h-[50vh] space-y-5 overflow-y-auto pr-1">
              {chapters.map((chapter) => (
                <div key={chapter.key}>
                  <p className="mb-2 text-xs font-semibold text-muted-foreground">
                    {chapter.dayNumber}일차 · {chapter.dateLabel}
                  </p>
                  <div className="space-y-3">
                    {chapter.entries.map((w) => {
                      const isExpanded = expandedMemoIds.has(w.waypointId)
                      const memo = w.memo ?? ""
                      const isLong = memo.length > 60
                      return (
                        <button
                          key={w.waypointId}
                          onClick={() => isLong && toggleMemoExpanded(w.waypointId)}
                          className="flex w-full gap-3 rounded-xl border border-border p-3 text-left"
                        >
                          <div className="h-16 w-16 shrink-0 overflow-hidden rounded-lg bg-gradient-to-br from-primary/10 to-accent/10">
                            <WaypointThumb url={w.thumbnailUrl} />
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="text-[11px] text-muted-foreground">
                              {formatWaypointTime(w.checkedAt)}{w.placeName && ` · ${w.placeName}`}
                              {w.photoCount > 1 && ` · 사진 ${w.photoCount}장`}
                            </p>
                            <p className={cn("text-sm text-foreground", !isExpanded && "line-clamp-2")}>
                              {memo || "(메모 없음)"}
                            </p>
                            {isLong && (
                              <span className="mt-1 inline-block text-xs font-medium text-primary">
                                {isExpanded ? "접기" : "더보기"}
                              </span>
                            )}
                          </div>
                        </button>
                      )
                    })}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="py-8 text-center text-sm text-muted-foreground">
              아직 남긴 여정이 없어요. 그래도 괜찮아요.
            </p>
          )}
        </CardContent>
      </Card>

      <Card className="shadow-lg border-dashed">
        <CardContent className="p-5">
          <h3 className="mb-2 font-bold text-foreground text-sm">여정 지도 (구상 중, 낮은 우선순위)</h3>
          <div className="flex h-28 items-center justify-center rounded-xl bg-secondary/40 text-xs text-muted-foreground">
            📍 실제 지도 연동 전까지는 빈 자리
          </div>
        </CardContent>
      </Card>

      {/* 기록을 이미 썼으면 초안 대신 그 기록으로 보내고, 안 썼으면 이 초안으로 새로 쓰게 함 */}
      {!hasRecord && (
        <Card className="shadow-lg">
          <CardContent className="p-5">
            <h3 className="mb-2 font-bold text-foreground text-sm">기록 초안 (여정 기반 자동 생성)</h3>
            <div className="max-h-[30vh] overflow-y-auto rounded-xl bg-secondary/30 p-4">
              <p className="whitespace-pre-wrap text-sm text-foreground">
                {draftSummary || "(남긴 여정이 없어서 빈 상태로 시작해요)"}
              </p>
            </div>
            <p className="mt-2 text-xs text-muted-foreground">
              이 내용을 그대로 다듬어서 기록으로 저장하거나, 자유롭게 다시 써도 돼요.
            </p>
          </CardContent>
        </Card>
      )}

      {hasRecord ? (
        <Button
          size="lg"
          variant="outline"
          className="w-full gap-1"
          onClick={() => router.push(`/record?recordId=${recordId}`)}
        >
          기록 보러가기
          <ChevronRight className="h-5 w-5" />
        </Button>
      ) : (
        <Button
          size="lg"
          className="w-full gap-2 bg-accent hover:bg-accent/90 text-accent-foreground"
          onClick={handleWriteRecord}
        >
          <BookOpen className="h-5 w-5" />
          기록 남기기
        </Button>
      )}

      <Button variant="outline" className="w-full" onClick={onBack}>
        돌아가기
      </Button>
    </div>
  )
}
