"use client"

import { useParams, useRouter } from "next/navigation"
import { ExplorationIntroScreen } from "@/components/web/screens/exploration-intro-screen"

export default function ExplorationIntroPage() {
  const params = useParams<{ id: string }>()
  const router = useRouter()

  return (
    <ExplorationIntroScreen
      explorationId={params.id}
      onBack={() => router.push("/explore")}
      onStart={(userExplorationId) => router.push(`/my-explorations/${userExplorationId}`)}
    />
  )
}
