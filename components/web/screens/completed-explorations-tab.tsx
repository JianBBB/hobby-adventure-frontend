"use client"

import { useEffect, useState } from "react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { Compass } from "lucide-react"
import { getMyExplorations, getCompletedExplorationCounts } from "@/lib/api/myExplorations"
import { getRecords } from "@/lib/api/records"
import type { ExplorationCount, MyExplorationListItem } from "@/lib/api/types"

const PAGE_SIZE = 20

interface CompletedExplorationsTabProps {
  // 탭 배지랑 같은 숫자를 다시 물어보지 않게 부모에서 받음(전체 개수, hasRecord 필터 없이)
  completedTotal: number
  onExplorationSelect?: (id: string) => void
}

export function CompletedExplorationsTab({ completedTotal, onExplorationSelect }: CompletedExplorationsTabProps) {
  const [filter, setFilter] = useState<"all" | "no-record">("all")
  const [explorationFilter, setExplorationFilter] = useState<number | null>(null)

  const [items, setItems] = useState<MyExplorationListItem[]>([])
  const [loading, setLoading] = useState(true)
  const [loadingMore, setLoadingMore] = useState(false)
  const [page, setPage] = useState(1)
  const [hasNext, setHasNext] = useState(false)

  // 필터칩/드롭다운에 쓰는 개수들 — 전부 백엔드가 계산해서 주는 값(GROUP BY/COUNT), client에서 배열 세는 게 아님
  const [noRecordCount, setNoRecordCount] = useState(0)
  const [explorationCounts, setExplorationCounts] = useState<ExplorationCount[]>([])
  const [recordByUserExplorationId, setRecordByUserExplorationId] = useState<Map<number, { recordId: number; title: string; thumbnailUrl: string | null }>>(new Map())

  // 필터 개수/옵션은 "전체 기준"으로 고정 — filter를 바꿔도 선택지가 갑자기 사라지거나 개수가 바뀌면 헷갈림
  useEffect(() => {
    getMyExplorations({ status: "COMPLETED", hasRecord: false, page: 1, size: 1 })
      .then((res) => setNoRecordCount(res.meta.totalElements))
      .catch(() => {})

    getCompletedExplorationCounts()
      .then(setExplorationCounts)
      .catch(() => {})
  }, [])

  // 목록 자체(및 정확한 "이 필터 조건의" 개수)는 filter/explorationFilter가 바뀔 때마다 백엔드에 다시 요청
  useEffect(() => {
    setLoading(true)
    setPage(1)
    getMyExplorations({
      status: "COMPLETED",
      hasRecord: filter === "no-record" ? false : undefined,
      explorationId: explorationFilter ?? undefined,
      page: 1,
      size: PAGE_SIZE,
    })
      .then((res) => {
        setItems(res.items)
        setHasNext(res.meta.hasNext)
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [filter, explorationFilter])

  // 지금 화면에 보이는 항목 중 기록 있는 것들의 recordId만 필요한 만큼 배치 조회(기록 제목/딥링크용)
  useEffect(() => {
    const withRecordIds = items.filter((c) => c.hasRecord).map((c) => c.userExplorationId)
    if (withRecordIds.length === 0) return
    getRecords({ size: 100 })
      .then((res) => {
        setRecordByUserExplorationId((prev) => {
          const next = new Map(prev)
          res.items.forEach((r) => next.set(r.userExplorationId, { recordId: r.recordId, title: r.title, thumbnailUrl: r.thumbnailUrl }))
          return next
        })
      })
      .catch(() => {})
  }, [items])

  const handleLoadMore = () => {
    const nextPage = page + 1
    setLoadingMore(true)
    getMyExplorations({
      status: "COMPLETED",
      hasRecord: filter === "no-record" ? false : undefined,
      explorationId: explorationFilter ?? undefined,
      page: nextPage,
      size: PAGE_SIZE,
    })
      .then((res) => {
        setItems((prev) => [...prev, ...res.items])
        setPage(nextPage)
        setHasNext(res.meta.hasNext)
      })
      .catch(() => {})
      .finally(() => setLoadingMore(false))
  }

  if (loading) {
    return (
      <div className="grid gap-4 md:grid-cols-2">
        {Array.from({ length: 2 }).map((_, i) => (
          <div key={i} className="h-32 animate-pulse rounded-xl bg-secondary" />
        ))}
      </div>
    )
  }

  if (completedTotal === 0) {
    return <p className="py-12 text-center text-muted-foreground">아직 완료한 탐험이 없어요.</p>
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => setFilter("all")}
          className={cn(
            "rounded-full px-4 py-1.5 text-sm font-medium transition-all",
            filter === "all" ? "bg-primary text-primary-foreground shadow" : "bg-secondary text-muted-foreground"
          )}
        >
          전체 {completedTotal}
        </button>
        <button
          onClick={() => setFilter("no-record")}
          className={cn(
            "rounded-full px-4 py-1.5 text-sm font-medium transition-all",
            filter === "no-record" ? "bg-primary text-primary-foreground shadow" : "bg-secondary text-muted-foreground"
          )}
        >
          기록 없는 것만 {noRecordCount}
        </button>
      </div>

      {/* 탐험 종류가 많은 사람한텐 칩으로 나열하면 화면이 폭발해서 드롭다운으로 */}
      {explorationCounts.length > 1 && (
        <Select
          value={explorationFilter !== null ? String(explorationFilter) : "all"}
          onValueChange={(v) => setExplorationFilter(v === "all" ? null : Number(v))}
        >
          <SelectTrigger className="w-full max-w-md rounded-xl">
            <Compass className="h-4 w-4 text-primary" />
            <SelectValue placeholder="탐험 전체 보기" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">탐험 전체 보기</SelectItem>
            {[...explorationCounts]
              .sort((a, b) => b.count - a.count)
              .map((ec) => (
                <SelectItem key={ec.explorationId} value={String(ec.explorationId)}>
                  <span className="flex w-full items-center justify-between gap-3">
                    <span className="truncate">{ec.title}</span>
                    <span className="shrink-0 rounded-full bg-secondary px-1.5 py-0.5 text-[11px] font-medium text-muted-foreground">
                      {ec.count}개
                    </span>
                  </span>
                </SelectItem>
              ))}
          </SelectContent>
        </Select>
      )}

      {/* 여정 줄/기록 줄을 항상 각자 독립적으로 보여줌 — 하나가 있다고 다른 하나를 가리지 않음 (v10 목업) */}
      <div className="grid items-start gap-3 md:grid-cols-2">
        {items.map((c) => {
          const record = recordByUserExplorationId.get(c.userExplorationId)
          return (
            <button
              key={c.userExplorationId}
              onClick={() => onExplorationSelect?.(c.userExplorationId.toString())}
              className="flex w-full flex-col gap-2 rounded-xl border border-border p-3 text-left hover:bg-secondary/30"
            >
              {/* 헤더: 탐험 정체성 아이콘(카탈로그 이미지, 절대 안 바꿈) + 완료일 + 제목 */}
              <div className="flex items-center gap-2.5">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-gradient-to-br from-primary/10 to-accent/10 text-lg">
                  {c.thumbnailUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={c.thumbnailUrl} alt={c.title} className="h-full w-full object-cover" />
                  ) : (
                    "🧭"
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-[10.5px] font-semibold text-quest-success">완료 · {c.completedAt?.slice(0, 10)}</p>
                  <p className="truncate text-sm font-bold text-foreground">{c.title}</p>
                </div>
              </div>

              {/* 여정 줄: 사진은 항상 자기 메모랑 같은 줄에서만 등장 */}
              <div
                className={cn(
                  "flex h-[42px] items-center gap-2 rounded-md bg-secondary px-2",
                  !c.lastWaypointMemo && "opacity-55"
                )}
              >
                <div className="flex h-8 w-8 shrink-0 items-center justify-center overflow-hidden rounded bg-border text-sm">
                  {c.lastWaypointThumbnailUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={c.lastWaypointThumbnailUrl} alt="" className="h-full w-full object-cover" />
                  ) : (
                    "–"
                  )}
                </div>
                <span className="shrink-0 text-[10px] font-bold text-muted-foreground">여정</span>
                <p className="min-w-0 flex-1 truncate text-xs text-foreground">
                  {c.lastWaypointMemo ?? "남긴 여정 없음"}
                </p>
              </div>

              {/* 기록 줄: 있으면 여정 줄과 같은 높이로, 없으면 강조색 CTA */}
              {record ? (
                <div className="flex h-[42px] items-center gap-2 rounded-md bg-primary/10 px-2">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center overflow-hidden rounded bg-border text-sm">
                    {record.thumbnailUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={record.thumbnailUrl} alt="" className="h-full w-full object-cover" />
                    ) : (
                      "📷"
                    )}
                  </div>
                  <span className="shrink-0 text-[10px] font-bold text-primary">기록</span>
                  <p className="min-w-0 flex-1 truncate text-xs font-bold text-foreground">&ldquo;{record.title}&rdquo;</p>
                </div>
              ) : (
                <div className="flex h-[42px] items-center justify-center rounded-md bg-accent px-2 text-xs font-bold text-accent-foreground">
                  기록 남기러 가기
                </div>
              )}
            </button>
          )
        })}
        {items.length === 0 && (
          <p className="py-10 text-center text-sm text-muted-foreground">해당하는 완료 탐험이 없어요.</p>
        )}
      </div>

      {hasNext && (
        <div className="flex justify-center pt-2">
          <Button variant="outline" size="sm" onClick={handleLoadMore} disabled={loadingMore}>
            {loadingMore ? "불러오는 중..." : "더보기"}
          </Button>
        </div>
      )}
    </div>
  )
}
