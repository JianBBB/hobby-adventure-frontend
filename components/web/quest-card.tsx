"use client"

import { cn } from "@/lib/utils"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { 
  CheckCircle2, 
  Circle, 
  ChevronRight,
  Clock,
  Zap,
  Star,
  Swords,
  Play
} from "lucide-react"

interface QuestStep {
  id: number
  title: string
  completed: boolean
}

interface QuestCardProps {
  title: string
  hobby: string
  category: string
  difficulty: "쉬움" | "보통" | "어려움"
  estimatedTime: string
  steps: QuestStep[]
  xpReward: number
  featured?: boolean
  onStart?: () => void
  onContinue?: () => void
  onClick?: () => void
}

export function WebQuestCard({
  title,
  hobby,
  category,
  difficulty,
  estimatedTime,
  steps,
  xpReward,
  featured = false,
  onStart,
  onContinue,
  onClick,
}: QuestCardProps) {
  const completedSteps = steps.filter((s) => s.completed).length
  const progress = (completedSteps / steps.length) * 100
  const isStarted = completedSteps > 0
  const isCompleted = completedSteps === steps.length

  const difficultyConfig = {
    쉬움: { 
      color: "bg-quest-easy/10 text-quest-easy border-quest-easy/30", 
      stars: 1,
      label: "쉬움"
    },
    보통: { 
      color: "bg-quest-medium/10 text-quest-medium border-quest-medium/30", 
      stars: 2,
      label: "보통"
    },
    어려움: { 
      color: "bg-quest-hard/10 text-quest-hard border-quest-hard/30", 
      stars: 3,
      label: "어려움"
    },
  }

  const diffConfig = difficultyConfig[difficulty]

  return (
    <Card 
      className={cn(
        "group cursor-pointer overflow-hidden shadow-lg transition-all duration-300 hover:shadow-xl hover:-translate-y-1",
        featured && "ring-2 ring-accent ring-offset-2 ring-offset-background shadow-accent/10",
        isCompleted && "ring-2 ring-quest-success ring-offset-2 ring-offset-background shadow-quest-success/10"
      )}
      onClick={onClick}
    >
      <CardContent className="p-0">
        {/* Header */}
        <div className={cn(
          "relative px-5 py-4",
          featured 
            ? "bg-gradient-to-r from-accent/10 via-primary/5 to-accent/10" 
            : "bg-gradient-to-r from-card to-secondary/30"
        )}>
          {/* Featured badge */}
          {featured && (
            <div className="absolute top-3 right-3">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-accent px-3 py-1 text-xs font-bold text-accent-foreground shadow-lg shadow-accent/30">
                <Zap className="h-3.5 w-3.5" />
                오늘의 추천
              </span>
            </div>
          )}

          {/* Quest Icon */}
          <div className="flex items-start gap-4">
            <div className={cn(
              "flex h-14 w-14 items-center justify-center rounded-xl shadow-lg transition-transform group-hover:scale-110",
              isCompleted 
                ? "bg-gradient-to-br from-quest-success to-quest-success/80 shadow-quest-success/30"
                : "bg-gradient-to-br from-primary to-primary/80 shadow-primary/30"
            )}>
              {isCompleted ? (
                <CheckCircle2 className="h-7 w-7 text-white" />
              ) : (
                <Swords className="h-7 w-7 text-primary-foreground" />
              )}
            </div>

            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-accent uppercase tracking-wide">{category}</p>
              <h3 className="mt-1 text-lg font-bold text-foreground truncate">{title}</h3>
              <p className="mt-0.5 text-sm text-muted-foreground truncate">{hobby}</p>
            </div>
          </div>

          {/* Meta badges */}
          <div className="mt-4 flex flex-wrap items-center gap-2">
            {/* Difficulty with stars */}
            <div className={cn(
              "flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold border",
              diffConfig.color
            )}>
              <div className="flex">
                {Array.from({ length: 3 }).map((_, i) => (
                  <Star 
                    key={i} 
                    className={cn(
                      "h-3 w-3",
                      i < diffConfig.stars ? "fill-current" : "opacity-30"
                    )} 
                  />
                ))}
              </div>
              <span>{diffConfig.label}</span>
            </div>

            {/* Time */}
            <div className="flex items-center gap-1 text-xs text-muted-foreground bg-secondary/50 px-2.5 py-1 rounded-full">
              <Clock className="h-3.5 w-3.5" />
              <span>{estimatedTime}</span>
            </div>

            {/* XP Reward */}
            <div className="flex items-center gap-1 text-xs font-bold text-primary bg-primary/10 px-2.5 py-1 rounded-full">
              <Zap className="h-3.5 w-3.5" />
              <span>+{xpReward} XP</span>
            </div>
          </div>
        </div>

        {/* Steps Progress */}
        <div className="px-5 py-4">
          {/* Progress Ring + Steps */}
          <div className="flex items-center gap-4 mb-4">
            {/* Progress Ring */}
            <div className="relative h-16 w-16 shrink-0">
              <svg className="h-16 w-16 -rotate-90 transform">
                <circle
                  cx="32"
                  cy="32"
                  r="28"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="6"
                  className="text-muted/30"
                />
                <circle
                  cx="32"
                  cy="32"
                  r="28"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="6"
                  strokeDasharray={`${progress * 1.76} 176`}
                  strokeLinecap="round"
                  className={cn(
                    "transition-all duration-500",
                    isCompleted ? "text-quest-success" : "text-primary"
                  )}
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className={cn(
                  "text-lg font-bold",
                  isCompleted ? "text-quest-success" : "text-primary"
                )}>
                  {Math.round(progress)}%
                </span>
              </div>
            </div>

            {/* Steps list */}
            <div className="flex-1 space-y-1.5">
              {steps.slice(0, 3).map((step, index) => (
                <div
                  key={step.id}
                  className={cn(
                    "flex items-center gap-2 text-sm",
                    step.completed ? "text-muted-foreground" : "text-foreground"
                  )}
                >
                  {step.completed ? (
                    <CheckCircle2 className="h-4 w-4 shrink-0 text-quest-success" />
                  ) : (
                    <Circle className="h-4 w-4 shrink-0 text-muted-foreground/50" />
                  )}
                  <span className={cn(
                    "truncate",
                    step.completed && "line-through"
                  )}>
                    {step.title}
                  </span>
                </div>
              ))}
              {steps.length > 3 && (
                <p className="text-xs text-muted-foreground pl-6">
                  +{steps.length - 3}개 더...
                </p>
              )}
            </div>
          </div>

          {/* Progress Bar */}
          <div className="mb-4">
            <div className="h-2.5 overflow-hidden rounded-full bg-muted/50">
              <div 
                className={cn(
                  "h-full rounded-full transition-all duration-500",
                  isCompleted 
                    ? "bg-gradient-to-r from-quest-success to-quest-success/80" 
                    : "bg-gradient-to-r from-primary to-primary/80"
                )}
                style={{ width: `${progress}%` }}
              />
            </div>
            <p className="mt-1.5 text-xs text-muted-foreground">
              {completedSteps}/{steps.length} 단계 완료
            </p>
          </div>

          {/* Action Button */}
          <div>
            {isCompleted ? (
              <Button 
                className="w-full bg-gradient-to-r from-quest-success to-quest-success/90 hover:from-quest-success/90 hover:to-quest-success/80 text-white shadow-lg shadow-quest-success/20" 
                size="lg"
              >
                <CheckCircle2 className="mr-2 h-5 w-5" />
                퀘스트 완료! 기록하기
              </Button>
            ) : isStarted ? (
              <Button 
                className="w-full bg-gradient-to-r from-accent to-accent/90 hover:from-accent/90 hover:to-accent/80 text-accent-foreground shadow-lg shadow-accent/20" 
                size="lg" 
                onClick={(e) => { e.stopPropagation(); onContinue?.(); }}
              >
                <Play className="mr-2 h-5 w-5" />
                계속하기
                <ChevronRight className="ml-1 h-5 w-5" />
              </Button>
            ) : (
              <Button 
                className="w-full bg-gradient-to-r from-accent to-accent/90 hover:from-accent/90 hover:to-accent/80 text-accent-foreground shadow-lg shadow-accent/20" 
                size="lg" 
                onClick={(e) => { e.stopPropagation(); onStart?.(); }}
              >
                <Swords className="mr-2 h-5 w-5" />
                퀘스트 시작
                <ChevronRight className="ml-1 h-5 w-5" />
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
