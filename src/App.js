import React from 'react'
import Die from './Die'
import { nanoid } from 'nanoid'
import Confetti from 'react-confetti'

let intervalID

export default function App() {
  const [dice, setDice] = React.useState(allNewDice())
  const [tenzies, setTenzies] = React.useState(false)

  React.useEffect(() => {
    const allHeld = dice.every((die) => die.isHeld)
    const firstValue = dice[0].value
    const allSameValue = dice.every((die) => die.value === firstValue)
    if (allHeld && allSameValue) {
      setTenzies(true)
      stopTimeCount()
    }
  }, [dice])

  function generateNewDie() {
    return {
      value: Math.ceil(Math.random() * 6),
      isHeld: false,
      id: nanoid(),
      dieFace: '',
    }
  }

  function allNewDice() {
    startTimeCount()
    const newDice = []
    for (let i = 0; i < 10; i++) {
      newDice.push(generateNewDie())
    }
    return newDice
  }

  function rollDice() {
    if (!tenzies) {
      increaseScore()
      setDice((oldDice) =>
        oldDice.map((die) => {
          return die.isHeld ? die : generateNewDie()
        })
      )
    } else {
      setTenzies(false)
      intervalID = ''
      setDice(allNewDice())
      resetScores()
    }
  }

  function holdDice(id) {
    setDice((oldDice) =>
      oldDice.map((die) => {
        return die.id === id ? { ...die, isHeld: !die.isHeld } : die
      })
    )
  }

  // CODE WRITTEN BY ME
  function generateDots() {
    for (let i = 0; i < 10; i++) {
      const num = dice[i].value
      const diceFace = []
      for (let j = 1; j <= num; j++) {
        const cls = num % 2 === 0 ? 'even-' : 'odd-'
        diceFace.push(` ${cls}${j}`)
      }
      dice[i].dieFace = diceFace
    }
  }

  generateDots()

  const diceElements = dice.map((die) => (
    <Die
      key={die.id}
      value={die.value}
      isHeld={die.isHeld}
      clsName={die.dieFace}
      holdDice={() => holdDice(die.id)}
    />
  ))

  const [scores, setScores] = React.useState(generateNewScores())
  const [bestScores, setBestScores] = React.useState(generateNewBestScores())

  function generateNewScores() {
    return {
      min: 0,
      sec: 0,
      secs: 0,
      score: 0,
    }
  }

  function generateNewBestScores() {
    return {
      min: 99,
      sec: 99,
      secs: 999,
      score: 999,
    }
  }

  // FILLING SCORES STATE WITH DATA
  function increaseTime() {
    setScores((prevScore) => {
      return {
        ...prevScore,
        secs: prevScore.secs + 1,
        sec: (prevScore.secs + 1) % 60,
        min: Math.floor((prevScore.secs + 1) / 60),
      }
    })
  }

  function increaseScore() {
    setScores((prevScore) => {
      return {
        ...prevScore,
        score: prevScore.score + 1,
      }
    })
  }

  // START 1 SEC PULSE
  function startTimeCount() {
    if (!intervalID) {
      intervalID = setInterval(increaseTime, 1000)
    }
  }

  function stopTimeCount() {
    clearInterval(intervalID)
    // FILLING BESTSCORES STATE WITH DATA
    if (scores.secs < bestScores.secs) {
      setBestScores((prevScore) => {
        return {
          ...prevScore,
          secs: scores.secs,
          sec: scores.sec,
          min: scores.min,
        }
      })
    }
    if (scores.score < bestScores.score) {
      setBestScores((prevScore) => {
        return {
          ...prevScore,
          score: scores.score,
        }
      })
    }
  }

  function resetScores() {
    setScores(generateNewScores)
  }

  return (
    <main>
      {tenzies && <Confetti />}
      <h1 className="title">Tenzies</h1>
      <p className="instructions">
        Roll until all dice are the same. Click each die to freeze it at its
        current value between rolls.
      </p>
      <div className="dice-container">{diceElements}</div>
      <button className="roll-dice" onClick={rollDice}>
        {tenzies ? 'New Game' : 'Roll'}
      </button>
      <div className="time-score">
        <h2>
          Time: {scores.min < 10 ? '0' + scores.min : scores.min}:
          {scores.sec < 10 ? '0' + scores.sec : scores.sec}
        </h2>
        {bestScores.secs < 999 && (
          <h2>
            Best Time:{' '}
            {bestScores.min < 10 ? '0' + bestScores.min : bestScores.min}:
            {bestScores.sec < 10 ? '0' + bestScores.sec : bestScores.sec}
          </h2>
        )}
        {bestScores.secs > 998 && <h2>Best Time: 00:00</h2>}
        <h2>
          Score: {scores.score} {scores.score <= 1 ? 'roll' : 'rolls'}
        </h2>
        <h2>
          Best Score: {bestScores.score < 999 ? bestScores.score : 0}{' '}
          {bestScores.score > 998 ? 'roll' : 'rolls'}
        </h2>
      </div>
    </main>
  )
}
