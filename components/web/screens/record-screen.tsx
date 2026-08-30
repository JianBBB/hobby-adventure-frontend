"use client"

import { useEffect, useMemo, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { RecordDetail } from "@/components/web/record-detail"
import { RecordExplorationPicker } from "@/components/web/record-exploration-picker"
import {
  Calendar,
  ChevronRight,
  ChevronDown,
  Plus,
  BookOpen
} from "lucide-react"
import { cn } from "@/lib/utils"
import { toast } from "sonner"
import { ApiError } from "@/lib/api/client"
import { getRecords } from "@/lib/api/records"
import { getCategories } from "@/lib/api/categories"
import { getEmotionEmoji } from "@/lib/emotion"
import type { Category, RecordListItem } from "@/lib/api/types"

// 활동 잔디(히트맵)는 실제 기록 데이터가 쌓인 뒤 다시 붙이기로 미룸 — 지금은 숨김
// function generateHeatmapData(...) { ... }
// function ActivityHeatmap(...) { ... }

function formatDateShort(dateStr: string) {
  const [, month, day] = dateStr.split("-").map(Number)
  return `${month}월 ${day}일`
}

interface WriteRecordData {
  mode: "create" | "edit"
  userExplorationId: number
  recordId?: number
  explorationName: string
  explorationCategory: string
}

interface RecordScreenProps {
  onWriteRecord?: (data: WriteRecordData) => void
  onContinueExploration?: (id: string) => void
}

export function RecordScreen({ onWriteRecord, onContinueExploration }: RecordScreenProps) {
  const [records, setRecords] = useState<RecordListItem[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedRecordId, setSelectedRecordId] = useState<number | null>(null)
  const [expandedYears, setExpandedYears] = useState<Record<string, boolean>>({})
  const [selectedMonth, setSelectedMonth] = useState<string | null>(null)
  const [categories, setCategories] = useState<Category[]>([])
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(null)
  const [showPicker, setShowPicker] = useState(false)

  useEffect(() => {
    getCategories()
      .then(setCategories)
      .catch((err) => {
        toast.error(err instanceof ApiError ? err.message : "카테고리를 불러오지 못했어요.")
      })
  }, [])

  useEffect(() => {
    setLoading(true)
    getRecords({ categoryId: selectedCategoryId ?? undefined, page: 1, size: 100 })
      .then(({ items }) => {
        const sorted = [...items].sort((a, b) => b.visitedDate.localeCompare(a.visitedDate))
        setRecords(sorted)
        if (sorted.length > 0) {
          const [year, month] = sorted[0].visitedDate.split("-")
          setExpandedYears({ [year]: true })
          setSelectedMonth(`${year}-${Number(month)}`)
        } else {
          setExpandedYears({})
          setSelectedMonth(null)
        }
      })
      .catch((err) => {
        toast.error(err instanceof ApiError ? err.message : "기록 목록을 불러오지 못했어요.")
      })
      .finally(() => setLoading(false))
  }, [selectedCategoryId])

  const handlePickerPickCompleted = (data: { userExplorationId: number; explorationName: string; explorationCategory: string }) => {
    setShowPicker(false)
    onWriteRecord?.({
      mode: "create",
      userExplorationId: data.userExplorationId,
      explorationName: data.explorationName,
      explorationCategory: data.explorationCategory,
    })
  }

  const handlePickerStartNew = (userExplorationId: number) => {
    setShowPicker(false)
    onContinueExploration?.(userExplorationId.toString())
  }

  // Group records by year and month
  const archiveData = useMemo(() => {
    return records.reduce((acc, record) => {
      const [year, month] = record.visitedDate.split("-")
      const yearKey = year
      const monthKey = `${Number(month)}월`

      if (!acc[yearKey]) acc[yearKey] = {}
      if (!acc[yearKey][monthKey]) acc[yearKey][monthKey] = []
      acc[yearKey][monthKey].push(record)

      return acc
    }, {} as Record<string, Record<string, RecordListItem[]>>)
  }, [records])

  const selectedIndex = records.findIndex((r) => r.recordId === selectedRecordId)
  const hasPrev = selectedIndex > 0
  const hasNext = selectedIndex !== -1 && selectedIndex < records.length - 1

  const handleDeleteRecord = (recordId: number) => {
    setRecords((prev) => prev.filter((r) => r.recordId !== recordId))
    setSelectedRecordId(null)
    toast.success("기록을 삭제했어요.")
  }

  const handleEditRecord = (data: WriteRecordData) => {
    onWriteRecord?.(data)
  }

  const handlePrevRecord = () => {
    if (hasPrev) setSelectedRecordId(records[selectedIndex - 1].recordId)
  }

  const handleNextRecord = () => {
    if (hasNext) setSelectedRecordId(records[selectedIndex + 1].recordId)
  }

  const toggleYear = (year: string) => {
    setExpandedYears((prev) => ({ ...prev, [year]: !prev[year] }))
  }

  const selectMonth = (year: string, month: string) => {
    setSelectedMonth(`${year}-${month.replace("월", "")}`)
  }

  const getSelectedRecords = () => {
    if (!selectedMonth) return []
    const [year, month] = selectedMonth.split("-")
    return archiveData[year]?.[`${month}월`] || []
  }

  return (
    <div className="space-y-6">
      {/* Record Detail Modal */}
      {selectedRecordId !== null && (
        <RecordDetail
          recordId={selectedRecordId}
          onClose={() => setSelectedRecordId(null)}
          onPrev={handlePrevRecord}
          onNext={handleNextRecord}
          onDelete={handleDeleteRecord}
          onEdit={handleEditRecord}
          hasPrev={hasPrev}
          hasNext={hasNext}
        />
      )}

      {/* Exploration Picker (새 기록 진입) */}
      {showPicker && (
        <RecordExplorationPicker
          onClose={() => setShowPicker(false)}
          onPickCompleted={handlePickerPickCompleted}
          onStartNew={handlePickerStartNew}
        />
      )}

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">탐험 기록</h1>
          <p className="text-muted-foreground">시간으로 기록된 탐험 아카이브</p>
        </div>
        <Button className="gap-2" onClick={() => setShowPicker(true)}>
          <Plus className="h-4 w-4" />
          새 기록
        </Button>
      </div>

      {/* Category Filter */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => setSelectedCategoryId(null)}
          className={cn(
            "rounded-full px-4 py-2 text-sm font-medium transition-all",
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
              "rounded-full px-4 py-2 text-sm font-medium transition-all",
              selectedCategoryId === category.categoryId
                ? "bg-primary text-primary-foreground shadow-md"
                : "bg-secondary text-muted-foreground hover:bg-secondary/80 hover:text-foreground"
            )}
          >
            {category.name}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="grid gap-6 lg:grid-cols-4">
          <div className="lg:col-span-1 h-40 animate-pulse rounded-xl bg-secondary" />
          <div className="lg:col-span-3 space-y-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="h-24 animate-pulse rounded-xl bg-secondary" />
            ))}
          </div>
        </div>
      ) : records.length === 0 ? (
        <Card className="py-12">
          <CardContent className="flex flex-col items-center justify-center text-center">
            <p className="text-muted-foreground">
              {selectedCategoryId !== null ? "이 카테고리엔 아직 기록이 없어요." : "아직 기록이 없어요."}
            </p>
            {selectedCategoryId === null && (
              <Button className="mt-4 gap-2" onClick={() => setShowPicker(true)}>
                <BookOpen className="h-4 w-4" />
                첫 기록 남기기
              </Button>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6 lg:grid-cols-4">
          {/* Year/Month Navigation */}
          <div className="lg:col-span-1">
            <Card className="shadow-lg">
              <CardContent className="p-4">
                <h3 className="font-bold text-foreground mb-4 flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-primary" />
                  기록 아카이브
                </h3>
                <div className="space-y-2">
                  {Object.entries(archiveData).sort((a, b) => Number(b[0]) - Number(a[0])).map(([year, months]) => (
                    <div key={year}>
                      <button
                        onClick={() => toggleYear(year)}
                        className="w-full flex items-center justify-between px-3 py-2 rounded-lg hover:bg-muted transition-colors font-semibold text-foreground"
                      >
                        <span>{year}년</span>
                        <ChevronDown className={cn(
                          "h-4 w-4 transition-transform",
                          expandedYears[year] && "rotate-180"
                        )} />
                      </button>
                      {expandedYears[year] && (
                        <div className="ml-2 mt-1 space-y-1">
                          {Object.entries(months).sort((a, b) => {
                            const monthA = parseInt(a[0])
                            const monthB = parseInt(b[0])
                            return monthB - monthA
                          }).map(([month, monthRecords]) => (
                            <button
                              key={month}
                              onClick={() => selectMonth(year, month)}
                              className={cn(
                                "w-full flex items-center justify-between px-3 py-2 rounded-lg transition-colors text-sm",
                                selectedMonth === `${year}-${month.replace("월", "")}`
                                  ? "bg-primary/10 text-primary font-medium"
                                  : "hover:bg-muted text-muted-foreground"
                              )}
                            >
                              <span>{month}</span>
                              <span className="text-xs bg-secondary px-2 py-0.5 rounded-full">
                                {monthRecords.length}
                              </span>
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Month Records */}
          <div className="lg:col-span-3">
            <Card className="shadow-lg">
              <CardContent className="p-4">
                {selectedMonth && (
                  <>
                    <h3 className="font-bold text-foreground mb-4">
                      {selectedMonth.split("-")[0]}년 {selectedMonth.split("-")[1]}월 기록
                    </h3>
                    <div className="space-y-3">
                      {getSelectedRecords().map((record) => (
                        <button
                          key={record.recordId}
                          onClick={() => setSelectedRecordId(record.recordId)}
                          className="w-full flex items-center gap-4 p-4 rounded-xl border border-border hover:border-primary/30 hover:bg-muted/30 transition-all text-left"
                        >
                          <div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-primary/10 text-2xl">
                            {record.thumbnailUrl ? (
                              // eslint-disable-next-line @next/next/no-img-element
                              <img src={record.thumbnailUrl} alt={record.explorationTitle} className="h-full w-full object-cover" />
                            ) : (
                              "🧭"
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="text-xs text-primary font-medium">{record.categoryName}</span>
                              <span className="text-xs text-muted-foreground">{formatDateShort(record.visitedDate)}</span>
                            </div>
                            <h4 className="font-semibold text-foreground">{record.title}</h4>
                            <p className="text-sm text-muted-foreground mt-1 line-clamp-1">
                              {record.explorationTitle}
                            </p>
                          </div>
                          <div className="flex shrink-0 items-center gap-1 text-sm text-muted-foreground">
                            <span>{getEmotionEmoji(record.emotionCode)}</span>
                            <span>★{record.rating}.0</span>
                          </div>
                          <ChevronRight className="h-5 w-5 text-muted-foreground shrink-0" />
                        </button>
                      ))}
                      {getSelectedRecords().length === 0 && (
                        <div className="text-center py-8 text-muted-foreground">
                          이 달의 기록이 없습니다.
                        </div>
                      )}
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </div>
  )
}
