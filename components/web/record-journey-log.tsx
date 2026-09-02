"use client"

import { useEffect, useState } from "react"
import { cn } from "@/lib/utils"
import { toast } from "sonner"
import { ImageOff } from "lucide-react"
import { ApiError } from "@/lib/api/client"
import { getWaypoints } from "@/lib/api/waypoints"
import type { WaypointListItem } from "@/lib/api/types"

interface RecordJourneyLogProps {
  userExplorationId: number
}

function WaypointThumb({ url }: { url: string | null }) {
  if (!url) {
    return (
      <div className="flex h-full w-full items-center justify-center text-muted-foreground">
        <ImageOff className="h-4 w-4" />
      </div>
    )
  }
  // eslint-disable-next-line @next/next/no-img-element
  return <img src={url} alt="" className="h-full w-full object-cover" />
}

export function RecordJourneyLog({ userExplorationId }: RecordJourneyLogProps) {
  const [waypoints, setWaypoints] = useState<WaypointListItem[]>([])
  const [loading, setLoading] = useState(true)
  const [showFull, setShowFull] = useState(false)
  const [expandedIds, setExpandedIds] = useState<Set<number>>(new Set())
  // 탐험 성향에 따라 원하는 순서가 다를 수 있어서 사용자가 직접 고름
  const [sortOrder, setSortOrder] = useState<"oldest" | "newest">("oldest")

  useEffect(() => {
    setLoading(true)
    getWaypoints({ userExplorationId, sortOrder: "oldest", size: 100 })
      .then((res) => setWaypoints(res.items))
      .catch((err) => {
        toast.error(err instanceof ApiError ? err.message : "여정을 불러오지 못했어요.")
      })
      .finally(() => setLoading(false))
  }, [userExplorationId])

  if (loading) {
    return (
      <div className="space-y-2">
        <div className="h-16 animate-pulse rounded-xl bg-secondary" />
        <div className="h-16 animate-pulse rounded-xl bg-secondary" />
      </div>
    )
  }

  const hasJourney = waypoints.length > 0
  const sorted = [...waypoints].sort((a, b) =>
    sortOrder === "oldest" ? a.checkedAt.localeCompare(b.checkedAt) : b.checkedAt.localeCompare(a.checkedAt)
  )
  const recentIds = new Set(
    [...waypoints].sort((a, b) => b.checkedAt.localeCompare(a.checkedAt)).slice(0, 2).map((w) => w.waypointId)
  )
  const visible = showFull ? sorted : sorted.filter((w) => recentIds.has(w.waypointId))

  const toggleExpanded = (id: number) => {
    setExpandedIds((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  return (
    <div className="space-y-3 rounded-xl border border-primary/10 p-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h3 className="text-sm font-medium text-foreground">📍 이 기록을 쓰기까지의 여정</h3>
        {hasJourney && (
          <div className="flex rounded-full bg-secondary p-0.5 text-xs">
            <button
              onClick={() => setSortOrder("oldest")}
              className={cn(
                "rounded-full px-2.5 py-1 font-medium transition-all",
                sortOrder === "oldest" ? "bg-card shadow text-foreground" : "text-muted-foreground"
              )}
            >
              1일차부터
            </button>
            <button
              onClick={() => setSortOrder("newest")}
              className={cn(
                "rounded-full px-2.5 py-1 font-medium transition-all",
                sortOrder === "newest" ? "bg-card shadow text-foreground" : "text-muted-foreground"
              )}
            >
              최신부터
            </button>
          </div>
        )}
      </div>

      {!hasJourney ? (
        <p className="py-6 text-center text-sm text-muted-foreground">이 기록엔 남겨진 여정이 없어요.</p>
      ) : (
        <>
          <div className="space-y-3">
            {visible.map((w) => {
              const isExpanded = expandedIds.has(w.waypointId)
              const memo = w.memo ?? ""
              const isLong = memo.length > 60
              return (
                <button
                  key={w.waypointId}
                  onClick={() => isLong && toggleExpanded(w.waypointId)}
                  className="flex w-full gap-3 rounded-xl border border-border p-3 text-left"
                >
                  <div className="h-14 w-14 shrink-0 overflow-hidden rounded-lg bg-gradient-to-br from-primary/10 to-accent/10">
                    <WaypointThumb url={w.thumbnailUrl} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-[11px] text-muted-foreground">
                      {w.checkedAt.slice(0, 10)}{w.placeName && ` · ${w.placeName}`}
                    </p>
                    <p className={cn("text-sm text-foreground", !isExpanded && "line-clamp-2")}>
                      {memo || "(메모 없음)"}
                    </p>
                    {isLong && (
                      <span className="mt-1 inline-block text-xs font-medium text-primary">
                        {isExpanded ? "접기" : "더보기"}
                      </span>
                    )}
                  </div>
                </button>
              )
            })}
          </div>

          {waypoints.length > 2 && (
            <button
              onClick={() => setShowFull((v) => !v)}
              className="w-full rounded-lg py-2 text-center text-xs font-medium text-primary hover:bg-primary/5"
            >
              {showFull ? "최근 것만 보기" : "전체 여정 보기"}
            </button>
          )}

          <p className="text-xs text-muted-foreground">
            이 기록은 진행중에 남긴 {waypoints.length}개의 여정을 바탕으로 초안이 만들어졌어요.
          </p>
        </>
      )}
    </div>
  )
}
