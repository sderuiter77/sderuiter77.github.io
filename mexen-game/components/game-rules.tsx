export default function GameRules() {
  return (
    <div className="space-y-4 text-sm">
      <div>
        <h3 className="font-bold mb-1">What is Mexen?</h3>
        <p>Mexen (also known as Mexxen, Moxen or Mexicaantje) is a popular dice drinking game played with two dice.</p>
      </div>

      <div>
        <h3 className="font-bold mb-1">Basic Rules:</h3>
        <ul className="list-disc pl-5 space-y-1">
          <li>Players take turns rolling two dice</li>
          <li>Each player can roll a maximum of 3 times per turn</li>
          <li>The player with the lowest roll in a round drinks</li>
          <li>If Mex is rolled (1 and 2), the number of drinks in this round doubles</li>
          <li>If Mex is rolled, the player's turn ends immediately</li>
        </ul>
      </div>

      <div>
        <h3 className="font-bold mb-1">Roll Values (from highest to lowest):</h3>
        <ol className="list-decimal pl-5 space-y-1">
          <li>Mex (1 and 2) - highest possible roll</li>
          <li>Doubles (e.g., 6-6 = 600, 5-5 = 500, etc.)</li>
          <li>Regular rolls - highest number first (e.g., 6-5 = 65, 6-4 = 64)</li>
        </ol>
      </div>

      <div>
        <h3 className="font-bold mb-1">Special Combinations:</h3>
        <ul className="list-disc pl-5 space-y-1">
          <li>3-1: Player can give away a drink (doesn't count toward max rolls)</li>
          <li>3-2: Player has to take a drink (doesn't count toward max rolls)</li>
          <li>
            If the first player rolls Mex before using all 3 rolls, other players are limited to the same number of
            rolls
          </li>
        </ul>
      </div>

      <div>
        <h3 className="font-bold mb-1">Special Features:</h3>
        <ul className="list-disc pl-5 space-y-1">
          <li>Pin dice - Click the pin icon on a die to keep its value for a single roll</li>
          <li>Re-roll option - After rolling, you can choose to re-roll your dice (up to 3 times)</li>
          <li>Drinks are awarded after all players have completed one turn</li>
          <li>Roll results are only shown at the end of the round</li>
          <li>You can assign drinks at any point after at least one player has rolled</li>
        </ul>
      </div>

      <div>
        <h3 className="font-bold mb-1">How to Play:</h3>
        <ol className="list-decimal pl-5 space-y-1">
          <li>Add at least 2 players to the game</li>
          <li>Players take turns rolling the dice (up to 3 times per turn)</li>
          <li>After rolling, you can choose to re-roll or pass to the next player</li>
          <li>You can assign drinks at any time to end the round</li>
          <li>The player with the lowest roll drinks</li>
          <li>A new round begins after drinks are awarded</li>
        </ol>
      </div>
    </div>
  )
}
