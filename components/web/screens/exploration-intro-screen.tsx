"use client"

import { useEffect, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  ArrowLeft,
  FileText,
  Play,
} from "lucide-react"
import { toast } from "sonner"
import { ApiError } from "@/lib/api/client"
import { getExploration, startExploration } from "@/lib/api/explorations"
import type { ExplorationDetail } from "@/lib/api/types"
import { StartExplorationModal } from "@/components/web/start-exploration-modal"

interface ExplorationIntroScreenProps {
  explorationId: string
  onBack: () => void
  onStart: (userExplorationId: number) => void
}

export function ExplorationIntroScreen({
  explorationId,
  onBack,
  onStart
}: ExplorationIntroScreenProps) {
  const [exploration, setExploration] = useState<ExplorationDetail | null>(null)
  const [loading, setLoading] = useState(true)
  const [showStartModal, setShowStartModal] = useState(false)
  const [starting, setStarting] = useState(false)

  useEffect(() => {
    setLoading(true)
    getExploration(Number(explorationId))
      .then(setExploration)
      .catch((err) => {
        toast.error(err instanceof ApiError ? err.message : "탐험 정보를 불러오지 못했어요.")
      })
      .finally(() => setLoading(false))
  }, [explorationId])

  const handleStartClick = () => {
    setShowStartModal(true)
  }

  const handleConfirmStart = () => {
    setStarting(true)
    startExploration(Number(explorationId))
      .then(({ userExplorationId }) => {
        setShowStartModal(false)
        onStart(userExplorationId)
      })
      .catch((err) => {
        toast.error(err instanceof ApiError ? err.message : "탐험을 시작하지 못했어요.")
      })
      .finally(() => setStarting(false))
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={onBack}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div className="h-6 w-32 animate-pulse rounded bg-secondary" />
        </div>
        <div className="h-48 animate-pulse rounded-xl bg-secondary" />
        <div className="h-40 animate-pulse rounded-xl bg-secondary" />
      </div>
    )
  }

  if (!exploration) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={onBack}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </div>
        <p className="text-muted-foreground">탐험 정보를 찾을 수 없어요.</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={onBack}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="text-xl font-bold text-foreground sm:text-2xl">탐험 소개</h1>
          <p className="text-sm text-muted-foreground">이 탐험에 대해 알아보세요</p>
        </div>
      </div>

      {/* Hero Section */}
      <Card className="shadow-lg overflow-hidden">
        <div className="relative h-48 bg-gradient-to-br from-primary/20 via-accent/20 to-highlight/20 flex items-center justify-center overflow-hidden">
          {exploration.thumbnailUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={exploration.thumbnailUrl} alt={exploration.title} className="h-full w-full object-cover" />
          ) : (
            <span className="text-8xl">🧭</span>
          )}
        </div>
        <CardContent className="p-6">
          <span className="inline-block px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium mb-3">
            {exploration.categoryName}
          </span>
          <h1 className="text-xl font-bold text-foreground mb-3 sm:text-2xl md:text-3xl">{exploration.title}</h1>
          <p className="text-sm text-muted-foreground sm:text-base md:text-lg">{exploration.shortDescription}</p>
        </CardContent>
      </Card>

      {/* Description */}
      <Card className="shadow-lg">
        <CardContent className="p-6">
          <div className="flex items-center gap-2 mb-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
              <FileText className="h-5 w-5 text-primary" />
            </div>
            <h2 className="text-lg font-bold text-foreground">어떤 탐험인가요?</h2>
          </div>
          <p className="whitespace-pre-wrap leading-relaxed text-foreground">{exploration.description}</p>
        </CardContent>
      </Card>

      {/* Start Button */}
      <Card className="shadow-lg bg-gradient-to-r from-accent/5 to-primary/5 border-accent/20">
        <CardContent className="p-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h3 className="font-bold text-foreground mb-1">이 탐험을 시작해볼까요?</h3>
              <p className="text-sm text-muted-foreground">시작하면 내 탐험 목록에 추가됩니다</p>
            </div>
            <Button
              size="lg"
              className="w-full gap-2 bg-accent hover:bg-accent/90 text-accent-foreground shadow-lg sm:w-auto sm:px-8"
              onClick={handleStartClick}
            >
              <Play className="h-5 w-5" />
              탐험 시작
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Start Confirmation Modal */}
      <StartExplorationModal
        isOpen={showStartModal}
        onClose={() => setShowStartModal(false)}
        onConfirm={handleConfirmStart}
        explorationName={exploration.title}
        confirming={starting}
      />
    </div>
  )
}
