"use client"

import { useParams, useRouter } from "next/navigation"
import { ExplorationDetailScreen } from "@/components/web/screens/exploration-detail-screen"
import { useAppNavigation } from "@/lib/app-navigation-context"

export default function MyExplorationDetailPage() {
  const params = useParams<{ id: string }>()
  const router = useRouter()
  const { onWriteRecord } = useAppNavigation()

  return (
    <ExplorationDetailScreen
      userExplorationId={params.id}
      onBack={() => router.back()}
      onWriteRecord={onWriteRecord}
    />
  )
}
