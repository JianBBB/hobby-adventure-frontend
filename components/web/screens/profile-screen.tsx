"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { AchievementDetail } from "@/components/web/achievement-detail"
import { 
  User,
  Trophy,
  Target,
  BookOpen,
  Flame,
  Star,
  Settings,
  ChevronRight,
  TrendingUp,
  Award,
  Calendar
} from "lucide-react"
import { cn } from "@/lib/utils"

const achievements = [
  { id: 1, name: "첫 퀘스트 완료", description: "첫 번째 퀘스트를 완료했습니다", icon: "🎯", unlocked: true },
  { id: 2, name: "탐험가", description: "5개의 서로 다른 취미를 시도했습니다", icon: "🧭", unlocked: true },
  { id: 3, name: "꾸준함의 달인", description: "7일 연속 활동했습니다", icon: "🔥", unlocked: true },
  { id: 4, name: "기록왕", description: "10개 이상의 기록을 작성했습니다", icon: "📝", unlocked: false },
  { id: 5, name: "도전자", description: "어려움 난이도 퀘스트를 완료했습니다", icon: "💪", unlocked: true },
  { id: 6, name: "예술가", description: "예술 카테고리 퀘스트 3개 완료", icon: "🎨", unlocked: false },
]

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

type AchievementType = typeof achievements[0]

export function ProfileScreen() {
  const [selectedAchievement, setSelectedAchievement] = useState<AchievementType | null>(null)
  const totalCategories = hobbyCategories.reduce((sum, cat) => sum + cat.count, 0)

  return (
    <div className="space-y-8">
      {/* Achievement Detail Modal */}
      {selectedAchievement && (
        <AchievementDetail 
          achievement={selectedAchievement}
          onClose={() => setSelectedAchievement(null)}
        />
      )}

      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-foreground">프로필</h1>
        <Button variant="outline" size="sm" className="gap-2">
          <Settings className="h-4 w-4" />
          설정
        </Button>
      </div>

      {/* Profile Card */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-start gap-6">
            <div className="relative">
              <div className="flex h-24 w-24 items-center justify-center rounded-full bg-primary/10 ring-4 ring-primary/20">
                <User className="h-12 w-12 text-primary" />
              </div>
              <div className="absolute -bottom-1 -right-1 flex h-9 w-9 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground ring-2 ring-background">
                Lv.5
              </div>
            </div>
            <div className="flex-1">
              <h2 className="text-xl font-bold text-foreground">탐험가 김하늘</h2>
              <p className="mt-1 text-muted-foreground">새로운 취미를 찾아 떠나는 모험가</p>
              
              {/* XP Progress */}
              <div className="mt-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium text-foreground">레벨 6까지</span>
                  <span className="font-bold text-primary">320 / 500 XP</span>
                </div>
                <div className="mt-2 h-3 overflow-hidden rounded-full bg-muted">
                  <div 
                    className="h-full rounded-full bg-primary transition-all"
                    style={{ width: "64%" }}
                  />
                </div>
              </div>

              {/* Quick Stats */}
              <div className="mt-4 flex gap-6">
                <div className="flex items-center gap-2">
                  <Flame className="h-5 w-5 text-accent" />
                  <span className="font-semibold text-foreground">7일</span>
                  <span className="text-sm text-muted-foreground">연속</span>
                </div>
                <div className="flex items-center gap-2">
                  <Trophy className="h-5 w-5 text-accent" />
                  <span className="font-semibold text-foreground">12개</span>
                  <span className="text-sm text-muted-foreground">퀘스트</span>
                </div>
                <div className="flex items-center gap-2">
                  <BookOpen className="h-5 w-5 text-primary" />
                  <span className="font-semibold text-foreground">8개</span>
                  <span className="text-sm text-muted-foreground">기록</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="p-4 text-center">
            <Target className="mx-auto h-8 w-8 text-primary" />
            <p className="mt-2 text-2xl font-bold text-foreground">12</p>
            <p className="text-sm text-muted-foreground">완료한 퀘스트</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <BookOpen className="mx-auto h-8 w-8 text-quest-success" />
            <p className="mt-2 text-2xl font-bold text-foreground">8</p>
            <p className="text-sm text-muted-foreground">작성한 기록</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <Award className="mx-auto h-8 w-8 text-accent" />
            <p className="mt-2 text-2xl font-bold text-foreground">4</p>
            <p className="text-sm text-muted-foreground">획득한 뱃지</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <TrendingUp className="mx-auto h-8 w-8 text-quest-progress" />
            <p className="mt-2 text-2xl font-bold text-foreground">1,250</p>
            <p className="text-sm text-muted-foreground">총 경험치</p>
          </CardContent>
        </Card>
      </div>

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
            <CardTitle className="text-base">���별 활동</CardTitle>
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

      {/* Achievements */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-base">업적</CardTitle>
          <Button variant="ghost" size="sm" className="gap-1 text-muted-foreground">
            전체보기
            <ChevronRight className="h-4 w-4" />
          </Button>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {achievements.map((achievement) => (
              <div
                key={achievement.id}
                onClick={() => setSelectedAchievement(achievement)}
                className={cn(
                  "flex cursor-pointer items-center gap-3 rounded-xl border p-3 transition-all hover:shadow-md",
                  achievement.unlocked
                    ? "border-primary/20 bg-primary/5 hover:border-primary/40"
                    : "border-border bg-secondary/30 opacity-50 hover:opacity-70"
                )}
              >
                <div className={cn(
                  "flex h-12 w-12 items-center justify-center rounded-xl text-2xl",
                  achievement.unlocked ? "bg-primary/10" : "bg-muted grayscale"
                )}>
                  {achievement.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="truncate text-sm font-semibold text-foreground">
                    {achievement.name}
                  </h4>
                  <p className="truncate text-xs text-muted-foreground">
                    {achievement.description}
                  </p>
                </div>
                {achievement.unlocked && (
                  <Star className="h-4 w-4 shrink-0 fill-accent text-accent" />
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
