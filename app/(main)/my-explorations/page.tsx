"use client"

import { MyExplorationsScreen } from "@/components/web/screens/my-explorations-screen"
import { useAppNavigation } from "@/lib/app-navigation-context"

export default function MyExplorationsPage() {
  const { onContinueExploration } = useAppNavigation()

  return <MyExplorationsScreen onExplorationSelect={onContinueExploration} />
}
