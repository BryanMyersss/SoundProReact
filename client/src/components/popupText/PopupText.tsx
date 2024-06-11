import React, {useState} from 'react'
import './PopupText.css'

const PopupText = ({text, expireSeconds} : {text: string, expireSeconds?: number}) => {
  const [hidden, setHidden] = useState(false)

  if(expireSeconds) {
    setTimeout(() => {
      setHidden(true)
    }, expireSeconds * 1000)
  }

  if (hidden) {
    return null
  }

  return (
    <span className={`popupText ${hidden ? 'hidden' : ''}`}>{text}</span>
  )
}

export default PopupText