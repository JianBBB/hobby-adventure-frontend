"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Compass, X } from "lucide-react"
import { toast } from "sonner"
import { ApiError } from "@/lib/api/client"
import { login, signup } from "@/lib/api/auth"
import { setLoggedInUser } from "@/lib/auth"

type AuthMode = "login" | "signup"

interface AuthScreenProps {
  mode: AuthMode
  onModeChange: (mode: AuthMode) => void
  onClose: () => void
  onSuccess: () => void
}

export function AuthScreen({ mode, onModeChange, onClose, onSuccess }: AuthScreenProps) {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [nickname, setNickname] = useState("")
  const [submitting, setSubmitting] = useState(false)

  const isSignup = mode === "signup"
  const canSubmit = isSignup
    ? email.trim() && password.trim() && nickname.trim()
    : email.trim() && password.trim()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!canSubmit) return

    setSubmitting(true)
    const request = isSignup
      ? signup({ email, password, nickname })
      : login({ email, password })

    request
      .then((user) => {
        setLoggedInUser(user)
        onSuccess()
      })
      .catch((err) => {
        toast.error(err instanceof ApiError ? err.message : "요청 처리 중 오류가 발생했어요.")
      })
      .finally(() => setSubmitting(false))
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/60 backdrop-blur-sm">
      <Card className="relative mx-4 w-full max-w-md shadow-2xl">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 rounded-lg p-2 text-muted-foreground hover:bg-secondary"
        >
          <X className="h-5 w-5" />
        </button>

        <CardContent className="p-8">
          <div className="mb-6 flex flex-col items-center text-center">
            <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-accent to-primary shadow-lg shadow-accent/30">
              <Compass className="h-7 w-7 text-white" />
            </div>
            <h2 className="text-xl font-bold text-foreground">
              {isSignup ? "회원가입" : "로그인"}
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              {isSignup ? "취미 탐험을 시작해보세요" : "다시 오신 걸 환영해요"}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {isSignup && (
              <div className="space-y-1.5">
                <Label htmlFor="nickname">닉네임</Label>
                <Input
                  id="nickname"
                  placeholder="닉네임을 입력하세요"
                  value={nickname}
                  onChange={(e) => setNickname(e.target.value)}
                />
              </div>
            )}
            <div className="space-y-1.5">
              <Label htmlFor="email">이메일</Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="password">비밀번호</Label>
              <Input
                id="password"
                type="password"
                placeholder="비밀번호를 입력하세요"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <Button type="submit" className="w-full" disabled={!canSubmit || submitting}>
              {submitting ? "처리 중..." : isSignup ? "회원가입" : "로그인"}
            </Button>
          </form>

          <p className="mt-5 text-center text-sm text-muted-foreground">
            {isSignup ? (
              <>
                이미 계정이 있으신가요?{" "}
                <button
                  onClick={() => onModeChange("login")}
                  className="font-medium text-primary hover:underline"
                >
                  로그인
                </button>
              </>
            ) : (
              <>
                계정이 없으신가요?{" "}
                <button
                  onClick={() => onModeChange("signup")}
                  className="font-medium text-primary hover:underline"
                >
                  회원가입
                </button>
              </>
            )}
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
