"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { 
  ArrowLeft,
  MapPin,
  Star,
  Camera,
  CheckCircle2,
  Search
} from "lucide-react"
import { cn } from "@/lib/utils"

interface WriteRecordScreenProps {
  explorationId: string
  explorationName: string
  explorationIcon: string
  explorationCategory: string
  onBack: () => void
  onSave: () => void
}

// Emotion options
const emotions = [
  { value: "excited", label: "신남", emoji: "😆" },
  { value: "proud", label: "뿌듯", emoji: "😊" },
  { value: "peaceful", label: "평온", emoji: "😌" },
  { value: "surprised", label: "놀람", emoji: "😲" },
  { value: "tired", label: "피곤", emoji: "😓" },
  { value: "disappointed", label: "아쉬움", emoji: "😔" },
]

// Location suggestions
const locationSuggestions = [
  "홍대입구역 근처",
  "강남역 근처", 
  "이태원",
  "연남동",
  "성수동",
  "망원동",
  "을지로",
  "북촌",
]

export function WriteRecordScreen({
  explorationId,
  explorationName,
  explorationIcon,
  explorationCategory,
  onBack,
  onSave
}: WriteRecordScreenProps) {
  // Default to today's date
  const today = new Date()
  const todayString = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`
  
  const isNewRecord = explorationId === "new"
  
  const [recordName, setRecordName] = useState(explorationName)
  const [recordDate, setRecordDate] = useState(todayString)
  const [rating, setRating] = useState(0)
  const [selectedEmotion, setSelectedEmotion] = useState("")
  const [note, setNote] = useState("")
  const [location, setLocation] = useState("")
  const [locationMode, setLocationMode] = useState<"input" | "search" | null>(null)
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)

  const handleSave = () => {
    setIsSaving(true)
    // Simulate save
    setTimeout(() => {
      setIsSaving(false)
      setShowSuccess(true)
      setTimeout(() => {
        onSave()
      }, 1500)
    }, 800)
  }

  const canSave = (isNewRecord ? recordName.trim().length > 0 : true) && rating > 0 && selectedEmotion && note.trim().length > 0

  if (showSuccess) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-quest-success/20 mb-6 animate-bounce">
          <CheckCircle2 className="h-10 w-10 text-quest-success" />
        </div>
        <h2 className="text-2xl font-bold text-foreground mb-2">기록이 저장되었어요!</h2>
        <p className="text-muted-foreground">탐험 기록에서 확인할 수 있어요</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={onBack}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold text-foreground">
            {isNewRecord ? "새 탐험 기록" : "탐험 기록 남기기"}
          </h1>
          <p className="text-sm text-muted-foreground">
            {isNewRecord ? "어떤 탐험을 했는지 기록해보세요" : "이번 탐험은 어땠나요?"}
          </p>
        </div>
      </div>

      {/* Exploration Info - Auto filled or Input */}
      {isNewRecord ? (
        <Card className="shadow-lg">
          <CardContent className="p-5">
            <h3 className="font-bold text-foreground mb-4">어떤 탐험을 했나요?</h3>
            <Input
              placeholder="예: 재즈바 탐방, 도자기 공예 체험"
              value={recordName}
              onChange={(e) => setRecordName(e.target.value)}
              className="text-lg"
            />
          </CardContent>
        </Card>
      ) : (
        <Card className="shadow-lg border-primary/20 bg-gradient-to-r from-primary/5 to-transparent">
          <CardContent className="p-5">
            <div className="flex items-center gap-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-white shadow-md text-3xl">
                {explorationIcon}
              </div>
              <div className="flex-1">
                <span className="text-xs text-primary font-medium">{explorationCategory}</span>
                <h2 className="text-xl font-bold text-foreground">{explorationName}</h2>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Date Selection */}
      <Card className="shadow-lg">
        <CardContent className="p-5">
          <h3 className="font-bold text-foreground mb-4">언제 탐험했나요?</h3>
          <Input
            type="date"
            value={recordDate}
            onChange={(e) => setRecordDate(e.target.value)}
            className="w-full"
          />
        </CardContent>
      </Card>

      {/* Rating */}
      <Card className="shadow-lg">
        <CardContent className="p-5">
          <h3 className="font-bold text-foreground mb-4">이번 탐험은 어땠나요?</h3>
          <div className="flex items-center justify-center gap-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                onClick={() => setRating(star)}
                className="p-1 transition-transform hover:scale-110"
              >
                <Star
                  className={cn(
                    "h-10 w-10 transition-colors",
                    star <= rating
                      ? "fill-highlight text-highlight"
                      : "fill-muted text-muted"
                  )}
                />
              </button>
            ))}
          </div>
          {rating > 0 && (
            <p className="text-center mt-3 text-sm text-muted-foreground">
              {rating === 5 && "최고의 탐험이었어요!"}
              {rating === 4 && "정말 좋았어요!"}
              {rating === 3 && "괜찮았어요"}
              {rating === 2 && "조금 아쉬웠어요"}
              {rating === 1 && "다음엔 더 좋을 거예요"}
            </p>
          )}
        </CardContent>
      </Card>

      {/* Emotion */}
      <Card className="shadow-lg">
        <CardContent className="p-5">
          <h3 className="font-bold text-foreground mb-4">어떤 기분이 들었나요?</h3>
          <div className="grid grid-cols-3 gap-3">
            {emotions.map((emotion) => (
              <button
                key={emotion.value}
                onClick={() => setSelectedEmotion(emotion.value)}
                className={cn(
                  "flex flex-col items-center gap-2 p-4 rounded-xl border transition-all",
                  selectedEmotion === emotion.value
                    ? "border-primary bg-primary/10"
                    : "border-border hover:border-primary/30 hover:bg-muted/30"
                )}
              >
                <span className="text-2xl">{emotion.emoji}</span>
                <span className={cn(
                  "text-sm font-medium",
                  selectedEmotion === emotion.value ? "text-primary" : "text-foreground"
                )}>
                  {emotion.label}
                </span>
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Location */}
      <Card className="shadow-lg">
        <CardContent className="p-5">
          <h3 className="font-bold text-foreground mb-2">어디서 탐험했나요?</h3>
          <p className="text-sm text-muted-foreground mb-4">선택 사항이에요. 탐험 지도에 표시됩니다.</p>
          
          {!locationMode && !location && (
            <div className="flex gap-3">
              <Button 
                variant="outline" 
                className="flex-1 gap-2"
                onClick={() => setLocationMode("input")}
              >
                <MapPin className="h-4 w-4" />
                직접 입력
              </Button>
              <Button 
                variant="outline" 
                className="flex-1 gap-2"
                onClick={() => {
                  setLocationMode("search")
                  setShowSuggestions(true)
                }}
              >
                <Search className="h-4 w-4" />
                장소 검색
              </Button>
            </div>
          )}

          {locationMode === "input" && !location && (
            <div className="space-y-3">
              <Input
                placeholder="예: 홍대 재즈바, 강남 클라이밍센터"
                onKeyDown={(e) => {
                  if (e.key === "Enter" && e.currentTarget.value) {
                    setLocation(e.currentTarget.value)
                    setLocationMode(null)
                  }
                }}
                autoFocus
              />
              <div className="flex gap-2">
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => setLocationMode(null)}
                >
                  취소
                </Button>
              </div>
            </div>
          )}

          {locationMode === "search" && showSuggestions && !location && (
            <div className="space-y-3">
              <Input
                placeholder="장소 검색..."
                autoFocus
              />
              <div className="flex flex-wrap gap-2">
                {locationSuggestions.map((suggestion) => (
                  <button
                    key={suggestion}
                    onClick={() => {
                      setLocation(suggestion)
                      setLocationMode(null)
                      setShowSuggestions(false)
                    }}
                    className="px-3 py-1.5 rounded-full border border-border text-sm hover:border-primary/30 hover:bg-muted/30 transition-colors"
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => {
                  setLocationMode(null)
                  setShowSuggestions(false)
                }}
              >
                취소
              </Button>
            </div>
          )}

          {location && (
            <div className="flex items-center justify-between p-3 rounded-xl bg-primary/5 border border-primary/20">
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-primary" />
                <span className="font-medium text-foreground">{location}</span>
              </div>
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => {
                  setLocation("")
                  setLocationMode(null)
                }}
              >
                변경
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Note */}
      <Card className="shadow-lg">
        <CardContent className="p-5">
          <h3 className="font-bold text-foreground mb-2">경험을 기록해주세요</h3>
          <p className="text-sm text-muted-foreground mb-4">어떤 것을 배웠나요? 기억에 남는 순간이 있나요?</p>
          <Textarea
            placeholder="예: 처음으로 도자기를 빚어봤다. 생각보다 어려웠지만 완성했을 때 뿌듯했다. 다음엔 접시도 만들어보고 싶다."
            value={note}
            onChange={(e) => setNote(e.target.value)}
            className="min-h-[120px] resize-none"
          />
          <p className="text-xs text-muted-foreground mt-2 text-right">
            {note.length}자
          </p>
        </CardContent>
      </Card>

      {/* Photo (Optional) */}
      <Card className="shadow-lg">
        <CardContent className="p-5">
          <h3 className="font-bold text-foreground mb-2">사진 추가</h3>
          <p className="text-sm text-muted-foreground mb-4">선택 사항이에요</p>
          <Button variant="outline" className="w-full gap-2 h-24 border-dashed">
            <Camera className="h-5 w-5" />
            사진 업로드
          </Button>
        </CardContent>
      </Card>

      {/* Save Button */}
      <div className="sticky bottom-4 pt-4">
        <Button
          size="lg"
          className={cn(
            "w-full gap-2 shadow-lg",
            canSave 
              ? "bg-accent hover:bg-accent/90 text-accent-foreground" 
              : "bg-muted text-muted-foreground"
          )}
          disabled={!canSave || isSaving}
          onClick={handleSave}
        >
          {isSaving ? (
            <>저장 중...</>
          ) : (
            <>
              <CheckCircle2 className="h-5 w-5" />
              기록 저장하기
            </>
          )}
        </Button>
        {!canSave && (
          <p className="text-center text-xs text-muted-foreground mt-2">
            {isNewRecord ? "탐험 이름, 별점, 기분, 경험을 모두 입력해주세요" : "별점, 기분, 경험을 모두 입력해주세요"}
          </p>
        )}
      </div>
    </div>
  )
}
