import { apiClient } from "./client"
import type { PageMeta } from "./client"
import type { CommonResponse, CreateRecordRequest, PageResponse, Record } from "./types"

export interface GetRecordsParams {
  categoryId?: number
  explorationId?: number
  page?: number
  size?: number
}

export async function getRecords(
  params: GetRecordsParams = {}
): Promise<{ items: Record[]; meta: PageMeta }> {
  const query = new URLSearchParams()
  if (params.categoryId) query.set("categoryId", String(params.categoryId))
  if (params.explorationId) query.set("explorationId", String(params.explorationId))
  query.set("page", String(params.page ?? 1))
  query.set("size", String(params.size ?? 20))

  const res = await apiClient.get<PageResponse<Record>>(`/api/v1/records?${query.toString()}`)
  return { items: res.data, meta: res.meta }
}

export async function getRecord(recordId: number): Promise<Record> {
  const res = await apiClient.get<CommonResponse<Record>>(`/api/v1/records/${recordId}`)
  return res.data
}

function buildRecordFormData(request: CreateRecordRequest, images: File[]): FormData {
  const formData = new FormData()
  formData.append("request", new Blob([JSON.stringify(request)], { type: "application/json" }))
  images.forEach((image) => formData.append("images", image))
  return formData
}

export async function createRecord(request: CreateRecordRequest, images: File[]): Promise<Record> {
  const res = await apiClient.postForm<CommonResponse<Record>>(
    "/api/v1/records",
    buildRecordFormData(request, images)
  )
  return res.data
}

export async function updateRecord(
  recordId: number,
  request: CreateRecordRequest,
  images: File[]
): Promise<Record> {
  const res = await apiClient.patchForm<CommonResponse<Record>>(
    `/api/v1/records/${recordId}`,
    buildRecordFormData(request, images)
  )
  return res.data
}

export async function deleteRecord(recordId: number): Promise<void> {
  await apiClient.delete(`/api/v1/records/${recordId}`)
}
