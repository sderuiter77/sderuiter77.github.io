"use client"

import { Beer, Trophy, Gift, AlertCircle, MinusCircle } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import type { Player } from "@/types/game"

interface PlayerListProps {
  players: Player[]
  currentPlayerIndex: number
  highestRollIndex: number
  roundComplete: boolean
  onDrinkTaken: (playerIndex: number) => void
}

export default function PlayerList({
  players,
  currentPlayerIndex,
  highestRollIndex,
  roundComplete,
  onDrinkTaken,
}: PlayerListProps) {
  // Function to format roll value according to the rules
  const formatRollValue = (dice1: number, dice2: number, isMex: boolean): string => {
    if (isMex) {
      return "Mex"
    } else if (dice1 === dice2) {
      // Doubles are displayed as hundreds
      return `${dice1 * 100}`
    } else {
      // Sort dice to get highest first
      const sortedDice = [dice1, dice2].sort((a, b) => b - a)
      return `${sortedDice[0]}${sortedDice[1]}`
    }
  }

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">Players</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {players.map((player, index) => {
            const [dice1, dice2] = player.currentRoll
            const hasRolled = dice1 !== 0 || dice2 !== 0

            return (
              <div
                key={index}
                className={`flex justify-between items-center p-2 rounded ${
                  index === currentPlayerIndex
                    ? "bg-amber-200"
                    : index === highestRollIndex && roundComplete
                      ? "bg-green-100"
                      : "bg-gray-50"
                }`}
              >
                <div className="flex items-center gap-2">
                  <span className="font-medium">{player.name}</span>
                  {index === highestRollIndex && roundComplete && <Trophy className="w-4 h-4 text-amber-600" />}
                  {player.canGiveDrink && <Gift className="w-4 h-4 text-green-600" />}
                  {player.mustTakeDrink && <AlertCircle className="w-4 h-4 text-red-600" />}
                </div>

                <div className="flex items-center gap-3">
                  {hasRolled && roundComplete && (
                    <div className="flex gap-1 text-sm bg-white px-2 py-1 rounded">
                      {formatRollValue(dice1, dice2, player.isMex)}
                    </div>
                  )}

                  {player.drinks > 0 && (
                    <div className="flex items-center gap-1">
                      <div className="flex items-center gap-1 text-sm bg-amber-100 px-2 py-1 rounded">
                        <Beer className="w-4 h-4 text-amber-600" />
                        <span>{player.drinks}</span>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6 text-amber-700 hover:text-amber-900 hover:bg-amber-100"
                        onClick={() => onDrinkTaken(index)}
                        title="Drink taken"
                      >
                        <MinusCircle className="h-4 w-4" />
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
