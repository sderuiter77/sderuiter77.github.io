export interface Player {
  name: string
  drinks: number
  currentRoll: number[]
  isMex: boolean
  hasRolled: boolean
  rollCount: number
  canGiveDrink: boolean
  mustTakeDrink: boolean
}

export interface GameState {
  drinkMultiplier: number
  maxRollsAllowed: number
  firstPlayerRollCount: number
  roundComplete: boolean
}
