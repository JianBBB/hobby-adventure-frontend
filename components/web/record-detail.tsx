"use client"

import { useEffect, useState } from "react"
import { cn } from "@/lib/utils"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  Star,
  Calendar,
  Image as ImageIcon,
  X,
  MapPin,
  Edit3,
  Trash2,
  Share2,
  ChevronLeft,
  ChevronRight
} from "lucide-react"
import { toast } from "sonner"
import { ApiError } from "@/lib/api/client"
import { getRecord, deleteRecord } from "@/lib/api/records"
import { getEmotionEmoji } from "@/lib/emotion"
import type { RecordDetail as RecordDetailType } from "@/lib/api/types"

interface WriteRecordData {
  mode: "create" | "edit"
  userExplorationId: number
  recordId?: number
  explorationName: string
  explorationCategory: string
}

interface RecordDetailProps {
  recordId: number
  onClose: () => void
  onPrev?: () => void
  onNext?: () => void
  onDelete: (recordId: number) => void
  onEdit: (data: WriteRecordData) => void
  hasPrev?: boolean
  hasNext?: boolean
}

function formatDate(dateStr: string) {
  const [year, month, day] = dateStr.split("-").map(Number)
  return `${year}년 ${month}월 ${day}일`
}

export function RecordDetail({
  recordId,
  onClose,
  onPrev,
  onNext,
  onDelete,
  onEdit,
  hasPrev = false,
  hasNext = false
}: RecordDetailProps) {
  const [record, setRecord] = useState<RecordDetailType | null>(null)
  const [loading, setLoading] = useState(true)
  const [deleting, setDeleting] = useState(false)

  useEffect(() => {
    setLoading(true)
    setRecord(null)
    getRecord(recordId)
      .then(setRecord)
      .catch((err) => {
        toast.error(err instanceof ApiError ? err.message : "기록을 불러오지 못했어요.")
        onClose()
      })
      .finally(() => setLoading(false))
  }, [recordId])

  const handleShare = () => {
    if (!record) return
    const text = `[${record.title}] ${formatDate(record.visitedDate)}\n${record.content}`
    navigator.clipboard.writeText(text)
    toast.success("기록 내용을 클립보드에 복사했어요.")
  }

  const handleDelete = async () => {
    const confirmed = window.confirm("이 기록을 삭제할까요? 되돌릴 수 없어요.")
    if (!confirmed) return
    setDeleting(true)
    try {
      await deleteRecord(recordId)
      onDelete(recordId)
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : "기록을 삭제하지 못했어요.")
    } finally {
      setDeleting(false)
    }
  }

  const handleEdit = () => {
    if (!record) return
    onEdit({
      mode: "edit",
      userExplorationId: record.userExplorationId,
      recordId: record.recordId,
      explorationName: record.explorationTitle,
      explorationCategory: record.categoryName
    })
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/60 backdrop-blur-sm">
      <div className="relative mx-4 w-full max-w-2xl">
        {/* Navigation arrows */}
        {hasPrev && (
          <button
            onClick={onPrev}
            className="absolute -left-16 top-1/2 hidden -translate-y-1/2 rounded-full bg-card p-3 text-muted-foreground shadow-lg transition-all hover:bg-secondary hover:text-foreground lg:flex"
          >
            <ChevronLeft className="h-6 w-6" />
          </button>
        )}
        {hasNext && (
          <button
            onClick={onNext}
            className="absolute -right-16 top-1/2 hidden -translate-y-1/2 rounded-full bg-card p-3 text-muted-foreground shadow-lg transition-all hover:bg-secondary hover:text-foreground lg:flex"
          >
            <ChevronRight className="h-6 w-6" />
          </button>
        )}

        <Card className="max-h-[90vh] overflow-y-auto shadow-2xl">
          {loading || !record ? (
            <CardContent className="p-6 space-y-4">
              <div className="h-8 w-2/3 animate-pulse rounded-lg bg-secondary" />
              <div className="h-24 animate-pulse rounded-xl bg-secondary" />
              <div className="h-24 animate-pulse rounded-xl bg-secondary" />
            </CardContent>
          ) : (
            <>
              <CardHeader className="sticky top-0 z-10 flex flex-row items-center justify-between border-b bg-card pb-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-secondary text-2xl">
                    {getEmotionEmoji(record.emotionCode)}
                  </div>
                  <div>
                    <CardTitle className="text-xl">{record.title}</CardTitle>
                    <div className="mt-1 flex items-center gap-2 text-sm text-muted-foreground">
                      <Calendar className="h-3.5 w-3.5" />
                      <span>{formatDate(record.visitedDate)}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="icon" className="text-muted-foreground" onClick={handleShare}>
                    <Share2 className="h-5 w-5" />
                  </Button>
                  <Button variant="ghost" size="icon" className="text-muted-foreground" onClick={handleEdit}>
                    <Edit3 className="h-5 w-5" />
                  </Button>
                  <button
                    onClick={onClose}
                    className="rounded-lg p-2 text-muted-foreground hover:bg-secondary"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>
              </CardHeader>

              <CardContent className="space-y-6 p-6">
                {/* Exploration & Emotion Tags */}
                <div className="flex flex-wrap items-center gap-2">
                  <span className="rounded-full bg-secondary px-3 py-1.5 text-sm font-medium text-foreground">
                    {record.explorationTitle}
                  </span>
                  <span className="rounded-full bg-primary/10 px-3 py-1.5 text-sm font-medium text-primary">
                    {record.categoryName}
                  </span>
                  <span className="flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1.5 text-sm font-medium text-primary">
                    <span>{getEmotionEmoji(record.emotionCode)}</span>
                    <span>{record.emotionLabel}</span>
                  </span>
                </div>

                {/* Rating */}
                <div className="flex items-center gap-4">
                  <span className="text-sm font-medium text-muted-foreground">평점</span>
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={cn(
                          "h-6 w-6",
                          star <= record.rating
                            ? "fill-accent text-accent"
                            : "text-muted"
                        )}
                      />
                    ))}
                    <span className="ml-2 text-lg font-bold text-foreground">{record.rating}.0</span>
                  </div>
                </div>

                {/* Photo Gallery */}
                {record.images.length > 0 && (
                  <div className="space-y-3">
                    <h3 className="flex items-center gap-2 text-sm font-medium text-foreground">
                      <ImageIcon className="h-4 w-4" />
                      첨부 사진
                    </h3>
                    <div className="grid grid-cols-2 gap-3">
                      {record.images.map((image) => (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          key={image.imageId}
                          src={image.url}
                          alt="기록 사진"
                          className="aspect-[4/3] w-full rounded-xl object-cover"
                        />
                      ))}
                    </div>
                  </div>
                )}

                {/* Place */}
                {record.placeName && (
                  <div className="flex items-center gap-3 rounded-xl bg-secondary/50 p-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                      <MapPin className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">장소</p>
                      <p className="font-medium text-foreground">{record.placeName}</p>
                    </div>
                  </div>
                )}

                {/* Note */}
                <div className="space-y-3">
                  <h3 className="text-sm font-medium text-foreground">메모</h3>
                  <div className="rounded-xl bg-secondary/30 p-4">
                    <p className="whitespace-pre-wrap leading-relaxed text-foreground">
                      {record.content}
                    </p>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center justify-between border-t pt-6">
                  <Button
                    variant="outline"
                    className="gap-2 text-destructive hover:bg-destructive/10 hover:text-destructive"
                    onClick={handleDelete}
                    disabled={deleting}
                  >
                    <Trash2 className="h-4 w-4" />
                    삭제
                  </Button>
                  <div className="flex gap-3 lg:hidden">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={onPrev}
                      disabled={!hasPrev}
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={onNext}
                      disabled={!hasNext}
                    >
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                  <Button className="gap-2" onClick={handleEdit}>
                    <Edit3 className="h-4 w-4" />
                    수정하기
                  </Button>
                </div>
              </CardContent>
            </>
          )}
        </Card>
      </div>
    </div>
  )
}
