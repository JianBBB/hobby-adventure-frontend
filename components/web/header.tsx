"use client"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Bell, Settings, LogOut, User, ChevronDown } from "lucide-react"

interface HeaderProps {
  isLoggedIn: boolean
  onLogin: () => void
  onLogout: () => void
}

export function Header({ isLoggedIn, onLogin, onLogout }: HeaderProps) {
  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-end gap-4 border-b border-border bg-background/95 backdrop-blur px-8">
      {isLoggedIn ? (
        <>
          {/* Notifications */}
          <Button variant="ghost" size="icon" className="relative">
            <Bell className="h-5 w-5 text-muted-foreground" />
            <span className="absolute top-1.5 right-1.5 flex h-2 w-2 rounded-full bg-accent" />
          </Button>

          {/* Settings */}
          <Button variant="ghost" size="icon">
            <Settings className="h-5 w-5 text-muted-foreground" />
          </Button>

          {/* Account Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="gap-2 pl-2 pr-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground text-sm font-bold">
                  김
                </div>
                <ChevronDown className="h-4 w-4 text-muted-foreground" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem className="gap-2">
                <User className="h-4 w-4" />
                내 프로필
              </DropdownMenuItem>
              <DropdownMenuItem className="gap-2">
                <Settings className="h-4 w-4" />
                설정
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="gap-2 text-destructive" onClick={onLogout}>
                <LogOut className="h-4 w-4" />
                로그아웃
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </>
      ) : (
        <>
          <Button variant="ghost" onClick={onLogin}>
            로그인
          </Button>
          <Button onClick={onLogin}>
            회원가입
          </Button>
        </>
      )}
    </header>
  )
}
