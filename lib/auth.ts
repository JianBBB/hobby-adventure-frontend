const USER_STORAGE_KEY = "hobby-adventure-user"

export interface LoggedInUser {
  userId: number
  nickname: string
}

export function getLoggedInUser(): LoggedInUser | null {
  if (typeof window === "undefined") return null
  const raw = window.localStorage.getItem(USER_STORAGE_KEY)
  if (!raw) return null
  try {
    return JSON.parse(raw) as LoggedInUser
  } catch {
    return null
  }
}

export function setLoggedInUser(user: LoggedInUser) {
  window.localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user))
}

export function clearLoggedInUser() {
  window.localStorage.removeItem(USER_STORAGE_KEY)
}
