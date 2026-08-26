"use client"

import { Shuffle, Bell, ChevronRight } from "lucide-react"
import { QuestCard } from "@/components/quest-card"
import { RecordCard } from "@/components/record-card"

interface HomeScreenProps {
  onNavigate: (tab: "quest" | "record" | "explore") => void
}

export function HomeScreen({ onNavigate }: HomeScreenProps) {
  return (
    <div className="h-full overflow-y-auto pb-24 pt-12">
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4">
        <div>
          <p className="text-sm text-muted-foreground">Good morning!</p>
          <h1 className="text-xl font-extrabold text-foreground">Ready to explore?</h1>
        </div>
        <button className="relative flex h-10 w-10 items-center justify-center rounded-full bg-card shadow-sm">
          <Bell className="h-5 w-5 text-foreground" />
          <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-destructive text-[9px] font-bold text-destructive-foreground">
            2
          </span>
        </button>
      </div>

      <div className="space-y-6 px-5">
        {/* Today's Quest - Featured */}
        <section>
          <QuestCard
            variant="featured"
            title="Jazz Bar Discovery"
            category="Nightlife Experience"
            progress={50}
            totalSteps={4}
            completedSteps={2}
            timeEstimate="30 min"
            streak={5}
            onClick={() => onNavigate("quest")}
          />
        </section>

        {/* Random Hobby Button */}
        <section>
          <button 
            onClick={() => onNavigate("explore")}
            className="group flex w-full items-center justify-between rounded-2xl bg-gradient-to-r from-accent to-accent/80 p-4 shadow-md transition-all hover:shadow-lg active:scale-[0.98]"
          >
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/20">
                <Shuffle className="h-6 w-6 text-accent-foreground" />
              </div>
              <div className="text-left">
                <h3 className="font-bold text-accent-foreground">Random Hobby</h3>
                <p className="text-sm text-accent-foreground/70">Try something unexpected!</p>
              </div>
            </div>
            <ChevronRight className="h-5 w-5 text-accent-foreground transition-transform group-hover:translate-x-1" />
          </button>
        </section>

        {/* In Progress Quests */}
        <section>
          <div className="mb-3 flex items-center justify-between">
            <h2 className="font-bold text-foreground">In Progress</h2>
            <button 
              onClick={() => onNavigate("quest")}
              className="text-sm font-semibold text-primary"
            >
              See all
            </button>
          </div>
          <div className="space-y-3">
            <QuestCard
              variant="compact"
              title="Pottery Workshop"
              category="Creative Arts"
              progress={25}
              totalSteps={4}
              completedSteps={1}
              onClick={() => onNavigate("quest")}
            />
            <QuestCard
              variant="compact"
              title="Rock Climbing"
              category="Adventure Sports"
              progress={75}
              totalSteps={4}
              completedSteps={3}
              onClick={() => onNavigate("quest")}
            />
          </div>
        </section>

        {/* Recent Records */}
        <section>
          <div className="mb-3 flex items-center justify-between">
            <h2 className="font-bold text-foreground">Recent Records</h2>
            <button 
              onClick={() => onNavigate("record")}
              className="text-sm font-semibold text-primary"
            >
              See all
            </button>
          </div>
          <RecordCard
            title="Coffee Brewing"
            date="Mar 5, 2026"
            rating={4}
            emotion="proud"
            note="Made my first pour-over coffee. The taste was amazing!"
            image="https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=400&h=300&fit=crop"
            onClick={() => onNavigate("record")}
          />
        </section>
      </div>
    </div>
  )
}
