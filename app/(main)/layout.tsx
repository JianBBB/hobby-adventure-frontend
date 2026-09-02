"use client"

import { useEffect, useState } from "react"
import { usePathname, useRouter } from "next/navigation"
import { Sidebar } from "@/components/web/sidebar"
import { Header } from "@/components/web/header"
import { WriteRecordScreen } from "@/components/web/screens/write-record-screen"
import { AuthScreen } from "@/components/web/screens/auth-screen"
import { AppNavigationContext } from "@/lib/app-navigation-context"
import { clearLoggedInUser, getLoggedInUser, type LoggedInUser } from "@/lib/auth"

// 로그인해야만 볼 수 있는 화면들 (경로 앞부분 기준)
const PROTECTED_PATHS = ["/profile", "/my-explorations", "/record"]

interface WriteRecordData {
  mode: "create" | "edit"
  userExplorationId: number
  recordId?: number
  explorationName: string
  explorationCategory: string
  draftContent?: string
  completedAt?: string
}

export default function MainLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()
  const [user, setUser] = useState<LoggedInUser | null>(null)
  const [authChecked, setAuthChecked] = useState(false)
  const [authMode, setAuthMode] = useState<"login" | "signup" | null>(null)
  const [writeRecordData, setWriteRecordData] = useState<WriteRecordData | null>(null)
  const isLoggedIn = user !== null

  // localStorage에 저장된 로그인 정보 기준으로 초기 상태 동기화
  useEffect(() => {
    setUser(getLoggedInUser())
    setAuthChecked(true)
  }, [])

  const isProtectedRoute = PROTECTED_PATHS.some(
    (path) => pathname === path || pathname.startsWith(`${path}/`)
  )
  const needsLogin = authChecked && isProtectedRoute && !isLoggedIn

  // 로그인 필요한 페이지에 로그인 안 한 채로 들어오면 바로 로그인 화면을 띄움
  useEffect(() => {
    if (needsLogin) {
      setAuthMode("login")
    }
  }, [needsLogin])

  // 기록 작성 화면은 라우트가 아니라 오버레이라 사이드바로 다른 메뉴를 눌러 경로가
  // 바뀌어도 저절로 안 닫힘 — 실제 경로 이동이 감지되면 오버레이를 닫아줌
  useEffect(() => {
    setWriteRecordData(null)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname])

  const handleExplorationSelect = (id: string) => {
    router.push(`/explore/${id}`)
  }

  const handleContinueExploration = (id: string) => {
    router.push(`/my-explorations/${id}`)
  }

  const handleWriteRecord = (data: WriteRecordData) => {
    setWriteRecordData(data)
  }

  const handleWriteRecordBack = () => {
    setWriteRecordData(null)
  }

  const handleWriteRecordSave = () => {
    setWriteRecordData(null)
    router.push("/record")
  }

  return (
    <AppNavigationContext.Provider
      value={{
        onExplorationSelect: handleExplorationSelect,
        onContinueExploration: handleContinueExploration,
        onWriteRecord: handleWriteRecord,
        onCloseOverlays: () => setWriteRecordData(null),
        isLoggedIn,
      }}
    >
      <div className="min-h-screen bg-background">
        {authMode && (
          <AuthScreen
            mode={authMode}
            onModeChange={setAuthMode}
            onClose={() => {
              setAuthMode(null)
              if (needsLogin) router.push("/")
            }}
            onSuccess={() => {
              setUser(getLoggedInUser())
              setAuthMode(null)
            }}
          />
        )}

        <Sidebar user={user} />

        <main className="ml-64 min-h-screen">
          <Header
            isLoggedIn={isLoggedIn}
            nickname={user?.nickname}
            onLogin={() => setAuthMode("login")}
            onSignup={() => setAuthMode("signup")}
            onLogout={() => {
              clearLoggedInUser()
              setUser(null)
            }}
            onNavigateToProfile={() => router.push("/profile")}
          />

          <div className="mx-auto max-w-6xl px-8 py-8">
            {needsLogin ? null : writeRecordData ? (
              <WriteRecordScreen
                mode={writeRecordData.mode}
                userExplorationId={writeRecordData.userExplorationId}
                recordId={writeRecordData.recordId}
                explorationName={writeRecordData.explorationName}
                explorationCategory={writeRecordData.explorationCategory}
                draftContent={writeRecordData.draftContent}
                completedAt={writeRecordData.completedAt}
                onBack={handleWriteRecordBack}
                onSave={handleWriteRecordSave}
              />
            ) : (
              children
            )}
          </div>
        </main>
      </div>
    </AppNavigationContext.Provider>
  )
}
