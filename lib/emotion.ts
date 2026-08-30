import type { EmotionCode } from "./api/types"

export const EMOTION_OPTIONS: { code: EmotionCode; label: string; emoji: string }[] = [
  { code: "PROUD", label: "뿌듯", emoji: "🥹" },
  { code: "HAPPY", label: "행복", emoji: "😊" },
  { code: "EXCITED", label: "신남", emoji: "🤩" },
  { code: "TOUCHED", label: "감동", emoji: "🥲" },
  { code: "CALM", label: "평온", emoji: "😌" },
  { code: "BITTERSWEET", label: "아쉬움", emoji: "😔" },
  { code: "DIFFICULT", label: "힘들었어", emoji: "😓" },
  { code: "LONELY", label: "외로움", emoji: "🥺" },
  { code: "DISAPPOINTED", label: "실망", emoji: "😞" },
]

export function getEmotionEmoji(code: EmotionCode): string {
  return EMOTION_OPTIONS.find((option) => option.code === code)?.emoji ?? "✨"
}
