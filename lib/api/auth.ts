import { apiClient } from "./client"
import type { AuthResponse, CommonResponse, LoginRequest, SignupRequest } from "./types"

export async function login(payload: LoginRequest): Promise<AuthResponse> {
  const res = await apiClient.post<CommonResponse<AuthResponse>>("/api/v1/auth/login", payload)
  return res.data
}

export async function signup(payload: SignupRequest): Promise<AuthResponse> {
  const res = await apiClient.post<CommonResponse<AuthResponse>>("/api/v1/auth/signup", payload)
  return res.data
}
