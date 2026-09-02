"use client"

import { useEffect, useRef, useState, type ChangeEvent } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  ArrowLeft,
  MapPin,
  Star,
  Camera,
  CheckCircle2,
  X,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { toast } from "sonner"
import { ApiError } from "@/lib/api/client"
import { getRecord, createRecord, updateRecord } from "@/lib/api/records"
import { EMOTION_OPTIONS } from "@/lib/emotion"
import type { EmotionCode, RecordImage } from "@/lib/api/types"

interface WriteRecordScreenProps {
  mode: "create" | "edit"
  userExplorationId: number
  recordId?: number
  explorationName: string
  explorationCategory: string
  draftContent?: string
  completedAt?: string
  onBack: () => void
  onSave: () => void
}

export function WriteRecordScreen({
  mode,
  userExplorationId,
  recordId,
  explorationName,
  explorationCategory,
  draftContent,
  completedAt,
  onBack,
  onSave,
}: WriteRecordScreenProps) {
  const today = new Date()
  const todayString = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`
  // 여정이 여러 날에 걸쳐 있을 수 있어서 "오늘"(=기록 쓰는 날)보다 "완료한 날"이 실제 탐험한 날에 더 가까움
  const initialVisitedDate = completedAt ? completedAt.slice(0, 10) : todayString

  const [loading, setLoading] = useState(mode === "edit")
  const [title, setTitle] = useState(explorationName)
  const [visitedDate, setVisitedDate] = useState(initialVisitedDate)
  const [rating, setRating] = useState(0)
  const [selectedEmotion, setSelectedEmotion] = useState<EmotionCode | "">("")
  const [content, setContent] = useState(draftContent ?? "")
  const [placeName, setPlaceName] = useState("")
  const [existingImages, setExistingImages] = useState<RecordImage[]>([])
  const [markedForDeletion, setMarkedForDeletion] = useState<Set<number>>(new Set())
  const [newImages, setNewImages] = useState<File[]>([])
  const [newImagePreviews, setNewImagePreviews] = useState<string[]>([])
  const [isSaving, setIsSaving] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (mode !== "edit" || !recordId) return
    getRecord(recordId)
      .then((record) => {
        setTitle(record.title)
        setVisitedDate(record.visitedDate)
        setRating(record.rating)
        setSelectedEmotion(record.emotionCode)
        setContent(record.content)
        setPlaceName(record.placeName ?? "")
        setExistingImages(record.images)
      })
      .catch((err) => {
        toast.error(err instanceof ApiError ? err.message : "기록을 불러오지 못했어요.")
      })
      .finally(() => setLoading(false))
  }, [mode, recordId])

  // 기존 사진은 여기서 바로 안 지우고 표시만 해뒀다가, "저장" 누를 때 한 번에 반영함
  const toggleMarkForDeletion = (imageId: number) => {
    setMarkedForDeletion((prev) => {
      const next = new Set(prev)
      if (next.has(imageId)) next.delete(imageId)
      else next.add(imageId)
      return next
    })
  }

  useEffect(() => {
    const urls = newImages.map((file) => URL.createObjectURL(file))
    setNewImagePreviews(urls)
    return () => {
      urls.forEach((url) => URL.revokeObjectURL(url))
    }
  }, [newImages])

  const remainingSlots = 10 - existingImages.length + markedForDeletion.size - newImages.length

  const handleFileSelect = (e: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? [])
    if (files.length === 0) return
    setNewImages((prev) => {
      const combined = [...prev, ...files]
      const limit = 10 - existingImages.length + markedForDeletion.size
      if (combined.length > limit) {
        toast.error(`사진은 최대 10장까지 첨부할 수 있어요. ${limit}장만 담았어요.`)
        return combined.slice(0, Math.max(limit, 0))
      }
      return combined
    })
    e.target.value = ""
  }

  const removeNewImage = (index: number) => {
    setNewImages((prev) => prev.filter((_, i) => i !== index))
  }

  const canSave = title.trim().length > 0 && rating > 0 && !!selectedEmotion && content.trim().length > 0

  const handleSave = () => {
    if (!selectedEmotion) return

    const payload = {
      title: title.trim(),
      visitedDate,
      rating,
      emotionCode: selectedEmotion,
      placeName: placeName.trim() || undefined,
      content: content.trim(),
    }

    setIsSaving(true)
    const request =
      mode === "create"
        ? createRecord({ userExplorationId, ...payload }, newImages)
        : updateRecord(recordId!, { ...payload, deleteImageIds: Array.from(markedForDeletion) }, newImages)

    request
      .then(() => {
        setShowSuccess(true)
        setTimeout(onSave, 1200)
      })
      .catch((err) => {
        toast.error(err instanceof ApiError ? err.message : "기록을 저장하지 못했어요.")
      })
      .finally(() => setIsSaving(false))
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-8 w-24 animate-pulse rounded bg-secondary" />
        <div className="h-32 animate-pulse rounded-xl bg-secondary" />
        <div className="h-32 animate-pulse rounded-xl bg-secondary" />
      </div>
    )
  }

  if (showSuccess) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-quest-success/20 mb-6 animate-bounce">
          <CheckCircle2 className="h-10 w-10 text-quest-success" />
        </div>
        <h2 className="text-2xl font-bold text-foreground mb-2">
          {mode === "create" ? "기록이 저장되었어요!" : "기록이 수정되었어요!"}
        </h2>
        <p className="text-muted-foreground">탐험 기록에서 확인할 수 있어요</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={onBack}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold text-foreground">
            {mode === "create" ? "탐험 기록 남기기" : "기록 수정하기"}
          </h1>
          <p className="text-sm text-muted-foreground">이번 탐험은 어땠나요?</p>
        </div>
      </div>

      {/* Exploration Info */}
      <Card className="shadow-lg border-primary/20 bg-gradient-to-r from-primary/5 to-transparent">
        <CardContent className="p-5">
          <div className="flex items-center gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-white shadow-md text-3xl">
              🧭
            </div>
            <div className="flex-1">
              <span className="text-xs text-primary font-medium">{explorationCategory}</span>
              <h2 className="text-xl font-bold text-foreground">{explorationName}</h2>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Title */}
      <Card className="shadow-lg">
        <CardContent className="p-5">
          <h3 className="font-bold text-foreground mb-4">기록 제목</h3>
          <Input value={title} onChange={(e) => setTitle(e.target.value)} className="text-lg" />
        </CardContent>
      </Card>

      {/* Date */}
      <Card className="shadow-lg">
        <CardContent className="p-5">
          <h3 className="font-bold text-foreground mb-1">언제 탐험했나요?</h3>
          {mode === "create" && completedAt && (
            <p className="mb-3 text-xs text-muted-foreground">
              탐험을 완료한 날짜로 채워뒀어요. 실제로 다녀온 날짜와 다르면 바꿔주세요.
            </p>
          )}
          <Input
            type="date"
            value={visitedDate}
            onChange={(e) => setVisitedDate(e.target.value)}
            className="w-full"
          />
        </CardContent>
      </Card>

      {/* Rating */}
      <Card className="shadow-lg">
        <CardContent className="p-5">
          <h3 className="font-bold text-foreground mb-4">이번 탐험은 어땠나요?</h3>
          <div className="flex items-center justify-center gap-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                onClick={() => setRating(star)}
                className="p-1 transition-transform hover:scale-110"
              >
                <Star
                  className={cn(
                    "h-10 w-10 transition-colors",
                    star <= rating ? "fill-highlight text-highlight" : "fill-muted text-muted"
                  )}
                />
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Emotion */}
      <Card className="shadow-lg">
        <CardContent className="p-5">
          <h3 className="font-bold text-foreground mb-4">어떤 기분이 들었나요?</h3>
          <div className="grid grid-cols-3 gap-3">
            {EMOTION_OPTIONS.map((emotion) => (
              <button
                key={emotion.code}
                onClick={() => setSelectedEmotion(emotion.code)}
                className={cn(
                  "flex flex-col items-center gap-2 p-4 rounded-xl border transition-all",
                  selectedEmotion === emotion.code
                    ? "border-primary bg-primary/10"
                    : "border-border hover:border-primary/30 hover:bg-muted/30"
                )}
              >
                <span className="text-2xl">{emotion.emoji}</span>
                <span
                  className={cn(
                    "text-sm font-medium",
                    selectedEmotion === emotion.code ? "text-primary" : "text-foreground"
                  )}
                >
                  {emotion.label}
                </span>
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Location */}
      <Card className="shadow-lg">
        <CardContent className="p-5">
          <h3 className="font-bold text-foreground mb-2">어디서 탐험했나요?</h3>
          <p className="text-sm text-muted-foreground mb-4">선택 사항이에요.</p>
          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4 text-muted-foreground shrink-0" />
            <Input
              placeholder="예: 홍대 재즈바, 강남 클라이밍센터"
              value={placeName}
              onChange={(e) => setPlaceName(e.target.value)}
            />
          </div>
        </CardContent>
      </Card>

      {/* Content */}
      <Card className="shadow-lg">
        <CardContent className="p-5">
          <h3 className="font-bold text-foreground mb-2">경험을 기록해주세요</h3>
          <p className="text-sm text-muted-foreground mb-4">
            {draftContent
              ? "남겨둔 여정을 바탕으로 초안을 채워뒀어요. 그대로 다듬거나 자유롭게 다시 써도 돼요."
              : "어떤 것을 배웠나요? 기억에 남는 순간이 있나요?"}
          </p>
          <Textarea
            placeholder="예: 처음으로 도자기를 빚어봤다. 생각보다 어려웠지만 완성했을 때 뿌듯했다."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="min-h-[120px] resize-none"
          />
          <p className="text-xs text-muted-foreground mt-2 text-right">{content.length}자</p>
        </CardContent>
      </Card>

      {/* Photos */}
      <Card className="shadow-lg">
        <CardContent className="p-5">
          <h3 className="font-bold text-foreground mb-2">사진 추가</h3>
          <p className="text-sm text-muted-foreground mb-4">선택 사항이에요. 최대 10장.</p>

          {(existingImages.length > 0 || newImagePreviews.length > 0) && (
            <div className="grid grid-cols-4 gap-2 mb-4">
              {existingImages.map((image) => {
                const isMarked = markedForDeletion.has(image.imageId)
                return (
                  <div key={image.imageId} className="relative aspect-square">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={image.url}
                      alt=""
                      className={cn(
                        "h-full w-full rounded-lg object-cover transition-opacity",
                        isMarked && "opacity-40"
                      )}
                    />
                    <button
                      onClick={() => toggleMarkForDeletion(image.imageId)}
                      className={cn(
                        "absolute -right-1.5 -top-1.5 flex h-5 w-5 items-center justify-center rounded-full text-background",
                        isMarked ? "bg-destructive" : "bg-foreground"
                      )}
                    >
                      <X className="h-3 w-3" />
                    </button>
                    {isMarked && (
                      <span className="absolute inset-x-0 bottom-0 rounded-b-lg bg-destructive/80 py-0.5 text-center text-[10px] text-background">
                        삭제 예정
                      </span>
                    )}
                  </div>
                )
              })}
              {newImagePreviews.map((url, i) => (
                <div key={`new-${i}`} className="relative aspect-square">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={url} alt="" className="h-full w-full rounded-lg object-cover" />
                  <button
                    onClick={() => removeNewImage(i)}
                    className="absolute -right-1.5 -top-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-foreground text-background"
                  >
                    <X className="h-3 w-3" />
                  </button>
                  <span className="absolute inset-x-0 bottom-0 rounded-b-lg bg-primary/80 py-0.5 text-center text-[10px] text-primary-foreground">
                    추가됨
                  </span>
                </div>
              ))}
            </div>
          )}

          {mode === "edit" && (markedForDeletion.size > 0 || newImages.length > 0) && (
            <p className="text-xs text-muted-foreground mb-4">
              "수정 완료"를 눌러야 실제로 반영돼요.
            </p>
          )}

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            multiple
            hidden
            onChange={handleFileSelect}
          />
          <Button
            variant="outline"
            className="w-full gap-2 h-24 border-dashed"
            onClick={() => fileInputRef.current?.click()}
            disabled={remainingSlots <= 0}
          >
            <Camera className="h-5 w-5" />
            {remainingSlots <= 0 ? "최대 10장까지 담았어요" : "사진 선택"}
          </Button>
        </CardContent>
      </Card>

      {/* Save Button */}
      <div className="sticky bottom-4 pt-4">
        <Button
          size="lg"
          className={cn(
            "w-full gap-2 shadow-lg",
            canSave ? "bg-accent hover:bg-accent/90 text-accent-foreground" : "bg-muted text-muted-foreground"
          )}
          disabled={!canSave || isSaving}
          onClick={handleSave}
        >
          {isSaving ? (
            <>저장 중...</>
          ) : (
            <>
              <CheckCircle2 className="h-5 w-5" />
              {mode === "create" ? "기록 저장하기" : "수정 완료"}
            </>
          )}
        </Button>
        {!canSave && (
          <p className="text-center text-xs text-muted-foreground mt-2">
            제목, 별점, 기분, 경험을 모두 입력해주세요
          </p>
        )}
      </div>
    </div>
  )
}
