"use client"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Play, Compass } from "lucide-react"

interface StartExplorationModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  explorationName: string
  explorationIcon?: string
  confirming?: boolean
}

export function StartExplorationModal({
  isOpen,
  onClose,
  onConfirm,
  explorationName,
  explorationIcon = "🧭",
  confirming = false,
}: StartExplorationModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader className="text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-primary/20 to-accent/20 text-4xl mb-4">
            {explorationIcon}
          </div>
          <DialogTitle className="text-xl">
            {explorationName}을(를) 시작할까요?
          </DialogTitle>
          <DialogDescription className="text-center">
            시작하면 내 탐험 목록에 추가됩니다.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="flex gap-3 sm:justify-center mt-4">
          <Button variant="outline" onClick={onClose} disabled={confirming} className="flex-1 sm:flex-initial">
            취소
          </Button>
          <Button
            onClick={onConfirm}
            disabled={confirming}
            className="flex-1 sm:flex-initial gap-2 bg-accent hover:bg-accent/90 text-accent-foreground"
          >
            <Play className="h-4 w-4" />
            {confirming ? "시작하는 중..." : "탐험 시작"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
