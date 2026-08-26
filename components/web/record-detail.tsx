"use client"

import { cn } from "@/lib/utils"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { 
  Star, 
  Calendar,
  Image as ImageIcon,
  X,
  MapPin,
  Clock,
  Edit3,
  Trash2,
  Share2,
  ChevronLeft,
  ChevronRight
} from "lucide-react"

interface RecordDetailProps {
  record: {
    hobbyName: string
    date: string
    rating: number
    emotion: string
    note: string
    hasPhoto?: boolean
    category?: string
    location?: string
    duration?: string
    photos?: string[]
  }
  onClose: () => void
  onPrev?: () => void
  onNext?: () => void
  hasPrev?: boolean
  hasNext?: boolean
}

const emotionEmojis: Record<string, string> = {
  "행복": "😊",
  "신남": "🤩",
  "평온": "😌",
  "뿌듯": "🥹",
  "피곤": "😴",
  "아쉬움": "😔",
}

const categoryColors: Record<string, string> = {
  "공예": "bg-amber-100 text-amber-700",
  "스포츠": "bg-emerald-100 text-emerald-700",
  "문화": "bg-violet-100 text-violet-700",
  "요리": "bg-rose-100 text-rose-700",
  "자연": "bg-sky-100 text-sky-700",
  "음악": "bg-pink-100 text-pink-700",
}

export function RecordDetail({ 
  record, 
  onClose,
  onPrev,
  onNext,
  hasPrev = false,
  hasNext = false
}: RecordDetailProps) {
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
          <CardHeader className="sticky top-0 z-10 flex flex-row items-center justify-between border-b bg-card pb-4">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-secondary text-2xl">
                {emotionEmojis[record.emotion] || "✨"}
              </div>
              <div>
                <CardTitle className="text-xl">{record.hobbyName}</CardTitle>
                <div className="mt-1 flex items-center gap-2 text-sm text-muted-foreground">
                  <Calendar className="h-3.5 w-3.5" />
                  <span>{record.date}</span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon" className="text-muted-foreground">
                <Share2 className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon" className="text-muted-foreground">
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
            {/* Category & Emotion Tags */}
            <div className="flex flex-wrap items-center gap-2">
              <span className={cn(
                "rounded-full px-3 py-1.5 text-sm font-medium",
                categoryColors[record.category || ""] || "bg-secondary text-foreground"
              )}>
                {record.category}
              </span>
              <span className="flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1.5 text-sm font-medium text-primary">
                <span>{emotionEmojis[record.emotion]}</span>
                <span>{record.emotion}</span>
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
            {record.hasPhoto && (
              <div className="space-y-3">
                <h3 className="flex items-center gap-2 text-sm font-medium text-foreground">
                  <ImageIcon className="h-4 w-4" />
                  첨부 사진
                </h3>
                <div className="grid grid-cols-2 gap-3">
                  <div className="aspect-[4/3] rounded-xl bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
                    <div className="text-center text-muted-foreground">
                      <ImageIcon className="mx-auto h-8 w-8 mb-2" />
                      <span className="text-sm">사진 미리보기</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Additional Info */}
            <div className="grid gap-4 sm:grid-cols-2">
              {record.location && (
                <div className="flex items-center gap-3 rounded-xl bg-secondary/50 p-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                    <MapPin className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">장소</p>
                    <p className="font-medium text-foreground">{record.location}</p>
                  </div>
                </div>
              )}
              {record.duration && (
                <div className="flex items-center gap-3 rounded-xl bg-secondary/50 p-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent/10">
                    <Clock className="h-5 w-5 text-accent" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">소요 시간</p>
                    <p className="font-medium text-foreground">{record.duration}</p>
                  </div>
                </div>
              )}
            </div>

            {/* Note */}
            <div className="space-y-3">
              <h3 className="text-sm font-medium text-foreground">메모</h3>
              <div className="rounded-xl bg-secondary/30 p-4">
                <p className="whitespace-pre-wrap leading-relaxed text-foreground">
                  {record.note}
                </p>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-between border-t pt-6">
              <Button variant="outline" className="gap-2 text-destructive hover:bg-destructive/10 hover:text-destructive">
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
              <Button className="gap-2">
                <Edit3 className="h-4 w-4" />
                수정하기
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
