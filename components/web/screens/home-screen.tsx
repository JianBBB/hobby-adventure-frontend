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
} from "lucide-react"
import { cn } from "@/lib/utils"
import { toast } from "sonner"
import { ApiError } from "@/lib/api/client"
import { getExplorations } from "@/lib/api/explorations"
import { getMyExplorations } from "@/lib/api/myExplorations"
import type { ExplorationListItem, MyExplorationListItem } from "@/lib/api/types"

interface HomeScreenProps {
  onExplorationSelect?: (id: string) => void
  onContinueExploration?: (id: string) => void
  onNavigateToMyExplorations?: () => void
  isLoggedIn: boolean
}

export function HomeScreen({ onExplorationSelect, onContinueExploration, onNavigateToMyExplorations, isLoggedIn }: HomeScreenProps) {
  const [randomQuest, setRandomQuest] = useState<ExplorationListItem | null>(null)
  const [totalExplorations, setTotalExplorations] = useState<number | null>(null)
  const [isShuffling, setIsShuffling] = useState(false)
  const [inProgress, setInProgress] = useState<MyExplorationListItem[]>([])

  // size=1로 페이지 번호를 무작위로 골라서 요청하면, 전체 탐험 중에서 균등하게 한 건이 뽑힘
  // (page/size 앞쪽만 계속 불러오면 카탈로그가 커질수록 항상 오래된 것들만 뽑히는 문제가 생김)
  const pickRandomQuest = useCallback((total: number) => {
    if (total <= 0) return
    setIsShuffling(true)
    const randomPage = Math.floor(Math.random() * total) + 1
    getExplorations({ page: randomPage, size: 1 })
      .then(({ items }) => {
        if (items.length > 0) setRandomQuest(items[0])
      })
      .catch((err) => {
        toast.error(err instanceof ApiError ? err.message : "탐험을 뽑지 못했어요.")
      })
      .finally(() => setIsShuffling(false))
  }, [])

  useEffect(() => {
    // 전체 개수를 먼저 알아야 첫 화면부터 진짜 랜덤 위치를 고를 수 있음(그냥 1페이지로 시작하면 항상 같은 탐험이 뜸)
    setIsShuffling(true)
    getExplorations({ page: 1, size: 1 })
      .then(({ meta }) => {
        setTotalExplorations(meta.totalElements)
        pickRandomQuest(meta.totalElements)
      })
      .catch((err) => {
        toast.error(err instanceof ApiError ? err.message : "탐험 목록을 불러오지 못했어요.")
        setIsShuffling(false)
      })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // 로그인 상태가 바뀔 때마다(로그인 직후/로그아웃 직후) 다시 반영되도록 isLoggedIn을 의존성에 둠
  useEffect(() => {
    if (!isLoggedIn) {
      setInProgress([])
      return
    }
    getMyExplorations({ status: "STARTED", page: 1, size: 3 })
      .then(({ items }) => setInProgress(items))
      .catch((err) => {
        toast.error(err instanceof ApiError ? err.message : "진행중인 탐험을 불러오지 못했어요.")
      })
  }, [isLoggedIn])

  return (
    <div className="space-y-8">
      {/* Hero - Simple & Focused */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary/5 via-white to-accent/5 border border-border p-5 sm:p-8">
        <div className="absolute top-0 right-0 w-48 h-48 bg-gradient-to-br from-highlight/10 to-transparent rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-tr from-primary/10 to-transparent rounded-full blur-2xl" />
        
        <div className="relative text-center max-w-xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
            <Sparkles className="h-4 w-4" />
            오늘의 탐험
          </div>
          
          <h1 className="text-2xl font-bold text-foreground mb-3 sm:text-3xl">
            오늘은 뭐 해볼까?
          </h1>
          <p className="text-muted-foreground mb-8">
            새로운 취미를 발견하고, 경험을 기록해보세요
          </p>

          {/* Random Quest Card */}
          <Card className="mb-6 border-2 border-dashed border-accent/30 bg-gradient-to-r from-accent/5 to-primary/5 shadow-lg">
            <CardContent className="p-5 sm:p-6">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-4">
                  <div className={cn(
                    "flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-gradient-to-br from-accent/20 to-primary/20 text-4xl transition-transform",
                    isShuffling && "animate-pulse"
                  )}>
                    {randomQuest?.thumbnailUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={randomQuest.thumbnailUrl} alt={randomQuest.title} className="h-full w-full object-cover" />
                    ) : (
                      "🧭"
                    )}
                  </div>
                  <div className="min-w-0 flex-1 text-left">
                    <p className="text-xs text-accent font-semibold uppercase tracking-wide mb-1">
                      {randomQuest?.categoryName ?? "탐험 뽑는 중..."}
                    </p>
                    <h3 className="text-lg font-bold text-foreground sm:text-xl">{randomQuest?.title ?? ""}</h3>
                    <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{randomQuest?.shortDescription ?? ""}</p>
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <Button
                    onClick={() => totalExplorations && pickRandomQuest(totalExplorations)}
                    disabled={isShuffling}
                    variant="outline"
                    className="w-full gap-2 border-primary/30 hover:bg-primary/10 sm:w-auto"
                  >
                    <Shuffle className={cn("h-4 w-4", isShuffling && "animate-spin")} />
                    {isShuffling ? "뽑는 중..." : "다시 뽑기"}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          <Button
            size="lg"
            className="w-full gap-2 bg-accent hover:bg-accent/90 text-accent-foreground shadow-lg shadow-accent/30 text-base sm:w-auto sm:px-10"
            disabled={!randomQuest}
            onClick={() => randomQuest && onExplorationSelect?.(randomQuest.id.toString())}
          >
            <Play className="h-5 w-5" />
            랜덤 탐험 시작
          </Button>
        </div>
      </div>

      {/* In Progress Explorations */}
      {inProgress.length > 0 && (
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
            <Button
              variant="ghost"
              size="sm"
              className="gap-1 text-primary hover:text-primary/80"
              onClick={onNavigateToMyExplorations}
            >
              전체보기
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {inProgress.map((exploration) => (
              <Card
                key={exploration.userExplorationId}
                className="group min-w-0 cursor-pointer shadow-md hover:shadow-lg transition-all hover:-translate-y-0.5"
                onClick={() => onContinueExploration?.(exploration.userExplorationId.toString())}
              >
                <CardContent className="p-5">
                  <div className="flex items-start gap-4 mb-4">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-gradient-to-br from-primary/10 to-accent/10 text-2xl">
                      {exploration.thumbnailUrl ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={exploration.thumbnailUrl} alt={exploration.title} className="h-full w-full object-cover" />
                      ) : (
                        "🧭"
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs text-primary font-medium">{exploration.categoryName}</span>
                      </div>
                      <h3 className="font-bold text-foreground truncate">{exploration.title}</h3>
                      <p className="text-sm text-muted-foreground truncate">{exploration.shortDescription}</p>
                    </div>
                  </div>

                  <div className="mb-4 text-xs text-muted-foreground">
                    시작: {exploration.startedAt.slice(0, 10)}
                  </div>

                  <Button
                    className="w-full gap-2 bg-primary hover:bg-primary/90"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation()
                      onContinueExploration?.(exploration.userExplorationId.toString())
                    }}
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
