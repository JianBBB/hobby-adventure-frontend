"use client"

import { cn } from "@/lib/utils"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { 
  Heart, 
  Clock, 
  Users, 
  Sparkles,
  ChevronRight,
  Star
} from "lucide-react"

interface WebHobbyCardProps {
  name: string
  description: string
  category: string
  difficulty: "쉬움" | "보통" | "어려움"
  duration: string
  isIndoor: boolean
  isSolo: boolean
  imageUrl?: string
  isFavorite?: boolean
  onFavorite?: () => void
  onStartQuest?: () => void
  onViewDetail?: () => void
  onClick?: () => void
}

export function WebHobbyCard({
  name,
  description,
  category,
  difficulty,
  duration,
  isIndoor,
  isSolo,
  isFavorite = false,
  onFavorite,
  onStartQuest,
  onViewDetail,
  onClick,
}: WebHobbyCardProps) {
  const difficultyColor = {
    쉬움: "bg-quest-success/10 text-quest-success",
    보통: "bg-quest-warning/10 text-quest-warning",
    어려움: "bg-destructive/10 text-destructive",
  }

  const categoryIcons: Record<string, string> = {
    "예술": "🎨",
    "음악": "🎵",
    "스포츠": "⚽",
    "요리": "🍳",
    "여행": "✈️",
    "독서": "📚",
    "게임": "🎮",
    "공예": "🧶",
    "사진": "📷",
    "자연": "🌿",
  }

  return (
    <Card 
      className="group cursor-pointer overflow-hidden transition-all hover:shadow-lg hover:-translate-y-1"
      onClick={onClick}
    >
      <CardContent className="p-0">
        {/* Image placeholder with category icon */}
        <div className="relative flex h-36 items-center justify-center bg-secondary/50">
          <span className="text-5xl">{categoryIcons[category] || "✨"}</span>
          <button
            onClick={onFavorite}
            className={cn(
              "absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-card/80 backdrop-blur-sm transition-all hover:scale-110",
              isFavorite && "bg-destructive/10"
            )}
          >
            <Heart 
              className={cn(
                "h-5 w-5 transition-colors",
                isFavorite ? "fill-destructive text-destructive" : "text-muted-foreground"
              )} 
            />
          </button>
          <div className="absolute left-3 top-3">
            <span className="rounded-full bg-card/80 px-2.5 py-1 text-xs font-medium text-foreground backdrop-blur-sm">
              {category}
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="p-4">
          <div className="flex items-start justify-between gap-2">
            <h3 className="text-lg font-bold text-foreground group-hover:text-primary transition-colors">
              {name}
            </h3>
            <span className={cn(
              "shrink-0 rounded-full px-2 py-0.5 text-xs font-medium",
              difficultyColor[difficulty]
            )}>
              {difficulty}
            </span>
          </div>
          
          <p className="mt-1.5 line-clamp-2 text-sm text-muted-foreground">
            {description}
          </p>

          {/* Tags */}
          <div className="mt-3 flex flex-wrap items-center gap-2">
            <span className="flex items-center gap-1 rounded-full bg-secondary px-2.5 py-1 text-xs text-muted-foreground">
              <Clock className="h-3 w-3" />
              {duration}
            </span>
            <span className="flex items-center gap-1 rounded-full bg-secondary px-2.5 py-1 text-xs text-muted-foreground">
              {isIndoor ? "🏠 실내" : "🌳 실외"}
            </span>
            <span className="flex items-center gap-1 rounded-full bg-secondary px-2.5 py-1 text-xs text-muted-foreground">
              <Users className="h-3 w-3" />
              {isSolo ? "혼자" : "함께"}
            </span>
          </div>

          {/* Actions */}
          <div className="mt-4 flex gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              className="flex-1"
              onClick={onViewDetail}
            >
              상세보기
            </Button>
            <Button 
              size="sm" 
              className="flex-1"
              onClick={onStartQuest}
            >
              <Sparkles className="mr-1.5 h-3.5 w-3.5" />
              퀘스트 시작
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
