"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Sidebar } from "@/components/web/sidebar"
import { Header } from "@/components/web/header"
import { ExplorationDetailScreen } from "@/components/web/screens/exploration-detail-screen"
import { ExplorationIntroScreen } from "@/components/web/screens/exploration-intro-screen"
import { WriteRecordScreen } from "@/components/web/screens/write-record-screen"
import { AuthScreen } from "@/components/web/screens/auth-screen"
import { AppNavigationContext } from "@/lib/app-navigation-context"

interface WriteRecordData {
  explorationId: string
  explorationName: string
  explorationIcon: string
  explorationCategory: string
  isNewRecord: boolean
}

export default function MainLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const [isLoggedIn, setIsLoggedIn] = useState(true) // Demo: logged in state
  const [authMode, setAuthMode] = useState<"login" | "signup" | null>(null)
  const [selectedExplorationId, setSelectedExplorationId] = useState<string | null>(null)
  const [selectedExplorationForProgress, setSelectedExplorationForProgress] = useState<string | null>(null)
  const [writeRecordData, setWriteRecordData] = useState<WriteRecordData | null>(null)

  const handleExplorationSelect = (id: string) => {
    setSelectedExplorationId(id)
  }

  const handleContinueExploration = (id: string) => {
    setSelectedExplorationForProgress(id)
  }

  const handleExplorationBack = () => {
    setSelectedExplorationId(null)
  }

  const handleProgressBack = () => {
    setSelectedExplorationForProgress(null)
  }

  const handleStartExploration = (id: string) => {
    setSelectedExplorationId(null)
    setSelectedExplorationForProgress(id)
  }

  const handleWriteRecord = (data: WriteRecordData) => {
    setSelectedExplorationForProgress(null)
    setWriteRecordData(data)
  }

  const handleWriteRecordBack = () => {
    setWriteRecordData(null)
  }

  const handleWriteRecordSave = () => {
    setWriteRecordData(null)
    router.push("/record")
  }

  let overlay: React.ReactNode = null
  if (writeRecordData) {
    overlay = (
      <WriteRecordScreen
        explorationId={writeRecordData.explorationId}
        explorationName={writeRecordData.explorationName}
        explorationIcon={writeRecordData.explorationIcon}
        explorationCategory={writeRecordData.explorationCategory}
        isNewRecord={writeRecordData.isNewRecord}
        onBack={handleWriteRecordBack}
        onSave={handleWriteRecordSave}
      />
    )
  } else if (selectedExplorationForProgress) {
    overlay = (
      <ExplorationDetailScreen
        explorationId={selectedExplorationForProgress}
        onBack={handleProgressBack}
        onWriteRecord={handleWriteRecord}
      />
    )
  } else if (selectedExplorationId) {
    overlay = (
      <ExplorationIntroScreen
        explorationId={selectedExplorationId}
        onBack={handleExplorationBack}
        onStart={handleStartExploration}
      />
    )
  }

  return (
    <AppNavigationContext.Provider
      value={{
        onExplorationSelect: handleExplorationSelect,
        onContinueExploration: handleContinueExploration,
        onWriteRecord: handleWriteRecord,
      }}
    >
      <div className="min-h-screen bg-background">
        {authMode && (
          <AuthScreen
            mode={authMode}
            onModeChange={setAuthMode}
            onClose={() => setAuthMode(null)}
            onSuccess={() => {
              setIsLoggedIn(true)
              setAuthMode(null)
            }}
          />
        )}

        <Sidebar />

        <main className="ml-64 min-h-screen">
          <Header
            isLoggedIn={isLoggedIn}
            onLogin={() => setAuthMode("login")}
            onSignup={() => setAuthMode("signup")}
            onLogout={() => setIsLoggedIn(false)}
            onNavigateToProfile={() => router.push("/profile")}
          />

          <div className="mx-auto max-w-6xl px-8 py-8">
            {overlay ?? children}
          </div>
        </main>
      </div>
    </AppNavigationContext.Provider>
  )
}
