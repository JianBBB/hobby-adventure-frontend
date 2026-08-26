"use client"

import { ExploreScreen } from "@/components/web/screens/explore-screen"
import { useAppNavigation } from "@/lib/app-navigation-context"

export default function ExplorePage() {
  const { onExplorationSelect } = useAppNavigation()

  return <ExploreScreen onExplorationSelect={onExplorationSelect} />
}
