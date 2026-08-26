"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { 
  ArrowLeft,
  Sparkles,
  Lightbulb,
  Play,
  ChevronRight
} from "lucide-react"
import { cn } from "@/lib/utils"
import { StartExplorationModal } from "@/components/web/start-exploration-modal"

// Exploration data for intro (without user progress)
const explorations: Record<string, {
  id: string
  name: string
  icon: string
  category: string
  description: string
  image?: string
  whatYouCanDo: string[]
  tips: string[]
  steps: string[]
}> = {
  "1": {
    id: "1",
    name: "재즈바 탐험",
    icon: "🎷",
    category: "문화/예술",
    description: "도시의 숨은 재즈바를 찾아 라이브 음악과 함께하는 특별한 저녁을 경험해보세요.",
    whatYouCanDo: [
      "라이브 재즈 공연 감상하기",
      "새로운 음악 장르 발견하기", 
      "아늑한 분위기에서 휴식 취하기",
      "칵테일이나 음료와 함께 여유 즐기기"
    ],
    tips: [
      "혼자 가도 충분히 즐길 수 있어요",
      "공연 시작 전에 도착하면 좋은 자리를 잡을 수 있어요",
      "첫 방문이라면 스탠다드 재즈를 추천해요",
      "사전에 공연 일정을 확인하세요"
    ],
    steps: [
      "재즈바 찾기",
      "입장하기",
      "공연 감상하기"
    ]
  },
  "2": {
    id: "2",
    name: "도자기 공예",
    icon: "🏺",
    category: "공예",
    description: "흙을 빚어 나만의 작품을 만들어보는 도자기 공예 체험입니다.",
    whatYouCanDo: [
      "물레를 돌려 그릇 만들기",
      "핸드빌딩으로 자유로운 형태 만들기",
      "유약 바르기 체험",
      "나만의 머그컵 완성하기"
    ],
    tips: [
      "편한 옷을 입고 가세요",
      "완성작은 건조 후 수령해야 해요 (보통 2주)",
      "처음이라면 물레보다 핸드빌딩이 쉬워요",
      "앞치마는 공방에서 제공해요"
    ],
    steps: [
      "공방 예약하기",
      "체험 참여하기",
      "작품 완성하기"
    ]
  },
  "3": {
    id: "3",
    name: "클라이밍 체험",
    icon: "🧗",
    category: "스포츠",
    description: "실내 클라이밍장에서 암벽 등반의 재미를 느껴보세요.",
    whatYouCanDo: [
      "볼더링 기초 배우기",
      "다양한 난이도 코스 도전",
      "전신 운동 효과 경험",
      "성취감과 자신감 얻기"
    ],
    tips: [
      "클라이밍화는 대여 가능해요",
      "손에 땀이 많으면 초크를 사용하세요",
      "처음엔 쉬운 코스부터 시작하세요",
      "무리하지 말고 충분히 쉬어가며 하세요"
    ],
    steps: [
      "클라이밍장 방문하기",
      "기초 강습 받기",
      "코스 도전하기"
    ]
  },
  "4": {
    id: "4",
    name: "독립서점 탐방",
    icon: "📚",
    category: "문화/예술",
    description: "개성 넘치는 독립서점에서 특별한 책을 발견해보세요.",
    whatYouCanDo: [
      "큐레이션된 책 구경하기",
      "독립출판물 발견하기",
      "서점 주인과 대화 나누기",
      "조용한 독서 시간 갖기"
    ],
    tips: [
      "SNS에서 미리 분위기를 확인해보세요",
      "영업시간이 짧은 곳이 많으니 확인하세요",
      "작은 공간이 많아 조용히 관람하세요",
      "마음에 드는 책은 바로 구매하세요"
    ],
    steps: [
      "독립서점 찾기",
      "서점 방문하기",
      "책 탐색하기"
    ]
  },
  "5": {
    id: "5",
    name: "홈 베이킹",
    icon: "🥖",
    category: "요리",
    description: "집에서 직접 빵이나 디저트를 만들어보는 베이킹 체험입니다.",
    whatYouCanDo: [
      "반죽부터 굽기까지 전 과정 체험",
      "다양한 레시피 시도하기",
      "나만의 레시피 개발",
      "가족, 친구와 함께 즐기기"
    ],
    tips: [
      "레시피를 꼼꼼히 읽고 시작하세요",
      "재료는 미리 계량해두면 편해요",
      "오븐 온도는 기기마다 달라요",
      "실패해도 괜찮아요, 다음에 더 잘하면 돼요"
    ],
    steps: [
      "레시피 선택하기",
      "재료 준비하기",
      "베이킹 완성하기"
    ]
  }
}

interface ExplorationIntroScreenProps {
  explorationId: string
  onBack: () => void
  onStart: (explorationId: string) => void
}

export function ExplorationIntroScreen({ 
  explorationId, 
  onBack,
  onStart
}: ExplorationIntroScreenProps) {
  const [showStartModal, setShowStartModal] = useState(false)
  const exploration = explorations[explorationId] || explorations["1"]

  const handleStartClick = () => {
    setShowStartModal(true)
  }

  const handleConfirmStart = () => {
    setShowStartModal(false)
    onStart(explorationId)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={onBack}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold text-foreground">탐험 소개</h1>
          <p className="text-sm text-muted-foreground">이 탐험에 대해 알아보세요</p>
        </div>
      </div>

      {/* Hero Section */}
      <Card className="shadow-lg overflow-hidden">
        <div className="relative h-48 bg-gradient-to-br from-primary/20 via-accent/20 to-highlight/20 flex items-center justify-center">
          <span className="text-8xl">{exploration.icon}</span>
        </div>
        <CardContent className="p-6">
          <span className="inline-block px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium mb-3">
            {exploration.category}
          </span>
          <h1 className="text-3xl font-bold text-foreground mb-3">{exploration.name}</h1>
          <p className="text-lg text-muted-foreground">{exploration.description}</p>
        </CardContent>
      </Card>

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
                  <ChevronRight className="h-4 w-4 text-primary" />
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

      {/* Steps Preview */}
      <Card className="shadow-lg">
        <CardContent className="p-6">
          <div className="flex items-center gap-2 mb-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent/10">
              <Play className="h-5 w-5 text-accent" />
            </div>
            <h2 className="text-lg font-bold text-foreground">진행 단계 안내</h2>
          </div>
          <p className="text-sm text-muted-foreground mb-4">탐험을 시작하면 이런 순서로 진행돼요</p>
          <div className="space-y-3">
            {exploration.steps.map((step, index) => (
              <div
                key={index}
                className="flex items-center gap-3 p-3 rounded-xl bg-muted/30 border border-border"
              >
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted text-muted-foreground shrink-0">
                  <span className="text-sm font-medium">{index + 1}</span>
                </div>
                <span className="text-foreground font-medium">{step}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Start Button */}
      <Card className="shadow-lg bg-gradient-to-r from-accent/5 to-primary/5 border-accent/20">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-foreground mb-1">이 탐험을 시작해볼까요?</h3>
              <p className="text-sm text-muted-foreground">시작하면 내 탐험 목록에 추가됩니다</p>
            </div>
            <Button 
              size="lg" 
              className="gap-2 bg-accent hover:bg-accent/90 text-accent-foreground shadow-lg px-8"
              onClick={handleStartClick}
            >
              <Play className="h-5 w-5" />
              탐험 시작
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Start Confirmation Modal */}
      <StartExplorationModal
        isOpen={showStartModal}
        onClose={() => setShowStartModal(false)}
        onConfirm={handleConfirmStart}
        explorationName={exploration.name}
        explorationIcon={exploration.icon}
      />
    </div>
  )
}
