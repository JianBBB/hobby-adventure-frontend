import type { PageMeta } from "./client"

export interface CommonResponse<T> {
  data: T
}

export interface PageResponse<T> {
  data: T[]
  meta: PageMeta
}

// 인증
export interface LoginRequest {
  email: string
  password: string
}

export interface SignupRequest {
  email: string
  password: string
  nickname: string
}

export interface AuthResponse {
  userId: number
  nickname: string
}

// 카테고리
export interface Category {
  categoryId: number
  code: string
  name: string
}

// 탐험 (공개 카탈로그)
export interface ExplorationListItem {
  id: number
  title: string
  shortDescription: string
  categoryName: string
  thumbnailUrl: string | null
}

export interface ExplorationDetail {
  id: number
  title: string
  shortDescription: string
  description: string
  categoryName: string
  thumbnailUrl: string | null
  createdAt: string
}

// 내 탐험
export type ExplorationStatus = "STARTED" | "COMPLETED"

export interface MyExplorationListItem {
  userExplorationId: number
  explorationId: number
  title: string
  categoryName: string
  thumbnailUrl: string | null
  status: ExplorationStatus
  startedAt: string
  completedAt: string | null
  hasRecord: boolean
}

export interface MyExplorationDetail extends MyExplorationListItem {
  description: string
}

// 기록
export type EmotionCode =
  | "HAPPY"
  | "EXCITED"
  | "PROUD"
  | "PEACEFUL"
  | "SURPRISED"
  | "TIRED"
  | "DISAPPOINTED"
  | "SAD"
  | "ANGRY"

export interface Record {
  recordId: number
  userExplorationId: number
  explorationTitle: string
  categoryName: string
  title: string
  visitedDate: string
  rating: number
  emotionCode: EmotionCode
  placeName: string | null
  content: string
  imageUrls: string[]
}

export interface CreateRecordRequest {
  userExplorationId: number
  title: string
  visitedDate: string
  rating: number
  emotionCode: EmotionCode
  placeName?: string
  content: string
}

// 사용자
export interface UserProfile {
  userId: number
  email: string
  nickname: string
}
