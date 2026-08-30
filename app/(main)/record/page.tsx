"use client"

import { RecordScreen } from "@/components/web/screens/record-screen"
import { useAppNavigation } from "@/lib/app-navigation-context"

export default function RecordPage() {
  const { onWriteRecord, onContinueExploration } = useAppNavigation()

  return <RecordScreen onWriteRecord={onWriteRecord} onContinueExploration={onContinueExploration} />
}
