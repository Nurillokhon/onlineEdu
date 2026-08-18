import { useState } from 'react'

function newPair() {
  return {
    left: Math.floor(Math.random() * 15) + 5,
    right: Math.floor(Math.random() * 9) + 1,
  }
}

/** Arithmetic captcha shared by the auth forms. */
export function useCaptcha() {
  const [pair, setPair] = useState(newPair)
  const [answer, setAnswer] = useState('')

  function refresh() {
    setPair(newPair())
    setAnswer('')
  }

  return {
    question: `${pair.left} + ${pair.right} =`,
    answer,
    setAnswer,
    isCorrect: answer !== '' && Number(answer) === pair.left + pair.right,
    refresh,
  }
}
