"use client"

import { useState } from "react"
import { ArrowLeft, Flame, Trophy, Clock, CheckCircle2, X, Sparkles } from "lucide-react"
import { QuestCard } from "@/components/quest-card"
import { QuestSteps } from "@/components/quest-steps"
import { cn } from "@/lib/utils"

const quests = [
  {
    id: "1",
    title: "Jazz Bar Discovery",
    category: "Nightlife Experience",
    progress: 50,
    totalSteps: 4,
    completedSteps: 2,
    timeEstimate: "30 min",
    status: "IN_PROGRESS" as const,
    steps: [
      { id: "1", title: "Find a jazz bar", description: "Search for highly-rated jazz bars nearby", status: "completed" as const },
      { id: "2", title: "Visit the bar", description: "Go there and enjoy the atmosphere", status: "completed" as const },
      { id: "3", title: "Take a photo", description: "Capture the moment", status: "current" as const },
      { id: "4", title: "Record your feelings", description: "Write down your experience", status: "locked" as const },
    ],
  },
  {
    id: "2",
    title: "Pottery Workshop",
    category: "Creative Arts",
    progress: 25,
    totalSteps: 4,
    completedSteps: 1,
    timeEstimate: "2 hours",
    status: "IN_PROGRESS" as const,
    steps: [
      { id: "1", title: "Book a workshop", description: "Find and book a pottery class", status: "completed" as const },
      { id: "2", title: "Attend the class", description: "Learn the basics", status: "current" as const },
      { id: "3", title: "Create your piece", description: "Make something unique", status: "locked" as const },
      { id: "4", title: "Share your creation", description: "Take photos and reflect", status: "locked" as const },
    ],
  },
  {
    id: "3",
    title: "Rock Climbing",
    category: "Adventure Sports",
    progress: 75,
    totalSteps: 4,
    completedSteps: 3,
    timeEstimate: "15 min",
    status: "IN_PROGRESS" as const,
    steps: [
      { id: "1", title: "Find a climbing gym", status: "completed" as const },
      { id: "2", title: "Get gear rental", status: "completed" as const },
      { id: "3", title: "Complete a route", status: "completed" as const },
      { id: "4", title: "Record achievement", status: "current" as const },
    ],
  },
]

export function QuestScreen() {
  const [selectedQuest, setSelectedQuest] = useState<typeof quests[0] | null>(null)
  const [showCompletion, setShowCompletion] = useState(false)
  const [questSteps, setQuestSteps] = useState(quests)

  const handleStepComplete = (questId: string, stepId: string) => {
    setQuestSteps(prev => prev.map(quest => {
      if (quest.id !== questId) return quest
      
      const stepIndex = quest.steps.findIndex(s => s.id === stepId)
      if (stepIndex === -1 || quest.steps[stepIndex].status !== "current") return quest
      
      const newSteps = quest.steps.map((step, idx) => {
        if (idx === stepIndex) return { ...step, status: "completed" as const }
        if (idx === stepIndex + 1) return { ...step, status: "current" as const }
        return step
      })
      
      const completedCount = newSteps.filter(s => s.status === "completed").length
      const newProgress = (completedCount / quest.totalSteps) * 100
      
      // Check if quest is completed
      if (completedCount === quest.totalSteps) {
        setTimeout(() => setShowCompletion(true), 300)
      }
      
      return {
        ...quest,
        steps: newSteps,
        completedSteps: completedCount,
        progress: newProgress,
      }
    }))
    
    // Update selected quest if viewing
    if (selectedQuest?.id === questId) {
      const updated = questSteps.find(q => q.id === questId)
      if (updated) {
        const stepIndex = updated.steps.findIndex(s => s.id === stepId)
        const newSteps = updated.steps.map((step, idx) => {
          if (idx === stepIndex) return { ...step, status: "completed" as const }
          if (idx === stepIndex + 1) return { ...step, status: "current" as const }
          return step
        })
        const completedCount = newSteps.filter(s => s.status === "completed").length
        setSelectedQuest({
          ...updated,
          steps: newSteps,
          completedSteps: completedCount,
          progress: (completedCount / updated.totalSteps) * 100,
        })
      }
    }
  }

  if (showCompletion) {
    return (
      <div className="flex h-full flex-col items-center justify-center px-5 pt-12">
        <div className="relative mb-6">
          <div className="flex h-32 w-32 items-center justify-center rounded-full bg-gradient-to-br from-primary to-primary/70 shadow-2xl shadow-primary/40">
            <Trophy className="h-16 w-16 text-primary-foreground" />
          </div>
          <div className="absolute -right-2 -top-2 flex h-12 w-12 items-center justify-center rounded-full bg-accent shadow-lg">
            <Sparkles className="h-6 w-6 text-accent-foreground" />
          </div>
        </div>
        
        <h1 className="mb-2 text-center text-2xl font-extrabold text-foreground">Quest Complete!</h1>
        <p className="mb-6 text-center text-muted-foreground">
          Amazing job! You&apos;ve completed the quest.
        </p>
        
        <div className="mb-8 flex items-center gap-6">
          <div className="text-center">
            <div className="mb-1 flex items-center justify-center gap-1">
              <Flame className="h-5 w-5 text-accent" />
              <span className="text-2xl font-bold text-foreground">6</span>
            </div>
            <p className="text-xs text-muted-foreground">Day Streak</p>
          </div>
          <div className="h-10 w-px bg-border" />
          <div className="text-center">
            <div className="mb-1 flex items-center justify-center gap-1">
              <Trophy className="h-5 w-5 text-primary" />
              <span className="text-2xl font-bold text-foreground">12</span>
            </div>
            <p className="text-xs text-muted-foreground">Total Quests</p>
          </div>
        </div>
        
        <button 
          onClick={() => setShowCompletion(false)}
          className="w-full rounded-2xl bg-primary py-4 font-bold text-primary-foreground shadow-lg shadow-primary/30 transition-all hover:bg-primary/90 active:scale-[0.98]"
        >
          Record Your Experience
        </button>
        
        <button 
          onClick={() => {
            setShowCompletion(false)
            setSelectedQuest(null)
          }}
          className="mt-3 font-semibold text-muted-foreground"
        >
          Back to Quests
        </button>
      </div>
    )
  }

  if (selectedQuest) {
    const currentQuest = questSteps.find(q => q.id === selectedQuest.id) || selectedQuest
    
    return (
      <div className="h-full overflow-y-auto pb-24 pt-12">
        {/* Header */}
        <div className="flex items-center gap-3 px-5 py-4">
          <button 
            onClick={() => setSelectedQuest(null)}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-card shadow-sm"
          >
            <ArrowLeft className="h-5 w-5 text-foreground" />
          </button>
          <div className="flex-1">
            <h1 className="text-lg font-extrabold text-foreground">{currentQuest.title}</h1>
            <p className="text-sm text-muted-foreground">{currentQuest.category}</p>
          </div>
          <button className="flex h-10 w-10 items-center justify-center rounded-full bg-card shadow-sm">
            <X className="h-5 w-5 text-muted-foreground" />
          </button>
        </div>

        <div className="space-y-6 px-5">
          {/* Progress Header */}
          <div className="rounded-2xl bg-card p-4 shadow-sm">
            <div className="mb-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-primary" />
                <span className="font-bold text-card-foreground">
                  {currentQuest.completedSteps}/{currentQuest.totalSteps} Steps Complete
                </span>
              </div>
              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                <Clock className="h-4 w-4" />
                {currentQuest.timeEstimate}
              </div>
            </div>
            
            {/* Progress Bar */}
            <div className="h-3 overflow-hidden rounded-full bg-quest-inactive">
              <div 
                className="h-full rounded-full bg-gradient-to-r from-primary to-primary/80 transition-all duration-500"
                style={{ width: `${currentQuest.progress}%` }}
              />
            </div>
          </div>

          {/* Quest Steps */}
          <section>
            <h2 className="mb-4 font-bold text-foreground">Your Journey</h2>
            <QuestSteps 
              steps={currentQuest.steps}
              onStepClick={(stepId) => handleStepComplete(currentQuest.id, stepId)}
            />
          </section>
        </div>
      </div>
    )
  }

  return (
    <div className="h-full overflow-y-auto pb-24 pt-12">
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4">
        <div>
          <h1 className="text-xl font-extrabold text-foreground">My Quests</h1>
          <p className="text-sm text-muted-foreground">Track your adventures</p>
        </div>
        <div className="flex items-center gap-1 rounded-full bg-accent/20 px-3 py-1.5">
          <Flame className="h-4 w-4 text-accent" />
          <span className="text-sm font-bold text-accent">5 Day Streak</span>
        </div>
      </div>

      <div className="space-y-6 px-5">
        {/* Stats Row */}
        <div className="flex gap-3">
          <div className="flex-1 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 p-4">
            <div className="mb-1 flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/20">
                <Trophy className="h-4 w-4 text-primary" />
              </div>
            </div>
            <p className="text-2xl font-extrabold text-foreground">11</p>
            <p className="text-xs text-muted-foreground">Completed</p>
          </div>
          <div className="flex-1 rounded-2xl bg-gradient-to-br from-chart-4/20 to-chart-4/5 p-4">
            <div className="mb-1 flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-chart-4/20">
                <Clock className="h-4 w-4 text-chart-4" />
              </div>
            </div>
            <p className="text-2xl font-extrabold text-foreground">3</p>
            <p className="text-xs text-muted-foreground">In Progress</p>
          </div>
        </div>

        {/* Tab Buttons */}
        <div className="flex gap-2">
          <button className="flex-1 rounded-xl bg-primary py-2.5 text-sm font-semibold text-primary-foreground shadow-md shadow-primary/20">
            In Progress
          </button>
          <button className="flex-1 rounded-xl bg-card py-2.5 text-sm font-semibold text-muted-foreground">
            Completed
          </button>
        </div>

        {/* Quest List */}
        <section>
          <div className="space-y-3">
            {questSteps.map((quest) => (
              <QuestCard
                key={quest.id}
                {...quest}
                onClick={() => setSelectedQuest(quest)}
              />
            ))}
          </div>
        </section>
      </div>
    </div>
  )
}
