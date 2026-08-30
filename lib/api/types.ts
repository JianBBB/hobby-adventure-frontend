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

export interface SignupResponse {
  success: boolean
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
  categoryId: number
  categoryName: string
  shortDescription: string
  thumbnailUrl: string | null
  status: ExplorationStatus
  startedAt: string
  completedAt: string | null
  hasRecord: boolean
}

export interface MyExplorationDetail extends MyExplorationListItem {
  recordId: number | null
}

export interface StartExplorationResponse {
  userExplorationId: number
}

// 기록
export type EmotionCode =
  | "PROUD"
  | "HAPPY"
  | "EXCITED"
  | "TOUCHED"
  | "CALM"
  | "BITTERSWEET"
  | "DIFFICULT"
  | "LONELY"
  | "DISAPPOINTED"

export interface RecordListItem {
  recordId: number
  userExplorationId: number
  explorationId: number
  explorationTitle: string
  categoryId: number
  categoryName: string
  title: string
  thumbnailUrl: string | null
  visitedDate: string
  rating: number
  emotionCode: EmotionCode
  emotionLabel: string
  createdAt: string
}

export interface RecordDetail {
  recordId: number
  userExplorationId: number
  explorationId: number
  explorationTitle: string
  categoryId: number
  categoryName: string
  title: string
  visitedDate: string
  rating: number
  emotionCode: EmotionCode
  emotionLabel: string
  placeName: string | null
  content: string
  imageUrls: string[]
  createdAt: string
  updatedAt: string
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

export interface UpdateRecordRequest {
  title?: string
  visitedDate?: string
  rating?: number
  emotionCode?: EmotionCode
  placeName?: string
  content?: string
}

// 사용자
export interface UserProfile {
  userId: number
  email: string
  nickname: string
}
