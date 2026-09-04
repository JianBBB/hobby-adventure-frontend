"use client"

import { useEffect, useMemo, useRef, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
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
import { getRecords, getRecordArchiveCounts } from "@/lib/api/records"
import { getCategories } from "@/lib/api/categories"
import { getEmotionEmoji } from "@/lib/emotion"
import type { Category, RecordListItem, RecordArchiveCount } from "@/lib/api/types"

// 활동 잔디(히트맵)는 실제 기록 데이터가 쌓인 뒤 다시 붙이기로 미룸 — 지금은 숨김
// function generateHeatmapData(...) { ... }
// function ActivityHeatmap(...) { ... }

const RECORDS_PAGE_SIZE = 20

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
  completedAt?: string
}

interface RecordScreenProps {
  onWriteRecord?: (data: WriteRecordData) => void
  onContinueExploration?: (id: string) => void
}

export function RecordScreen({ onWriteRecord, onContinueExploration }: RecordScreenProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const recordIdParam = searchParams.get("recordId")
  const [records, setRecords] = useState<RecordListItem[]>([])
  const [archiveCounts, setArchiveCounts] = useState<RecordArchiveCount[]>([])
  const [loading, setLoading] = useState(true)
  // 다른 화면(완료 탐험 상세 등)에서 특정 기록으로 바로 딥링크할 수 있게 URL의 recordId를 초기값으로 씀
  const [selectedRecordId, setSelectedRecordId] = useState<number | null>(
    recordIdParam ? Number(recordIdParam) : null
  )
  const [expandedYears, setExpandedYears] = useState<Record<string, boolean>>({})
  // null이면 전체(연속 피드), 아니면 아카이브에서 콕 찍은 연도/월만 걸러서 보여줌
  const [archiveFilter, setArchiveFilter] = useState<{ year: string; month?: number } | null>(null)
  const [filterLoading, setFilterLoading] = useState(false)
  const [categories, setCategories] = useState<Category[]>([])
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(null)
  const [showPicker, setShowPicker] = useState(false)
  const [hasMorePages, setHasMorePages] = useState(false)
  const [loadingMore, setLoadingMore] = useState(false)
  // 페이지 번호/더 있는지 여부는 state 대신 ref로 관리 — scrollToMonth가 연속으로 loadMore를
  // 호출할 때 setState의 비동기 타이밍 때문에 오래된 값을 참조하는 걸 막기 위함
  const pageRef = useRef(1)
  const hasMoreRef = useRef(false)

  useEffect(() => {
    getCategories()
      .then(setCategories)
      .catch((err) => {
        toast.error(err instanceof ApiError ? err.message : "카테고리를 불러오지 못했어요.")
      })
  }, [])

  useEffect(() => {
    setLoading(true)
    pageRef.current = 1
    getRecords({ categoryId: selectedCategoryId ?? undefined, page: 1, size: RECORDS_PAGE_SIZE })
      .then(({ items, meta }) => {
        const sorted = [...items].sort((a, b) => b.visitedDate.localeCompare(a.visitedDate))
        setRecords(sorted)
        hasMoreRef.current = meta.hasNext
        setHasMorePages(meta.hasNext)
      })
      .catch((err) => {
        toast.error(err instanceof ApiError ? err.message : "기록 목록을 불러오지 못했어요.")
      })
      .finally(() => setLoading(false))
  }, [selectedCategoryId])

  // "더 있으면 계속 불러온다"를 한 곳에 모아둠 — scrollToMonth가 아직 안 불러온 구간으로
  // 점프해야 할 때도 이 함수를 반복 호출해서 목표 지점이 나올 때까지 이어붙임
  const loadMoreRecords = async (): Promise<RecordListItem[]> => {
    if (!hasMoreRef.current) return []
    const nextPage = pageRef.current + 1
    setLoadingMore(true)
    try {
      const { items, meta } = await getRecords({
        categoryId: selectedCategoryId ?? undefined,
        page: nextPage,
        size: RECORDS_PAGE_SIZE,
      })
      setRecords((prev) => [...prev, ...items].sort((a, b) => b.visitedDate.localeCompare(a.visitedDate)))
      pageRef.current = nextPage
      hasMoreRef.current = meta.hasNext
      setHasMorePages(meta.hasNext)
      return items
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : "더 불러오지 못했어요.")
      hasMoreRef.current = false
      setHasMorePages(false)
      return []
    } finally {
      setLoadingMore(false)
    }
  }

  useEffect(() => {
    getRecordArchiveCounts(selectedCategoryId ?? undefined)
      .then(setArchiveCounts)
      .catch((err) => {
        toast.error(err instanceof ApiError ? err.message : "기록 아카이브 개수를 불러오지 못했어요.")
      })
  }, [selectedCategoryId])

  const handlePickerPickCompleted = (data: {
    userExplorationId: number
    explorationName: string
    explorationCategory: string
    completedAt?: string
  }) => {
    setShowPicker(false)
    onWriteRecord?.({
      mode: "create",
      userExplorationId: data.userExplorationId,
      explorationName: data.explorationName,
      explorationCategory: data.explorationCategory,
      completedAt: data.completedAt,
    })
  }

  const handlePickerStartNew = (userExplorationId: number) => {
    setShowPicker(false)
    onContinueExploration?.(userExplorationId.toString())
  }

  // 사이드바 연도/월별 개수는 백엔드 집계(archive-counts)로, 실제 목록은 아래 records에서 직접 필터링
  const archiveSummary = useMemo(() => {
    return archiveCounts.reduce((acc, { month, count }) => {
      const [year, m] = month.split("-")
      const monthKey = `${Number(m)}월`

      if (!acc[year]) acc[year] = {}
      acc[year][monthKey] = count

      return acc
    }, {} as Record<string, Record<string, number>>)
  }, [archiveCounts])

  const selectedIndex = records.findIndex((r) => r.recordId === selectedRecordId)
  const hasPrev = selectedIndex > 0
  const hasNext = selectedIndex !== -1 && selectedIndex < records.length - 1

  const handleDeleteRecord = (recordId: number) => {
    setRecords((prev) => prev.filter((r) => r.recordId !== recordId))
    setSelectedRecordId(null)
    toast.success("기록을 삭제했어요.")
    getRecordArchiveCounts(selectedCategoryId ?? undefined)
      .then(setArchiveCounts)
      .catch(() => {})
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

  // 아카이브에서 콕 찍으면 그 연도/월만 걸러서 보여줌 — 목표 구간이 아직 더보기로
  // 안 불러와진 뒤쪽일 수 있어서, 조건에 맞는 게 나올 때까지 계속 이어서 불러온 뒤 필터를 켬
  const ensureLoaded = async (predicate: (r: RecordListItem) => boolean) => {
    if (records.some(predicate)) return
    while (hasMoreRef.current) {
      const newItems = await loadMoreRecords()
      if (newItems.some(predicate)) return
    }
  }

  const filterToMonth = async (year: string, month: string) => {
    const monthNum = Number(month.replace("월", ""))
    // 이미 그 달이 선택된 상태면 다시 눌렀을 때 꺼지게(토글) 함 — 별도 "전체 보기" 없이도 빠져나올 수 있게
    if (archiveFilter?.year === year && archiveFilter.month === monthNum) {
      setArchiveFilter(null)
      return
    }
    setFilterLoading(true)
    await ensureLoaded((r) => {
      const [ry, rm] = r.visitedDate.split("-")
      return ry === year && Number(rm) === monthNum
    })
    setFilterLoading(false)
    setArchiveFilter({ year, month: monthNum })
  }

  const filterToYear = async (year: string) => {
    if (archiveFilter?.year === year && archiveFilter.month === undefined) {
      setArchiveFilter(null)
      return
    }
    setFilterLoading(true)
    // 월 필터와 달리 "하나라도 찾으면 끝"이 아니라 끝까지 다 불러와야 함 — 같은 연도 기록이라도
    // 서버가 만든 시각순으로 페이지를 나누기 때문에 여러 페이지에 흩어져 있을 수 있음
    // (예: 9월 기록이 1페이지엔 없고 2페이지에만 있는데, 1페이지에 이미 다른 2026년 기록이 있어서
    // "찾았다"고 착각하고 멈추면 9월이 통째로 빠지는 버그가 있었음)
    while (hasMoreRef.current) {
      await loadMoreRecords()
    }
    setFilterLoading(false)
    setArchiveFilter({ year })
  }

  // records가 이미 최신순 정렬돼있어서, 그 순서 그대로 월 단위로만 묶으면 됨(그룹 자체를 다시 정렬할 필요 없음)
  const groupedRecords = useMemo(() => {
    const groups: { key: string; year: string; month: number; items: RecordListItem[] }[] = []
    for (const record of records) {
      const [year, month] = record.visitedDate.split("-")
      const monthNum = Number(month)
      const key = `${year}-${monthNum}`
      const last = groups[groups.length - 1]
      if (last && last.key === key) {
        last.items.push(record)
      } else {
        groups.push({ key, year, month: monthNum, items: [record] })
      }
    }
    return groups
  }, [records])

  const visibleGroups = useMemo(() => {
    if (!archiveFilter) return groupedRecords
    return groupedRecords.filter((g) => {
      if (g.year !== archiveFilter.year) return false
      if (archiveFilter.month !== undefined && g.month !== archiveFilter.month) return false
      return true
    })
  }, [groupedRecords, archiveFilter])

  return (
    <div className="space-y-6 pb-20 md:pb-0">
      {/* Record Detail Modal */}
      {selectedRecordId !== null && (
        <RecordDetail
          recordId={selectedRecordId}
          onClose={() => {
            setSelectedRecordId(null)
            if (recordIdParam) router.replace("/record", { scroll: false })
          }}
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
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h1 className="text-xl font-bold text-foreground sm:text-2xl">탐험 기록</h1>
          <p className="text-muted-foreground">시간으로 기록된 탐험 아카이브</p>
        </div>
        {/* 모바일은 아래 FAB로, 여기는 데스크탑 전용 */}
        <Button className="hidden shrink-0 gap-2 md:inline-flex" onClick={() => setShowPicker(true)}>
          <Plus className="h-4 w-4" />
          새 기록
        </Button>
      </div>

      {!showPicker && (
        <button
          onClick={() => setShowPicker(true)}
          className="fixed bottom-20 right-4 z-40 flex h-12 items-center gap-1.5 rounded-full bg-primary px-5 text-primary-foreground shadow-lg md:hidden"
        >
          <Plus className="h-5 w-5" />
          <span className="text-sm font-semibold">새 기록</span>
        </button>
      )}

      {/* Category Filter — sticky로 고정. 개수가 늘어나도 높이가 안 커지게 줄바꿈 대신 가로 한 줄 스크롤로 처리 */}
      <div className="sticky top-16 z-20 -mx-4 bg-background md:static md:mx-0">
        <div className="relative">
          <div className="flex gap-2 overflow-x-auto px-4 py-2 md:flex-wrap md:overflow-visible md:px-0 md:py-0">
            <button
              onClick={() => setSelectedCategoryId(null)}
              className={cn(
                "shrink-0 rounded-full px-4 py-2 text-sm font-medium transition-all",
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
                  "shrink-0 rounded-full px-4 py-2 text-sm font-medium transition-all",
                  selectedCategoryId === category.categoryId
                    ? "bg-primary text-primary-foreground shadow-md"
                    : "bg-secondary text-muted-foreground hover:bg-secondary/80 hover:text-foreground"
                )}
              >
                {category.name}
              </button>
            ))}
          </div>
          {/* 더 있다는 걸 알려주는 오른쪽 페이드 힌트 — 가로 스크롤은 데스크탑엔 없어서 모바일 전용 */}
          <div className="pointer-events-none absolute inset-y-0 right-0 w-8 bg-gradient-to-l from-background to-transparent md:hidden" />
        </div>
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
          {/* Year/Month Navigation — 스크롤해도 계속 보이게 고정 */}
          <div className="lg:sticky lg:top-20 lg:col-span-1 lg:self-start">
            <Card className="shadow-lg">
              <CardContent className="p-4">
                <h3 className="font-bold text-foreground mb-1 flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-primary" />
                  기록 아카이브
                </h3>
                <p className="mb-3 text-xs text-muted-foreground">
                  눌러서 그 연도/월만 걸러볼 수 있어요.
                </p>
                <div className="space-y-2">
                  {Object.entries(archiveSummary).sort((a, b) => Number(b[0]) - Number(a[0])).map(([year, months]) => (
                    <div key={year}>
                      {/* 펼침/접힘(화살표)과 필터(연도 글자)를 별개 동작으로 분리 — 접어도 필터는 유지되고,
                          이 연도 안의 특정 월이 선택된 상태여도(접혀있어도) 강조색으로 표시됨 */}
                      <div className={cn(
                        "flex items-center rounded-lg transition-colors",
                        archiveFilter?.year === year ? "bg-primary/10" : "hover:bg-muted"
                      )}>
                        <button
                          onClick={() => filterToYear(year)}
                          disabled={filterLoading}
                          className={cn(
                            "flex-1 px-3 py-2 text-left font-semibold",
                            archiveFilter?.year === year ? "text-primary" : "text-foreground"
                          )}
                        >
                          {year}년
                          {archiveFilter?.year === year && archiveFilter.month !== undefined && (
                            <span className="ml-1 font-normal">· {archiveFilter.month}월</span>
                          )}
                        </button>
                        <button
                          onClick={() => toggleYear(year)}
                          className="px-3 py-2"
                          aria-label={expandedYears[year] ? "월 목록 접기" : "월 목록 펼치기"}
                        >
                          <ChevronDown className={cn(
                            "h-4 w-4 text-muted-foreground transition-transform",
                            expandedYears[year] && "rotate-180"
                          )} />
                        </button>
                      </div>
                      {expandedYears[year] && (
                        // 모바일은 월이 많아도 세로로 안 쌓이게 가로 한 줄 스크롤 칩, 데스크탑은
                        // 마우스로 스크롤하기 불편하고 칩이 다닥다닥 붙어 지저분해 보여서 원래처럼 세로 리스트로
                        <div className="mt-1 flex gap-1.5 overflow-x-auto pb-1 pl-2 md:flex-col md:gap-1 md:overflow-visible md:pb-0 md:pl-0">
                          {Object.entries(months).sort((a, b) => {
                            const monthA = parseInt(a[0])
                            const monthB = parseInt(b[0])
                            return monthB - monthA
                          }).map(([month, count]) => {
                            const monthNum = parseInt(month)
                            const isActive = archiveFilter?.year === year && archiveFilter.month === monthNum
                            return (
                            <button
                              key={month}
                              onClick={() => filterToMonth(year, month)}
                              disabled={filterLoading}
                              className={cn(
                                "shrink-0 flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium transition-colors md:w-full md:justify-between md:rounded-lg md:px-3 md:py-2 md:text-sm",
                                isActive
                                  ? "bg-primary text-primary-foreground md:bg-primary/10 md:text-primary"
                                  : "bg-secondary text-muted-foreground hover:bg-secondary/80 hover:text-foreground md:bg-transparent md:hover:bg-muted"
                              )}
                            >
                              <span>{month}</span>
                              <span className={cn(
                                "rounded-full px-1.5 py-0.5 text-[11px] md:px-2 md:py-0.5 md:text-xs",
                                isActive ? "bg-primary-foreground/20 md:bg-primary/10" : "bg-background md:bg-secondary"
                              )}>
                                {count}
                              </span>
                            </button>
                            )
                          })}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* 기본은 전체 기록을 최신순으로 이어서 보여줌(스크롤하는 만큼이 곧 보고 싶은 기간).
              아카이브에서 연도/월을 콕 찍으면 그것만 걸러서 보여줌 */}
          <div className="lg:col-span-3 space-y-6">
            {/* 카드마다 이미 "OO년 OO월 기록"이라고 나와서 별도 안내 배지는 안 둠 —
                빠져나오려면 아카이브에서 선택된 연도/월을 다시 누르면 꺼짐(토글) */}
            {archiveFilter && visibleGroups.length === 0 && (
              <p className="py-8 text-center text-muted-foreground">해당 기간의 기록이 없어요.</p>
            )}
            {visibleGroups.map((group) => (
              <Card key={group.key} id={`record-month-${group.year}-${group.month}`} className="shadow-lg scroll-mt-32">
                <CardContent className="p-4">
                  <h3 className="font-bold text-foreground mb-4">
                    {group.year}년 {group.month}월 기록
                  </h3>
                  <div className="space-y-3">
                    {group.items.map((record) => (
                      <button
                        key={record.recordId}
                        onClick={() => setSelectedRecordId(record.recordId)}
                        className="flex w-full min-w-0 items-center gap-4 rounded-xl border border-border p-3 text-left transition-all hover:border-primary/30 hover:bg-muted/30"
                      >
                        {/* 사진이 이 기록을 떠올리게 하는 핵심 단서라 크게 키움 — 카테고리 태그는 아래 메타줄로 내려서 덜 강조 */}
                        <div className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-primary/10 text-3xl">
                          {record.thumbnailUrl ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img src={record.thumbnailUrl} alt={record.explorationTitle} className="h-full w-full object-cover" />
                          ) : (
                            "🧭"
                          )}
                        </div>
                        <div className="min-w-0 flex-1">
                          <h4 className="truncate font-semibold text-foreground">{record.title}</h4>
                          <p className="truncate text-sm text-muted-foreground">{record.explorationTitle}</p>
                          <div className="mt-1 flex items-center gap-1.5 text-xs text-muted-foreground">
                            <span>{record.categoryName}</span>
                            <span>·</span>
                            <span>{formatDateShort(record.visitedDate)}</span>
                            <span>·</span>
                            <span>{getEmotionEmoji(record.emotionCode)} {record.rating}.0</span>
                          </div>
                        </div>
                        <ChevronRight className="hidden h-5 w-5 shrink-0 self-center text-muted-foreground sm:block" />
                      </button>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
            {!archiveFilter && hasMorePages && (
              <div className="flex justify-center">
                <Button variant="outline" onClick={loadMoreRecords} disabled={loadingMore}>
                  {loadingMore ? "불러오는 중..." : "더보기"}
                </Button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
