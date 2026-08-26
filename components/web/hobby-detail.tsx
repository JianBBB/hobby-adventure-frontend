"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { 
  X, 
  Clock, 
  MapPin, 
  Users, 
  Star,
  Heart,
  Play,
  ChevronRight,
  Sparkles,
  Target,
  CheckCircle2,
  BookOpen
} from "lucide-react"
import { cn } from "@/lib/utils"

interface HobbyDetailProps {
  hobby: {
    name: string
    description: string
    category: string
    difficulty: "쉬움" | "보통" | "어려움"
    duration: string
    isIndoor: boolean
    isSolo: boolean
    isFavorite?: boolean
  }
  onClose: () => void
  onStartQuest?: () => void
}

const difficultyColors = {
  쉬움: "bg-quest-easy/10 text-quest-easy",
  보통: "bg-quest-medium/10 text-quest-medium",
  어려움: "bg-quest-hard/10 text-quest-hard",
}

const categoryIcons: Record<string, string> = {
  "음악": "🎵",
  "문화/예술": "🎨",
  "창작": "✨",
  "운동": "💪",
  "음식": "🍽️",
  "야외활동": "🏔️",
  "휴식": "🧘",
}

// 관련 퀘스트 예시
const relatedQuests = [
  { title: "첫 체험하기", xp: 100, difficulty: "쉬움" },
  { title: "3번 반복하기", xp: 200, difficulty: "보통" },
  { title: "작품 완성하기", xp: 300, difficulty: "어려움" },
]

// 팁 예시
const tips = [
  "처음이라면 체험 클래스를 추천해요",
  "편한 복장으로 참여하세요",
  "사전 예약이 필요한 경우가 많아요",
]

export function HobbyDetail({ hobby, onClose, onStartQuest }: HobbyDetailProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm p-4">
      <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl bg-card border shadow-xl">
        {/* Header Image Area */}
        <div className="relative h-48 bg-gradient-to-br from-primary/20 via-accent/10 to-primary/5 flex items-center justify-center">
          <span className="text-8xl">{categoryIcons[hobby.category] || "🎯"}</span>
          
          {/* Close Button */}
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-4 top-4 h-10 w-10 rounded-full bg-card/80 hover:bg-card"
            onClick={onClose}
          >
            <X className="h-5 w-5" />
          </Button>

          {/* Favorite Button */}
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-16 top-4 h-10 w-10 rounded-full bg-card/80 hover:bg-card"
          >
            <Heart className={cn("h-5 w-5", hobby.isFavorite && "fill-destructive text-destructive")} />
          </Button>

          {/* Category Badge */}
          <div className="absolute left-4 top-4 flex items-center gap-2 rounded-full bg-card/80 px-3 py-1.5 text-sm font-medium">
            <span>{categoryIcons[hobby.category]}</span>
            <span>{hobby.category}</span>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Title & Description */}
          <div>
            <h2 className="text-2xl font-bold text-foreground">{hobby.name}</h2>
            <p className="mt-2 text-muted-foreground leading-relaxed">{hobby.description}</p>
          </div>

          {/* Quick Info */}
          <div className="flex flex-wrap gap-3">
            <div className={cn("flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-medium", difficultyColors[hobby.difficulty])}>
              <Target className="h-4 w-4" />
              {hobby.difficulty}
            </div>
            <div className="flex items-center gap-1.5 rounded-full bg-secondary px-3 py-1.5 text-sm text-muted-foreground">
              <Clock className="h-4 w-4" />
              {hobby.duration}
            </div>
            <div className="flex items-center gap-1.5 rounded-full bg-secondary px-3 py-1.5 text-sm text-muted-foreground">
              <MapPin className="h-4 w-4" />
              {hobby.isIndoor ? "실내" : "야외"}
            </div>
            <div className="flex items-center gap-1.5 rounded-full bg-secondary px-3 py-1.5 text-sm text-muted-foreground">
              <Users className="h-4 w-4" />
              {hobby.isSolo ? "혼자서도 가능" : "함께하면 좋아요"}
            </div>
          </div>

          {/* Tips Section */}
          <Card className="bg-accent/5 border-accent/20">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-3">
                <Sparkles className="h-5 w-5 text-accent" />
                <h3 className="font-semibold text-foreground">시작하기 전 팁</h3>
              </div>
              <ul className="space-y-2">
                {tips.map((tip, index) => (
                  <li key={index} className="flex items-start gap-2 text-sm text-muted-foreground">
                    <CheckCircle2 className="h-4 w-4 mt-0.5 text-accent shrink-0" />
                    {tip}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          {/* Related Quests */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Target className="h-5 w-5 text-primary" />
              <h3 className="font-semibold text-foreground">관련 퀘스트</h3>
            </div>
            <div className="space-y-2">
              {relatedQuests.map((quest, index) => (
                <div 
                  key={index}
                  className="flex items-center justify-between rounded-xl border bg-card p-3 hover:bg-secondary/50 transition-colors cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                      <Target className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium text-foreground">{quest.title}</p>
                      <p className="text-xs text-muted-foreground">난이도: {quest.difficulty}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-primary">+{quest.xp} XP</span>
                    <ChevronRight className="h-4 w-4 text-muted-foreground" />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center p-3 rounded-xl bg-secondary/50">
              <div className="flex items-center justify-center gap-1 text-accent">
                <Star className="h-4 w-4 fill-accent" />
                <span className="font-bold">4.5</span>
              </div>
              <p className="text-xs text-muted-foreground mt-1">평균 평점</p>
            </div>
            <div className="text-center p-3 rounded-xl bg-secondary/50">
              <p className="font-bold text-foreground">127명</p>
              <p className="text-xs text-muted-foreground mt-1">도전한 사람</p>
            </div>
            <div className="text-center p-3 rounded-xl bg-secondary/50">
              <div className="flex items-center justify-center gap-1">
                <BookOpen className="h-4 w-4 text-primary" />
                <span className="font-bold text-foreground">43개</span>
              </div>
              <p className="text-xs text-muted-foreground mt-1">기록</p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-2">
            <Button variant="outline" className="flex-1 gap-2" onClick={onClose}>
              닫기
            </Button>
            <Button 
              className="flex-1 gap-2 bg-gradient-to-r from-primary to-primary/80"
              onClick={onStartQuest}
            >
              <Play className="h-4 w-4" />
              퀘스트 시작하기
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
