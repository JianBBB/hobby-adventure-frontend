"use client"

import { Star, Calendar, ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"

interface RecordCardProps {
  title: string
  date: string
  rating: number
  emotion?: string
  note?: string
  image?: string
  onClick?: () => void
}

const emotionIcons: Record<string, string> = {
  happy: "😊",
  excited: "🤩",
  calm: "😌",
  proud: "🥹",
  surprised: "😮",
}

export function RecordCard({
  title,
  date,
  rating,
  emotion,
  note,
  image,
  onClick,
}: RecordCardProps) {
  return (
    <button
      onClick={onClick}
      className="group w-full overflow-hidden rounded-2xl bg-card shadow-sm transition-all hover:shadow-md active:scale-[0.98]"
    >
      {image && (
        <div className="aspect-video w-full overflow-hidden">
          <img
            src={image}
            alt={title}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        </div>
      )}
      
      <div className="p-4 text-left">
        <div className="mb-2 flex items-center justify-between">
          <h4 className="font-bold text-card-foreground">{title}</h4>
          {emotion && (
            <span className="text-xl">{emotionIcons[emotion] || emotion}</span>
          )}
        </div>
        
        <div className="mb-2 flex items-center gap-2">
          <div className="flex items-center">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star
                key={i}
                className={cn(
                  "h-4 w-4",
                  i < rating ? "fill-accent text-accent" : "text-muted-foreground/30"
                )}
              />
            ))}
          </div>
          <span className="flex items-center gap-1 text-xs text-muted-foreground">
            <Calendar className="h-3 w-3" />
            {date}
          </span>
        </div>
        
        {note && (
          <p className="line-clamp-2 text-sm text-muted-foreground">{note}</p>
        )}
        
        <div className="mt-2 flex items-center justify-end">
          <ChevronRight className="h-4 w-4 text-muted-foreground transition-transform group-hover:translate-x-0.5" />
        </div>
      </div>
    </button>
  )
}
