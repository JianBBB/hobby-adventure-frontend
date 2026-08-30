"use client"

import { useEffect, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  ArrowLeft,
  CheckCircle2,
  PartyPopper,
  BookOpen,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { toast } from "sonner"
import { ApiError } from "@/lib/api/client"
import { getMyExploration, completeMyExploration } from "@/lib/api/myExplorations"
import type { MyExplorationDetail } from "@/lib/api/types"

interface WriteRecordData {
  mode: "create" | "edit"
  userExplorationId: number
  recordId?: number
  explorationName: string
  explorationCategory: string
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
  const [showCompleteModal, setShowCompleteModal] = useState(false)

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
        setShowCompleteModal(true)
      })
      .catch((err) => {
        toast.error(err instanceof ApiError ? err.message : "탐험을 완료 처리하지 못했어요.")
      })
      .finally(() => setCompleting(false))
  }

  const handleRecordLater = () => {
    setShowCompleteModal(false)
    onBack()
  }

  const handleRecordNow = () => {
    setShowCompleteModal(false)
    if (onWriteRecord && exploration) {
      onWriteRecord({
        mode: "create",
        userExplorationId: Number(userExplorationId),
        explorationName: exploration.title,
        explorationCategory: exploration.categoryName,
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

  return (
    <div className="space-y-6">
      {/* Complete Modal */}
      {showCompleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <Card className="w-full max-w-md mx-4 shadow-2xl">
            <CardContent className="p-8 text-center">
              <div className="flex h-20 w-20 items-center justify-center rounded-full bg-highlight/20 mx-auto mb-6">
                <PartyPopper className="h-10 w-10 text-highlight" />
              </div>
              <h2 className="text-2xl font-bold text-foreground mb-2">탐험 완료!</h2>
              <p className="text-muted-foreground mb-8">기록을 남길까요?</p>
              <div className="flex flex-col gap-3">
                <Button
                  size="lg"
                  className="w-full gap-2 bg-accent hover:bg-accent/90"
                  onClick={handleRecordNow}
                >
                  <BookOpen className="h-5 w-5" />
                  기록 남기기
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  className="w-full"
                  onClick={handleRecordLater}
                >
                  나중에 하기
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

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

      {/* In progress: complete button */}
      {exploration.status === "STARTED" && (
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
      )}

      {/* Already completed */}
      {exploration.status === "COMPLETED" && (
        <Card className="shadow-lg bg-quest-success/5 border-quest-success/20">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-quest-success/10">
                <CheckCircle2 className="h-6 w-6 text-quest-success" />
              </div>
              <div>
                <h3 className="font-bold text-foreground">이 탐험을 완료했어요!</h3>
                <p className="text-sm text-muted-foreground">
                  {exploration.hasRecord ? "기록에서 경험을 확인할 수 있습니다" : "기록을 남겨보는 건 어떨까요?"}
                </p>
              </div>
              {!exploration.hasRecord && (
                <Button className="ml-auto gap-2" onClick={handleRecordNow}>
                  <BookOpen className="h-4 w-4" />
                  기록 남기기
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
