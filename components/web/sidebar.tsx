"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import {
  Home,
  Compass,
  FolderHeart,
  BookOpen,
  Sparkles,
  ChevronRight
} from "lucide-react"
import { getLoggedInUser, type LoggedInUser } from "@/lib/auth"
import { getMyExplorations } from "@/lib/api/myExplorations"

const navItems = [
  { path: "/", label: "홈", icon: Home },
  { path: "/explore", label: "탐험", icon: Compass },
  { path: "/my-explorations", label: "내 탐험", icon: FolderHeart },
  { path: "/record", label: "탐험 기록", icon: BookOpen },
]

export function Sidebar() {
  const pathname = usePathname()
  const [user, setUser] = useState<LoggedInUser | null>(null)
  const [startedCount, setStartedCount] = useState(0)
  const [completedCount, setCompletedCount] = useState(0)

  useEffect(() => {
    const loggedInUser = getLoggedInUser()
    setUser(loggedInUser)
    if (!loggedInUser) return

    getMyExplorations({ status: "STARTED", page: 1, size: 1 })
      .then(({ meta }) => setStartedCount(meta.totalElements))
      .catch(() => {})
    getMyExplorations({ status: "COMPLETED", page: 1, size: 1 })
      .then(({ meta }) => setCompletedCount(meta.totalElements))
      .catch(() => {})
  }, [pathname])

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
        <Link
          href="/profile"
          className="block w-full rounded-2xl bg-gradient-to-br from-sidebar-accent/80 to-sidebar-accent/40 p-4 border border-sidebar-border hover:border-primary/30 transition-all group cursor-pointer text-left"
        >
          {/* User Avatar */}
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-primary to-primary/70 ring-4 ring-primary/30 shadow-lg shadow-primary/20 group-hover:ring-primary/50 transition-all">
              <Compass className="h-6 w-6 text-primary-foreground" />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <p className="font-bold text-sidebar-foreground text-base">
                  {user ? user.nickname : "게스트"}
                </p>
                <ChevronRight className="h-4 w-4 text-sidebar-foreground/40 group-hover:text-primary group-hover:translate-x-0.5 transition-all" />
              </div>
              <p className="text-xs text-sidebar-foreground/60 mt-0.5">
                {user ? "탐험가" : "로그인이 필요해요"}
              </p>
            </div>
          </div>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4">
        <ul className="space-y-1.5">
          {navItems.map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.path
            return (
              <li key={item.path}>
                <Link
                  href={item.path}
                  className={cn(
                    "flex w-full items-center gap-3 rounded-xl px-4 py-3.5 text-sm font-medium transition-all duration-200",
                    isActive
                      ? "bg-gradient-to-r from-accent to-accent/80 text-accent-foreground shadow-lg shadow-accent/20"
                      : "text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-foreground"
                  )}
                >
                  <Icon className="h-5 w-5" />
                  <span>{item.label}</span>
                  {item.path === "/my-explorations" && startedCount > 0 && (
                    <span className={cn(
                      "ml-auto flex h-6 min-w-6 items-center justify-center rounded-full px-2 text-xs font-bold",
                      isActive
                        ? "bg-accent-foreground/20 text-accent-foreground"
                        : "bg-accent/20 text-accent"
                    )}>
                      {startedCount}
                    </span>
                  )}
                </Link>
              </li>
            )
          })}
        </ul>
      </nav>

      {/* Quick Stats */}
      <div className="border-t border-sidebar-border px-4 py-4">
        <div className="rounded-xl bg-sidebar-accent/50 p-3 text-center">
          <p className="text-lg font-bold text-sidebar-foreground">{completedCount}</p>
          <p className="text-xs text-sidebar-foreground/60">완료한 탐험</p>
        </div>
      </div>
    </aside>
  )
}
