"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { RecordDetail } from "@/components/web/record-detail"
import { 
  Plus, 
  Calendar,
  MapPin,
  ChevronRight,
  ChevronDown
} from "lucide-react"
import { cn } from "@/lib/utils"

const records = [
  {
    hobbyName: "도자기 공예",
    date: "2026년 3월 8일",
    dateShort: "3월 8일",
    year: 2026,
    month: 3,
    day: 8,
    rating: 5,
    emotion: "뿌듯",
    note: "처음으로 컵을 만들었다! 생각보다 어려웠지만 완성했을 때 정말 뿌듯했다.",
    hasPhoto: true,
    category: "공예",
    location: "이태원 도자기 공방",
    icon: "🏺",
  },
  {
    hobbyName: "클라이밍",
    date: "2026년 3월 5일",
    dateShort: "3월 5일",
    year: 2026,
    month: 3,
    day: 5,
    rating: 4,
    emotion: "신남",
    note: "5단계 코스를 드디어 클리어! 다음엔 6단계 도전해봐야겠다.",
    hasPhoto: true,
    category: "스포츠",
    location: "강남 클라이밍센터",
    icon: "🧗",
  },
  {
    hobbyName: "재즈바 탐방",
    date: "2026년 3월 2일",
    dateShort: "3월 2일",
    year: 2026,
    month: 3,
    day: 2,
    rating: 5,
    emotion: "평온",
    note: "홍대 근처 재즈바에서 라이브 공연을 들었다. 분위기가 너무 좋았다.",
    hasPhoto: false,
    category: "문화",
    location: "홍대 재즈클럽",
    icon: "🎷",
  },
  {
    hobbyName: "홈 베이킹",
    date: "2026년 2월 28일",
    dateShort: "2월 28일",
    year: 2026,
    month: 2,
    day: 28,
    rating: 3,
    emotion: "아쉬움",
    note: "첫 번째 시도는 실패... 빵이 부풀지 않았다.",
    hasPhoto: true,
    category: "요리",
    location: "집",
    icon: "🍞",
  },
  {
    hobbyName: "별자리 관측",
    date: "2026년 2월 25일",
    dateShort: "2월 25일",
    year: 2026,
    month: 2,
    day: 25,
    rating: 4,
    emotion: "평온",
    note: "오리온자리, 큰곰자리, 카시오페이아를 찾았다!",
    hasPhoto: false,
    category: "자연",
    location: "북한산 정상",
    icon: "⭐",
  },
]

// Generate heatmap data for 2026
const generateHeatmapData = () => {
  const data: { date: string; count: number }[] = []
  const startDate = new Date(2026, 0, 1)
  const endDate = new Date(2026, 2, 31) // Up to March
  
  for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
    const dateStr = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
    const recordsOnDay = records.filter(r => 
      r.year === d.getFullYear() && 
      r.month === d.getMonth() + 1 && 
      r.day === d.getDate()
    ).length
    data.push({ date: dateStr, count: recordsOnDay })
  }
  return data
}

const heatmapData = generateHeatmapData()

// Group records by year and month
const archiveData = records.reduce((acc, record) => {
  const yearKey = record.year.toString()
  const monthKey = `${record.month}월`
  
  if (!acc[yearKey]) acc[yearKey] = {}
  if (!acc[yearKey][monthKey]) acc[yearKey][monthKey] = []
  acc[yearKey][monthKey].push(record)
  
  return acc
}, {} as Record<string, Record<string, typeof records>>)

// Activity Heatmap Component
function ActivityHeatmap() {
  const weeks: { date: string; count: number }[][] = []
  let currentWeek: { date: string; count: number }[] = []
  
  // Start from first Sunday
  const firstDay = new Date(2026, 0, 1).getDay()
  for (let i = 0; i < firstDay; i++) {
    currentWeek.push({ date: '', count: -1 })
  }
  
  heatmapData.forEach((day, index) => {
    currentWeek.push(day)
    if (currentWeek.length === 7) {
      weeks.push(currentWeek)
      currentWeek = []
    }
  })
  
  if (currentWeek.length > 0) {
    while (currentWeek.length < 7) {
      currentWeek.push({ date: '', count: -1 })
    }
    weeks.push(currentWeek)
  }

  const getColor = (count: number) => {
    if (count === -1) return 'bg-transparent'
    if (count === 0) return 'bg-muted'
    if (count === 1) return 'bg-primary/40'
    if (count === 2) return 'bg-primary/60'
    return 'bg-primary'
  }

  const months = ['1월', '2월', '3월']

  return (
    <Card className="shadow-lg">
      <CardContent className="p-4">
        <div className="mb-4">
          <h3 className="font-bold text-foreground">2026년 탐험 활동</h3>
          <p className="text-sm text-muted-foreground mt-1">지금까지 {records.length}개의 탐험을 기록했어요</p>
        </div>
        <div className="overflow-x-auto">
          <div className="flex gap-1">
            {/* Day labels */}
            <div className="flex flex-col gap-1 text-xs text-muted-foreground pr-2">
              <span className="h-3">월</span>
              <span className="h-3"></span>
              <span className="h-3">수</span>
              <span className="h-3"></span>
              <span className="h-3">금</span>
              <span className="h-3"></span>
              <span className="h-3">일</span>
            </div>
            {/* Weeks */}
            <div className="flex gap-1">
              {weeks.map((week, weekIndex) => (
                <div key={weekIndex} className="flex flex-col gap-1">
                  {week.map((day, dayIndex) => (
                    <div
                      key={dayIndex}
                      className={cn(
                        "w-3 h-3 rounded-sm transition-colors",
                        getColor(day.count),
                        day.count > 0 && "cursor-pointer hover:ring-2 hover:ring-primary/50"
                      )}
                      title={day.date && day.count >= 0 ? `${day.date}: ${day.count}개 탐험` : ''}
                    />
                  ))}
                </div>
              ))}
            </div>
          </div>
          {/* Month labels */}
          <div className="flex gap-1 mt-2 ml-6">
            {months.map((month, i) => (
              <span key={i} className="text-xs text-muted-foreground" style={{ width: `${100/3}%` }}>
                {month}
              </span>
            ))}
          </div>
        </div>
        <div className="flex items-center justify-end gap-2 mt-3 text-xs text-muted-foreground">
          <span>적음</span>
          <div className="flex gap-1">
            <div className="w-3 h-3 rounded-sm bg-muted" />
            <div className="w-3 h-3 rounded-sm bg-primary/40" />
            <div className="w-3 h-3 rounded-sm bg-primary/60" />
            <div className="w-3 h-3 rounded-sm bg-primary" />
          </div>
          <span>많음</span>
        </div>
      </CardContent>
    </Card>
  )
}

interface WriteRecordData {
  explorationId: string
  explorationName: string
  explorationIcon: string
  explorationCategory: string
  isNewRecord: boolean
}

interface RecordScreenProps {
  onNewRecord?: (data: WriteRecordData) => void
}

export function RecordScreen({ onNewRecord }: RecordScreenProps) {
  const [selectedRecordIndex, setSelectedRecordIndex] = useState<number | null>(null)
  const [expandedYears, setExpandedYears] = useState<Record<string, boolean>>({ '2026': true })
  const [selectedMonth, setSelectedMonth] = useState<string | null>('2026-3')

  const handleNewRecord = () => {
    if (onNewRecord) {
      onNewRecord({
        explorationId: "",
        explorationName: "",
        explorationIcon: "",
        explorationCategory: "",
        isNewRecord: true
      })
    }
  }

  const handlePrevRecord = () => {
    if (selectedRecordIndex !== null && selectedRecordIndex > 0) {
      setSelectedRecordIndex(selectedRecordIndex - 1)
    }
  }

  const handleNextRecord = () => {
    if (selectedRecordIndex !== null && selectedRecordIndex < records.length - 1) {
      setSelectedRecordIndex(selectedRecordIndex + 1)
    }
  }

  const toggleYear = (year: string) => {
    setExpandedYears(prev => ({ ...prev, [year]: !prev[year] }))
  }

  const selectMonth = (year: string, month: string) => {
    setSelectedMonth(`${year}-${month.replace('월', '')}`)
  }

  const getSelectedRecords = () => {
    if (!selectedMonth) return []
    const [year, month] = selectedMonth.split('-')
    return archiveData[year]?.[`${month}월`] || []
  }

  return (
    <div className="space-y-6">
      {/* Record Detail Modal */}
      {selectedRecordIndex !== null && (
        <RecordDetail
          record={records[selectedRecordIndex]}
          onClose={() => setSelectedRecordIndex(null)}
          onPrev={handlePrevRecord}
          onNext={handleNextRecord}
          hasPrev={selectedRecordIndex > 0}
          hasNext={selectedRecordIndex < records.length - 1}
        />
      )}

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">탐험 기록</h1>
          <p className="text-muted-foreground">시간으로 기록된 탐험 아카이브</p>
        </div>
        <Button className="gap-2" onClick={handleNewRecord}>
          <Plus className="h-4 w-4" />
          새 기록
        </Button>
      </div>

      {/* Activity Heatmap */}
      <ActivityHeatmap />

      

      {/* Archive Layout */}
      <div className="grid gap-6 lg:grid-cols-4">
        {/* Year/Month Navigation */}
        <div className="lg:col-span-1">
          <Card className="shadow-lg">
            <CardContent className="p-4">
              <h3 className="font-bold text-foreground mb-4 flex items-center gap-2">
                <Calendar className="h-4 w-4 text-primary" />
                기록 아카이브
              </h3>
              <div className="space-y-2">
                {Object.entries(archiveData).sort((a, b) => Number(b[0]) - Number(a[0])).map(([year, months]) => (
                  <div key={year}>
                    <button
                      onClick={() => toggleYear(year)}
                      className="w-full flex items-center justify-between px-3 py-2 rounded-lg hover:bg-muted transition-colors font-semibold text-foreground"
                    >
                      <span>{year}년</span>
                      <ChevronDown className={cn(
                        "h-4 w-4 transition-transform",
                        expandedYears[year] && "rotate-180"
                      )} />
                    </button>
                    {expandedYears[year] && (
                      <div className="ml-2 mt-1 space-y-1">
                        {Object.entries(months).sort((a, b) => {
                          const monthA = parseInt(a[0])
                          const monthB = parseInt(b[0])
                          return monthB - monthA
                        }).map(([month, monthRecords]) => (
                          <button
                            key={month}
                            onClick={() => selectMonth(year, month)}
                            className={cn(
                              "w-full flex items-center justify-between px-3 py-2 rounded-lg transition-colors text-sm",
                              selectedMonth === `${year}-${month.replace('월', '')}`
                                ? "bg-primary/10 text-primary font-medium"
                                : "hover:bg-muted text-muted-foreground"
                            )}
                          >
                            <span>{month}</span>
                            <span className="text-xs bg-secondary px-2 py-0.5 rounded-full">
                              {monthRecords.length}
                            </span>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Month Records */}
        <div className="lg:col-span-3">
          <Card className="shadow-lg">
            <CardContent className="p-4">
              {selectedMonth && (
                <>
                  <h3 className="font-bold text-foreground mb-4">
                    {selectedMonth.split('-')[0]}년 {selectedMonth.split('-')[1]}월 기록
                  </h3>
                  <div className="space-y-3">
                    {getSelectedRecords().map((record, index) => (
                      <button
                        key={index}
                        onClick={() => setSelectedRecordIndex(records.indexOf(record))}
                        className="w-full flex items-center gap-4 p-4 rounded-xl border border-border hover:border-primary/30 hover:bg-muted/30 transition-all text-left"
                      >
                        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-2xl shrink-0">
                          {record.icon}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-xs text-primary font-medium">{record.category}</span>
                            <span className="text-xs text-muted-foreground">{record.dateShort}</span>
                          </div>
                          <h4 className="font-semibold text-foreground">{record.hobbyName}</h4>
                          <p className="text-sm text-muted-foreground flex items-center gap-1 mt-1">
                            <MapPin className="h-3 w-3" />
                            {record.location}
                          </p>
                          <p className="text-sm text-foreground/70 mt-1.5 line-clamp-1">
                            {record.note}
                          </p>
                        </div>
                        <ChevronRight className="h-5 w-5 text-muted-foreground shrink-0" />
                      </button>
                    ))}
                    {getSelectedRecords().length === 0 && (
                      <div className="text-center py-8 text-muted-foreground">
                        이 달의 기록이 없습니다.
                      </div>
                    )}
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
