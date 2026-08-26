"use client"

import { Button } from "@/components/ui/button"
import { 
  X, 
  Star,
  Lock,
  Share2,
  Calendar,
  ChevronRight,
  Sparkles
} from "lucide-react"
import { cn } from "@/lib/utils"

interface AchievementDetailProps {
  achievement: {
    id: number
    name: string
    description: string
    icon: string
    unlocked: boolean
    unlockedAt?: string
    progress?: number
    total?: number
  }
  onClose: () => void
}

// 관련 업적 예시
const relatedAchievements = [
  { name: "탐험가 II", icon: "🧭", unlocked: false, description: "10개의 서로 다른 취미 시도" },
  { name: "탐험가 III", icon: "🗺️", unlocked: false, description: "20개의 서로 다른 취미 시도" },
]

export function AchievementDetail({ achievement, onClose }: AchievementDetailProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm p-4">
      <div className="relative w-full max-w-md rounded-2xl bg-card border shadow-xl overflow-hidden">
        {/* Header */}
        <div className={cn(
          "relative p-8 text-center",
          achievement.unlocked 
            ? "bg-gradient-to-br from-accent/20 via-primary/10 to-accent/5"
            : "bg-gradient-to-br from-muted to-secondary"
        )}>
          {/* Close Button */}
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-4 top-4 h-10 w-10 rounded-full bg-card/80 hover:bg-card"
            onClick={onClose}
          >
            <X className="h-5 w-5" />
          </Button>

          {/* Icon */}
          <div className={cn(
            "inline-flex h-24 w-24 items-center justify-center rounded-full text-5xl mb-4",
            achievement.unlocked 
              ? "bg-accent/20" 
              : "bg-muted grayscale"
          )}>
            {achievement.unlocked ? (
              achievement.icon
            ) : (
              <Lock className="h-10 w-10 text-muted-foreground" />
            )}
          </div>

          {/* Title */}
          <h2 className={cn(
            "text-xl font-bold",
            achievement.unlocked ? "text-foreground" : "text-muted-foreground"
          )}>
            {achievement.name}
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">{achievement.description}</p>

          {/* Status Badge */}
          {achievement.unlocked ? (
            <div className="mt-4 inline-flex items-center gap-2 rounded-full bg-accent/20 px-4 py-2">
              <Star className="h-4 w-4 fill-accent text-accent" />
              <span className="text-sm font-semibold text-accent">획득 완료!</span>
            </div>
          ) : (
            <div className="mt-4 inline-flex items-center gap-2 rounded-full bg-muted px-4 py-2">
              <Lock className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium text-muted-foreground">미획득</span>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-6 space-y-5">
          {/* Progress (if not unlocked) */}
          {!achievement.unlocked && achievement.progress !== undefined && achievement.total !== undefined && (
            <div>
              <div className="flex items-center justify-between text-sm mb-2">
                <span className="text-muted-foreground">진행 상황</span>
                <span className="font-semibold text-foreground">{achievement.progress}/{achievement.total}</span>
              </div>
              <div className="h-2.5 rounded-full bg-muted overflow-hidden">
                <div 
                  className="h-full rounded-full bg-primary transition-all"
                  style={{ width: `${(achievement.progress / achievement.total) * 100}%` }}
                />
              </div>
              <p className="mt-2 text-xs text-muted-foreground text-center">
                {achievement.total - achievement.progress}개 더 완료하면 획득할 수 있어요!
              </p>
            </div>
          )}

          {/* Unlock Date (if unlocked) */}
          {achievement.unlocked && (
            <div className="flex items-center justify-center gap-2 rounded-xl bg-secondary/50 p-3">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">
                획득일: {achievement.unlockedAt || "2026년 3월 1일"}
              </span>
            </div>
          )}

          {/* Reward Info */}
          <div className="flex items-center justify-center gap-2 rounded-xl bg-primary/5 border border-primary/20 p-3">
            <Sparkles className="h-5 w-5 text-primary" />
            <span className="text-sm font-medium text-foreground">
              {achievement.unlocked ? "50 XP 획득됨" : "획득 시 +50 XP"}
            </span>
          </div>

          {/* Related Achievements */}
          <div>
            <h3 className="text-sm font-semibold text-foreground mb-3">관련 업적</h3>
            <div className="space-y-2">
              {relatedAchievements.map((related, index) => (
                <div 
                  key={index}
                  className={cn(
                    "flex items-center gap-3 rounded-xl border p-3 transition-colors",
                    related.unlocked 
                      ? "bg-accent/5 border-accent/20" 
                      : "bg-secondary/30 border-border opacity-70"
                  )}
                >
                  <div className={cn(
                    "flex h-10 w-10 items-center justify-center rounded-lg text-xl",
                    related.unlocked ? "bg-accent/10" : "bg-muted grayscale"
                  )}>
                    {related.unlocked ? related.icon : <Lock className="h-4 w-4 text-muted-foreground" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">{related.name}</p>
                    <p className="text-xs text-muted-foreground truncate">{related.description}</p>
                  </div>
                  <ChevronRight className="h-4 w-4 text-muted-foreground shrink-0" />
                </div>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-2">
            {achievement.unlocked && (
              <Button variant="outline" className="flex-1 gap-2">
                <Share2 className="h-4 w-4" />
                공유하기
              </Button>
            )}
            <Button 
              className={cn("gap-2", achievement.unlocked ? "flex-1" : "w-full")}
              onClick={onClose}
            >
              확인
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
