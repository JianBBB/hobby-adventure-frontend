"use client"

import { Suspense } from "react"
import { RecordScreen } from "@/components/web/screens/record-screen"
import { useAppNavigation } from "@/lib/app-navigation-context"

export default function RecordPage() {
  const { onWriteRecord, onContinueExploration } = useAppNavigation()

  return (
    // RecordScreen이 딥링크용 recordId를 URL(useSearchParams)에서 읽어서 Suspense 경계 필요
    <Suspense fallback={null}>
      <RecordScreen onWriteRecord={onWriteRecord} onContinueExploration={onContinueExploration} />
    </Suspense>
  )
}
