"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { X } from "lucide-react"
import { cn } from "@/lib/utils"
import { toast } from "sonner"
import { ApiError } from "@/lib/api/client"
import { getMyExplorations, completeMyExploration } from "@/lib/api/myExplorations"
import { getCategories } from "@/lib/api/categories"
import { getExplorations, startExploration } from "@/lib/api/explorations"
import type { Category, ExplorationListItem, MyExplorationListItem } from "@/lib/api/types"

// 탐험 카테고리는 장식용 이모지가 없어서 코드 기준으로 프론트에서만 매핑 (explore-screen.tsx와 동일)
const categoryIcons: Record<string, string> = {
  EXERCISE: "💪",
  VISIT: "📍",
  GATHERING: "👥",
  CREATION: "✨",
  LEARNING: "📚",
  APPRECIATION: "🎨",
  REST: "🧘",
  ETC: "🌟",
}

interface SelectedExploration {
  userExplorationId: number
  explorationName: string
  explorationCategory: string
}

interface RecordExplorationPickerProps {
  onClose: () => void
  // 이미 완료된(=바로 기록 작성 가능한) 탐험을 골랐을 때
  onPickCompleted: (data: SelectedExploration) => void
  // 새 탐험을 "시작만" 했을 때 — 진행 화면으로 이동시켜야 함
  onStartNew: (userExplorationId: number) => void
}

function Thumb({ url, title }: { url: string | null; title: string }) {
  return (
    <div className="flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-primary/10 text-xl">
      {url ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={url} alt={title} className="h-full w-full object-cover" />
      ) : (
        "🧭"
      )}
    </div>
  )
}

function ListSkeleton() {
  return (
    <div className="space-y-2">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="h-16 animate-pulse rounded-xl bg-secondary" />
      ))}
    </div>
  )
}

interface PendingAction {
  explorationId: number
  mode: "start" | "record"
}

export function RecordExplorationPicker({ onClose, onPickCompleted, onStartNew }: RecordExplorationPickerProps) {
  const [tab, setTab] = useState<"mine" | "catalog">("mine")
  const [myExplorations, setMyExplorations] = useState<MyExplorationListItem[]>([])
  const [myLoading, setMyLoading] = useState(true)
  const [categories, setCategories] = useState<Category[]>([])
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(null)
  const [catalog, setCatalog] = useState<ExplorationListItem[]>([])
  const [catalogLoading, setCatalogLoading] = useState(true)
  const [catalogPage, setCatalogPage] = useState(1)
  const [catalogHasNext, setCatalogHasNext] = useState(false)
  const [catalogLoadingMore, setCatalogLoadingMore] = useState(false)
  const [pendingAction, setPendingAction] = useState<PendingAction | null>(null)

  useEffect(() => {
    setMyLoading(true)
    // 기록은 완료한 탐험에만, 그리고 탐험당 1개만 남길 수 있음(백엔드 RecordService 제약) — 진행중이거나 이미 기록이 있는 건 제외
    getMyExplorations({ status: "COMPLETED", page: 1, size: 50 })
      .then(({ items }) => setMyExplorations(items.filter((item) => !item.hasRecord)))
      .catch((err) => toast.error(err instanceof ApiError ? err.message : "내 탐험 목록을 불러오지 못했어요."))
      .finally(() => setMyLoading(false))

    getCategories()
      .then(setCategories)
      .catch((err) => toast.error(err instanceof ApiError ? err.message : "카테고리를 불러오지 못했어요."))
  }, [])

  // 카테고리가 바뀌면 1페이지부터 새로 불러옴
  useEffect(() => {
    setCatalogLoading(true)
    getExplorations({ categoryId: selectedCategoryId ?? undefined, page: 1, size: 20 })
      .then(({ items, meta }) => {
        setCatalog(items)
        setCatalogPage(1)
        setCatalogHasNext(meta.hasNext)
      })
      .catch((err) => toast.error(err instanceof ApiError ? err.message : "탐험 목록을 불러오지 못했어요."))
      .finally(() => setCatalogLoading(false))
  }, [selectedCategoryId])

  const handleCatalogLoadMore = () => {
    const nextPage = catalogPage + 1
    setCatalogLoadingMore(true)
    getExplorations({ categoryId: selectedCategoryId ?? undefined, page: nextPage, size: 20 })
      .then(({ items, meta }) => {
        setCatalog((prev) => [...prev, ...items])
        setCatalogPage(nextPage)
        setCatalogHasNext(meta.hasNext)
      })
      .catch((err) => toast.error(err instanceof ApiError ? err.message : "탐험 목록을 더 불러오지 못했어요."))
      .finally(() => setCatalogLoadingMore(false))
  }

  const handlePickMine = (exploration: MyExplorationListItem) => {
    onPickCompleted({
      userExplorationId: exploration.userExplorationId,
      explorationName: exploration.title,
      explorationCategory: exploration.categoryName,
    })
  }

  const handleStartOnly = async (exploration: ExplorationListItem) => {
    setPendingAction({ explorationId: exploration.id, mode: "start" })
    try {
      const { userExplorationId } = await startExploration(exploration.id)
      onStartNew(userExplorationId)
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : "탐험을 시작하지 못했어요.")
    } finally {
      setPendingAction(null)
    }
  }

  const handleStartAndRecord = async (exploration: ExplorationListItem) => {
    setPendingAction({ explorationId: exploration.id, mode: "record" })
    try {
      const { userExplorationId } = await startExploration(exploration.id)
      await completeMyExploration(userExplorationId)
      onPickCompleted({
        userExplorationId,
        explorationName: exploration.title,
        explorationCategory: exploration.categoryName,
      })
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : "탐험을 기록하지 못했어요.")
    } finally {
      setPendingAction(null)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/60 backdrop-blur-sm">
      <Card className="mx-4 flex max-h-[85vh] w-full max-w-lg flex-col shadow-2xl">
        <CardHeader className="flex flex-row items-center justify-between border-b pb-4">
          <CardTitle>기록을 남길 탐험을 골라주세요</CardTitle>
          <button onClick={onClose} className="rounded-lg p-2 text-muted-foreground hover:bg-secondary">
            <X className="h-5 w-5" />
          </button>
        </CardHeader>

        <div className="flex border-b px-6">
          <button
            onClick={() => setTab("mine")}
            className={cn(
              "-mb-px border-b-2 px-4 py-3 text-sm font-medium transition-colors",
              tab === "mine" ? "border-primary text-primary" : "border-transparent text-muted-foreground"
            )}
          >
            완료한 탐험 중에서
          </button>
          <button
            onClick={() => setTab("catalog")}
            className={cn(
              "-mb-px border-b-2 px-4 py-3 text-sm font-medium transition-colors",
              tab === "catalog" ? "border-primary text-primary" : "border-transparent text-muted-foreground"
            )}
          >
            새로운 탐험 해보기
          </button>
        </div>

        {tab === "catalog" && (
          <>
            <div className="flex flex-wrap gap-2 border-b px-4 py-3">
              <button
                onClick={() => setSelectedCategoryId(null)}
                className={cn(
                  "rounded-full px-3 py-1.5 text-xs font-medium transition-all",
                  selectedCategoryId === null
                    ? "bg-primary text-primary-foreground shadow-md"
                    : "bg-secondary text-muted-foreground hover:bg-secondary/80 hover:text-foreground"
                )}
              >
                전체
              </button>
              {categories.map((category) => (
                <button
                  key={category.categoryId}
                  onClick={() => setSelectedCategoryId(category.categoryId)}
                  className={cn(
                    "flex items-center gap-1 rounded-full px-3 py-1.5 text-xs font-medium transition-all",
                    selectedCategoryId === category.categoryId
                      ? "bg-primary text-primary-foreground shadow-md"
                      : "bg-secondary text-muted-foreground hover:bg-secondary/80 hover:text-foreground"
                  )}
                >
                  <span>{categoryIcons[category.code] || "🧭"}</span>
                  <span>{category.name}</span>
                </button>
              ))}
            </div>
            <p className="border-b bg-secondary/30 px-4 py-2 text-xs text-muted-foreground">
              아직 안 해봤으면 &apos;시작만&apos;, 이미 해봤고 지금 바로 남기고 싶으면 &apos;바로 기록&apos;을 눌러주세요.
            </p>
          </>
        )}

        <CardContent className="flex-1 space-y-2 overflow-y-auto p-4">
          {tab === "mine" ? (
            myLoading ? (
              <ListSkeleton />
            ) : myExplorations.length === 0 ? (
              <p className="py-8 text-center text-sm text-muted-foreground">
                아직 기록을 남길 수 있는 완료된 탐험이 없어요.
                <br />
                진행중인 탐험은 &apos;내 탐험&apos; 탭에서 완료한 뒤 기록을 남길 수 있어요.
              </p>
            ) : (
              myExplorations.map((exploration) => (
                <button
                  key={exploration.userExplorationId}
                  onClick={() => handlePickMine(exploration)}
                  className="flex w-full items-center gap-3 rounded-xl border border-border p-3 text-left transition-all hover:border-primary/30 hover:bg-muted/30"
                >
                  <Thumb url={exploration.thumbnailUrl} title={exploration.title} />
                  <div className="min-w-0 flex-1">
                    <span className="text-xs font-medium text-primary">{exploration.categoryName}</span>
                    <p className="truncate font-semibold text-foreground">{exploration.title}</p>
                  </div>
                </button>
              ))
            )
          ) : catalogLoading ? (
            <ListSkeleton />
          ) : (
            <>
              {catalog.map((exploration) => {
                const isPending = pendingAction?.explorationId === exploration.id
                const isDisabled = pendingAction !== null
                return (
                  <div
                    key={exploration.id}
                    className="flex w-full items-center gap-3 rounded-xl border border-border p-3"
                  >
                    <Thumb url={exploration.thumbnailUrl} title={exploration.title} />
                    <div className="min-w-0 flex-1">
                      <span className="text-xs font-medium text-primary">{exploration.categoryName}</span>
                      <p className="truncate font-semibold text-foreground">{exploration.title}</p>
                    </div>
                    <div className="flex shrink-0 gap-1.5">
                      <Button
                        variant="outline"
                        size="sm"
                        disabled={isDisabled}
                        onClick={() => handleStartOnly(exploration)}
                      >
                        {isPending && pendingAction?.mode === "start" ? "시작하는 중..." : "시작만"}
                      </Button>
                      <Button
                        size="sm"
                        disabled={isDisabled}
                        onClick={() => handleStartAndRecord(exploration)}
                      >
                        {isPending && pendingAction?.mode === "record" ? "처리 중..." : "바로 기록"}
                      </Button>
                    </div>
                  </div>
                )
              })}
              {catalogHasNext && (
                <div className="flex justify-center pt-2">
                  <Button variant="outline" size="sm" onClick={handleCatalogLoadMore} disabled={catalogLoadingMore}>
                    {catalogLoadingMore ? "불러오는 중..." : "더보기"}
                  </Button>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
