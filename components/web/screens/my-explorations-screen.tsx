"use client"

import { useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Play, CheckCircle2 } from "lucide-react"
import { cn, getExplorationCardInfo } from "@/lib/utils"
import { toast } from "sonner"
import { ApiError } from "@/lib/api/client"
import { getMyExplorations } from "@/lib/api/myExplorations"
import type { MyExplorationListItem } from "@/lib/api/types"
import { CompletedExplorationsTab } from "@/components/web/screens/completed-explorations-tab"

function ExplorationCard({
  exploration,
  onExplorationSelect
}: {
  exploration: MyExplorationListItem
  onExplorationSelect?: (id: string) => void
}) {
  const handleCardClick = () => {
    onExplorationSelect?.(exploration.userExplorationId.toString())
  }

  const cardInfo = getExplorationCardInfo(exploration)

  return (
    <Card
      className="group min-w-0 cursor-pointer shadow-md transition-all hover:shadow-lg hover:-translate-y-0.5"
      onClick={handleCardClick}
    >
      <CardContent className="p-5">
        <div className="flex items-start gap-4 mb-4">
          <div className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-gradient-to-br from-primary/10 to-accent/10 text-3xl">
            {cardInfo.thumbnailUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={cardInfo.thumbnailUrl} alt={exploration.title} className="h-full w-full object-cover" />
            ) : (
              "🧭"
            )}
          </div>
          <div className="flex-1 min-w-0">
            <span className="text-xs text-primary font-medium">{exploration.categoryName}</span>
            <h3 className="font-bold text-foreground">{exploration.title}</h3>
            <p className="text-sm text-muted-foreground line-clamp-2">{exploration.shortDescription}</p>
          </div>
        </div>

        <div
          className={cn(
            "mb-4 flex h-10 items-center gap-1.5 rounded-md px-2 text-xs",
            cardInfo.hasWaypoint ? "bg-accent/10 font-medium text-accent" : "text-muted-foreground"
          )}
        >
          {cardInfo.waypointThumbnailUrl && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={cardInfo.waypointThumbnailUrl}
              alt="마지막 여정 사진"
              className="h-8 w-8 shrink-0 rounded object-cover"
            />
          )}
          <span className="flex min-w-0 items-baseline">
            {cardInfo.infoLabel && <span className="min-w-0 truncate">{cardInfo.infoLabel}</span>}
            <span className={cn("shrink-0", cardInfo.infoLabel && "ml-1")}>
              {cardInfo.infoLabel ? `· ${cardInfo.infoDate}` : cardInfo.infoDate}
            </span>
          </span>
        </div>

        <Button
          className="w-full gap-2 bg-primary hover:bg-primary/90"
          size="sm"
          onClick={(e) => {
            e.stopPropagation()
            handleCardClick()
          }}
        >
          <Play className="h-4 w-4" />
          계속 탐험하기
        </Button>
      </CardContent>
    </Card>
  )
}

interface MyExplorationsScreenProps {
  onExplorationSelect?: (id: string) => void
}

export function MyExplorationsScreen({ onExplorationSelect }: MyExplorationsScreenProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const initialTab = searchParams.get("tab") === "completed" ? "completed" : "inProgress"
  const [activeTab, setActiveTab] = useState(initialTab)
  const [inProgress, setInProgress] = useState<MyExplorationListItem[]>([])
  // 탭 배지는 지금 화면에 불러온 개수(.length)가 아니라 실제 총 개수를 보여줘야 함 —
  // 목록은 size로 잘려있어도(지금 20개) 총 개수는 항상 정확해야 배지를 신뢰할 수 있음.
  // 완료 목록 자체(및 필터별 세부 개수)는 CompletedExplorationsTab이 자체적으로 백엔드 필터를 태워서 조회함
  const [inProgressTotal, setInProgressTotal] = useState(0)
  const [completedTotal, setCompletedTotal] = useState(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)
    Promise.all([
      getMyExplorations({ status: "STARTED", page: 1, size: 20 }),
      getMyExplorations({ status: "COMPLETED", page: 1, size: 1 }),
    ])
      .then(([started, completedTotalRes]) => {
        setInProgress(started.items)
        setInProgressTotal(started.meta.totalElements)
        setCompletedTotal(completedTotalRes.meta.totalElements)
      })
      .catch((err) => {
        toast.error(err instanceof ApiError ? err.message : "내 탐험 목록을 불러오지 못했어요.")
      })
      .finally(() => setLoading(false))
  }, [])

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-xl font-bold text-foreground sm:text-2xl">내 탐험</h1>
        <p className="text-muted-foreground">시작한 탐험을 모아봤어요</p>
      </div>

      {/* Tabs */}
      <Tabs
        value={activeTab}
        onValueChange={(value) => {
          setActiveTab(value)
          // URL에 탭을 반영해둬야 상세 화면 갔다가 뒤로가기해도 있던 탭 그대로 돌아옴
          router.replace(`/my-explorations?tab=${value}`, { scroll: false })
        }}
      >
        <TabsList className="grid w-full max-w-md grid-cols-2">
          <TabsTrigger value="inProgress" className="gap-2">
            <Play className="h-4 w-4" />
            진행 중
            <span className="ml-1 rounded-full bg-primary/20 px-2 py-0.5 text-xs font-bold text-primary">
              {inProgressTotal}
            </span>
          </TabsTrigger>
          <TabsTrigger value="completed" className="gap-2">
            <CheckCircle2 className="h-4 w-4" />
            완료
            <span className="ml-1 rounded-full bg-quest-success/20 px-2 py-0.5 text-xs font-bold text-quest-success">
              {completedTotal}
            </span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="inProgress" className="mt-6">
          {loading ? (
            <div className="grid gap-4 md:grid-cols-2">
              {Array.from({ length: 2 }).map((_, i) => (
                <div key={i} className="h-32 animate-pulse rounded-xl bg-secondary" />
              ))}
            </div>
          ) : inProgress.length === 0 ? (
            <p className="py-12 text-center text-muted-foreground">아직 진행 중인 탐험이 없어요.</p>
          ) : (
            <div className="grid gap-4 md:grid-cols-2">
              {inProgress.map((exploration) => (
                <ExplorationCard
                  key={exploration.userExplorationId}
                  exploration={exploration}
                  onExplorationSelect={onExplorationSelect}
                />
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="completed" className="mt-6">
          <CompletedExplorationsTab
            completedTotal={completedTotal}
            onExplorationSelect={onExplorationSelect}
          />
        </TabsContent>
      </Tabs>
    </div>
  )
}
