import { apiClient } from "./client"
import type { PageMeta } from "./client"
import type {
  CommonResponse,
  CreateWaypointRequest,
  UpdateWaypointRequest,
  PageResponse,
  WaypointListItem,
  WaypointDetail,
} from "./types"

export interface GetWaypointsParams {
  userExplorationId: number
  sortOrder?: "oldest" | "newest"
  page?: number
  size?: number
}

export async function getWaypoints(
  params: GetWaypointsParams
): Promise<{ items: WaypointListItem[]; meta: PageMeta }> {
  const query = new URLSearchParams()
  query.set("userExplorationId", String(params.userExplorationId))
  query.set("sortOrder", params.sortOrder ?? "newest")
  query.set("page", String(params.page ?? 1))
  query.set("size", String(params.size ?? 20))

  const res = await apiClient.get<PageResponse<WaypointListItem>>(`/api/v1/waypoints?${query.toString()}`)
  return { items: res.data, meta: res.meta }
}

export async function getWaypoint(waypointId: number): Promise<WaypointDetail> {
  const res = await apiClient.get<CommonResponse<WaypointDetail>>(`/api/v1/waypoints/${waypointId}`)
  return res.data
}

function buildWaypointFormData(request: CreateWaypointRequest | UpdateWaypointRequest, images: File[]): FormData {
  const formData = new FormData()
  formData.append("request", new Blob([JSON.stringify(request)], { type: "application/json" }))
  images.forEach((image) => formData.append("images", image))
  return formData
}

export async function createWaypoint(request: CreateWaypointRequest, images: File[]): Promise<{ waypointId: number }> {
  const res = await apiClient.postForm<CommonResponse<{ waypointId: number }>>(
    "/api/v1/waypoints",
    buildWaypointFormData(request, images)
  )
  return res.data
}

export async function updateWaypoint(
  waypointId: number,
  request: UpdateWaypointRequest,
  images: File[]
): Promise<{ waypointId: number }> {
  const res = await apiClient.patchForm<CommonResponse<{ waypointId: number }>>(
    `/api/v1/waypoints/${waypointId}`,
    buildWaypointFormData(request, images)
  )
  return res.data
}

export async function deleteWaypoint(waypointId: number): Promise<void> {
  await apiClient.delete(`/api/v1/waypoints/${waypointId}`)
}
