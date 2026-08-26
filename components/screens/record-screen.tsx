"use client"

import { useState } from "react"
import { Plus, Calendar, Image, Star } from "lucide-react"
import { RecordCard } from "@/components/record-card"
import { cn } from "@/lib/utils"

const records = [
  {
    id: "1",
    title: "Coffee Brewing",
    date: "Mar 5, 2026",
    rating: 4,
    emotion: "proud",
    note: "Made my first pour-over coffee. The taste was amazing and I'm proud of learning this new skill!",
    image: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=400&h=300&fit=crop",
  },
  {
    id: "2",
    title: "Jazz Bar Visit",
    date: "Mar 3, 2026",
    rating: 5,
    emotion: "happy",
    note: "The atmosphere was incredible. Live band playing smooth jazz. Definitely coming back!",
    image: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=400&h=300&fit=crop",
  },
  {
    id: "3",
    title: "Morning Yoga",
    date: "Mar 1, 2026",
    rating: 4,
    emotion: "calm",
    note: "Started my day with a 30-minute yoga session. Feeling refreshed and centered.",
    image: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=400&h=300&fit=crop",
  },
  {
    id: "4",
    title: "Urban Sketching",
    date: "Feb 28, 2026",
    rating: 3,
    emotion: "excited",
    note: "First attempt at sketching the city. Still learning but had a great time!",
    image: "https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=400&h=300&fit=crop",
  },
]

const emotions = [
  { id: "happy", emoji: "😊", label: "Happy" },
  { id: "excited", emoji: "🤩", label: "Excited" },
  { id: "calm", emoji: "😌", label: "Calm" },
  { id: "proud", emoji: "🥹", label: "Proud" },
  { id: "surprised", emoji: "😮", label: "Surprised" },
]

export function RecordScreen() {
  const [showNewRecord, setShowNewRecord] = useState(false)
  const [rating, setRating] = useState(0)
  const [selectedEmotion, setSelectedEmotion] = useState<string | null>(null)

  if (showNewRecord) {
    return (
      <div className="h-full overflow-y-auto pb-24 pt-12">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4">
          <button 
            onClick={() => setShowNewRecord(false)}
            className="text-sm font-semibold text-muted-foreground"
          >
            Cancel
          </button>
          <h1 className="font-bold text-foreground">New Record</h1>
          <button className="text-sm font-semibold text-primary">
            Save
          </button>
        </div>

        <div className="space-y-6 px-5">
          {/* Image Upload */}
          <button className="flex aspect-video w-full flex-col items-center justify-center rounded-2xl border-2 border-dashed border-border bg-card transition-colors hover:bg-muted">
            <Image className="mb-2 h-8 w-8 text-muted-foreground" />
            <span className="text-sm font-medium text-muted-foreground">Add Photo</span>
          </button>

          {/* Hobby Name */}
          <div>
            <label className="mb-2 block text-sm font-semibold text-foreground">Hobby</label>
            <input
              type="text"
              placeholder="What hobby did you try?"
              className="w-full rounded-xl bg-card px-4 py-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          {/* Date */}
          <div>
            <label className="mb-2 block text-sm font-semibold text-foreground">Date</label>
            <button className="flex w-full items-center gap-3 rounded-xl bg-card px-4 py-3">
              <Calendar className="h-5 w-5 text-muted-foreground" />
              <span className="text-foreground">March 10, 2026</span>
            </button>
          </div>

          {/* Rating */}
          <div>
            <label className="mb-2 block text-sm font-semibold text-foreground">Rating</label>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  onClick={() => setRating(star)}
                  className="p-1 transition-transform hover:scale-110"
                >
                  <Star
                    className={cn(
                      "h-8 w-8 transition-colors",
                      star <= rating
                        ? "fill-accent text-accent"
                        : "text-muted-foreground/30"
                    )}
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Emotion */}
          <div>
            <label className="mb-2 block text-sm font-semibold text-foreground">How did you feel?</label>
            <div className="flex gap-2">
              {emotions.map((emotion) => (
                <button
                  key={emotion.id}
                  onClick={() => setSelectedEmotion(emotion.id)}
                  className={cn(
                    "flex flex-col items-center gap-1 rounded-xl p-3 transition-all",
                    selectedEmotion === emotion.id
                      ? "bg-primary/15 ring-2 ring-primary"
                      : "bg-card hover:bg-muted"
                  )}
                >
                  <span className="text-2xl">{emotion.emoji}</span>
                  <span className="text-[10px] font-medium text-muted-foreground">{emotion.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="mb-2 block text-sm font-semibold text-foreground">Notes</label>
            <textarea
              placeholder="Write about your experience..."
              rows={4}
              className="w-full resize-none rounded-xl bg-card px-4 py-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          {/* Save Button */}
          <button className="w-full rounded-2xl bg-primary py-4 font-bold text-primary-foreground shadow-lg shadow-primary/30 transition-all hover:bg-primary/90 active:scale-[0.98]">
            Save Record
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="h-full overflow-y-auto pb-24 pt-12">
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4">
        <div>
          <h1 className="text-xl font-extrabold text-foreground">My Records</h1>
          <p className="text-sm text-muted-foreground">Your hobby journal</p>
        </div>
        <button 
          onClick={() => setShowNewRecord(true)}
          className="flex h-10 w-10 items-center justify-center rounded-full bg-primary shadow-md shadow-primary/30"
        >
          <Plus className="h-5 w-5 text-primary-foreground" />
        </button>
      </div>

      {/* Stats */}
      <div className="flex gap-3 px-5">
        <div className="flex-1 rounded-2xl bg-card p-3 text-center shadow-sm">
          <p className="text-2xl font-extrabold text-foreground">{records.length}</p>
          <p className="text-xs text-muted-foreground">Total Records</p>
        </div>
        <div className="flex-1 rounded-2xl bg-card p-3 text-center shadow-sm">
          <p className="text-2xl font-extrabold text-foreground">4.0</p>
          <p className="text-xs text-muted-foreground">Avg Rating</p>
        </div>
        <div className="flex-1 rounded-2xl bg-card p-3 text-center shadow-sm">
          <p className="text-2xl font-extrabold text-foreground">8</p>
          <p className="text-xs text-muted-foreground">Hobbies Tried</p>
        </div>
      </div>

      {/* Timeline */}
      <div className="mt-6 space-y-4 px-5">
        <h2 className="font-bold text-foreground">March 2026</h2>
        <div className="space-y-3">
          {records.map((record) => (
            <RecordCard key={record.id} {...record} />
          ))}
        </div>
      </div>
    </div>
  )
}
