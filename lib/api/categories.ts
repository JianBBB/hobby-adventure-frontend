import { apiClient } from "./client"
import type { Category, CommonResponse } from "./types"

export async function getCategories(): Promise<Category[]> {
  const res = await apiClient.get<CommonResponse<Category[]>>("/api/v1/categories")
  return res.data
}
