import { apiClient } from "./client"
import type { PageMeta } from "./client"
import type {
  CommonResponse,
  CreateRecordRequest,
  UpdateRecordRequest,
  PageResponse,
  RecordListItem,
  RecordDetail,
  RecordArchiveCount,
} from "./types"

export interface GetRecordsParams {
  categoryId?: number
  explorationId?: number
  page?: number
  size?: number
}

export async function getRecords(
  params: GetRecordsParams = {}
): Promise<{ items: RecordListItem[]; meta: PageMeta }> {
  const query = new URLSearchParams()
  if (params.categoryId) query.set("categoryId", String(params.categoryId))
  if (params.explorationId) query.set("explorationId", String(params.explorationId))
  query.set("page", String(params.page ?? 1))
  query.set("size", String(params.size ?? 20))

  const res = await apiClient.get<PageResponse<RecordListItem>>(`/api/v1/records?${query.toString()}`)
  return { items: res.data, meta: res.meta }
}

export async function getRecord(recordId: number): Promise<RecordDetail> {
  const res = await apiClient.get<CommonResponse<RecordDetail>>(`/api/v1/records/${recordId}`)
  return res.data
}

export async function getRecordArchiveCounts(categoryId?: number): Promise<RecordArchiveCount[]> {
  const query = categoryId ? `?categoryId=${categoryId}` : ""
  const res = await apiClient.get<CommonResponse<RecordArchiveCount[]>>(`/api/v1/records/archive-counts${query}`)
  return res.data
}

function buildRecordFormData(request: CreateRecordRequest | UpdateRecordRequest, images: File[]): FormData {
  const formData = new FormData()
  formData.append("request", new Blob([JSON.stringify(request)], { type: "application/json" }))
  images.forEach((image) => formData.append("images", image))
  return formData
}

export async function createRecord(request: CreateRecordRequest, images: File[]): Promise<{ recordId: number }> {
  const res = await apiClient.postForm<CommonResponse<{ recordId: number }>>(
    "/api/v1/records",
    buildRecordFormData(request, images)
  )
  return res.data
}

export async function updateRecord(
  recordId: number,
  request: UpdateRecordRequest,
  images: File[]
): Promise<{ recordId: number }> {
  const res = await apiClient.patchForm<CommonResponse<{ recordId: number }>>(
    `/api/v1/records/${recordId}`,
    buildRecordFormData(request, images)
  )
  return res.data
}

export async function deleteRecord(recordId: number): Promise<void> {
  await apiClient.delete(`/api/v1/records/${recordId}`)
}
