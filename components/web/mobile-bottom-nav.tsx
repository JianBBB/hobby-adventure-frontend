"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Home, Compass, FolderHeart, BookOpen } from "lucide-react"
import { useAppNavigation } from "@/lib/app-navigation-context"

const navItems = [
  { path: "/", label: "홈", icon: Home },
  { path: "/explore", label: "탐험", icon: Compass },
  { path: "/my-explorations", label: "내 탐험", icon: FolderHeart },
  { path: "/record", label: "기록", icon: BookOpen },
]

export function MobileBottomNav() {
  const pathname = usePathname()
  const { onCloseOverlays } = useAppNavigation()

  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 flex border-t border-border bg-background pb-[env(safe-area-inset-bottom)] md:hidden">
      {navItems.map((item) => {
        const Icon = item.icon
        const isActive = pathname === item.path
        return (
          <Link
            key={item.path}
            href={item.path}
            onClick={onCloseOverlays}
            className={cn(
              "flex flex-1 flex-col items-center gap-1 py-2.5 text-xs font-medium",
              isActive ? "text-primary" : "text-muted-foreground"
            )}
          >
            <Icon className="h-5 w-5" />
            {item.label}
          </Link>
        )
      })}
    </nav>
  )
}
