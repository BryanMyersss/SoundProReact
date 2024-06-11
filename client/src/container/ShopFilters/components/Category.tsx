import React, { useState } from 'react'

const Category = ({ text, onClick }: { text: string, onClick: Function}) => {
  const initialState = false;
  const [state, setState] = useState(initialState)

  const handleClick = () => {
    onClick()
    setState(!state)
  }

  return (
    <div className='filters_category'>
      <div className='filters_category-clickeable-box' onClick={handleClick}>
        <div className={`filters_category-checkbox ${state ? 'selected' : ''}`} ></div>
        <span className='filters_category-checkbox-label'>{text}</span>
      </div>
    </div>
  
  )
}

export default Category