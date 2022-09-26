import { useState } from 'react'

const useWordle = (solution) => {
  const [turn, setTurn] = useState(0) 
  const [currentGuess, setCurrentGuess] = useState('')
  const [guesses, setGuesses] = useState([...Array(6)])  // cada intento es un array
  const [history, setHistory] = useState([]) // cada intento en un historial
  const [isCorrect, setIsCorrect] = useState(false)
  const [usedKeys, setUsedKeys] = useState({}) // {a: 'grey', b: 'green', c: 'yellow'} etc

  //formatear una conjetura en una matriz de objetos de letras
  // e.g. [{key: 'a', color: 'yellow'}]
  const formatGuess = () => {
    console.log('formatting the guess - ', currentGuess)
    let solutionArray = [...solution]
    let formattedGuess = [...currentGuess].map((l) => {
      return {key: l, color: 'grey'}
    })

    // encuentra letras verdes
    formattedGuess.forEach((l, i) => {
      if (solution[i] === l.key) {
        formattedGuess[i].color = 'green'
        solutionArray[i] = null
      }
    })
    
    // encuentra letras amarillas
    formattedGuess.forEach((l, i) => {
      if (solutionArray.includes(l.key) && l.color !== 'green') {
        formattedGuess[i].color = 'yellow'
        solutionArray[solutionArray.indexOf(l.key)] = null
      }
    })

    return formattedGuess
  }

  // agrega un nuevo intento  al estado de intentos
  // actualiza el estado isCorrect si el intento es correcto
  // cambia el estado del turno (que n° de intento es)
  const addNewGuess = (formattedGuess) => {
    if (currentGuess === solution) {
      setIsCorrect(true)
    }
    setGuesses(prevGuesses => {
      let newGuesses = [...prevGuesses]
      newGuesses[turn] = formattedGuess
      return newGuesses
    })
    setHistory(prevHistory => {
      return [...prevHistory, currentGuess]
    })
    setTurn(prevTurn => {
      return prevTurn + 1
    })

    setUsedKeys(prevUsedKeys => {
      formattedGuess.forEach(l => {
        const currentColor = prevUsedKeys[l.key]

        if (l.color === 'green') {
          prevUsedKeys[l.key] = 'green'
          return
        }
        if (l.color === 'yellow' && currentColor !== 'green') {
          prevUsedKeys[l.key] = 'yellow'
          return
        }
        if (l.color === 'grey' && currentColor !== ('green' || 'yellow')) {
          prevUsedKeys[l.key] = 'grey'
          return
        }
      })

      return prevUsedKeys
    })
    setCurrentGuess('')
  }

// maneja el evento keyup y rastrea la conjetura actual
// si el usuario presiona enter, agrega la nueva suposición
const handleKeyup = ({ key }) => {
  console.log('key pressed - ', key)
  if (key === 'Enter') {
    // only add guess if turn is less than 5
    if (turn > 5) {
      console.log('you used all your guesses!')
      return
    }
    // do not allow duplicate words
    if (history.includes(currentGuess)) {
      console.log('you already tried that word.')
      return
    }
    // check word is 5 chars
    if (currentGuess.length !== 5) {
      console.log('word must be 5 chars.')
      return
    }

    const formatted = formatGuess()
    addNewGuess(formatted)
    console.log(formatted)
  }

  if (key === 'Backspace') {
    setCurrentGuess(prev => prev.slice(0, -1))
    return
  }
  if (/^[A-Za-z]$/.test(key)) {
    if (currentGuess.length < 5) {
      setCurrentGuess(prev => prev + key)
    }
  }
}

  return {turn, currentGuess, guesses, isCorrect,usedKeys, handleKeyup}
}

export default useWordle