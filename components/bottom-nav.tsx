"use client"

import { Home, Compass, Target, BookOpen, User } from "lucide-react"
import { cn } from "@/lib/utils"

type TabType = "home" | "explore" | "quest" | "record" | "profile"

interface BottomNavProps {
  activeTab: TabType
  onTabChange: (tab: TabType) => void
}

const tabs = [
  { id: "home" as const, icon: Home, label: "Home" },
  { id: "explore" as const, icon: Compass, label: "Explore" },
  { id: "quest" as const, icon: Target, label: "Quest" },
  { id: "record" as const, icon: BookOpen, label: "Record" },
  { id: "profile" as const, icon: User, label: "Profile" },
]

export function BottomNav({ activeTab, onTabChange }: BottomNavProps) {
  return (
    <nav className="absolute bottom-0 left-0 right-0 z-40 flex items-center justify-around border-t border-border bg-card/95 px-2 pb-6 pt-2 backdrop-blur-sm">
      {tabs.map((tab) => {
        const Icon = tab.icon
        const isActive = activeTab === tab.id
        
        return (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={cn(
              "flex flex-col items-center gap-0.5 rounded-xl px-3 py-1.5 transition-all duration-200",
              isActive 
                ? "text-primary" 
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            <div className={cn(
              "flex h-8 w-8 items-center justify-center rounded-xl transition-all duration-200",
              isActive && "bg-primary/15 scale-110"
            )}>
              <Icon className={cn("h-5 w-5", isActive && "stroke-[2.5]")} />
            </div>
            <span className={cn(
              "text-[10px] font-semibold",
              isActive && "text-primary"
            )}>
              {tab.label}
            </span>
          </button>
        )
      })}
    </nav>
  )
}
