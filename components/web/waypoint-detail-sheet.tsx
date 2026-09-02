"use client"

import { useEffect, useState } from "react"
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { MapPin, ImageOff } from "lucide-react"
import { toast } from "sonner"
import { ApiError } from "@/lib/api/client"
import { getWaypoint } from "@/lib/api/waypoints"
import type { WaypointDetail } from "@/lib/api/types"

function formatWaypointTime(iso: string) {
  const d = new Date(iso)
  return `${d.getMonth() + 1}/${d.getDate()} ${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`
}

interface WaypointDetailSheetProps {
  waypointId: number | null
  onClose: () => void
}

// 진행중 화면(WaypointSection)의 조회 전용 바텀시트와 같은 정보를 보여주지만,
// 완료 후 회고 화면/기록 상세의 여정 로그에서도 재사용할 수 있게 조회 전용으로만 분리한 컴포넌트.
export function WaypointDetailSheet({ waypointId, onClose }: WaypointDetailSheetProps) {
  const [detail, setDetail] = useState<WaypointDetail | null>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (waypointId === null) return
    setLoading(true)
    setDetail(null)
    getWaypoint(waypointId)
      .then(setDetail)
      .catch((err) => {
        toast.error(err instanceof ApiError ? err.message : "여정을 불러오지 못했어요.")
        onClose()
      })
      .finally(() => setLoading(false))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [waypointId])

  return (
    <Sheet open={waypointId !== null} onOpenChange={(open) => !open && onClose()}>
      <SheetContent side="bottom" className="max-h-[85vh] overflow-y-auto p-0">
        <div className="mx-auto w-full max-w-lg">
          <SheetHeader>
            <SheetTitle>여정 보기</SheetTitle>
          </SheetHeader>

          <div className="space-y-5 px-4 pb-6">
            {loading || !detail ? (
              <div className="h-[24rem] animate-pulse rounded-xl bg-secondary" />
            ) : (
              <>
                {/* 사진 영역은 있든 없든 높이를 h-40으로 고정 — 여정마다 시트가 들쭉날쭉하지 않게 함.
                    없을 땐 빈 칸 여러 개 대신 안내 박스 하나만 보여줌(그게 더 안 어색함) */}
                <div className="flex h-40 gap-2 overflow-x-auto">
                  {detail.images.length > 0 ? (
                    detail.images.map((img) => (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        key={img.imageId}
                        src={img.url}
                        alt=""
                        className="aspect-square h-full w-auto shrink-0 rounded-xl object-cover"
                      />
                    ))
                  ) : (
                    <div className="flex h-full w-full flex-col items-center justify-center gap-1.5 rounded-xl bg-secondary text-muted-foreground">
                      <ImageOff className="h-6 w-6" />
                      <span className="text-xs">사진을 남기지 않았어요</span>
                    </div>
                  )}
                </div>

                <div>
                  <p className="mb-2 text-xs text-muted-foreground">날짜·시간</p>
                  <p className="text-sm text-foreground">{formatWaypointTime(detail.checkedAt)}</p>
                </div>

                {/* 장소/메모는 내용이 없어도 라벨만 붙은 빈 줄로 안 보이게, 박스 안에 넣어서
                    "비어있음"도 하나의 카드처럼 눈에 들어오게 함 */}
                <div>
                  <p className="mb-2 text-xs text-muted-foreground">장소</p>
                  <div className="flex items-center gap-1.5 rounded-xl bg-secondary/60 px-3 py-2.5">
                    <MapPin className="h-4 w-4 shrink-0 text-muted-foreground" />
                    {detail.placeName ? (
                      <span className="text-sm text-foreground">{detail.placeName}</span>
                    ) : (
                      <span className="text-sm text-muted-foreground">남기지 않았어요</span>
                    )}
                  </div>
                </div>

                <div>
                  <p className="mb-2 text-xs text-muted-foreground">한마디</p>
                  <div className="min-h-[4.5rem] rounded-xl bg-secondary/60 px-3 py-2.5">
                    {detail.memo ? (
                      <p className="whitespace-pre-wrap text-sm text-foreground">{detail.memo}</p>
                    ) : (
                      <p className="text-sm text-muted-foreground">남기지 않았어요</p>
                    )}
                  </div>
                </div>
              </>
            )}

            <Button variant="outline" size="lg" className="w-full" onClick={onClose}>
              닫기
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}
