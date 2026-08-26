"use client"

import { ChevronRight, Flame, Clock } from "lucide-react"
import { cn } from "@/lib/utils"

interface QuestCardProps {
  title: string
  category: string
  progress: number
  totalSteps: number
  completedSteps: number
  timeEstimate?: string
  streak?: number
  variant?: "default" | "compact" | "featured"
  onClick?: () => void
}

export function QuestCard({
  title,
  category,
  progress,
  totalSteps,
  completedSteps,
  timeEstimate,
  streak,
  variant = "default",
  onClick,
}: QuestCardProps) {
  if (variant === "compact") {
    return (
      <button
        onClick={onClick}
        className="group flex items-center gap-3 rounded-2xl bg-card p-3 shadow-sm transition-all hover:shadow-md active:scale-[0.98]"
      >
        <div className="relative flex h-12 w-12 items-center justify-center rounded-xl bg-primary/15">
          <span className="text-lg font-bold text-primary">{completedSteps}/{totalSteps}</span>
          <svg className="absolute inset-0 -rotate-90" viewBox="0 0 48 48">
            <circle
              cx="24"
              cy="24"
              r="20"
              fill="none"
              stroke="currentColor"
              strokeWidth="3"
              className="text-quest-inactive"
            />
            <circle
              cx="24"
              cy="24"
              r="20"
              fill="none"
              stroke="currentColor"
              strokeWidth="3"
              strokeDasharray={`${progress * 1.26} 126`}
              strokeLinecap="round"
              className="text-primary transition-all duration-500"
            />
          </svg>
        </div>
        <div className="flex-1 text-left">
          <h4 className="font-bold text-card-foreground">{title}</h4>
          <p className="text-xs text-muted-foreground">{category}</p>
        </div>
        <ChevronRight className="h-5 w-5 text-muted-foreground transition-transform group-hover:translate-x-0.5" />
      </button>
    )
  }

  if (variant === "featured") {
    return (
      <button
        onClick={onClick}
        className="group relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary to-primary/80 p-5 text-left shadow-lg transition-all hover:shadow-xl active:scale-[0.98]"
      >
        {/* Background pattern */}
        <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-white/10" />
        <div className="absolute -bottom-4 -left-4 h-24 w-24 rounded-full bg-white/5" />
        
        <div className="relative">
          <div className="mb-1 flex items-center gap-2">
            <span className="rounded-full bg-white/20 px-2 py-0.5 text-[10px] font-semibold text-primary-foreground">
              TODAY&apos;S QUEST
            </span>
            {streak && streak > 0 && (
              <span className="flex items-center gap-1 text-accent">
                <Flame className="h-3.5 w-3.5" />
                <span className="text-xs font-bold">{streak}</span>
              </span>
            )}
          </div>
          
          <h3 className="mb-1 text-xl font-extrabold text-primary-foreground">{title}</h3>
          <p className="mb-4 text-sm text-primary-foreground/80">{category}</p>
          
          {/* Progress bar */}
          <div className="mb-2">
            <div className="mb-1 flex items-center justify-between text-xs text-primary-foreground/80">
              <span>Progress</span>
              <span className="font-bold text-primary-foreground">{completedSteps}/{totalSteps} steps</span>
            </div>
            <div className="h-2.5 overflow-hidden rounded-full bg-white/20">
              <div 
                className="h-full rounded-full bg-accent transition-all duration-500"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
          
          {timeEstimate && (
            <div className="flex items-center gap-1 text-xs text-primary-foreground/70">
              <Clock className="h-3.5 w-3.5" />
              <span>{timeEstimate} left</span>
            </div>
          )}
        </div>
      </button>
    )
  }

  return (
    <button
      onClick={onClick}
      className={cn(
        "group w-full rounded-2xl bg-card p-4 text-left shadow-sm transition-all hover:shadow-md active:scale-[0.98]"
      )}
    >
      <div className="mb-3 flex items-start justify-between">
        <div>
          <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-semibold text-primary">
            {category}
          </span>
          <h3 className="mt-2 font-bold text-card-foreground">{title}</h3>
        </div>
        <div className="relative flex h-14 w-14 items-center justify-center">
          <span className="text-sm font-bold text-primary">{Math.round(progress)}%</span>
          <svg className="absolute inset-0 -rotate-90" viewBox="0 0 56 56">
            <circle
              cx="28"
              cy="28"
              r="24"
              fill="none"
              stroke="currentColor"
              strokeWidth="4"
              className="text-quest-inactive"
            />
            <circle
              cx="28"
              cy="28"
              r="24"
              fill="none"
              stroke="currentColor"
              strokeWidth="4"
              strokeDasharray={`${progress * 1.51} 151`}
              strokeLinecap="round"
              className="text-primary transition-all duration-500"
            />
          </svg>
        </div>
      </div>
      
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <span>{completedSteps}/{totalSteps} steps</span>
          {timeEstimate && (
            <>
              <span>•</span>
              <Clock className="h-3 w-3" />
              <span>{timeEstimate}</span>
            </>
          )}
        </div>
        <ChevronRight className="h-5 w-5 text-muted-foreground transition-transform group-hover:translate-x-0.5" />
      </div>
    </button>
  )
}
