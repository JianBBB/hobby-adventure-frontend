"use client"

import { cn } from "@/lib/utils"
import { 
  Home, 
  Compass, 
  FolderHeart,
  BookOpen, 
  Flame,
  Sparkles,
  Zap,
  Star,
  Map,
  ChevronRight
} from "lucide-react"

interface SidebarProps {
  activeTab: string
  onTabChange: (tab: string) => void
}

const navItems = [
  { id: "home", label: "홈", icon: Home },
  { id: "explore", label: "탐험", icon: Compass },
  { id: "my-explorations", label: "내 탐험", icon: FolderHeart, badge: 3 },
  { id: "map", label: "탐험 지도", icon: Map },
  { id: "record", label: "탐험 기록", icon: BookOpen },
]

export function Sidebar({ activeTab, onTabChange }: SidebarProps) {
  return (
    <aside className="fixed left-0 top-0 z-40 flex h-screen w-64 flex-col bg-sidebar text-sidebar-foreground">
      {/* Logo */}
      <div className="flex items-center gap-3 border-b border-sidebar-border px-6 py-5">
        <div className="relative">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-accent to-primary shadow-lg shadow-accent/30">
            <Compass className="h-7 w-7 text-white" />
          </div>
          <Sparkles className="absolute -top-1 -right-1 h-4 w-4 text-highlight animate-pulse" />
        </div>
        <div>
          <h1 className="text-lg font-bold text-sidebar-foreground">취미 탐험</h1>
          <p className="text-xs text-accent font-medium">발자취를 남겨요</p>
        </div>
      </div>

      {/* Explorer Card - Clickable to Profile */}
      <div className="border-b border-sidebar-border px-4 py-5">
        <button
          onClick={() => onTabChange("profile")}
          className="w-full rounded-2xl bg-gradient-to-br from-sidebar-accent/80 to-sidebar-accent/40 p-4 border border-sidebar-border hover:border-primary/30 transition-all group cursor-pointer text-left"
        >
          {/* User Avatar & Level */}
          <div className="flex items-center gap-4 mb-4">
            <div className="relative">
              <div className="h-14 w-14 rounded-full bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center ring-4 ring-primary/30 shadow-lg shadow-primary/20 group-hover:ring-primary/50 transition-all">
                <span className="text-lg font-bold text-primary-foreground">Lv.5</span>
              </div>
              <div className="absolute -bottom-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full bg-highlight text-highlight-foreground shadow-lg">
                <Star className="h-3.5 w-3.5" />
              </div>
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <p className="font-bold text-sidebar-foreground text-base">탐험가 김하늘</p>
                <ChevronRight className="h-4 w-4 text-sidebar-foreground/40 group-hover:text-primary group-hover:translate-x-0.5 transition-all" />
              </div>
              <p className="text-xs text-sidebar-foreground/60 mt-0.5">견습 탐험가</p>
            </div>
          </div>

          {/* XP Progress Bar */}
          <div className="mb-3">
            <div className="flex items-center justify-between mb-1.5">
              <div className="flex items-center gap-1.5">
                <Zap className="h-3.5 w-3.5 text-primary" />
                <span className="text-xs font-medium text-sidebar-foreground/70">경험치</span>
              </div>
              <span className="text-xs font-bold text-primary">320 / 500 XP</span>
            </div>
            <div className="h-2 w-full overflow-hidden rounded-full bg-sidebar-border/50">
              <div 
                className="h-full rounded-full bg-gradient-to-r from-primary to-primary/80"
                style={{ width: "64%" }}
              />
            </div>
          </div>

          {/* Streak */}
          <div className="flex items-center justify-between rounded-lg bg-accent/10 px-3 py-2">
            <div className="flex items-center gap-2">
              <Flame className="h-4 w-4 text-accent" />
              <span className="text-xs text-sidebar-foreground/70">연속 탐험</span>
            </div>
            <span className="text-sm font-bold text-accent">7일</span>
          </div>
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4">
        <ul className="space-y-1.5">
          {navItems.map((item) => {
            const Icon = item.icon
            const isActive = activeTab === item.id
            return (
              <li key={item.id}>
                <button
                  onClick={() => onTabChange(item.id)}
                  className={cn(
                    "flex w-full items-center gap-3 rounded-xl px-4 py-3.5 text-sm font-medium transition-all duration-200",
                    isActive
                      ? "bg-gradient-to-r from-accent to-accent/80 text-accent-foreground shadow-lg shadow-accent/20"
                      : "text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-foreground"
                  )}
                >
                  <Icon className="h-5 w-5" />
                  <span>{item.label}</span>
                  {item.badge && (
                    <span className={cn(
                      "ml-auto flex h-6 min-w-6 items-center justify-center rounded-full px-2 text-xs font-bold",
                      isActive 
                        ? "bg-accent-foreground/20 text-accent-foreground" 
                        : "bg-accent/20 text-accent"
                    )}>
                      {item.badge}
                    </span>
                  )}
                </button>
              </li>
            )
          })}
        </ul>
      </nav>

      {/* Quick Stats */}
      <div className="border-t border-sidebar-border px-4 py-4">
        <div className="grid grid-cols-2 gap-2">
          <div className="rounded-xl bg-sidebar-accent/50 p-3 text-center">
            <p className="text-lg font-bold text-sidebar-foreground">12</p>
            <p className="text-xs text-sidebar-foreground/60">탐험 완료</p>
          </div>
          <div className="rounded-xl bg-sidebar-accent/50 p-3 text-center">
            <p className="text-lg font-bold text-highlight">5</p>
            <p className="text-xs text-sidebar-foreground/60">탐험 장소</p>
          </div>
        </div>
      </div>
    </aside>
  )
}
