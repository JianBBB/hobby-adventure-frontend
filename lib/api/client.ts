import { getLoggedInUser } from "@/lib/auth"

// 로컬 개발 시 nginx가 80번 포트에서 백엔드로 라우팅해줌
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost"

export interface PageMeta {
  page: number
  size: number
  totalElements: number
  totalPages: number
  hasNext: boolean
}

export class ApiError extends Error {
  status: number
  constructor(status: number, message: string) {
    super(message)
    this.status = status
  }
}

interface RequestOptions {
  method?: "GET" | "POST" | "PATCH" | "DELETE"
  body?: unknown
  formData?: FormData
}

async function request<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const { method = "GET", body, formData } = options

  const headers: Record<string, string> = {}
  const user = getLoggedInUser()
  if (user) {
    headers["X-User-Id"] = String(user.userId)
  }

  let requestBody: BodyInit | undefined
  if (formData) {
    requestBody = formData
    // FormData는 브라우저가 Content-Type(boundary 포함)을 자동으로 설정하므로 직접 안 넣음
  } else if (body !== undefined) {
    headers["Content-Type"] = "application/json"
    requestBody = JSON.stringify(body)
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    method,
    headers,
    body: requestBody,
  })

  const text = await response.text()
  const json = text ? JSON.parse(text) : null

  if (!response.ok) {
    const message = json?.message || "요청 처리 중 오류가 발생했어요."
    throw new ApiError(response.status, message)
  }

  return json as T
}

export const apiClient = {
  get: <T>(path: string) => request<T>(path, { method: "GET" }),
  post: <T>(path: string, body?: unknown) => request<T>(path, { method: "POST", body }),
  postForm: <T>(path: string, formData: FormData) => request<T>(path, { method: "POST", formData }),
  patch: <T>(path: string, body?: unknown) => request<T>(path, { method: "PATCH", body }),
  patchForm: <T>(path: string, formData: FormData) => request<T>(path, { method: "PATCH", formData }),
  delete: <T>(path: string) => request<T>(path, { method: "DELETE" }),
}
