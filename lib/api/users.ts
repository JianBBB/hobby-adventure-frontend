import { apiClient } from "./client"
import type { CommonResponse, UserProfile } from "./types"

export async function getUser(userId: number): Promise<UserProfile> {
  const res = await apiClient.get<CommonResponse<UserProfile>>(`/api/v1/users/${userId}`)
  return res.data
}

export async function deleteUser(userId: number): Promise<void> {
  await apiClient.delete(`/api/v1/users/${userId}`)
}
