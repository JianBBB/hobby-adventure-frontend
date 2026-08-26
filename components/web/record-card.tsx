"use client"

import { cn } from "@/lib/utils"
import { Card, CardContent } from "@/components/ui/card"
import { 
  Star, 
  Calendar,
  MessageSquare,
  Image as ImageIcon,
  MoreHorizontal,
  MapPin
} from "lucide-react"

interface WebRecordCardProps {
  hobbyName: string
  date: string
  rating: number
  emotion: string
  note: string
  hasPhoto?: boolean
  category?: string
  location?: string
  onClick?: () => void
}

const emotionEmojis: Record<string, string> = {
  "행복": "😊",
  "신남": "🤩",
  "평온": "😌",
  "뿌듯": "🥹",
  "피곤": "😴",
  "아쉬움": "😔",
}

export function WebRecordCard({
  hobbyName,
  date,
  rating,
  emotion,
  note,
  hasPhoto = false,
  category = "취미",
  location,
  onClick,
}: WebRecordCardProps) {
  return (
    <Card 
      className="group cursor-pointer overflow-hidden shadow-md transition-all hover:shadow-lg hover:-translate-y-0.5"
      onClick={onClick}
    >
      <CardContent className="p-4">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-secondary text-2xl">
              {emotionEmojis[emotion] || "✨"}
            </div>
            <div>
              <h3 className="font-semibold text-foreground">{hobbyName}</h3>
              <div className="mt-0.5 flex items-center gap-2 text-xs text-muted-foreground">
                <Calendar className="h-3 w-3" />
                <span>{date}</span>
                <span className="rounded-full bg-secondary px-2 py-0.5">{category}</span>
              </div>
            </div>
          </div>
          <button className="rounded-lg p-1.5 text-muted-foreground opacity-0 transition-opacity hover:bg-secondary group-hover:opacity-100">
            <MoreHorizontal className="h-4 w-4" />
          </button>
        </div>

        {/* Rating */}
        <div className="mt-3 flex items-center gap-1">
          {[1, 2, 3, 4, 5].map((star) => (
            <Star
              key={star}
              className={cn(
                "h-4 w-4",
                star <= rating 
                  ? "fill-accent text-accent" 
                  : "text-muted"
              )}
            />
          ))}
          <span className="ml-1.5 text-sm font-medium text-foreground">{rating}.0</span>
          <span className="ml-2 rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
            {emotion}
          </span>
        </div>

        {/* Note */}
        <p className="mt-3 line-clamp-2 text-sm text-muted-foreground">
          {note}
        </p>

        {/* Location & Photo indicators */}
        <div className="mt-3 flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
          {location && (
            <div className="flex items-center gap-1.5">
              <MapPin className="h-3.5 w-3.5 text-highlight" />
              <span>{location}</span>
            </div>
          )}
          {hasPhoto && (
            <div className="flex items-center gap-1.5">
              <ImageIcon className="h-3.5 w-3.5" />
              <span>사진 1장</span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
