"use client"

import { useState } from "react"
import { Search, Shuffle, Filter, Sparkles } from "lucide-react"
import { HobbyCard } from "@/components/hobby-card"
import { cn } from "@/lib/utils"

const categories = ["All", "Activity", "Creative", "Social", "Learning", "Outdoor"]

const hobbies = [
  {
    id: "1",
    title: "Rock Climbing",
    description: "Challenge yourself with indoor or outdoor climbing adventures",
    image: "https://images.unsplash.com/photo-1522163182402-834f871fd851?w=400&h=300&fit=crop",
    type: "activity" as const,
    difficulty: 2 as const,
    duration: "2-3 hours",
  },
  {
    id: "2",
    title: "Pottery Making",
    description: "Create beautiful ceramics with your own hands",
    image: "https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?w=400&h=300&fit=crop",
    type: "learning" as const,
    difficulty: 2 as const,
    duration: "1-2 hours",
  },
  {
    id: "3",
    title: "Jazz Bar Hopping",
    description: "Discover the best jazz venues in your city",
    image: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=400&h=300&fit=crop",
    type: "appreciation" as const,
    difficulty: 1 as const,
    duration: "2-4 hours",
  },
  {
    id: "4",
    title: "Urban Sketching",
    description: "Capture city scenes with pen and watercolor",
    image: "https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=400&h=300&fit=crop",
    type: "learning" as const,
    difficulty: 2 as const,
    duration: "1-2 hours",
  },
]

const randomHobby = {
  id: "random",
  title: "Freediving",
  description: "Experience the underwater world with just one breath. A meditative sport that combines mental focus with physical challenge.",
  image: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=400&h=300&fit=crop",
  type: "activity" as const,
  difficulty: 3 as const,
  duration: "2-3 hours",
}

export function ExploreScreen() {
  const [activeCategory, setActiveCategory] = useState("All")
  const [favorites, setFavorites] = useState<string[]>([])
  const [showRandom, setShowRandom] = useState(false)

  const toggleFavorite = (id: string) => {
    setFavorites(prev => 
      prev.includes(id) ? prev.filter(f => f !== id) : [...prev, id]
    )
  }

  return (
    <div className="h-full overflow-y-auto pb-24 pt-12">
      {/* Header */}
      <div className="px-5 py-4">
        <h1 className="text-xl font-extrabold text-foreground">Explore Hobbies</h1>
        <p className="text-sm text-muted-foreground">Find your next adventure</p>
      </div>

      {/* Search Bar */}
      <div className="px-5">
        <div className="flex items-center gap-2 rounded-2xl bg-card px-4 py-3 shadow-sm">
          <Search className="h-5 w-5 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search hobbies..."
            className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground focus:outline-none"
          />
          <button className="flex h-8 w-8 items-center justify-center rounded-xl bg-secondary">
            <Filter className="h-4 w-4 text-secondary-foreground" />
          </button>
        </div>
      </div>

      {/* Category Pills */}
      <div className="mt-4 overflow-x-auto px-5">
        <div className="flex gap-2">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={cn(
                "shrink-0 rounded-full px-4 py-2 text-sm font-semibold transition-all",
                activeCategory === category
                  ? "bg-primary text-primary-foreground shadow-md shadow-primary/30"
                  : "bg-card text-muted-foreground hover:bg-secondary"
              )}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-6 space-y-6 px-5">
        {/* Random Hobby Section */}
        <section>
          <div className="mb-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-accent" />
              <h2 className="font-bold text-foreground">Random Pick</h2>
            </div>
            <button 
              onClick={() => setShowRandom(!showRandom)}
              className="flex items-center gap-1 text-sm font-semibold text-primary"
            >
              <Shuffle className="h-4 w-4" />
              Shuffle
            </button>
          </div>
          <HobbyCard
            variant="random"
            {...randomHobby}
            isFavorite={favorites.includes(randomHobby.id)}
            onFavoriteToggle={() => toggleFavorite(randomHobby.id)}
          />
        </section>

        {/* Recommended Hobbies */}
        <section>
          <h2 className="mb-3 font-bold text-foreground">Recommended for You</h2>
          <div className="grid grid-cols-2 gap-3">
            {hobbies.slice(0, 2).map((hobby) => (
              <HobbyCard
                key={hobby.id}
                variant="large"
                {...hobby}
                isFavorite={favorites.includes(hobby.id)}
                onFavoriteToggle={() => toggleFavorite(hobby.id)}
              />
            ))}
          </div>
        </section>

        {/* All Hobbies */}
        <section>
          <h2 className="mb-3 font-bold text-foreground">All Hobbies</h2>
          <div className="space-y-3">
            {hobbies.map((hobby) => (
              <HobbyCard
                key={hobby.id}
                {...hobby}
                isFavorite={favorites.includes(hobby.id)}
                onFavoriteToggle={() => toggleFavorite(hobby.id)}
              />
            ))}
          </div>
        </section>
      </div>
    </div>
  )
}
