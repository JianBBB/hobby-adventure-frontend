"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  User,
  Target,
  BookOpen,
  Settings,
  Calendar
} from "lucide-react"
import { cn } from "@/lib/utils"
import { toast } from "sonner"
import { ApiError } from "@/lib/api/client"
import { getLoggedInUser } from "@/lib/auth"
import { getUser } from "@/lib/api/users"
import { getMyExplorations } from "@/lib/api/myExplorations"
import { getRecords } from "@/lib/api/records"
import type { UserProfile } from "@/lib/api/types"

const hobbyCategories = [
  { name: "문화/예술", count: 4, color: "bg-chart-3" },
  { name: "스포츠", count: 3, color: "bg-chart-1" },
  { name: "요리", count: 2, color: "bg-chart-2" },
  { name: "공예", count: 2, color: "bg-chart-4" },
  { name: "자연", count: 1, color: "bg-chart-5" },
]

const monthlyActivity = [
  { month: "1월", quests: 2, records: 3 },
  { month: "2월", quests: 3, records: 4 },
  { month: "3월", quests: 4, records: 5 },
]

export function ProfileScreen() {
  const totalCategories = hobbyCategories.reduce((sum, cat) => sum + cat.count, 0)
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [completedCount, setCompletedCount] = useState(0)
  const [recordCount, setRecordCount] = useState(0)

  useEffect(() => {
    const loggedInUser = getLoggedInUser()
    if (!loggedInUser) return

    getUser(loggedInUser.userId)
      .then(setProfile)
      .catch((err) => {
        toast.error(err instanceof ApiError ? err.message : "프로필 정보를 불러오지 못했어요.")
      })
    getMyExplorations({ status: "COMPLETED", page: 1, size: 1 })
      .then(({ meta }) => setCompletedCount(meta.totalElements))
      .catch(() => {})
    getRecords({ page: 1, size: 1 })
      .then(({ meta }) => setRecordCount(meta.totalElements))
      .catch(() => {})
  }, [])

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-foreground sm:text-2xl">프로필</h1>
        <Button variant="outline" size="sm" className="gap-2">
          <Settings className="h-4 w-4" />
          설정
        </Button>
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
                {profile ? profile.nickname : "로그인이 필요해요"}
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

      <p className="text-xs text-muted-foreground">
        * 아래 취미 카테고리·월별 활동은 아직 예시 데이터예요, 나중에 실제 데이터로 교체할 예정이에요.
      </p>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Hobby Categories */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">취미 카테고리</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {hobbyCategories.map((category, index) => (
                <div key={index} className="flex items-center gap-3">
                  <div className={cn("h-3 w-3 rounded-full", category.color)} />
                  <span className="flex-1 text-sm text-foreground">{category.name}</span>
                  <div className="flex items-center gap-2">
                    <div className="h-2 w-24 overflow-hidden rounded-full bg-muted">
                      <div 
                        className={cn("h-full rounded-full", category.color)}
                        style={{ width: `${(category.count / totalCategories) * 100}%` }}
                      />
                    </div>
                    <span className="text-sm font-medium text-muted-foreground">{category.count}개</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Monthly Activity */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">월별 활동</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {monthlyActivity.map((activity, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm font-medium text-foreground">{activity.month}</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1.5">
                      <Target className="h-4 w-4 text-primary" />
                      <span className="text-sm text-muted-foreground">퀘스트 {activity.quests}개</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <BookOpen className="h-4 w-4 text-quest-success" />
                      <span className="text-sm text-muted-foreground">기록 {activity.records}개</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
