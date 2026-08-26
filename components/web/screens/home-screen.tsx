"use client"

import { useState, useEffect, useCallback } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { 
  Sparkles,
  Play,
  Compass,
  ChevronRight,
  Shuffle,
  Dice5,
  MapPin
} from "lucide-react"
import { cn } from "@/lib/utils"

const allRandomQuests = [
  { name: "재즈바 탐방", icon: "🎷", category: "음악", description: "도시 속 숨은 재즈바에서 라이브 음악을 즐겨보세요" },
  { name: "야간 산책", icon: "🌙", category: "야외활동", description: "별빛 아래 도시의 새로운 모습을 발견해보세요" },
  { name: "독립 서점 탐험", icon: "📚", category: "문화/예술", description: "작은 서점에서 특별한 책을 찾아보세요" },
  { name: "도예 체험", icon: "🏺", category: "창작", description: "흙을 빚어 나만의 작품을 만들어보세요" },
  { name: "클라이밍 체험", icon: "🧗", category: "운동", description: "벽을 오르며 새로운 도전을 시작해보세요" },
  { name: "사진 산책", icon: "📷", category: "창작", description: "카메라와 함께 일상 속 아름다움을 담아보세요" },
  { name: "새로운 카페 방문", icon: "☕", category: "음식", description: "숨겨진 카페에서 특별한 한 잔을 즐겨보세요" },
  { name: "공원 피크닉", icon: "🧺", category: "야외활동", description: "자연 속에서 여유로운 시간을 보내세요" },
  { name: "수제 맥주 탐방", icon: "🍺", category: "음식", description: "크래프트 맥주의 다양한 맛을 경험해보세요" },
  { name: "미술관 방문", icon: "🖼️", category: "문화/예술", description: "예술 작품 속에서 영감을 얻어보세요" },
]

const inProgressExplorations = [
  {
    id: 1,
    name: "재즈바 탐험",
    description: "홍대 근처 재즈바에서 라이브 공연 감상하기",
    category: "음악",
    icon: "🎷",
    progress: 50,
    currentStep: "공연 감상하기",
    estimatedTime: "2-3시간",
  },
  {
    id: 2,
    name: "홈 베이킹 입문",
    description: "집에서 처음으로 빵 굽기 도전",
    category: "요리",
    icon: "🍞",
    progress: 25,
    currentStep: "반죽 만들기",
    estimatedTime: "3-4시간",
  },
  {
    id: 3,
    name: "별자리 관측",
    description: "밤하늘 별자리 찾기",
    category: "자연/과학",
    icon: "⭐",
    progress: 75,
    currentStep: "소감 기록하기",
    estimatedTime: "1-2시간",
  },
]

interface HomeScreenProps {
  onExplorationSelect?: (id: string) => void
  onContinueExploration?: (id: string) => void
}

export function HomeScreen({ onExplorationSelect, onContinueExploration }: HomeScreenProps) {
  const [randomQuest, setRandomQuest] = useState(allRandomQuests[0])
  const [isShuffling, setIsShuffling] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const randomIndex = Math.floor(Math.random() * allRandomQuests.length)
    setRandomQuest(allRandomQuests[randomIndex])
  }, [])

  const shuffleRandomQuest = useCallback(() => {
    setIsShuffling(true)
    let count = 0
    const interval = setInterval(() => {
      const randomIndex = Math.floor(Math.random() * allRandomQuests.length)
      setRandomQuest(allRandomQuests[randomIndex])
      count++
      if (count >= 8) {
        clearInterval(interval)
        setIsShuffling(false)
      }
    }, 100)
  }, [])

  const currentQuest = mounted ? randomQuest : allRandomQuests[0]

  return (
    <div className="space-y-8">
      {/* Hero - Simple & Focused */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary/5 via-white to-accent/5 border border-border p-8">
        <div className="absolute top-0 right-0 w-48 h-48 bg-gradient-to-br from-highlight/10 to-transparent rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-tr from-primary/10 to-transparent rounded-full blur-2xl" />
        
        <div className="relative text-center max-w-xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
            <Sparkles className="h-4 w-4" />
            오늘의 탐험
          </div>
          
          <h1 className="text-3xl font-bold text-foreground mb-3">
            오늘은 뭐 해볼까?
          </h1>
          <p className="text-muted-foreground mb-8">
            새로운 취미를 발견하고, 경험을 기록해보세요
          </p>

          {/* Random Quest Card */}
          <Card className="mb-6 border-2 border-dashed border-accent/30 bg-gradient-to-r from-accent/5 to-primary/5 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className={cn(
                    "flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-accent/20 to-primary/20 text-4xl transition-transform",
                    isShuffling && "animate-bounce"
                  )}>
                    {currentQuest.icon}
                  </div>
                  <div className="text-left">
                    <p className="text-xs text-accent font-semibold uppercase tracking-wide mb-1">{currentQuest.category}</p>
                    <h3 className="text-xl font-bold text-foreground">{currentQuest.name}</h3>
                    <p className="text-sm text-muted-foreground mt-1">{currentQuest.description}</p>
                  </div>
                </div>
                
                <div className="flex flex-col gap-2">
                  <Button 
                    onClick={shuffleRandomQuest}
                    disabled={isShuffling}
                    variant="outline"
                    className="gap-2 border-primary/30 hover:bg-primary/10"
                  >
                    <Shuffle className={cn("h-4 w-4", isShuffling && "animate-spin")} />
                    {isShuffling ? "탐색 중..." : "다시 뽑기"}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          <Button 
            size="lg" 
            className="gap-2 bg-accent hover:bg-accent/90 text-accent-foreground shadow-lg shadow-accent/30 text-base px-10"
            onClick={() => onExplorationSelect?.("1")}
          >
            <Play className="h-5 w-5" />
            랜덤 탐험 시작
          </Button>
        </div>
      </div>

      {/* In Progress Explorations */}
      {inProgressExplorations.length > 0 && (
        <div>
          <div className="mb-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
                <Compass className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-foreground">진행 중인 탐험</h2>
                <p className="text-sm text-muted-foreground">이어서 탐험해보세요</p>
              </div>
            </div>
            <Button variant="ghost" size="sm" className="gap-1 text-primary hover:text-primary/80">
              전체보기
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
          
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {inProgressExplorations.map((exploration) => (
              <Card key={exploration.id} className="group cursor-pointer shadow-md hover:shadow-lg transition-all hover:-translate-y-0.5">
                <CardContent className="p-5">
                  <div className="flex items-start gap-4 mb-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-primary/10 to-accent/10 text-2xl">
                      {exploration.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs text-primary font-medium">{exploration.category}</span>
                      </div>
                      <h3 className="font-bold text-foreground truncate">{exploration.name}</h3>
                      <p className="text-sm text-muted-foreground truncate">{exploration.description}</p>
                    </div>
                  </div>
                  
                  {/* Progress */}
                  <div className="mb-4">
                    <div className="flex items-center justify-between text-xs mb-1.5">
                      <span className="text-muted-foreground">다음: {exploration.currentStep}</span>
                      <span className="font-medium text-primary">{exploration.progress}%</span>
                    </div>
                    <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
                      <div 
                        className="h-full rounded-full bg-gradient-to-r from-primary to-primary/80 transition-all"
                        style={{ width: `${exploration.progress}%` }}
                      />
                    </div>
                  </div>
                  
                  <Button 
                    className="w-full gap-2 bg-primary hover:bg-primary/90" 
                    size="sm"
                    onClick={() => onContinueExploration?.(exploration.id.toString())}
                  >
                    <Play className="h-4 w-4" />
                    계속 탐험하기
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
