"use client"

import type { LucideIcon } from "lucide-react"
import { cn } from "@/lib/utils"

interface StatCardProps {
  icon: LucideIcon
  label: string
  value: string | number
  subtext?: string
  color?: "primary" | "accent" | "chart-1" | "chart-2" | "chart-4"
}

export function StatCard({ icon: Icon, label, value, subtext, color = "primary" }: StatCardProps) {
  const colorClasses = {
    primary: "bg-primary/15 text-primary",
    accent: "bg-accent/15 text-accent",
    "chart-1": "bg-chart-1/15 text-chart-1",
    "chart-2": "bg-chart-2/15 text-chart-2",
    "chart-4": "bg-chart-4/15 text-chart-4",
  }

  return (
    <div className="flex flex-col items-center gap-2 rounded-2xl bg-card p-4 shadow-sm">
      <div className={cn("flex h-12 w-12 items-center justify-center rounded-xl", colorClasses[color])}>
        <Icon className="h-6 w-6" />
      </div>
      <div className="text-center">
        <p className="text-2xl font-extrabold text-card-foreground">{value}</p>
        <p className="text-xs font-medium text-muted-foreground">{label}</p>
        {subtext && (
          <p className="mt-0.5 text-[10px] text-muted-foreground/70">{subtext}</p>
        )}
      </div>
    </div>
  )
}
