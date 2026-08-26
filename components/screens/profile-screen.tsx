"use client"

import { Settings, Trophy, BookOpen, Flame, Target, ChevronRight, Medal } from "lucide-react"
import { StatCard } from "@/components/stat-card"

const achievements = [
  { id: "1", title: "First Quest", description: "Complete your first quest", icon: "🎯", unlocked: true },
  { id: "2", title: "Explorer", description: "Try 5 different hobbies", icon: "🧭", unlocked: true },
  { id: "3", title: "Streak Master", description: "Maintain a 7-day streak", icon: "🔥", unlocked: true },
  { id: "4", title: "Adventurer", description: "Complete 10 quests", icon: "⭐", unlocked: true },
  { id: "5", title: "Hobbyist Pro", description: "Complete 25 quests", icon: "🏆", unlocked: false },
  { id: "6", title: "Legend", description: "Complete 50 quests", icon: "👑", unlocked: false },
]

const recentHobbies = [
  { id: "1", name: "Jazz Bars", icon: "🎷", count: 3 },
  { id: "2", name: "Coffee", icon: "☕", count: 5 },
  { id: "3", name: "Climbing", icon: "🧗", count: 2 },
  { id: "4", name: "Pottery", icon: "🏺", count: 1 },
]

export function ProfileScreen() {
  return (
    <div className="h-full overflow-y-auto pb-24 pt-12">
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4">
        <h1 className="text-xl font-extrabold text-foreground">Profile</h1>
        <button className="flex h-10 w-10 items-center justify-center rounded-full bg-card shadow-sm">
          <Settings className="h-5 w-5 text-foreground" />
        </button>
      </div>

      <div className="space-y-6 px-5">
        {/* Profile Card */}
        <div className="flex flex-col items-center rounded-3xl bg-gradient-to-br from-primary/10 via-transparent to-accent/10 p-6">
          <div className="relative mb-3">
            <div className="h-20 w-20 overflow-hidden rounded-full bg-gradient-to-br from-primary to-primary/70 shadow-lg">
              <img
                src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&h=200&fit=crop"
                alt="Profile"
                className="h-full w-full object-cover"
              />
            </div>
            <div className="absolute -bottom-1 -right-1 flex h-8 w-8 items-center justify-center rounded-full bg-accent shadow-md">
              <span className="text-sm">🔥</span>
            </div>
          </div>
          <h2 className="text-lg font-bold text-foreground">Alex Kim</h2>
          <p className="text-sm text-muted-foreground">Hobby Explorer since Feb 2026</p>
          
          {/* Level Progress */}
          <div className="mt-4 w-full">
            <div className="mb-1 flex items-center justify-between text-xs">
              <span className="font-semibold text-foreground">Level 8</span>
              <span className="text-muted-foreground">320/500 XP</span>
            </div>
            <div className="h-2.5 overflow-hidden rounded-full bg-muted">
              <div 
                className="h-full rounded-full bg-gradient-to-r from-primary to-accent"
                style={{ width: "64%" }}
              />
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-3 gap-3">
          <StatCard
            icon={Trophy}
            label="Quests Done"
            value={11}
            color="primary"
          />
          <StatCard
            icon={BookOpen}
            label="Records"
            value={24}
            color="chart-4"
          />
          <StatCard
            icon={Flame}
            label="Best Streak"
            value={12}
            color="accent"
          />
        </div>

        {/* Activity Summary */}
        <section>
          <div className="mb-3 flex items-center justify-between">
            <h2 className="font-bold text-foreground">Activity Summary</h2>
            <button className="text-sm font-semibold text-primary">This Week</button>
          </div>
          <div className="rounded-2xl bg-card p-4 shadow-sm">
            <div className="flex items-center justify-between">
              {["M", "T", "W", "T", "F", "S", "S"].map((day, i) => (
                <div key={i} className="flex flex-col items-center gap-2">
                  <div className={`h-16 w-6 overflow-hidden rounded-full ${i < 5 ? "bg-primary/20" : "bg-muted"}`}>
                    <div 
                      className={`w-full rounded-full bg-gradient-to-t from-primary to-primary/70`}
                      style={{ 
                        height: i < 5 ? `${[80, 60, 100, 40, 70][i]}%` : "0%",
                        marginTop: i < 5 ? `${100 - [80, 60, 100, 40, 70][i]}%` : "100%"
                      }}
                    />
                  </div>
                  <span className="text-xs text-muted-foreground">{day}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Favorite Hobbies */}
        <section>
          <h2 className="mb-3 font-bold text-foreground">Your Hobbies</h2>
          <div className="flex gap-2 overflow-x-auto pb-2">
            {recentHobbies.map((hobby) => (
              <div
                key={hobby.id}
                className="flex shrink-0 flex-col items-center rounded-2xl bg-card p-3 shadow-sm"
              >
                <span className="mb-1 text-2xl">{hobby.icon}</span>
                <span className="text-xs font-medium text-foreground">{hobby.name}</span>
                <span className="text-[10px] text-muted-foreground">{hobby.count} times</span>
              </div>
            ))}
          </div>
        </section>

        {/* Achievements */}
        <section>
          <div className="mb-3 flex items-center justify-between">
            <h2 className="font-bold text-foreground">Achievements</h2>
            <button className="flex items-center gap-1 text-sm font-semibold text-primary">
              <Medal className="h-4 w-4" />
              4/6
            </button>
          </div>
          <div className="grid grid-cols-3 gap-2">
            {achievements.map((achievement) => (
              <div
                key={achievement.id}
                className={`flex flex-col items-center rounded-2xl p-3 ${
                  achievement.unlocked
                    ? "bg-card shadow-sm"
                    : "bg-muted/50 opacity-50"
                }`}
              >
                <span className="mb-1 text-2xl">{achievement.icon}</span>
                <span className="text-center text-[10px] font-semibold text-foreground">
                  {achievement.title}
                </span>
              </div>
            ))}
          </div>
        </section>

        {/* Settings Links */}
        <section className="space-y-2 pb-4">
          {[
            { label: "Account Settings", icon: Settings },
            { label: "Notifications", icon: Target },
          ].map((item) => (
            <button
              key={item.label}
              className="flex w-full items-center justify-between rounded-xl bg-card p-4 shadow-sm transition-all hover:bg-muted"
            >
              <div className="flex items-center gap-3">
                <item.icon className="h-5 w-5 text-muted-foreground" />
                <span className="font-medium text-foreground">{item.label}</span>
              </div>
              <ChevronRight className="h-5 w-5 text-muted-foreground" />
            </button>
          ))}
        </section>
      </div>
    </div>
  )
}
