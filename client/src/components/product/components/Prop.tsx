import React, {useState} from 'react';
import './Prop.css'
import {AutoResizeInput} from '../../admin';
import PropInterface from '../../../interfaces/config/prop.interface';

interface PropComponentInterface {
  icon: string;
  label?: string;
  text?: string;
  onChange?: Function;
  placeholder?: string;
  onClick?: Function;
  deleteCallback?: Function;
  currentlyDeletable?: boolean;
  reduxValue?: string;
}

const Prop = (
  { icon, label, text, onChange, placeholder, onClick, deleteCallback, currentlyDeletable, reduxValue} : PropComponentInterface) => {

  const onClickHandler = (event: React.MouseEvent<HTMLDivElement>) => {
    event.stopPropagation()
    if (onClick) {
      onClick()
    }
    if (deleteCallback && currentlyDeletable) {
      deleteCallback()
    }
  }

  return (
    <div className={`product_prop ${currentlyDeletable ? 'deletable' : ''} ${onClick ? 'clickable' : ''}`} onClick={onClickHandler}>
      <img src={icon} alt="" />
      {label && <b className='product_prop-label'>{label}</b>}
      {text && <span className='product_prop-text'>{text}</span>}
      {placeholder && !onChange && <span className='product_prop-text placeholder'>{placeholder}</span> }
      {onChange && <AutoResizeInput onChange={onChange} reduxValue={reduxValue}/> }
    </div>
  )
}

export default Prop