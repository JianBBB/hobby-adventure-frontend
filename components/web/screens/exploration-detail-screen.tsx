"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { 
  ArrowLeft,
  Sparkles,
  Lightbulb,
  CheckCircle2,
  PartyPopper,
  BookOpen,
  Play
} from "lucide-react"
import { cn } from "@/lib/utils"

// Shared exploration data with progress info
export const explorations: Record<string, {
  id: string
  name: string
  description: string
  category: string
  icon: string
  status: "not_started" | "in_progress" | "completed"
  progress: number
  currentStep: string
  nextAction: string
  steps: { name: string; completed: boolean }[]
  location?: string
  estimatedTime?: string
  whatYouCanDo: string[]
  tips: string[]
}> = {
  "1": {
    id: "1",
    name: "재즈바 탐험",
    description: "오늘은 재즈바에서 라이브 음악을 즐겨보세요. 분위기 좋은 공간에서 새로운 음악을 발견하는 시간.",
    category: "문화/예술",
    icon: "🎷",
    status: "in_progress",
    progress: 50,
    currentStep: "공연 감상하기",
    nextAction: "라이브 음악 감상하기",
    steps: [
      { name: "재즈바 찾기", completed: true },
      { name: "입장하기", completed: true },
      { name: "공연 감상하기", completed: false },
      { name: "소감 기록하기", completed: false },
    ],
    location: "홍대/이태원 재즈바",
    estimatedTime: "2-3시간",
    whatYouCanDo: [
      "라이브 음악 감상",
      "새로운 음악 발견",
      "분위기 즐기기",
      "음악에 집중하는 시간 갖기"
    ],
    tips: [
      "혼자 가도 좋습니다",
      "늦은 밤 분위기가 더 좋을 수 있어요",
      "음료 한 잔과 함께하면 더 좋아요",
      "첫 방문이라면 주말보다 평일 추천"
    ]
  },
  "2": {
    id: "2",
    name: "홈 베이킹 입문",
    description: "집에서 처음으로 빵을 구워보세요. 손으로 반죽하며 느끼는 특별한 시간.",
    category: "요리",
    icon: "🍞",
    status: "in_progress",
    progress: 25,
    currentStep: "반죽 만들기",
    nextAction: "밀가루 반죽하기",
    steps: [
      { name: "재료 준비하기", completed: true },
      { name: "반죽 만들기", completed: false },
      { name: "발효시키기", completed: false },
      { name: "굽기", completed: false },
    ],
    location: "집",
    estimatedTime: "3-4시간",
    whatYouCanDo: [
      "나만의 빵 만들기",
      "반죽의 감촉 느끼기",
      "발효 과정 관찰하기",
      "집중하는 시간 갖기"
    ],
    tips: [
      "처음엔 간단한 식빵부터 시작하세요",
      "정확한 계량이 중요해요",
      "발효 시간을 충분히 주세요",
      "오븐 예열을 잊지 마세요"
    ]
  },
  "3": {
    id: "3",
    name: "별자리 관측",
    description: "밤하늘의 별자리를 찾아보세요. 도시에서도 볼 수 있는 밤하늘의 아름다움.",
    category: "자연/과학",
    icon: "⭐",
    status: "in_progress",
    progress: 75,
    currentStep: "소감 기록하기",
    nextAction: "오늘 관측한 별자리 기록하기",
    steps: [
      { name: "관측 장소 선정", completed: true },
      { name: "별자리 앱 준비", completed: true },
      { name: "별자리 찾기", completed: true },
      { name: "소감 기록하기", completed: false },
    ],
    location: "야외",
    estimatedTime: "1-2시간",
    whatYouCanDo: [
      "밤하늘 감상하기",
      "별자리 찾기",
      "우주에 대해 생각하기",
      "평온한 시간 갖기"
    ],
    tips: [
      "달이 없는 밤이 좋아요",
      "별자리 앱을 활용하세요",
      "어두운 곳일수록 좋습니다",
      "담요나 돗자리를 준비하세요"
    ]
  },
  "4": {
    id: "4",
    name: "도자기 공방 체험",
    description: "흙을 빚어 나만의 작품을 만들어보세요. 집중하며 손으로 무언가를 만드는 특별한 경험.",
    category: "공예",
    icon: "🏺",
    status: "not_started",
    progress: 0,
    currentStep: "시작 전",
    nextAction: "공방 예약하기",
    steps: [
      { name: "공방 예약하기", completed: false },
      { name: "공방 방문하기", completed: false },
      { name: "작품 만들기", completed: false },
      { name: "소감 기록하기", completed: false },
    ],
    location: "이태원 도자기 공방",
    estimatedTime: "2-3시간",
    whatYouCanDo: [
      "나만의 컵/그릇 만들기",
      "물레 체험하기",
      "흙의 감촉 느끼기",
      "집중하는 시간 갖기"
    ],
    tips: [
      "편한 옷을 입고 가세요",
      "예약 필수인 곳이 많아요",
      "첫 작품은 소박해도 괜찮아요",
      "완성까지 1-2주 소요됩니다"
    ]
  },
  "5": {
    id: "5",
    name: "클라이밍 체험",
    description: "벽을 오르며 새로운 도전을 시작해보세요. 온몸을 사용하며 성취감을 느끼는 시간.",
    category: "운동",
    icon: "🧗",
    status: "completed",
    progress: 100,
    currentStep: "완료",
    nextAction: "",
    steps: [
      { name: "클라이밍장 방문", completed: true },
      { name: "기초 강습 듣기", completed: true },
      { name: "코스 도전하기", completed: true },
      { name: "소감 기록하기", completed: true },
    ],
    location: "강남 클라이밍 센터",
    estimatedTime: "1-2시간",
    whatYouCanDo: [
      "실내 볼더링 도전",
      "몸 전체 운동하기",
      "문제 해결 능력 키우기",
      "성취감 느끼기"
    ],
    tips: [
      "초보자 강습이 있는 곳 추천",
      "운동복과 편한 신발 준비",
      "손에 땀이 나면 초크 사용",
      "무리하지 않고 천천히 시작"
    ]
  }
}

interface WriteRecordData {
  explorationId: string
  explorationName: string
  explorationIcon: string
  explorationCategory: string
}

interface ExplorationDetailScreenProps {
  explorationId: string
  onBack: () => void
  onWriteRecord?: (data: WriteRecordData) => void
}

export function ExplorationDetailScreen({ 
  explorationId, 
  onBack,
  onWriteRecord 
}: ExplorationDetailScreenProps) {
  const [showCompleteModal, setShowCompleteModal] = useState(false)
  const baseExploration = explorations[explorationId] || explorations["1"]
  
  // Local state for steps (to allow toggling)
  const [steps, setSteps] = useState(baseExploration.steps.map(s => ({ ...s })))
  
  // Calculate progress from steps
  const completedSteps = steps.filter(s => s.completed).length
  const progress = Math.round((completedSteps / steps.length) * 100)
  const currentStepIndex = steps.findIndex(s => !s.completed)
  const currentStep = currentStepIndex >= 0 ? steps[currentStepIndex].name : "완료"
  const nextAction = currentStepIndex >= 0 
    ? `${steps[currentStepIndex].name} 완료하기` 
    : "탐험 완료하기"
  const allCompleted = steps.every(s => s.completed)
  
  const exploration = {
    ...baseExploration,
    steps,
    progress,
    currentStep,
    nextAction
  }

  const toggleStep = (index: number) => {
    setSteps(prev => {
      const newSteps = [...prev]
      newSteps[index] = { ...newSteps[index], completed: !newSteps[index].completed }
      return newSteps
    })
  }

  const statusConfig = {
    not_started: { label: "��작 전", color: "bg-muted text-muted-foreground" },
    in_progress: { label: "진행중", color: "bg-primary/10 text-primary" },
    completed: { label: "완료", color: "bg-quest-success/10 text-quest-success" }
  }

  const handleComplete = () => {
    setShowCompleteModal(true)
  }

  const handleRecordLater = () => {
    setShowCompleteModal(false)
    onBack()
  }

  const handleRecordNow = () => {
    setShowCompleteModal(false)
    if (onWriteRecord) {
      onWriteRecord({
        explorationId: exploration.id,
        explorationName: exploration.name,
        explorationIcon: exploration.icon,
        explorationCategory: exploration.category
      })
    }
  }

  return (
    <div className="space-y-6">
      {/* Complete Modal */}
      {showCompleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <Card className="w-full max-w-md mx-4 shadow-2xl">
            <CardContent className="p-8 text-center">
              <div className="flex h-20 w-20 items-center justify-center rounded-full bg-highlight/20 mx-auto mb-6">
                <PartyPopper className="h-10 w-10 text-highlight" />
              </div>
              <h2 className="text-2xl font-bold text-foreground mb-2">탐험 완료!</h2>
              <p className="text-muted-foreground mb-8">기록을 남길까요?</p>
              <div className="flex flex-col gap-3">
                <Button 
                  size="lg" 
                  className="w-full gap-2 bg-accent hover:bg-accent/90"
                  onClick={handleRecordNow}
                >
                  <BookOpen className="h-5 w-5" />
                  기록 남기기
                </Button>
                <Button 
                  variant="outline" 
                  size="lg" 
                  className="w-full"
                  onClick={handleRecordLater}
                >
                  나중에 하기
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Back Button */}
      <Button variant="ghost" className="gap-2 -ml-2" onClick={onBack}>
        <ArrowLeft className="h-4 w-4" />
        돌아가기
      </Button>

      {/* Header */}
      <div className="flex items-start gap-6">
        <div className="flex h-24 w-24 items-center justify-center rounded-2xl bg-primary/10 text-5xl shrink-0">
          {exploration.icon}
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-sm font-medium text-primary">{exploration.category}</span>
            <span className={cn(
              "px-2 py-0.5 rounded-full text-xs font-medium",
              statusConfig[exploration.status].color
            )}>
              {statusConfig[exploration.status].label}
            </span>
          </div>
          <h1 className="text-3xl font-bold text-foreground mb-2">{exploration.name}</h1>
          <p className="text-lg text-muted-foreground">{exploration.description}</p>
        </div>
      </div>

      {/* Content Cards - What you can do & Tips */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* What you can do */}
        <Card className="shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
                <Sparkles className="h-5 w-5 text-primary" />
              </div>
              <h2 className="text-lg font-bold text-foreground">이 탐험에서 해볼 수 있는 것</h2>
            </div>
            <ul className="space-y-3">
              {exploration.whatYouCanDo.map((item, index) => (
                <li key={index} className="flex items-start gap-3">
                  <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/10 shrink-0 mt-0.5">
                    <CheckCircle2 className="h-4 w-4 text-primary" />
                  </div>
                  <span className="text-foreground">{item}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        {/* Tips */}
        <Card className="shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-highlight/10">
                <Lightbulb className="h-5 w-5 text-highlight" />
              </div>
              <h2 className="text-lg font-bold text-foreground">탐험 팁</h2>
            </div>
            <ul className="space-y-3">
              {exploration.tips.map((tip, index) => (
                <li key={index} className="flex items-start gap-3">
                  <div className="flex h-6 w-6 items-center justify-center rounded-full bg-highlight/10 shrink-0 mt-0.5">
                    <span className="text-xs font-bold text-highlight">{index + 1}</span>
                  </div>
                  <span className="text-foreground">{tip}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>

      {/* Progress Card - Only show for in_progress status */}
      {exploration.status === "in_progress" && (
        <Card className="shadow-lg border-primary/20 bg-gradient-to-r from-primary/5 to-transparent">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Play className="h-5 w-5 text-primary" />
                <h2 className="text-lg font-bold text-foreground">탐험 진행 상황</h2>
              </div>
              <span className="text-2xl font-bold text-primary">{exploration.progress}%</span>
            </div>
            
            {/* Progress Bar */}
            <div className="h-3 w-full overflow-hidden rounded-full bg-muted mb-6">
              <div 
                className="h-full rounded-full bg-gradient-to-r from-primary to-accent transition-all"
                style={{ width: `${exploration.progress}%` }}
              />
            </div>

            {/* Steps - Clickable */}
            <div className="space-y-3 mb-6">
              {exploration.steps.map((step, index) => (
                <button
                  key={index}
                  onClick={() => toggleStep(index)}
                  className={cn(
                    "w-full flex items-center gap-3 p-3 rounded-xl border transition-all text-left",
                    step.completed 
                      ? "bg-quest-success/5 border-quest-success/20 hover:bg-quest-success/10" 
                      : "bg-muted/30 border-border hover:bg-muted/50 hover:border-primary/30"
                  )}
                >
                  <div className={cn(
                    "flex h-7 w-7 items-center justify-center rounded-full shrink-0 transition-all",
                    step.completed 
                      ? "bg-quest-success text-white" 
                      : "bg-muted text-muted-foreground"
                  )}>
                    {step.completed ? (
                      <CheckCircle2 className="h-4 w-4" />
                    ) : (
                      <span className="text-xs font-medium">{index + 1}</span>
                    )}
                  </div>
                  <span className={cn(
                    "flex-1",
                    step.completed ? "text-foreground line-through opacity-60" : "text-foreground font-medium"
                  )}>
                    {step.name}
                  </span>
                  {step.name === exploration.currentStep && !step.completed && (
                    <span className="px-2 py-0.5 rounded-full bg-accent/20 text-accent text-xs font-medium">
                      현재 단계
                    </span>
                  )}
                  {!step.completed && (
                    <span className="text-xs text-muted-foreground">클릭하여 완료</span>
                  )}
                </button>
              ))}
            </div>

            {/* Next Action */}
            <div className="p-4 rounded-xl bg-accent/10 border border-accent/20">
              <p className="text-sm text-muted-foreground mb-1">다�� 할 일</p>
              <p className="font-bold text-foreground">{exploration.nextAction}</p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Complete Button */}
      {exploration.status === "in_progress" && (
        <Card className={cn(
          "shadow-lg border-accent/20",
          allCompleted 
            ? "bg-gradient-to-r from-accent/10 to-highlight/10 border-highlight/30" 
            : "bg-gradient-to-r from-accent/5 to-primary/5"
        )}>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                {allCompleted ? (
                  <>
                    <h3 className="font-bold text-foreground mb-1">모든 단계를 완료했어요!</h3>
                    <p className="text-sm text-muted-foreground">탐험을 완료하고 경험을 기록하세요</p>
                  </>
                ) : (
                  <>
                    <h3 className="font-bold text-foreground mb-1">탐험을 마쳤나요?</h3>
                    <p className="text-sm text-muted-foreground">
                      {completedSteps}/{steps.length} 단계 완료 - 위 단계를 클릭하여 진행하세요
                    </p>
                  </>
                )}
              </div>
              <Button 
                size="lg" 
                className={cn(
                  "gap-2 shadow-lg px-8",
                  allCompleted 
                    ? "bg-highlight hover:bg-highlight/90 text-highlight-foreground animate-pulse" 
                    : "bg-accent hover:bg-accent/90 text-accent-foreground"
                )}
                onClick={handleComplete}
              >
                <CheckCircle2 className="h-5 w-5" />
                탐험 완료
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Already completed */}
      {exploration.status === "completed" && (
        <Card className="shadow-lg bg-quest-success/5 border-quest-success/20">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-quest-success/10">
                <CheckCircle2 className="h-6 w-6 text-quest-success" />
              </div>
              <div>
                <h3 className="font-bold text-foreground">이 탐험을 완료했어요!</h3>
                <p className="text-sm text-muted-foreground">기록에서 경험을 확인할 수 있습니다</p>
              </div>
              <Button variant="outline" className="ml-auto gap-2">
                <BookOpen className="h-4 w-4" />
                기록 보기
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
