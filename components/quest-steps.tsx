"use client"

import { Check, Circle, Lock } from "lucide-react"
import { cn } from "@/lib/utils"

interface Step {
  id: string
  title: string
  description?: string
  status: "completed" | "current" | "locked"
}

interface QuestStepsProps {
  steps: Step[]
  onStepClick?: (stepId: string) => void
}

export function QuestSteps({ steps, onStepClick }: QuestStepsProps) {
  return (
    <div className="relative space-y-0">
      {steps.map((step, index) => {
        const isLast = index === steps.length - 1
        
        return (
          <div key={step.id} className="relative flex gap-3">
            {/* Connector line */}
            {!isLast && (
              <div 
                className={cn(
                  "absolute left-[15px] top-10 h-[calc(100%-8px)] w-0.5",
                  step.status === "completed" ? "bg-primary" : "bg-border"
                )}
              />
            )}
            
            {/* Step indicator */}
            <button
              onClick={() => step.status !== "locked" && onStepClick?.(step.id)}
              disabled={step.status === "locked"}
              className={cn(
                "relative z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full transition-all",
                step.status === "completed" && "bg-primary text-primary-foreground shadow-md shadow-primary/30",
                step.status === "current" && "border-[3px] border-primary bg-card text-primary shadow-md shadow-primary/20 scale-110",
                step.status === "locked" && "border-2 border-border bg-muted text-muted-foreground"
              )}
            >
              {step.status === "completed" ? (
                <Check className="h-4 w-4 stroke-[3]" />
              ) : step.status === "current" ? (
                <Circle className="h-3 w-3 fill-primary text-primary" />
              ) : (
                <Lock className="h-3.5 w-3.5" />
              )}
            </button>
            
            {/* Step content */}
            <button
              onClick={() => step.status !== "locked" && onStepClick?.(step.id)}
              disabled={step.status === "locked"}
              className={cn(
                "flex-1 pb-6 text-left transition-all",
                step.status === "locked" && "opacity-50"
              )}
            >
              <div className={cn(
                "rounded-2xl p-3 transition-all",
                step.status === "current" && "bg-primary/10",
                step.status !== "locked" && "hover:bg-muted"
              )}>
                <h4 className={cn(
                  "font-bold",
                  step.status === "completed" && "text-muted-foreground line-through",
                  step.status === "current" && "text-primary",
                  step.status === "locked" && "text-muted-foreground"
                )}>
                  {step.title}
                </h4>
                {step.description && (
                  <p className="mt-0.5 text-sm text-muted-foreground">
                    {step.description}
                  </p>
                )}
                {step.status === "current" && (
                  <span className="mt-2 inline-flex items-center gap-1 rounded-full bg-primary px-3 py-1 text-xs font-semibold text-primary-foreground">
                    Tap to complete
                  </span>
                )}
              </div>
            </button>
          </div>
        )
      })}
    </div>
  )
}
