"use client"

import { useRouter } from "next/navigation"
import { HomeScreen } from "@/components/web/screens/home-screen"
import { useAppNavigation } from "@/lib/app-navigation-context"

export default function HomePage() {
  const router = useRouter()
  const { onExplorationSelect, onContinueExploration } = useAppNavigation()

  return (
    <HomeScreen
      onExplorationSelect={onExplorationSelect}
      onContinueExploration={onContinueExploration}
      onNavigateToMyExplorations={() => router.push("/my-explorations")}
    />
  )
}
