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
import type { Category } from "@/lib/api/types"

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

const explorations = [
  {
    id: 1,
    name: "재즈바 탐방",
    description: "분위기 있는 재즈바에서 라이브 공연 감상하기",
    category: "음악",
    icon: "🎷",
    estimatedTime: "2-3시간",
  },
  {
    id: 2,
    name: "도예 체험",
    description: "흙을 빚어 나만의 작품 만들기",
    category: "창작",
    icon: "🏺",
    estimatedTime: "2-3시간",
  },
  {
    id: 3,
    name: "클라이밍 체험",
    description: "실내 클라이밍으로 새로운 도전 시작하기",
    category: "운동",
    icon: "🧗",
    estimatedTime: "1-2시간",
  },
  {
    id: 4,
    name: "독립 서점 탐험",
    description: "숨겨진 독립 서점에서 특별한 책 찾기",
    category: "문화/예술",
    icon: "📚",
    estimatedTime: "1-2시간",
  },
  {
    id: 5,
    name: "야시장 방문",
    description: "다양한 먹거리와 볼거리 즐기기",
    category: "음식",
    icon: "🏮",
    estimatedTime: "2-3시간",
  },
  {
    id: 6,
    name: "수채화 그리기",
    description: "물감과 붓으로 자유롭게 그림 그리기",
    category: "창작",
    icon: "🎨",
    estimatedTime: "1-2시간",
  },
  {
    id: 7,
    name: "별자리 관측",
    description: "밤하늘의 별자리 찾아보기",
    category: "야외활동",
    icon: "⭐",
    estimatedTime: "1-2시간",
  },
  {
    id: 8,
    name: "홈 베이킹",
    description: "집에서 빵이나 쿠키 굽기",
    category: "음식",
    icon: "🍞",
    estimatedTime: "3-4시간",
  },
]

function ExplorationCard({ 
  exploration,
  onExplorationSelect 
}: { 
  exploration: typeof explorations[0]
  onExplorationSelect?: (id: string) => void 
}) {
  const handleCardClick = () => {
    onExplorationSelect?.(exploration.id.toString())
  }

  return (
    <Card 
      className="group cursor-pointer shadow-md hover:shadow-lg transition-all hover:-translate-y-0.5"
      onClick={handleCardClick}
    >
      <CardContent className="p-5">
        <div className="flex items-start gap-4 mb-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br from-primary/10 to-accent/10 text-3xl group-hover:scale-105 transition-transform">
            {exploration.icon}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs text-primary font-medium">{exploration.category}</span>
            </div>
            <h3 className="font-bold text-foreground">{exploration.name}</h3>
            <p className="text-sm text-muted-foreground">{exploration.description}</p>
          </div>
        </div>
        
        <div className="flex items-center justify-end">
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

  useEffect(() => {
    setCategoriesLoading(true)
    getCategories()
      .then(setCategories)
      .catch((err) => {
        toast.error(err instanceof ApiError ? err.message : "카테고리를 불러오지 못했어요.")
      })
      .finally(() => setCategoriesLoading(false))
  }, [])

  // 탐험 목록은 다음 단계(탐험목록/상세 연동)에서 실제 API로 교체 예정.
  // 지금은 카테고리 필터가 목업 데이터의 카테고리명과 대응이 안 되므로 검색만 적용.
  const filteredExplorations = explorations.filter((exploration) => {
    if (searchQuery) {
      return exploration.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
             exploration.description.toLowerCase().includes(searchQuery.toLowerCase())
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
        
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filteredExplorations.map((exploration) => (
            <ExplorationCard 
              key={exploration.id} 
              exploration={exploration} 
              onExplorationSelect={onExplorationSelect}
            />
          ))}
        </div>
        
        {filteredExplorations.length === 0 && (
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
      </div>
    </div>
  )
}
