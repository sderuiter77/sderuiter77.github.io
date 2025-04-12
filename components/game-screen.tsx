"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import { Beer, Plus, Trash2, Info, RotateCcw, ArrowRight, Gift, AlertCircle } from "lucide-react"
import DiceRoller from "./dice-roller"
import PlayerList from "./player-list"
import GameRules from "./game-rules"
import type { Player, GameState } from "@/types/game"

export default function GameScreen() {
  const [players, setPlayers] = useState<Player[]>([])
  const [newPlayerName, setNewPlayerName] = useState("")
  const [currentPlayerIndex, setCurrentPlayerIndex] = useState(0)
  const [gameStarted, setGameStarted] = useState(false)
  const [showRules, setShowRules] = useState(false)
  const [highestRoll, setHighestRoll] = useState({ value: 0, playerIndex: -1 })
  const [gameMessage, setGameMessage] = useState("")
  const [showAddPlayers, setShowAddPlayers] = useState(true)
  const [canReroll, setCanReroll] = useState(false)
  const [showGiveDrinkDialog, setShowGiveDrinkDialog] = useState(false)
  const [canAssignDrinks, setCanAssignDrinks] = useState(false)

  // Game state to track round-specific information
  const [gameState, setGameState] = useState<GameState>({
    drinkMultiplier: 1,
    maxRollsAllowed: 3,
    firstPlayerRollCount: 0,
    roundComplete: false,
  })

  // Effect to check if drinks can be assigned
  useEffect(() => {
    // Can assign drinks if at least one player has rolled
    const anyPlayerRolled = players.some((player) => player.hasRolled)
    setCanAssignDrinks(anyPlayerRolled)
  }, [players])

  const addPlayer = () => {
    if (newPlayerName.trim() && players.length < 10) {
      setPlayers([
        ...players,
        {
          name: newPlayerName.trim(),
          drinks: 0,
          currentRoll: [0, 0],
          isMex: false,
          hasRolled: false,
          rollCount: 0,
          canGiveDrink: false,
          mustTakeDrink: false,
        },
      ])
      setNewPlayerName("")
    }
  }

  const removePlayer = (index: number) => {
    setPlayers(players.filter((_, i) => i !== index))
  }

  const startGame = () => {
    if (players.length >= 2) {
      setGameStarted(true)
      setShowAddPlayers(false)
      setGameMessage("Game started! First player to roll...")
    } else {
      setGameMessage("You need at least 2 players to start the game")
    }
  }

  const handleRoll = (diceValues: number[]) => {
    const updatedPlayers = [...players]
    const currentPlayer = updatedPlayers[currentPlayerIndex]
    const updatedGameState = { ...gameState }

    // Increment roll count (unless it's a 3-1 or 3-2)
    const is31 = (diceValues[0] === 3 && diceValues[1] === 1) || (diceValues[0] === 1 && diceValues[1] === 3)
    const is32 = (diceValues[0] === 3 && diceValues[1] === 2) || (diceValues[0] === 2 && diceValues[1] === 3)

    if (!is31 && !is32) {
      currentPlayer.rollCount += 1

      // If this is the first player in the round, track their roll count
      if (currentPlayerIndex === 0 && !gameState.roundComplete) {
        updatedGameState.firstPlayerRollCount = currentPlayer.rollCount
      }
    }

    currentPlayer.currentRoll = diceValues
    currentPlayer.hasRolled = true

    // Reset special actions
    currentPlayer.canGiveDrink = false
    currentPlayer.mustTakeDrink = false

    // Check for Mex (1 and 2)
    const isMex = diceValues.includes(1) && diceValues.includes(2)
    currentPlayer.isMex = isMex

    // Check for special combinations
    if (is31) {
      currentPlayer.canGiveDrink = true
      setGameMessage(`${currentPlayer.name} rolled 3-1! You can give a drink to someone.`)
    } else if (is32) {
      currentPlayer.mustTakeDrink = true
      currentPlayer.drinks += 1
      setGameMessage(`${currentPlayer.name} rolled 3-2! You take a drink.`)
    } else if (isMex) {
      // If Mex is rolled, double the drinks for this round
      updatedGameState.drinkMultiplier *= 2
      setGameMessage(`${currentPlayer.name} rolled Mex! Drinks are doubled for the rest of the game!`)
    } else {
      // Calculate roll value for regular rolls
      const rollValue = calculateRollValue(diceValues)

      if (diceValues[0] === diceValues[1]) {
        setGameMessage(`${currentPlayer.name} rolled doubles (${diceValues[0]})!`)
      } else {
        setGameMessage(`${currentPlayer.name} rolled ${rollValue}`)
      }
    }

    // Update highest roll
    const rollValue = calculateRollValue(diceValues)
    if (rollValue > highestRoll.value) {
      setHighestRoll({ value: rollValue, playerIndex: currentPlayerIndex })
    }

    setPlayers(updatedPlayers)
    setGameState(updatedGameState)

    // Enable re-roll option if player hasn't reached max rolls and didn't roll Mex
    const maxRolls = getMaxRollsForPlayer(currentPlayer, currentPlayerIndex)
    setCanReroll(currentPlayer.rollCount < maxRolls && !isMex)

    // Show give drink dialog if applicable
    if (currentPlayer.canGiveDrink) {
      setShowGiveDrinkDialog(true)
    }

    // If Mex is rolled, end the player's turn automatically
    if (isMex) {
      // Use setTimeout to ensure the UI updates before moving to the next player
      setTimeout(() => {
        nextPlayer()
      }, 1000)
    }
  }

  const calculateRollValue = (diceValues: number[]): number => {
    // Check for Mex (1 and 2)
    const isMex = diceValues.includes(1) && diceValues.includes(2)

    if (isMex) {
      return 1000 // Mex is the highest
    } else if (diceValues[0] === diceValues[1]) {
      // Doubles
      return diceValues[0] * 100
    } else {
      // Regular roll - highest number first
      const sortedDice = [...diceValues].sort((a, b) => b - a)
      return Number.parseInt(`${sortedDice[0]}${sortedDice[1]}`)
    }
  }

  const getMaxRollsForPlayer = (player: Player, playerIndex: number): number => {
    // Rule 6: If first player rolls Mex before using all 3 rolls, other players are limited
    if (playerIndex > 0 && !gameState.roundComplete && gameState.firstPlayerRollCount > 0) {
      return gameState.firstPlayerRollCount
    }

    // Default max rolls is 3
    return gameState.maxRollsAllowed
  }

  const nextPlayer = () => {
    setCanReroll(false)

    // Check if all players have rolled
    const nextPlayerIndex = (currentPlayerIndex + 1) % players.length
    setCurrentPlayerIndex(nextPlayerIndex)

    // If we've gone through all players, mark the round as complete
    if (nextPlayerIndex === 0) {
      setGameState((prev) => ({ ...prev, roundComplete: true }))
    }
  }

  const resetGame = () => {
    setPlayers(
      players.map((player) => ({
        ...player,
        drinks: 0,
        currentRoll: [0, 0],
        isMex: false,
        hasRolled: false,
        rollCount: 0,
        canGiveDrink: false,
        mustTakeDrink: false,
      })),
    )
    setCurrentPlayerIndex(0)
    setHighestRoll({ value: 0, playerIndex: -1 })
    setGameMessage("Game reset! First player to roll...")
    setGameState({
      drinkMultiplier: 1,
      maxRollsAllowed: 3,
      firstPlayerRollCount: 0,
      roundComplete: false,
    })
    setCanReroll(false)
    setCanAssignDrinks(false)
  }

  const assignDrinks = () => {
    if (highestRoll.playerIndex === -1) return

    const updatedPlayers = [...players]

    // The player with the lowest roll drinks
    const lowestRollIndex = findLowestRollIndex()

    if (lowestRollIndex !== -1) {
      // Award drinks to the player with the lowest roll
      updatedPlayers[lowestRollIndex].drinks += gameState.drinkMultiplier

      // Format the roll value for display
      const [dice1, dice2] = updatedPlayers[lowestRollIndex].currentRoll
      let rollDisplay = ""

      if (updatedPlayers[lowestRollIndex].isMex) {
        rollDisplay = "Mex"
      } else if (dice1 === dice2) {
        rollDisplay = `${dice1 * 100}`
      } else {
        const sortedDice = [dice1, dice2].sort((a, b) => b - a)
        rollDisplay = `${sortedDice[0]}${sortedDice[1]}`
      }

      setGameMessage(
        `${updatedPlayers[lowestRollIndex].name} has the lowest roll (${rollDisplay}) and drinks ${gameState.drinkMultiplier} ${
          gameState.drinkMultiplier > 1 ? "drinks" : "drink"
        }!`,
      )
    }

    setPlayers(updatedPlayers)

    // Reset for next round
    setHighestRoll({ value: 0, playerIndex: -1 })
    updatedPlayers.forEach((player) => {
      player.currentRoll = [0, 0]
      player.isMex = false
      player.hasRolled = false
      player.rollCount = 0
      player.canGiveDrink = false
      player.mustTakeDrink = false
    })

    // Reset game state for next round
    setGameState({
      drinkMultiplier: 1,
      maxRollsAllowed: 3,
      firstPlayerRollCount: 0,
      roundComplete: false,
    })

    // Reset can assign drinks
    setCanAssignDrinks(false)
  }

  const findLowestRollIndex = () => {
    if (players.length === 0) return -1

    let lowestValue = 1001 // Higher than any possible roll
    let lowestIndex = -1

    players.forEach((player, index) => {
      const [dice1, dice2] = player.currentRoll

      // Skip players who haven't rolled
      if (dice1 === 0 && dice2 === 0) return

      const rollValue = calculateRollValue([dice1, dice2])

      if (rollValue < lowestValue) {
        lowestValue = rollValue
        lowestIndex = index
      }
    })

    return lowestIndex
  }

  const allPlayersRolled = () => {
    return players.every((player) => player.hasRolled)
  }

  const giveDrinkTo = (playerIndex: number) => {
    if (playerIndex === currentPlayerIndex) return

    const updatedPlayers = [...players]
    updatedPlayers[playerIndex].drinks += 1

    setPlayers(updatedPlayers)
    setShowGiveDrinkDialog(false)
    setGameMessage(`${players[currentPlayerIndex].name} gave a drink to ${players[playerIndex].name}!`)
  }

  const handleDrinkTaken = (playerIndex: number) => {
    const updatedPlayers = [...players]
    if (updatedPlayers[playerIndex].drinks > 0) {
      updatedPlayers[playerIndex].drinks -= 1
      setPlayers(updatedPlayers)
      setGameMessage(`${updatedPlayers[playerIndex].name} took a drink!`)
    }
  }

  const canPlayerRoll = () => {
    const currentPlayer = players[currentPlayerIndex]
    const maxRolls = getMaxRollsForPlayer(currentPlayer, currentPlayerIndex)
    return currentPlayer.rollCount < maxRolls
  }

  return (
    <div className="w-full max-w-md px-4 py-8">
      <div className="flex flex-col items-center mb-6">
        <h1 className="text-3xl font-bold text-amber-800 mb-2">Mexen</h1>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowRules(true)}
            className="text-amber-700 border-amber-700"
          >
            <Info className="w-4 h-4 mr-1" />
            Rules
          </Button>
          {gameStarted && (
            <Button variant="outline" size="sm" onClick={resetGame} className="text-amber-700 border-amber-700">
              Reset Game
            </Button>
          )}
        </div>
      </div>

      {showAddPlayers && (
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="flex items-center gap-2 mb-4">
              <Input
                placeholder="Enter player name"
                value={newPlayerName}
                onChange={(e) => setNewPlayerName(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && addPlayer()}
                className="border-amber-200 focus-visible:ring-amber-500"
              />
              <Button
                onClick={addPlayer}
                disabled={!newPlayerName.trim() || players.length >= 10}
                className="bg-amber-600 hover:bg-amber-700"
              >
                <Plus className="w-4 h-4" />
              </Button>
            </div>

            {players.length > 0 && (
              <div className="space-y-2">
                {players.map((player, index) => (
                  <div key={index} className="flex justify-between items-center p-2 bg-amber-100 rounded">
                    <span>{player.name}</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removePlayer(index)}
                      className="h-8 w-8 p-0 text-red-500"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            )}

            {players.length >= 2 && (
              <Button onClick={startGame} className="w-full mt-4 bg-amber-600 hover:bg-amber-700">
                Start Game
              </Button>
            )}

            {gameMessage && !gameStarted && <p className="text-center mt-2 text-amber-700">{gameMessage}</p>}
          </CardContent>
        </Card>
      )}

      {gameStarted && (
        <>
          <Card className="mb-6">
            <CardContent className="pt-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">{players[currentPlayerIndex].name}'s Turn</h2>
                <div className="text-sm text-amber-700">
                  Roll {players[currentPlayerIndex].rollCount}/
                  {getMaxRollsForPlayer(players[currentPlayerIndex], currentPlayerIndex)}
                </div>
              </div>

              {gameState.drinkMultiplier > 1 && (
                <div className="bg-amber-100 p-2 rounded-md mb-4 flex items-center">
                  <AlertCircle className="w-4 h-4 text-amber-700 mr-2" />
                  <span className="text-amber-700 text-sm">Drinks multiplier: x{gameState.drinkMultiplier}</span>
                </div>
              )}

              <DiceRoller onRoll={handleRoll} disabled={!canPlayerRoll() || gameState.roundComplete} />

              {gameMessage && <p className="text-center mt-4 text-amber-700 font-medium">{gameMessage}</p>}

              <div className="flex gap-2 mt-4">
                {canReroll && !gameState.roundComplete && (
                  <Button
                    onClick={() => setCanReroll(false)}
                    variant="outline"
                    className="flex-1 border-amber-500 text-amber-700"
                    disabled={!canPlayerRoll()}
                  >
                    <RotateCcw className="w-4 h-4 mr-2" />
                    Re-roll ({players[currentPlayerIndex].rollCount}/
                    {getMaxRollsForPlayer(players[currentPlayerIndex], currentPlayerIndex)})
                  </Button>
                )}

                {players[currentPlayerIndex].hasRolled &&
                  !gameState.roundComplete &&
                  !players[currentPlayerIndex].isMex && (
                    <Button onClick={nextPlayer} className="flex-1 bg-amber-600 hover:bg-amber-700">
                      <ArrowRight className="w-4 h-4 mr-2" />
                      Next Player
                    </Button>
                  )}
              </div>

              {canAssignDrinks && (
                <Button onClick={assignDrinks} className="w-full mt-4 bg-amber-600 hover:bg-amber-700">
                  <Beer className="w-4 h-4 mr-2" />
                  Assign Drinks
                </Button>
              )}
            </CardContent>
          </Card>

          <PlayerList
            players={players}
            currentPlayerIndex={currentPlayerIndex}
            highestRollIndex={highestRoll.playerIndex}
            roundComplete={gameState.roundComplete}
            onDrinkTaken={handleDrinkTaken}
          />
        </>
      )}

      <Dialog open={showRules} onOpenChange={setShowRules}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Mexen Game Rules</DialogTitle>
            <DialogDescription>Learn how to play the Mexen dice game</DialogDescription>
          </DialogHeader>
          <GameRules />
          <DialogFooter>
            <Button onClick={() => setShowRules(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={showGiveDrinkDialog} onOpenChange={setShowGiveDrinkDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Give a Drink</DialogTitle>
            <DialogDescription>You rolled 3-1! Choose a player to give a drink to:</DialogDescription>
          </DialogHeader>
          <div className="space-y-2 my-4">
            {players.map(
              (player, index) =>
                index !== currentPlayerIndex && (
                  <Button
                    key={index}
                    onClick={() => giveDrinkTo(index)}
                    className="w-full justify-start bg-amber-600 hover:bg-amber-700"
                  >
                    <Gift className="w-4 h-4 mr-2" />
                    {player.name}
                  </Button>
                ),
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowGiveDrinkDialog(false)}>
              Cancel
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
