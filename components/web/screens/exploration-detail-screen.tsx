"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  ArrowLeft,
  CheckCircle2,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { toast } from "sonner"
import { ApiError } from "@/lib/api/client"
import { getMyExploration, completeMyExploration } from "@/lib/api/myExplorations"
import type { MyExplorationDetail } from "@/lib/api/types"
import { WaypointSection } from "@/components/web/screens/waypoint-section"
import { WaypointJourneyView } from "@/components/web/screens/waypoint-journey-view"

interface WriteRecordData {
  mode: "create" | "edit"
  userExplorationId: number
  recordId?: number
  explorationName: string
  explorationCategory: string
  draftContent?: string
  completedAt?: string
}

interface ExplorationDetailScreenProps {
  userExplorationId: string
  onBack: () => void
  onWriteRecord?: (data: WriteRecordData) => void
}

const statusConfig = {
  STARTED: { label: "진행중", color: "bg-primary/10 text-primary" },
  COMPLETED: { label: "완료", color: "bg-quest-success/10 text-quest-success" },
}

export function ExplorationDetailScreen({
  userExplorationId,
  onBack,
  onWriteRecord
}: ExplorationDetailScreenProps) {
  const [exploration, setExploration] = useState<MyExplorationDetail | null>(null)
  const [loading, setLoading] = useState(true)
  const [completing, setCompleting] = useState(false)

  useEffect(() => {
    setLoading(true)
    getMyExploration(Number(userExplorationId))
      .then(setExploration)
      .catch((err) => {
        toast.error(err instanceof ApiError ? err.message : "탐험 정보를 불러오지 못했어요.")
      })
      .finally(() => setLoading(false))
  }, [userExplorationId])

  const handleComplete = () => {
    const confirmed = window.confirm("탐험을 완료할까요? 완료 후에는 되돌릴 수 없어요.")
    if (!confirmed) return

    setCompleting(true)
    completeMyExploration(Number(userExplorationId))
      .then(() => {
        setExploration((prev) => (prev ? { ...prev, status: "COMPLETED" } : prev))
      })
      .catch((err) => {
        toast.error(err instanceof ApiError ? err.message : "탐험을 완료 처리하지 못했어요.")
      })
      .finally(() => setCompleting(false))
  }

  const handleWriteRecord = (draftContent?: string) => {
    if (onWriteRecord && exploration) {
      onWriteRecord({
        mode: "create",
        userExplorationId: Number(userExplorationId),
        explorationName: exploration.title,
        explorationCategory: exploration.categoryName,
        draftContent,
        completedAt: exploration.completedAt ?? undefined,
      })
    }
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-8 w-24 animate-pulse rounded bg-secondary" />
        <div className="h-32 animate-pulse rounded-xl bg-secondary" />
        <div className="h-32 animate-pulse rounded-xl bg-secondary" />
      </div>
    )
  }

  if (!exploration) {
    return (
      <div className="space-y-6">
        <Button variant="ghost" className="gap-2 -ml-2" onClick={onBack}>
          <ArrowLeft className="h-4 w-4" />
          돌아가기
        </Button>
        <p className="text-muted-foreground">탐험 정보를 찾을 수 없어요.</p>
      </div>
    )
  }

  if (exploration.status === "COMPLETED") {
    return (
      <WaypointJourneyView
        userExplorationId={Number(userExplorationId)}
        explorationName={exploration.title}
        explorationCategory={exploration.categoryName}
        hasRecord={exploration.hasRecord}
        recordId={exploration.recordId}
        onWriteRecord={(data) => handleWriteRecord(data.draftContent)}
        onBack={onBack}
      />
    )
  }

  return (
    <div className="space-y-6">
      {/* Back Button */}
      <Button variant="ghost" className="gap-2 -ml-2" onClick={onBack}>
        <ArrowLeft className="h-4 w-4" />
        돌아가기
      </Button>

      {/* Header */}
      <div className="flex items-start gap-6">
        <div className="flex h-24 w-24 shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-primary/10 text-5xl">
          {exploration.thumbnailUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={exploration.thumbnailUrl} alt={exploration.title} className="h-full w-full object-cover" />
          ) : (
            "🧭"
          )}
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-sm font-medium text-primary">{exploration.categoryName}</span>
            <span className={cn(
              "px-2 py-0.5 rounded-full text-xs font-medium",
              statusConfig[exploration.status].color
            )}>
              {statusConfig[exploration.status].label}
            </span>
          </div>
          <h1 className="text-3xl font-bold text-foreground mb-2">{exploration.title}</h1>
          <p className="text-lg text-muted-foreground">{exploration.shortDescription}</p>
        </div>
      </div>

      {/* 여기 도달하는 시점엔 항상 STARTED — COMPLETED는 위에서 WaypointJourneyView로 이미 반환됨 */}
      <Card className="shadow-lg bg-gradient-to-r from-accent/5 to-primary/5 border-accent/20">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-foreground mb-1">탐험을 마쳤나요?</h3>
              <p className="text-sm text-muted-foreground">준비됐으면 완료 버튼을 눌러주세요</p>
            </div>
            <Button
              size="lg"
              className="gap-2 bg-accent hover:bg-accent/90 text-accent-foreground shadow-lg px-8"
              onClick={handleComplete}
              disabled={completing}
            >
              <CheckCircle2 className="h-5 w-5" />
              {completing ? "처리 중..." : "탐험 완료"}
            </Button>
          </div>
        </CardContent>
      </Card>

      <WaypointSection userExplorationId={Number(userExplorationId)} canEdit />
    </div>
  )
}
