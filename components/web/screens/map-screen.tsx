"use client"

import { useState, useMemo } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { 
  MapPin, 
  ChevronRight,
  Layers,
  ZoomIn,
  ZoomOut,
  Locate,
  X,
  Footprints,
  Calendar
} from "lucide-react"
import { cn } from "@/lib/utils"

const explorationRecords = [
  {
    id: 1,
    questName: "재즈바 탐험",
    category: "문화/예술",
    type: "재즈바",
    date: "2026.03.08",
    location: { name: "홍대 재즈바", lat: 37.556, lng: 126.923 },
    emoji: "🎷",
    note: "분위기가 정말 좋았다. 라이브 재즈 최고!",
  },
  {
    id: 2,
    questName: "도자기 공예",
    category: "공예",
    type: "도예",
    date: "2026.03.05",
    location: { name: "이태원 도자기 공방", lat: 37.534, lng: 126.994 },
    emoji: "🏺",
    note: "처음으로 컵을 만들었다. 뿌듯했다!",
  },
  {
    id: 3,
    questName: "클라이밍 체험",
    category: "운동",
    type: "클라이밍",
    date: "2026.03.01",
    location: { name: "강남 클라이밍 센터", lat: 37.498, lng: 127.028 },
    emoji: "🧗",
    note: "5단계 클리어! 다음엔 6단계 도전.",
  },
  {
    id: 4,
    questName: "독립 서점 탐험",
    category: "문화/예술",
    type: "독립서점",
    date: "2026.02.25",
    location: { name: "연남동 독립서점", lat: 37.566, lng: 126.925 },
    emoji: "📚",
    note: "독특한 책들이 많아서 좋았다.",
  },
  {
    id: 5,
    questName: "홈 베이킹",
    category: "요리",
    type: "베이킹",
    date: "2026.02.20",
    location: { name: "집", lat: 37.510, lng: 127.030 },
    emoji: "🥖",
    note: "첫 시도는 실패... 다음엔 꼭!",
  },
  {
    id: 6,
    questName: "재즈바 탐험 2차",
    category: "문화/예술",
    type: "재즈바",
    date: "2026.03.10",
    location: { name: "홍대 재즈바", lat: 37.556, lng: 126.923 },
    emoji: "🎷",
    note: "두 번째 방문, 다른 밴드 공연!",
  },
  {
    id: 7,
    questName: "재즈 페스티벌",
    category: "문화/예술",
    type: "재즈바",
    date: "2026.03.12",
    location: { name: "홍대 재즈바", lat: 37.556, lng: 126.923 },
    emoji: "🎺",
    note: "여러 팀 공연을 한 번에 볼 수 있어서 좋았다.",
  },
]

const periodOptions = [
  { value: "all", label: "전체" },
  { value: "thisMonth", label: "이번 달" },
  { value: "thisYear", label: "올해" },
  { value: "custom", label: "기간 선택" },
]

const categoryOptions = [
  { value: "all", label: "전체" },
  { value: "문화/예술", label: "문화/예술" },
  { value: "요리", label: "요리" },
  { value: "운동", label: "운동" },
  { value: "야외활동", label: "야외활동" },
  { value: "창작", label: "창작" },
  { value: "휴식", label: "휴식" },
  { value: "자연", label: "자연" },
  { value: "공예", label: "공예" },
  { value: "음악", label: "음악" },
  { value: "독서", label: "독서" },
  { value: "여행", label: "여행" },
]

const typeOptions = [
  { value: "all", label: "전체" },
  { value: "재즈바", label: "재즈바" },
  { value: "클라이밍", label: "클라이밍" },
  { value: "도예", label: "도예" },
  { value: "독립서점", label: "독립서점" },
  { value: "베이킹", label: "베이킹" },
]

export function MapScreen() {
  const [selectedRecord, setSelectedRecord] = useState<typeof explorationRecords[0] | null>(null)
  const [hoveredCluster, setHoveredCluster] = useState<string | null>(null)
  const [showList, setShowList] = useState(true)
  const [periodFilter, setPeriodFilter] = useState("all")
  const [categoryFilter, setCategoryFilter] = useState("all")
  const [typeFilter, setTypeFilter] = useState("all")

  // Filter records
  const filteredRecords = useMemo(() => {
    return explorationRecords.filter(record => {
      // Period filter
      if (periodFilter === "thisMonth") {
        if (!record.date.includes("2026.03")) return false
      } else if (periodFilter === "thisYear") {
        if (!record.date.includes("2026")) return false
      }
      // Category filter
      if (categoryFilter !== "all" && record.category !== categoryFilter) {
        return false
      }
      // Type filter
      if (typeFilter !== "all" && record.type !== typeFilter) {
        return false
      }
      return true
    })
  }, [periodFilter, categoryFilter, typeFilter])

  // Group records by location (cluster)
  const clusters = useMemo(() => {
    const clusterMap = new Map<string, typeof explorationRecords>()
    filteredRecords.forEach(record => {
      const key = record.location.name
      if (!clusterMap.has(key)) {
        clusterMap.set(key, [])
      }
      clusterMap.get(key)!.push(record)
    })
    return clusterMap
  }, [filteredRecords])

  const thisMonthCount = explorationRecords.filter(r => r.date.includes("2026.03")).length
  const uniqueLocations = new Set(explorationRecords.map(r => r.location.name)).size

  const handlePinClick = (record: typeof explorationRecords[0]) => {
    setSelectedRecord(record)
  }

  return (
    <div className="space-y-6">
      {/* Header with Stats */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">탐험 지도</h1>
          <p className="text-muted-foreground">지금까지의 탐험 발자취</p>
        </div>
        
        {/* Summary Stats */}
        <Card className="shadow-md">
          <CardContent className="p-4">
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
                  <Footprints className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-primary">{uniqueLocations}곳</p>
                  <p className="text-xs text-muted-foreground">총 탐험 장소</p>
                </div>
              </div>
              <div className="h-10 w-px bg-border" />
              <div>
                <p className="text-2xl font-bold text-accent">{thisMonthCount}개</p>
                <p className="text-xs text-muted-foreground">이번 달 탐험</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters - Dropdown Style */}
      <div className="flex items-center gap-3 flex-wrap">
        {/* Period Filter */}
        <div className="flex items-center gap-2">
          <Calendar className="h-4 w-4 text-muted-foreground" />
          <Select value={periodFilter} onValueChange={setPeriodFilter}>
            <SelectTrigger className="w-[130px]">
              <SelectValue placeholder="기간" />
            </SelectTrigger>
            <SelectContent>
              {periodOptions.map(option => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Category Filter */}
        <Select value={categoryFilter} onValueChange={setCategoryFilter}>
          <SelectTrigger className="w-[130px]">
            <SelectValue placeholder="카테고리" />
          </SelectTrigger>
          <SelectContent>
            {categoryOptions.map(option => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Type Filter */}
        <Select value={typeFilter} onValueChange={setTypeFilter}>
          <SelectTrigger className="w-[130px]">
            <SelectValue placeholder="탐험 종류" />
          </SelectTrigger>
          <SelectContent>
            {typeOptions.map(option => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <div className="flex-1" />
        
        <Button 
          variant={showList ? "default" : "outline"} 
          size="sm" 
          className="gap-2"
          onClick={() => setShowList(!showList)}
        >
          <Layers className="h-4 w-4" />
          목록
        </Button>
      </div>

      {/* Map and List Container */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Map Area */}
        <div className={cn("relative", showList ? "lg:col-span-2" : "lg:col-span-3")}>
          <Card className="overflow-hidden shadow-lg">
            <CardContent className="p-0">
              <div className="relative h-[500px] bg-gradient-to-br from-muted to-muted/50">
                {/* Grid background */}
                <div className="absolute inset-0 opacity-20">
                  <div className="h-full w-full" style={{
                    backgroundImage: `
                      linear-gradient(to right, var(--border) 1px, transparent 1px),
                      linear-gradient(to bottom, var(--border) 1px, transparent 1px)
                    `,
                    backgroundSize: '40px 40px'
                  }} />
                </div>

                {/* Map pins */}
                {Array.from(clusters.entries()).map(([locationName, records], index) => {
                  const isCluster = records.length > 1
                  const firstRecord = records[0]
                  const isSelected = selectedRecord?.location.name === locationName
                  const isHovered = hoveredCluster === locationName
                  
                  return (
                    <div
                      key={locationName}
                      className={cn(
                        "absolute transform -translate-x-1/2 -translate-y-full transition-all z-10",
                        isSelected && "scale-125 z-20"
                      )}
                      style={{
                        left: `${20 + (index * 15)}%`,
                        top: `${30 + (index * 12)}%`,
                      }}
                    >
                      <button
                        onClick={() => handlePinClick(firstRecord)}
                        onMouseEnter={() => setHoveredCluster(locationName)}
                        onMouseLeave={() => setHoveredCluster(null)}
                        className="relative hover:scale-110 transition-transform"
                      >
                        <div className={cn(
                          "relative",
                          isSelected && "animate-bounce"
                        )}>
                          <div className={cn(
                            "flex h-12 w-12 items-center justify-center rounded-full shadow-lg border-4 border-white",
                            isSelected 
                              ? "bg-accent" 
                              : "bg-primary"
                          )}>
                            <span className="text-xl">{firstRecord.emoji}</span>
                          </div>
                          <div className={cn(
                            "absolute left-1/2 -bottom-2 h-3 w-3 -translate-x-1/2 rotate-45",
                            isSelected 
                              ? "bg-accent" 
                              : "bg-primary"
                          )} />
                          
                          {/* Cluster count badge */}
                          {isCluster && (
                            <div className="absolute -top-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full bg-highlight text-highlight-foreground text-xs font-bold shadow-md">
                              {records.length}
                            </div>
                          )}
                        </div>
                      </button>
                      
                      {/* Hover tooltip */}
                      {isHovered && !isSelected && (
                        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 pointer-events-none z-30">
                          <Card className="shadow-lg border-primary/20">
                            <CardContent className="p-3">
                              <p className="font-semibold text-foreground text-sm">{locationName}</p>
                              {isCluster ? (
                                <p className="text-xs text-muted-foreground">{records.length}개의 탐험</p>
                              ) : (
                                <p className="text-xs text-foreground/70 mt-1 line-clamp-1">"{firstRecord.note}"</p>
                              )}
                            </CardContent>
                          </Card>
                        </div>
                      )}
                    </div>
                  )
                })}

                {/* Map controls */}
                <div className="absolute right-4 top-4 flex flex-col gap-2">
                  <Button variant="secondary" size="icon" className="shadow-lg">
                    <ZoomIn className="h-4 w-4" />
                  </Button>
                  <Button variant="secondary" size="icon" className="shadow-lg">
                    <ZoomOut className="h-4 w-4" />
                  </Button>
                  <Button variant="secondary" size="icon" className="shadow-lg">
                    <Locate className="h-4 w-4" />
                  </Button>
                </div>

                {/* Pin click mini card */}
                {selectedRecord && (
                  <div className="absolute bottom-4 left-4 max-w-xs">
                    <Card className="shadow-xl border-primary/20">
                      <CardContent className="p-4">
                        <div className="flex items-start gap-3">
                          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-2xl shrink-0">
                            {selectedRecord.emoji}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-2">
                              <div>
                                <h3 className="font-bold text-foreground">{selectedRecord.questName}</h3>
                                <p className="text-sm text-muted-foreground flex items-center gap-1">
                                  <MapPin className="h-3 w-3" />
                                  {selectedRecord.location.name}
                                </p>
                                <p className="text-xs text-muted-foreground mt-1">{selectedRecord.date}</p>
                              </div>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="shrink-0 h-8 w-8"
                                onClick={() => setSelectedRecord(null)}
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            </div>
                            <Button variant="outline" size="sm" className="gap-1 mt-3 w-full">
                              기록 보기
                              <ChevronRight className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* List Panel */}
        {showList && (
          <div className="lg:col-span-1">
            <Card className="shadow-lg h-[500px] overflow-hidden">
              <CardContent className="p-0 h-full flex flex-col">
                <div className="p-4 border-b border-border">
                  <h3 className="font-bold text-foreground">탐험 장소</h3>
                  <p className="text-sm text-muted-foreground">{clusters.size}곳</p>
                </div>
                <div className="flex-1 overflow-y-auto">
                  {Array.from(clusters.entries()).map(([locationName, records]) => (
                    <button
                      key={locationName}
                      onClick={() => handlePinClick(records[0])}
                      className={cn(
                        "w-full p-4 text-left border-b border-border hover:bg-muted/50 transition-colors",
                        selectedRecord?.location.name === locationName && "bg-primary/5 border-l-4 border-l-primary"
                      )}
                    >
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-xl shrink-0">
                          {records[0].emoji}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <h4 className="font-semibold text-foreground truncate">{locationName}</h4>
                            {records.length > 1 && (
                              <span className="px-2 py-0.5 rounded-full bg-highlight/20 text-highlight text-xs font-medium">
                                {records.length}
                              </span>
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground truncate">
                            {records.length > 1 
                              ? `${records.length}개의 탐험` 
                              : records[0].questName
                            }
                          </p>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  )
}
