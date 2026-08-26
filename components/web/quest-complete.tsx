"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { 
  PartyPopper, 
  MapPin, 
  Calendar, 
  Camera, 
  FileText,
  X,
  Sparkles,
  Star,
  Zap,
  Navigation,
  Search,
  CheckCircle2
} from "lucide-react"
import { cn } from "@/lib/utils"

interface QuestCompleteProps {
  quest: {
    title: string
    hobby: string
    category: string
    xpReward: number
  }
  onClose: () => void
  onSave: (data: {
    location?: { name: string; lat?: number; lng?: number }
    date: string
    photo?: string
    note: string
  }) => void
}

type LocationOption = "current" | "search" | "none"

export function QuestComplete({ quest, onClose, onSave }: QuestCompleteProps) {
  const [locationOption, setLocationOption] = useState<LocationOption>("none")
  const [locationName, setLocationName] = useState("")
  const [note, setNote] = useState("")
  const [photo, setPhoto] = useState<string | null>(null)
  const [step, setStep] = useState<"complete" | "record">("complete")

  const handleSave = () => {
    onSave({
      location: locationOption !== "none" ? { name: locationName } : undefined,
      date: new Date().toLocaleDateString("ko-KR", {
        year: "numeric",
        month: "long",
        day: "numeric",
      }),
      photo: photo || undefined,
      note,
    })
    onClose()
  }

  const handleGetCurrentLocation = () => {
    setLocationOption("current")
    // In a real app, this would use the Geolocation API
    setLocationName("서울특별시 강남구")
  }

  if (step === "complete") {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
        <Card className="w-full max-w-lg mx-4 overflow-hidden shadow-2xl">
          <CardContent className="p-0">
            {/* Celebration Header */}
            <div className="relative bg-gradient-to-br from-accent via-accent/90 to-primary p-8 text-center">
              <div className="absolute inset-0 overflow-hidden">
                <div className="absolute top-4 left-4 text-4xl animate-bounce">🎉</div>
                <div className="absolute top-8 right-8 text-3xl animate-bounce delay-100">✨</div>
                <div className="absolute bottom-4 left-8 text-3xl animate-bounce delay-200">🌟</div>
                <div className="absolute bottom-8 right-4 text-4xl animate-bounce delay-75">🎊</div>
              </div>
              <div className="relative">
                <div className="flex justify-center mb-4">
                  <div className="h-20 w-20 rounded-full bg-white/20 flex items-center justify-center backdrop-blur-sm">
                    <PartyPopper className="h-10 w-10 text-white" />
                  </div>
                </div>
                <h2 className="text-3xl font-bold text-white mb-2">탐험 완료!</h2>
                <p className="text-white/90 text-lg">새로운 경험을 획득했습니다</p>
              </div>
            </div>

            {/* Quest Info */}
            <div className="p-6 space-y-6">
              <div className="text-center">
                <h3 className="text-2xl font-bold text-foreground mb-2">{quest.title}</h3>
                <p className="text-muted-foreground">{quest.hobby}</p>
              </div>

              {/* XP Reward */}
              <div className="flex justify-center">
                <div className="flex items-center gap-3 px-6 py-3 rounded-full bg-primary/10 border border-primary/20">
                  <Zap className="h-6 w-6 text-primary" />
                  <span className="text-2xl font-bold text-primary">+{quest.xpReward} XP</span>
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-4 rounded-xl bg-muted/50">
                  <Star className="h-6 w-6 text-highlight mx-auto mb-2" />
                  <p className="text-sm text-muted-foreground">카테고리</p>
                  <p className="font-semibold text-foreground">{quest.category}</p>
                </div>
                <div className="text-center p-4 rounded-xl bg-muted/50">
                  <Calendar className="h-6 w-6 text-primary mx-auto mb-2" />
                  <p className="text-sm text-muted-foreground">완료일</p>
                  <p className="font-semibold text-foreground">
                    {new Date().toLocaleDateString("ko-KR", { month: "long", day: "numeric" })}
                  </p>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-3">
                <Button variant="outline" className="flex-1" onClick={onClose}>
                  나중에 기록하기
                </Button>
                <Button 
                  className="flex-1 bg-accent hover:bg-accent/90 text-accent-foreground"
                  onClick={() => setStep("record")}
                >
                  <FileText className="h-4 w-4 mr-2" />
                  탐험 기록하기
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
      <Card className="w-full max-w-lg mx-4 overflow-hidden shadow-2xl max-h-[90vh] overflow-y-auto">
        <CardContent className="p-0">
          {/* Header */}
          <div className="relative bg-gradient-to-r from-primary/10 to-accent/10 p-6 border-b border-border">
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-4 top-4"
              onClick={onClose}
            >
              <X className="h-5 w-5" />
            </Button>
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 rounded-xl bg-accent/20 flex items-center justify-center">
                <FileText className="h-6 w-6 text-accent" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-foreground">탐험 기록</h2>
                <p className="text-sm text-muted-foreground">{quest.title}</p>
              </div>
            </div>
          </div>

          {/* Form */}
          <div className="p-6 space-y-6">
            {/* Location Option */}
            <div className="space-y-3">
              <label className="flex items-center gap-2 text-sm font-medium text-foreground">
                <MapPin className="h-4 w-4 text-primary" />
                위치 기록 (선택)
              </label>
              <div className="grid grid-cols-3 gap-2">
                <Button
                  variant={locationOption === "current" ? "default" : "outline"}
                  size="sm"
                  className={cn(
                    "flex-col h-auto py-3",
                    locationOption === "current" && "bg-primary text-primary-foreground"
                  )}
                  onClick={handleGetCurrentLocation}
                >
                  <Navigation className="h-4 w-4 mb-1" />
                  <span className="text-xs">현재 위치</span>
                </Button>
                <Button
                  variant={locationOption === "search" ? "default" : "outline"}
                  size="sm"
                  className={cn(
                    "flex-col h-auto py-3",
                    locationOption === "search" && "bg-primary text-primary-foreground"
                  )}
                  onClick={() => setLocationOption("search")}
                >
                  <Search className="h-4 w-4 mb-1" />
                  <span className="text-xs">장소 검색</span>
                </Button>
                <Button
                  variant={locationOption === "none" ? "default" : "outline"}
                  size="sm"
                  className={cn(
                    "flex-col h-auto py-3",
                    locationOption === "none" && "bg-muted text-muted-foreground"
                  )}
                  onClick={() => {
                    setLocationOption("none")
                    setLocationName("")
                  }}
                >
                  <X className="h-4 w-4 mb-1" />
                  <span className="text-xs">기록 안함</span>
                </Button>
              </div>
              {(locationOption === "current" || locationOption === "search") && (
                <Input
                  placeholder="장소명을 입력하세요"
                  value={locationName}
                  onChange={(e) => setLocationName(e.target.value)}
                  className="mt-2"
                />
              )}
              {locationOption === "current" && locationName && (
                <div className="flex items-center gap-2 text-sm text-quest-success">
                  <CheckCircle2 className="h-4 w-4" />
                  현재 위치가 기록되었습니다
                </div>
              )}
            </div>

            {/* Photo */}
            <div className="space-y-3">
              <label className="flex items-center gap-2 text-sm font-medium text-foreground">
                <Camera className="h-4 w-4 text-primary" />
                사진 (선택)
              </label>
              <div 
                className="border-2 border-dashed border-border rounded-xl p-8 text-center hover:border-primary/50 transition-colors cursor-pointer"
                onClick={() => {
                  // In a real app, this would open a file picker
                  setPhoto("placeholder.jpg")
                }}
              >
                {photo ? (
                  <div className="flex items-center justify-center gap-2 text-quest-success">
                    <CheckCircle2 className="h-5 w-5" />
                    <span className="font-medium">사진이 추가되었습니다</span>
                  </div>
                ) : (
                  <>
                    <Camera className="h-10 w-10 text-muted-foreground mx-auto mb-2" />
                    <p className="text-sm text-muted-foreground">클릭하여 사진 추가</p>
                  </>
                )}
              </div>
            </div>

            {/* Note */}
            <div className="space-y-3">
              <label className="flex items-center gap-2 text-sm font-medium text-foreground">
                <FileText className="h-4 w-4 text-primary" />
                한줄 기록
              </label>
              <Textarea
                placeholder="오늘의 탐험은 어땠나요?"
                value={note}
                onChange={(e) => setNote(e.target.value)}
                rows={3}
              />
            </div>

            {/* Actions */}
            <div className="flex gap-3 pt-4">
              <Button variant="outline" className="flex-1" onClick={() => setStep("complete")}>
                뒤로
              </Button>
              <Button 
                className="flex-1 bg-accent hover:bg-accent/90 text-accent-foreground"
                onClick={handleSave}
              >
                <Sparkles className="h-4 w-4 mr-2" />
                기록 저장하기
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
