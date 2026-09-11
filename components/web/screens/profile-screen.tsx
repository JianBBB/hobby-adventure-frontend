"use client"

import { useEffect, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import {
  User,
  Target,
  BookOpen,
} from "lucide-react"
import { useAppNavigation } from "@/lib/app-navigation-context"
import { getUser } from "@/lib/api/users"
import { getMyExplorations } from "@/lib/api/myExplorations"
import { getRecords } from "@/lib/api/records"
import type { UserProfile } from "@/lib/api/types"

export function ProfileScreen() {
  // 로그인 여부/닉네임은 사이드바·헤더랑 같은 출처(레이아웃의 user 상태)를 써야
  // 화면마다 로그인 상태가 다르게 보이는 일이 없음 — 이메일 등 상세 정보만 여기서 추가로 불러옴
  const { user } = useAppNavigation()
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [completedCount, setCompletedCount] = useState(0)
  const [recordCount, setRecordCount] = useState(0)

  useEffect(() => {
    if (!user) return

    getUser(user.userId)
      .then(setProfile)
      .catch(() => {})
    getMyExplorations({ status: "COMPLETED", page: 1, size: 1 })
      .then(({ meta }) => setCompletedCount(meta.totalElements))
      .catch(() => {})
    getRecords({ page: 1, size: 1 })
      .then(({ meta }) => setRecordCount(meta.totalElements))
      .catch(() => {})
  }, [user])

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-foreground sm:text-2xl">프로필</h1>
      </div>

      {/* Profile Card */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center gap-6">
            <div className="flex h-24 w-24 items-center justify-center rounded-full bg-primary/10 ring-4 ring-primary/20">
              <User className="h-12 w-12 text-primary" />
            </div>
            <div className="flex-1">
              <h2 className="text-xl font-bold text-foreground">
                {user ? (profile?.nickname ?? user.nickname) : "로그인이 필요해요"}
              </h2>
              <p className="mt-1 text-muted-foreground">{profile?.email ?? ""}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardContent className="p-4 text-center">
            <Target className="mx-auto h-8 w-8 text-primary" />
            <p className="mt-2 text-2xl font-bold text-foreground">{completedCount}</p>
            <p className="text-sm text-muted-foreground">완료한 탐험</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <BookOpen className="mx-auto h-8 w-8 text-quest-success" />
            <p className="mt-2 text-2xl font-bold text-foreground">{recordCount}</p>
            <p className="text-sm text-muted-foreground">작성한 기록</p>
          </CardContent>
        </Card>
      </div>

    </div>
  )
}
