"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"
import { Pin } from "lucide-react"

interface DiceRollerProps {
  onRoll: (values: number[]) => void
  disabled?: boolean
}

export default function DiceRoller({ onRoll, disabled = false }: DiceRollerProps) {
  const [diceValues, setDiceValues] = useState<number[]>([6, 6])
  const [displayValues, setDisplayValues] = useState<number[]>([6, 6])
  const [isRolling, setIsRolling] = useState(false)
  const [pinnedDice, setPinnedDice] = useState<boolean[]>([false, false])

  // Reference to store the scramble interval
  const scrambleIntervalRef = useRef<NodeJS.Timeout | null>(null)

  // Clean up interval on unmount
  useEffect(() => {
    return () => {
      if (scrambleIntervalRef.current) {
        clearInterval(scrambleIntervalRef.current)
      }
    }
  }, [])

  const rollDice = () => {
    if (disabled) return

    setIsRolling(true)

    // Generate final values immediately but don't show them yet
    const finalValues = [...diceValues]
    if (!pinnedDice[0]) finalValues[0] = Math.floor(Math.random() * 6) + 1
    if (!pinnedDice[1]) finalValues[1] = Math.floor(Math.random() * 6) + 1

    // Store the final values
    setDiceValues(finalValues)

    // Start scrambling the display values
    if (scrambleIntervalRef.current) {
      clearInterval(scrambleIntervalRef.current)
    }

    scrambleIntervalRef.current = setInterval(() => {
      setDisplayValues((prev) => {
        const newValues = [...prev]
        if (!pinnedDice[0]) newValues[0] = Math.floor(Math.random() * 6) + 1
        if (!pinnedDice[1]) newValues[1] = Math.floor(Math.random() * 6) + 1
        return newValues
      })
    }, 75) // Fast scrambling effect

    // Stop scrambling and show final values after animation completes
    setTimeout(() => {
      if (scrambleIntervalRef.current) {
        clearInterval(scrambleIntervalRef.current)
      }
      setDisplayValues(finalValues)
      setIsRolling(false)

      // Automatically unpin all dice after the roll
      setPinnedDice([false, false])

      onRoll(finalValues)
    }, 600) // Keep the same duration
  }

  const togglePinDice = (index: number) => {
    if (disabled) return

    const newPinnedDice = [...pinnedDice]
    newPinnedDice[index] = !newPinnedDice[index]
    setPinnedDice(newPinnedDice)
  }

  return (
    <div className="flex flex-col items-center">
      <div className="flex justify-center gap-8 mb-6">
        {displayValues.map((value, index) => (
          <div key={index} className="relative">
            <motion.div
              className={`w-16 h-16 rounded-lg flex items-center justify-center shadow-lg ${
                pinnedDice[index] ? "dice-pinned" : "dice"
              }`}
              animate={{
                y: isRolling && !pinnedDice[index] ? [0, -10, 0] : 0,
              }}
              transition={{
                duration: 0.6,
                ease: "easeInOut",
              }}
              style={{
                perspective: "1000px",
                transformStyle: "preserve-3d",
              }}
            >
              <DiceFace value={value} />
            </motion.div>
            <button
              onClick={() => togglePinDice(index)}
              className={`absolute -top-2 -right-2 w-6 h-6 rounded-full flex items-center justify-center ${
                pinnedDice[index] ? "bg-red-500 text-white" : "bg-gray-200 text-gray-500"
              } ${disabled ? "opacity-50 cursor-not-allowed" : ""} shadow-md z-10`}
              disabled={disabled}
            >
              <Pin className="w-3 h-3" />
            </button>
          </div>
        ))}
      </div>
      <Button onClick={rollDice} disabled={isRolling || disabled} className="bg-amber-600 hover:bg-amber-700">
        {isRolling ? "Rolling..." : disabled ? "Max Rolls Reached" : "Roll Dice"}
      </Button>

      <style jsx global>{`
        .dice {
          background: linear-gradient(145deg, #ffffff, #f0f0f0);
          border: 2px solid #e0e0e0;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1), 
                      inset 0 -2px 5px rgba(0, 0, 0, 0.05),
                      inset 0 2px 5px rgba(255, 255, 255, 0.5);
        }
        
        .dice-pinned {
          background: linear-gradient(145deg, #ffffff, #f0f0f0);
          border: 2px solid #e74c3c;
          box-shadow: 0 4px 6px rgba(231, 76, 60, 0.3), 
                      inset 0 -2px 5px rgba(231, 76, 60, 0.1),
                      inset 0 2px 5px rgba(255, 255, 255, 0.5);
        }
      `}</style>
    </div>
  )
}

function DiceFace({ value }: { value: number }) {
  const dotPositionMap = {
    1: ["center"],
    2: ["top-left", "bottom-right"],
    3: ["top-left", "center", "bottom-right"],
    4: ["top-left", "top-right", "bottom-left", "bottom-right"],
    5: ["top-left", "top-right", "center", "bottom-left", "bottom-right"],
    6: ["top-left", "top-right", "middle-left", "middle-right", "bottom-left", "bottom-right"],
  }

  const getPositionClass = (position: string) => {
    switch (position) {
      case "top-left":
        return "top-2 left-2"
      case "top-right":
        return "top-2 right-2"
      case "middle-left":
        return "top-1/2 -translate-y-1/2 left-2"
      case "middle-right":
        return "top-1/2 -translate-y-1/2 right-2"
      case "bottom-left":
        return "bottom-2 left-2"
      case "bottom-right":
        return "bottom-2 right-2"
      case "center":
        return "top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
      default:
        return ""
    }
  }

  return (
    <div className="relative w-full h-full">
      {dotPositionMap[value as keyof typeof dotPositionMap].map((position, index) => (
        <div key={index} className={`absolute rounded-full ${getPositionClass(position)} dot`} />
      ))}

      <style jsx>{`
        .dot {
          width: 8px;
          height: 8px;
          background: radial-gradient(circle at 30% 30%, #333, #000);
          box-shadow: inset 0 0 1px rgba(0, 0, 0, 0.5), 0 1px 1px rgba(255, 255, 255, 0.5);
        }
      `}</style>
    </div>
  )
}
