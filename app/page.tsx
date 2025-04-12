import type { Metadata } from "next"
import GameScreen from "@/components/game-screen"

export const metadata: Metadata = {
  title: "Mexen Dice Game",
  description: "A fun dice drinking game app based on Mexen rules",
}

export default function HomePage() {
  return (
    <main className="flex min-h-screen flex-col items-center bg-amber-50">
      <GameScreen />
    </main>
  )
}
