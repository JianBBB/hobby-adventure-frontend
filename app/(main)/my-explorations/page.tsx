"use client"

import { Suspense } from "react"
import { MyExplorationsScreen } from "@/components/web/screens/my-explorations-screen"
import { useAppNavigation } from "@/lib/app-navigation-context"

export default function MyExplorationsPage() {
  const { onContinueExploration } = useAppNavigation()

  return (
    // MyExplorationsScreen이 탭 상태를 URL(useSearchParams)에 반영해서 Suspense 경계 필요
    <Suspense fallback={null}>
      <MyExplorationsScreen onExplorationSelect={onContinueExploration} />
    </Suspense>
  )
}
