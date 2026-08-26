"use client"

import { Heart, Clock, Zap, Star } from "lucide-react"
import { cn } from "@/lib/utils"

interface HobbyCardProps {
  title: string
  description: string
  image: string
  type: "activity" | "appreciation" | "learning"
  difficulty: 1 | 2 | 3
  duration: string
  isFavorite?: boolean
  onFavoriteToggle?: () => void
  onClick?: () => void
  variant?: "default" | "large" | "random"
}

const typeLabels = {
  activity: { label: "Activity", color: "bg-chart-1 text-white" },
  appreciation: { label: "Appreciation", color: "bg-chart-2 text-white" },
  learning: { label: "Learning", color: "bg-chart-4 text-white" },
}

const difficultyLabels = ["Easy", "Medium", "Hard"]

export function HobbyCard({
  title,
  description,
  image,
  type,
  difficulty,
  duration,
  isFavorite = false,
  onFavoriteToggle,
  onClick,
  variant = "default",
}: HobbyCardProps) {
  const typeConfig = typeLabels[type]

  if (variant === "random") {
    return (
      <button
        onClick={onClick}
        className="group relative aspect-[4/3] w-full overflow-hidden rounded-3xl shadow-lg transition-all hover:shadow-xl active:scale-[0.98]"
      >
        <img
          src={image}
          alt={title}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
        
        {/* Sparkle decoration */}
        <div className="absolute right-3 top-3 flex items-center gap-1 rounded-full bg-accent px-2.5 py-1 text-xs font-bold text-accent-foreground">
          <Zap className="h-3.5 w-3.5" />
          Random Pick!
        </div>
        
        <div className="absolute bottom-0 left-0 right-0 p-4 text-left">
          <span className={cn("mb-2 inline-block rounded-full px-2.5 py-0.5 text-[10px] font-semibold", typeConfig.color)}>
            {typeConfig.label}
          </span>
          <h3 className="text-xl font-extrabold text-white">{title}</h3>
          <p className="mt-1 line-clamp-2 text-sm text-white/80">{description}</p>
          
          <div className="mt-3 flex items-center gap-3 text-xs text-white/70">
            <span className="flex items-center gap-1">
              <Clock className="h-3.5 w-3.5" />
              {duration}
            </span>
            <span className="flex items-center gap-1">
              {Array.from({ length: 3 }).map((_, i) => (
                <Star
                  key={i}
                  className={cn(
                    "h-3.5 w-3.5",
                    i < difficulty ? "fill-accent text-accent" : "text-white/30"
                  )}
                />
              ))}
            </span>
          </div>
        </div>
      </button>
    )
  }

  if (variant === "large") {
    return (
      <button
        onClick={onClick}
        className="group relative w-full overflow-hidden rounded-3xl bg-card shadow-md transition-all hover:shadow-lg active:scale-[0.98]"
      >
        <div className="aspect-video w-full overflow-hidden">
          <img
            src={image}
            alt={title}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        </div>
        
        <button
          onClick={(e) => {
            e.stopPropagation()
            onFavoriteToggle?.()
          }}
          className={cn(
            "absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-card/90 backdrop-blur-sm transition-all",
            isFavorite ? "text-destructive" : "text-muted-foreground hover:text-destructive"
          )}
        >
          <Heart className={cn("h-5 w-5", isFavorite && "fill-current")} />
        </button>
        
        <div className="p-4 text-left">
          <div className="mb-2 flex items-center gap-2">
            <span className={cn("rounded-full px-2.5 py-0.5 text-[10px] font-semibold", typeConfig.color)}>
              {typeConfig.label}
            </span>
            <span className="text-xs text-muted-foreground">{difficultyLabels[difficulty - 1]}</span>
          </div>
          <h3 className="font-bold text-card-foreground">{title}</h3>
          <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">{description}</p>
          
          <div className="mt-3 flex items-center gap-1 text-xs text-muted-foreground">
            <Clock className="h-3.5 w-3.5" />
            {duration}
          </div>
        </div>
      </button>
    )
  }

  return (
    <button
      onClick={onClick}
      className="group flex items-center gap-3 rounded-2xl bg-card p-3 shadow-sm transition-all hover:shadow-md active:scale-[0.98]"
    >
      <div className="h-16 w-16 overflow-hidden rounded-xl">
        <img
          src={image}
          alt={title}
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
        />
      </div>
      
      <div className="flex-1 text-left">
        <div className="mb-1 flex items-center gap-2">
          <span className={cn("rounded-full px-2 py-0.5 text-[9px] font-semibold", typeConfig.color)}>
            {typeConfig.label}
          </span>
        </div>
        <h4 className="font-bold text-card-foreground">{title}</h4>
        <div className="mt-0.5 flex items-center gap-2 text-xs text-muted-foreground">
          <span className="flex items-center gap-0.5">
            <Clock className="h-3 w-3" />
            {duration}
          </span>
          <span>•</span>
          <span>{difficultyLabels[difficulty - 1]}</span>
        </div>
      </div>
      
      <button
        onClick={(e) => {
          e.stopPropagation()
          onFavoriteToggle?.()
        }}
        className={cn(
          "flex h-8 w-8 items-center justify-center rounded-full transition-all",
          isFavorite ? "text-destructive" : "text-muted-foreground hover:text-destructive"
        )}
      >
        <Heart className={cn("h-4 w-4", isFavorite && "fill-current")} />
      </button>
    </button>
  )
}
