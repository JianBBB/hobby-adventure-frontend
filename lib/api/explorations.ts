import { apiClient } from "./client"
import type { PageMeta } from "./client"
import type { CommonResponse, ExplorationDetail, ExplorationListItem, PageResponse } from "./types"

export interface GetExplorationsParams {
  categoryId?: number
  page?: number
  size?: number
}

export async function getExplorations(
  params: GetExplorationsParams = {}
): Promise<{ items: ExplorationListItem[]; meta: PageMeta }> {
  const query = new URLSearchParams()
  if (params.categoryId) query.set("categoryId", String(params.categoryId))
  query.set("page", String(params.page ?? 1))
  query.set("size", String(params.size ?? 20))

  const res = await apiClient.get<PageResponse<ExplorationListItem>>(
    `/api/v1/explorations?${query.toString()}`
  )
  return { items: res.data, meta: res.meta }
}

export async function getExploration(explorationId: number): Promise<ExplorationDetail> {
  const res = await apiClient.get<CommonResponse<ExplorationDetail>>(
    `/api/v1/explorations/${explorationId}`
  )
  return res.data
}

export async function startExploration(explorationId: number): Promise<void> {
  await apiClient.post(`/api/v1/explorations/${explorationId}/start`)
}
