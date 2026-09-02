import { apiClient } from "./client"
import type { PageMeta } from "./client"
import type {
  CommonResponse,
  ExplorationCount,
  ExplorationStatus,
  MyExplorationDetail,
  MyExplorationListItem,
  PageResponse,
} from "./types"

export interface GetMyExplorationsParams {
  status?: ExplorationStatus
  categoryId?: number
  explorationId?: number
  hasRecord?: boolean
  page?: number
  size?: number
}

export async function getMyExplorations(
  params: GetMyExplorationsParams = {}
): Promise<{ items: MyExplorationListItem[]; meta: PageMeta }> {
  const query = new URLSearchParams()
  if (params.status) query.set("status", params.status)
  if (params.categoryId) query.set("categoryId", String(params.categoryId))
  if (params.explorationId) query.set("explorationId", String(params.explorationId))
  if (params.hasRecord !== undefined) query.set("hasRecord", String(params.hasRecord))
  query.set("page", String(params.page ?? 1))
  query.set("size", String(params.size ?? 20))

  const res = await apiClient.get<PageResponse<MyExplorationListItem>>(
    `/api/v1/my-explorations?${query.toString()}`
  )
  return { items: res.data, meta: res.meta }
}

// 완료 탭의 "탐험별 필터" 드롭다운용 — 탐험(explorationId) 단위로 묶은 개수를 백엔드에서 한 번에 받음
export async function getCompletedExplorationCounts(): Promise<ExplorationCount[]> {
  const res = await apiClient.get<CommonResponse<ExplorationCount[]>>(
    "/api/v1/my-explorations/completed/exploration-counts"
  )
  return res.data
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
