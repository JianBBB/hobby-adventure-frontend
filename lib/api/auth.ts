import { apiClient } from "./client"
import type { AuthResponse, CommonResponse, LoginRequest, SignupRequest, SignupResponse } from "./types"

export async function login(payload: LoginRequest): Promise<AuthResponse> {
  const res = await apiClient.post<CommonResponse<AuthResponse>>("/api/v1/auth/login", payload)
  return res.data
}

// 회원가입 자체는 로그인 정보를 안 돌려줘서(성공 여부만), 가입 성공 시 바로 로그인까지 이어서 처리
export async function signup(payload: SignupRequest): Promise<AuthResponse> {
  await apiClient.post<CommonResponse<SignupResponse>>("/api/v1/auth/signup", payload)
  return login({ email: payload.email, password: payload.password })
}
