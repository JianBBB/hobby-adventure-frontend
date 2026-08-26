"use client"

import { useEffect, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Search,
  Filter,
  ChevronRight,
  Sparkles
} from "lucide-react"
import { cn } from "@/lib/utils"
import { toast } from "sonner"
import { ApiError } from "@/lib/api/client"
import { getCategories } from "@/lib/api/categories"
import { getExplorations } from "@/lib/api/explorations"
import type { Category, ExplorationListItem } from "@/lib/api/types"

// 카테고리는 장식용 이모지가 없어서 코드 기준으로 프론트에서만 매핑
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

function ExplorationCard({
  exploration,
  onExplorationSelect
}: {
  exploration: ExplorationListItem
  onExplorationSelect?: (id: string) => void
}) {
  const handleCardClick = () => {
    onExplorationSelect?.(exploration.id.toString())
  }

  return (
    <Card
      className="group flex h-full cursor-pointer flex-col shadow-md hover:shadow-lg transition-all hover:-translate-y-0.5"
      onClick={handleCardClick}
    >
      <CardContent className="flex flex-1 flex-col p-5">
        <div className="flex items-start gap-4 mb-4">
          <div className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-gradient-to-br from-primary/10 to-accent/10 text-3xl group-hover:scale-105 transition-transform">
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
            <h3 className="font-bold text-foreground line-clamp-1">{exploration.title}</h3>
            <p className="text-sm text-muted-foreground line-clamp-2">{exploration.shortDescription}</p>
          </div>
        </div>

        <div className="mt-auto flex items-center justify-end">
          <Button
            className="gap-2 bg-accent hover:bg-accent/90 text-accent-foreground"
            size="sm"
            onClick={(e) => {
              e.stopPropagation()
              handleCardClick()
            }}
          >
            <ChevronRight className="h-4 w-4" />
            자세히 보기
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

interface ExploreScreenProps {
  onExplorationSelect?: (id: string) => void
}

export function ExploreScreen({ onExplorationSelect }: ExploreScreenProps) {
  const [categories, setCategories] = useState<Category[]>([])
  const [categoriesLoading, setCategoriesLoading] = useState(true)
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [explorations, setExplorations] = useState<ExplorationListItem[]>([])
  const [explorationsLoading, setExplorationsLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [hasNext, setHasNext] = useState(false)
  const [loadingMore, setLoadingMore] = useState(false)

  useEffect(() => {
    setCategoriesLoading(true)
    getCategories()
      .then(setCategories)
      .catch((err) => {
        toast.error(err instanceof ApiError ? err.message : "카테고리를 불러오지 못했어요.")
      })
      .finally(() => setCategoriesLoading(false))
  }, [])

  // 카테고리가 바뀌면 1페이지부터 새로 불러옴
  useEffect(() => {
    setExplorationsLoading(true)
    getExplorations({ categoryId: selectedCategoryId ?? undefined, page: 1, size: 20 })
      .then(({ items, meta }) => {
        setExplorations(items)
        setPage(1)
        setHasNext(meta.hasNext)
      })
      .catch((err) => {
        toast.error(err instanceof ApiError ? err.message : "탐험 목록을 불러오지 못했어요.")
      })
      .finally(() => setExplorationsLoading(false))
  }, [selectedCategoryId])

  const handleLoadMore = () => {
    const nextPage = page + 1
    setLoadingMore(true)
    getExplorations({ categoryId: selectedCategoryId ?? undefined, page: nextPage, size: 20 })
      .then(({ items, meta }) => {
        setExplorations((prev) => [...prev, ...items])
        setPage(nextPage)
        setHasNext(meta.hasNext)
      })
      .catch((err) => {
        toast.error(err instanceof ApiError ? err.message : "탐험 목록을 더 불러오지 못했어요.")
      })
      .finally(() => setLoadingMore(false))
  }

  // 검색어는 프론트에서만 필터링(백엔드에 검색 파라미터 없음, 나중에 추가 예정)
  const filteredExplorations = explorations.filter((exploration) => {
    if (searchQuery) {
      return exploration.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
             exploration.shortDescription.toLowerCase().includes(searchQuery.toLowerCase())
    }
    return true
  })

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground">탐험</h1>
        <p className="text-muted-foreground">새로운 취미를 발견해보세요</p>
      </div>

      {/* Search */}
      <div className="flex gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input 
            placeholder="탐험 검색..." 
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Button variant="outline" className="gap-2">
          <Filter className="h-4 w-4" />
          필터
        </Button>
      </div>

      {/* Categories */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => setSelectedCategoryId(null)}
          className={cn(
            "flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-all",
            selectedCategoryId === null
              ? "bg-primary text-primary-foreground shadow-md"
              : "bg-secondary text-muted-foreground hover:bg-secondary/80 hover:text-foreground"
          )}
        >
          <span>🧭</span>
          <span>전체</span>
        </button>
        {categoriesLoading ? (
          <>
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="h-9 w-20 animate-pulse rounded-full bg-secondary" />
            ))}
          </>
        ) : (
          categories.map((category) => (
            <button
              key={category.categoryId}
              onClick={() => setSelectedCategoryId(category.categoryId)}
              className={cn(
                "flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-all",
                selectedCategoryId === category.categoryId
                  ? "bg-primary text-primary-foreground shadow-md"
                  : "bg-secondary text-muted-foreground hover:bg-secondary/80 hover:text-foreground"
              )}
            >
              <span>{categoryIcons[category.code] || "🧭"}</span>
              <span>{category.name}</span>
            </button>
          ))
        )}
      </div>

      {/* Explorations Grid */}
      <div>
        <div className="mb-4 flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-accent" />
          <h2 className="text-lg font-bold text-foreground">둘러보기</h2>
        </div>
        
        {explorationsLoading ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <Card key={i} className="shadow-md">
                <CardContent className="p-5">
                  <div className="mb-4 flex items-start gap-4">
                    <div className="h-14 w-14 shrink-0 animate-pulse rounded-xl bg-secondary" />
                    <div className="flex-1 space-y-2">
                      <div className="h-3 w-16 animate-pulse rounded bg-secondary" />
                      <div className="h-4 w-32 animate-pulse rounded bg-secondary" />
                      <div className="h-3 w-40 animate-pulse rounded bg-secondary" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filteredExplorations.map((exploration) => (
              <ExplorationCard
                key={exploration.id}
                exploration={exploration}
                onExplorationSelect={onExplorationSelect}
              />
            ))}
          </div>
        )}

        {!explorationsLoading && filteredExplorations.length === 0 && (
          <Card className="py-12">
            <CardContent className="flex flex-col items-center justify-center text-center">
              <Search className="h-12 w-12 text-muted-foreground/50 mb-4" />
              <h3 className="text-lg font-semibold text-foreground">검색 결과가 없습니다</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                다른 키워드나 카테고리로 검색해보세요
              </p>
            </CardContent>
          </Card>
        )}

        {!explorationsLoading && hasNext && (
          <div className="mt-6 flex justify-center">
            <Button variant="outline" onClick={handleLoadMore} disabled={loadingMore}>
              {loadingMore ? "불러오는 중..." : "더보기"}
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
