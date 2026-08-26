import { apiClient } from "./client"
import type { PageMeta } from "./client"
import type {
  CommonResponse,
  ExplorationStatus,
  MyExplorationDetail,
  MyExplorationListItem,
  PageResponse,
} from "./types"

export interface GetMyExplorationsParams {
  status?: ExplorationStatus
  categoryId?: number
  page?: number
  size?: number
}

export async function getMyExplorations(
  params: GetMyExplorationsParams = {}
): Promise<{ items: MyExplorationListItem[]; meta: PageMeta }> {
  const query = new URLSearchParams()
  if (params.status) query.set("status", params.status)
  if (params.categoryId) query.set("categoryId", String(params.categoryId))
  query.set("page", String(params.page ?? 1))
  query.set("size", String(params.size ?? 20))

  const res = await apiClient.get<PageResponse<MyExplorationListItem>>(
    `/api/v1/my-explorations?${query.toString()}`
  )
  return { items: res.data, meta: res.meta }
}

export async function getMyExploration(userExplorationId: number): Promise<MyExplorationDetail> {
  const res = await apiClient.get<CommonResponse<MyExplorationDetail>>(
    `/api/v1/my-explorations/${userExplorationId}`
  )
  return res.data
}

export async function completeMyExploration(userExplorationId: number): Promise<void> {
  await apiClient.patch(`/api/v1/my-explorations/${userExplorationId}/complete`)
}
