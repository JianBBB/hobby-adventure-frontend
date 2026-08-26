"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Play,
  CheckCircle2,
  Clock,
  MapPin,
  ChevronRight
} from "lucide-react"
import { cn } from "@/lib/utils"

const explorations = {
  inProgress: [
    {
      id: 1,
      name: "재즈바 탐험",
      description: "홍대 근처 재즈바에서 라이브 공연 감상하기",
      category: "음악",
      icon: "🎷",
      progress: 50,
      currentStep: "공연 감상하기",
      estimatedTime: "2-3시간",
      startedAt: "2026.03.10",
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
      startedAt: "2026.03.09",
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
      startedAt: "2026.03.08",
    },
  ],
  completed: [
    {
      id: 4,
      name: "도자기 공방 체험",
      description: "이태원 도자기 공방에서 컵 만들기",
      category: "공예",
      icon: "🏺",
      completedAt: "2026.03.08",
      location: "이태원 도자기 공방",
      rating: 5,
      note: "컵을 처음 만들어봤다. 생각보다 어렵지만 뿌듯했다.",
    },
    {
      id: 5,
      name: "클라이밍 체험",
      description: "강남 클라이밍 센터에서 첫 도전",
      category: "운동",
      icon: "🧗",
      completedAt: "2026.03.05",
      location: "강남 클라이밍센터",
      rating: 4,
      note: "5단계 코스를 드디어 클리어! 팔이 아프지만 기분 좋다.",
    },
  ],
  
}

function ExplorationCard({ 
  exploration, 
  type,
  onExplorationSelect
}: { 
  exploration: typeof explorations.inProgress[0] | typeof explorations.completed[0]
  type: "inProgress" | "completed"
  onExplorationSelect?: (id: string) => void
}) {
  const isInProgress = type === "inProgress"
  const isCompleted = type === "completed"

  const handleCardClick = () => {
    onExplorationSelect?.(exploration.id.toString())
  }
  
  return (
    <Card 
      className={cn(
        "group cursor-pointer shadow-md transition-all hover:shadow-lg hover:-translate-y-0.5",
        isCompleted && "border-quest-success/30 bg-quest-success/5"
      )}
      onClick={handleCardClick}
    >
      <CardContent className="p-5">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-start gap-4">
            <div className={cn(
              "flex h-14 w-14 items-center justify-center rounded-xl text-3xl",
              isInProgress && "bg-gradient-to-br from-primary/10 to-accent/10",
              isCompleted && "bg-quest-success/10"
            )}>
              {exploration.icon}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs text-primary font-medium">{exploration.category}</span>
                {isCompleted && (
                  <span className="flex items-center gap-1 text-xs text-quest-success">
                    <CheckCircle2 className="h-3 w-3" />
                    완료
                  </span>
                )}
              </div>
              <h3 className="font-bold text-foreground">{exploration.name}</h3>
              <p className="text-sm text-muted-foreground">{exploration.description}</p>
            </div>
          </div>
        </div>
        
        {isInProgress && 'progress' in exploration && (
          <>
            <div className="mb-4">
              <div className="flex items-center justify-between text-xs mb-1.5">
                <span className="text-muted-foreground flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  다음: {exploration.currentStep}
                </span>
                <span className="font-medium text-primary">{exploration.progress}%</span>
              </div>
              <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
                <div 
                  className="h-full rounded-full bg-gradient-to-r from-primary to-primary/80 transition-all"
                  style={{ width: `${exploration.progress}%` }}
                />
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground">시작: {exploration.startedAt}</span>
              <Button 
                className="gap-2 bg-primary hover:bg-primary/90" 
                size="sm"
                onClick={(e) => {
                  e.stopPropagation()
                  handleCardClick()
                }}
              >
                <Play className="h-4 w-4" />
                계속 탐험하기
              </Button>
            </div>
          </>
        )}
        
        {isCompleted && 'location' in exploration && (
          <div className="pt-2 border-t border-border">
            {'note' in exploration && exploration.note && (
              <p className="text-sm text-foreground/70 mb-3 line-clamp-1">{exploration.note}</p>
            )}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4 text-xs text-muted-foreground">
                <span className="flex items-center gap-1">
                  <MapPin className="h-3 w-3 text-highlight" />
                  {exploration.location}
                </span>
                <span>{exploration.completedAt}</span>
              </div>
              <Button 
                variant="outline" 
                size="sm" 
                className="gap-1"
                onClick={(e) => {
                  e.stopPropagation()
                  handleCardClick()
                }}
              >
                기록 보기
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

interface MyExplorationsScreenProps {
  onExplorationSelect?: (id: string) => void
}

export function MyExplorationsScreen({ onExplorationSelect }: MyExplorationsScreenProps) {
  const [activeTab, setActiveTab] = useState("inProgress")

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground">내 탐험</h1>
        <p className="text-muted-foreground">시작한 탐험을 모아봤어요</p>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full max-w-md grid-cols-2">
          <TabsTrigger value="inProgress" className="gap-2">
            <Play className="h-4 w-4" />
            진행 중
            <span className="ml-1 rounded-full bg-primary/20 px-2 py-0.5 text-xs font-bold text-primary">
              {explorations.inProgress.length}
            </span>
          </TabsTrigger>
          <TabsTrigger value="completed" className="gap-2">
            <CheckCircle2 className="h-4 w-4" />
            완료
            <span className="ml-1 rounded-full bg-quest-success/20 px-2 py-0.5 text-xs font-bold text-quest-success">
              {explorations.completed.length}
            </span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="inProgress" className="mt-6">
          <div className="grid gap-4 md:grid-cols-2">
            {explorations.inProgress.map((exploration) => (
              <ExplorationCard 
                key={exploration.id} 
                exploration={exploration} 
                type="inProgress" 
                onExplorationSelect={onExplorationSelect}
              />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="completed" className="mt-6">
          <div className="grid gap-4 md:grid-cols-2">
            {explorations.completed.map((exploration) => (
              <ExplorationCard 
                key={exploration.id} 
                exploration={exploration} 
                type="completed"
                onExplorationSelect={onExplorationSelect}
              />
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
