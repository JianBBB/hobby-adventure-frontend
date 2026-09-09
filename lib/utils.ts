import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'
import type { MyExplorationListItem } from '@/lib/api/types'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// 진행중 카드용: 같은 탐험을 여러 번 시작해도 마지막 여정(사진/메모/날짜)으로 구분되도록
// 정보 문구를 계산. 큰 썸네일 자리는 항상 탐험 고유 이미지로 고정해서 카드끼리 톤이 들쭉날쭉해지지 않게 하고,
// 여정 사진은 별도의 작은 배지로만 보여줌. 여정이 없으면 기존처럼 시작일만 보여줌
export function getExplorationCardInfo(
  item: Pick<MyExplorationListItem, "thumbnailUrl" | "startedAt" | "lastWaypointCheckedAt" | "lastWaypointMemo" | "lastWaypointThumbnailUrl">
) {
  const thumbnailUrl = item.thumbnailUrl
  const waypointThumbnailUrl = item.lastWaypointThumbnailUrl

  if (item.lastWaypointCheckedAt) {
    return {
      thumbnailUrl,
      waypointThumbnailUrl,
      hasWaypoint: true,
      infoLabel: item.lastWaypointMemo,
      infoDate: item.lastWaypointCheckedAt.slice(0, 10),
    }
  }

  return {
    thumbnailUrl,
    waypointThumbnailUrl,
    hasWaypoint: false,
    infoLabel: "탐험 시작",
    infoDate: item.startedAt.slice(0, 10),
  }
}
