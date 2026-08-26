"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { 
  X, 
  Clock, 
  Target,
  CheckCircle2,
  Circle,
  Sparkles,
  Trophy,
  Play,
  Pause,
  Flag,
  ChevronRight,
  Camera,
  PartyPopper,
  Star
} from "lucide-react"
import { cn } from "@/lib/utils"

interface QuestStep {
  id: number
  title: string
  completed: boolean
}

interface QuestDetailProps {
  quest: {
    title: string
    hobby: string
    category: string
    difficulty: "쉬움" | "보통" | "어려움"
    estimatedTime: string
    xpReward: number
    steps: QuestStep[]
  }
  onClose: () => void
  onComplete?: () => void
}

const difficultyColors = {
  쉬움: "bg-quest-easy/10 text-quest-easy border-quest-easy/30",
  보통: "bg-quest-medium/10 text-quest-medium border-quest-medium/30",
  어려움: "bg-quest-hard/10 text-quest-hard border-quest-hard/30",
}

export function QuestDetail({ quest, onClose, onComplete }: QuestDetailProps) {
  const [steps, setSteps] = useState(quest.steps)
  const [showCompletionModal, setShowCompletionModal] = useState(false)
  const [completionNote, setCompletionNote] = useState("")
  const [completionRating, setCompletionRating] = useState(0)
  
  const completedSteps = steps.filter(s => s.completed).length
  const progress = (completedSteps / steps.length) * 100
  const isAllCompleted = completedSteps === steps.length

  const toggleStep = (stepId: number) => {
    setSteps(prev => prev.map(step => 
      step.id === stepId ? { ...step, completed: !step.completed } : step
    ))
  }

  const handleCompleteQuest = () => {
    if (isAllCompleted) {
      setShowCompletionModal(true)
    }
  }

  const submitCompletion = () => {
    setShowCompletionModal(false)
    onComplete?.()
    onClose()
  }

  // Completion Modal
  if (showCompletionModal) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm p-4">
        <div className="relative w-full max-w-lg rounded-2xl bg-card border shadow-xl overflow-hidden">
          {/* Celebration Header */}
          <div className="bg-gradient-to-br from-quest-success/20 via-accent/10 to-primary/10 p-8 text-center">
            <div className="inline-flex h-20 w-20 items-center justify-center rounded-full bg-quest-success/20 mb-4">
              <PartyPopper className="h-10 w-10 text-quest-success" />
            </div>
            <h2 className="text-2xl font-bold text-foreground">퀘스트 완료!</h2>
            <p className="mt-2 text-muted-foreground">축하합니다! {quest.title} 퀘스트를 완료했습니다.</p>
            <div className="mt-4 inline-flex items-center gap-2 rounded-full bg-accent/20 px-4 py-2">
              <Sparkles className="h-5 w-5 text-accent" />
              <span className="font-bold text-accent">+{quest.xpReward} XP 획득!</span>
            </div>
          </div>

          {/* Completion Form */}
          <div className="p-6 space-y-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">이 경험은 어땠나요?</label>
              <div className="flex gap-2 justify-center">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    onClick={() => setCompletionRating(star)}
                    className="transition-transform hover:scale-110"
                  >
                    <Star 
                      className={cn(
                        "h-8 w-8 transition-colors",
                        star <= completionRating 
                          ? "fill-accent text-accent" 
                          : "text-muted-foreground/30"
                      )} 
                    />
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">간단한 소감을 남겨주세요</label>
              <Textarea 
                placeholder="이 퀘스트를 하면서 느낀 점을 적어주세요..."
                value={completionNote}
                onChange={(e) => setCompletionNote(e.target.value)}
                rows={3}
              />
            </div>

            <div className="flex gap-3 pt-2">
              <Button variant="outline" className="flex-1" onClick={() => setShowCompletionModal(false)}>
                나중에 작성
              </Button>
              <Button 
                className="flex-1 bg-gradient-to-r from-quest-success to-quest-success/80"
                onClick={submitCompletion}
              >
                완료하기
              </Button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm p-4">
      <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl bg-card border shadow-xl">
        {/* Header */}
        <div className="sticky top-0 z-10 bg-card border-b p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
              <Target className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h2 className="font-bold text-foreground">{quest.title}</h2>
              <p className="text-sm text-muted-foreground">{quest.hobby}</p>
            </div>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Progress Overview */}
          <Card className="bg-gradient-to-r from-primary/5 to-accent/5 border-primary/20">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-medium text-foreground">퀘스트 진행률</span>
                <span className="text-sm font-bold text-primary">{completedSteps}/{steps.length} 완료</span>
              </div>
              <div className="h-3 rounded-full bg-muted overflow-hidden">
                <div 
                  className="h-full rounded-full bg-gradient-to-r from-primary to-accent transition-all duration-500"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <div className="mt-3 flex items-center justify-between text-sm">
                <div className="flex items-center gap-4">
                  <div className={cn("flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium border", difficultyColors[quest.difficulty])}>
                    {quest.difficulty}
                  </div>
                  <div className="flex items-center gap-1.5 text-muted-foreground">
                    <Clock className="h-4 w-4" />
                    {quest.estimatedTime}
                  </div>
                </div>
                <div className="flex items-center gap-1.5 text-accent font-semibold">
                  <Sparkles className="h-4 w-4" />
                  +{quest.xpReward} XP
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Steps */}
          <div>
            <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
              <Flag className="h-5 w-5 text-primary" />
              퀘스트 단계
            </h3>
            <div className="space-y-3">
              {steps.map((step, index) => (
                <div key={step.id} className="relative">
                  {/* Connector Line */}
                  {index < steps.length - 1 && (
                    <div className={cn(
                      "absolute left-5 top-12 h-full w-0.5 -translate-x-1/2",
                      step.completed ? "bg-primary" : "bg-border"
                    )} />
                  )}
                  
                  <button
                    onClick={() => toggleStep(step.id)}
                    className={cn(
                      "relative w-full flex items-center gap-4 rounded-xl border p-4 transition-all text-left",
                      step.completed 
                        ? "bg-primary/5 border-primary/30" 
                        : "bg-card hover:bg-secondary/50 border-border"
                    )}
                  >
                    <div className={cn(
                      "flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-2 transition-all",
                      step.completed 
                        ? "bg-primary border-primary text-primary-foreground" 
                        : "bg-card border-border text-muted-foreground"
                    )}>
                      {step.completed ? (
                        <CheckCircle2 className="h-5 w-5" />
                      ) : (
                        <span className="text-sm font-bold">{step.id}</span>
                      )}
                    </div>
                    <div className="flex-1">
                      <p className={cn(
                        "font-medium transition-colors",
                        step.completed ? "text-primary" : "text-foreground"
                      )}>
                        {step.title}
                      </p>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {step.completed ? "완료됨" : "클릭하여 완료 표시"}
                      </p>
                    </div>
                    <ChevronRight className={cn(
                      "h-5 w-5 transition-transform",
                      step.completed && "rotate-90 text-primary"
                    )} />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="flex gap-3">
            <Button variant="outline" className="flex-1 gap-2">
              <Camera className="h-4 w-4" />
              사진 추가
            </Button>
            <Button variant="outline" className="flex-1 gap-2">
              <Pause className="h-4 w-4" />
              일시 중단
            </Button>
          </div>

          {/* Complete Button */}
          <Button 
            className={cn(
              "w-full gap-2 h-12 text-base",
              isAllCompleted 
                ? "bg-gradient-to-r from-quest-success to-quest-success/80 hover:from-quest-success/90 hover:to-quest-success/70"
                : "bg-muted text-muted-foreground cursor-not-allowed"
            )}
            onClick={handleCompleteQuest}
            disabled={!isAllCompleted}
          >
            {isAllCompleted ? (
              <>
                <Trophy className="h-5 w-5" />
                퀘스트 완료하기
              </>
            ) : (
              <>
                <Circle className="h-5 w-5" />
                모든 단계를 완료해주세요
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  )
}
