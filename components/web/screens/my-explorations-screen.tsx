"use client"

import { useEffect, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Play,
  CheckCircle2,
  ChevronRight
} from "lucide-react"
import { cn } from "@/lib/utils"
import { toast } from "sonner"
import { ApiError } from "@/lib/api/client"
import { getMyExplorations } from "@/lib/api/myExplorations"
import type { MyExplorationListItem } from "@/lib/api/types"

function ExplorationCard({
  exploration,
  onExplorationSelect
}: {
  exploration: MyExplorationListItem
  onExplorationSelect?: (id: string) => void
}) {
  const isCompleted = exploration.status === "COMPLETED"

  const handleCardClick = () => {
    onExplorationSelect?.(exploration.userExplorationId.toString())
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
        <div className="flex items-start gap-4 mb-4">
          <div className={cn(
            "flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-xl text-3xl",
            isCompleted ? "bg-quest-success/10" : "bg-gradient-to-br from-primary/10 to-accent/10"
          )}>
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
              {isCompleted && (
                <span className="flex items-center gap-1 text-xs text-quest-success">
                  <CheckCircle2 className="h-3 w-3" />
                  완료
                </span>
              )}
            </div>
            <h3 className="font-bold text-foreground">{exploration.title}</h3>
            <p className="text-sm text-muted-foreground line-clamp-2">{exploration.shortDescription}</p>
          </div>
        </div>

        {!isCompleted ? (
          <div className="flex items-center justify-between">
            <span className="text-xs text-muted-foreground">시작: {exploration.startedAt.slice(0, 10)}</span>
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
        ) : (
          <div className="flex items-center justify-between pt-2 border-t border-border">
            <span className="text-xs text-muted-foreground">
              완료: {exploration.completedAt?.slice(0, 10)}
            </span>
            <Button
              variant="outline"
              size="sm"
              className="gap-1"
              onClick={(e) => {
                e.stopPropagation()
                handleCardClick()
              }}
            >
              {exploration.hasRecord ? "기록 보기" : "기록 남기기"}
              <ChevronRight className="h-4 w-4" />
            </Button>
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
  const [inProgress, setInProgress] = useState<MyExplorationListItem[]>([])
  const [completed, setCompleted] = useState<MyExplorationListItem[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)
    Promise.all([
      getMyExplorations({ status: "STARTED", page: 1, size: 20 }),
      getMyExplorations({ status: "COMPLETED", page: 1, size: 20 }),
    ])
      .then(([started, done]) => {
        setInProgress(started.items)
        setCompleted(done.items)
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
              {inProgress.length}
            </span>
          </TabsTrigger>
          <TabsTrigger value="completed" className="gap-2">
            <CheckCircle2 className="h-4 w-4" />
            완료
            <span className="ml-1 rounded-full bg-quest-success/20 px-2 py-0.5 text-xs font-bold text-quest-success">
              {completed.length}
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
          {loading ? (
            <div className="grid gap-4 md:grid-cols-2">
              {Array.from({ length: 2 }).map((_, i) => (
                <div key={i} className="h-32 animate-pulse rounded-xl bg-secondary" />
              ))}
            </div>
          ) : completed.length === 0 ? (
            <p className="py-12 text-center text-muted-foreground">아직 완료한 탐험이 없어요.</p>
          ) : (
            <div className="grid gap-4 md:grid-cols-2">
              {completed.map((exploration) => (
                <ExplorationCard
                  key={exploration.userExplorationId}
                  exploration={exploration}
                  onExplorationSelect={onExplorationSelect}
                />
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
