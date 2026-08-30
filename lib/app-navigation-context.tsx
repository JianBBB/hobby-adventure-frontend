"use client"

import { createContext, useContext } from "react"

interface WriteRecordData {
  mode: "create" | "edit"
  userExplorationId: number
  recordId?: number
  explorationName: string
  explorationCategory: string
}

interface AppNavigationContextValue {
  onExplorationSelect: (id: string) => void
  onContinueExploration: (id: string) => void
  onWriteRecord: (data: WriteRecordData) => void
  isLoggedIn: boolean
}

export const AppNavigationContext = createContext<AppNavigationContextValue | null>(null)

export function useAppNavigation() {
  const context = useContext(AppNavigationContext)
  if (!context) {
    throw new Error("useAppNavigation은 (main) 레이아웃 안에서만 쓸 수 있어요.")
  }
  return context
}
