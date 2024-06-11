import React, {useEffect, useState} from 'react';
import './Input.css';
import { GrFormViewHide, GrFormView } from "react-icons/gr";

type inputTypes = 'text' | 'password' | 'date' | 'number';

interface InputProps {
  label: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  type?: inputTypes;
  canShowPassword?: boolean;
  reduxValue?: string | number;
}

const Input = ({ label, onChange, type = 'text', canShowPassword = false, reduxValue = '' }: InputProps) => {
  const [showPassword, setShowPassword] = useState(false);
  const [isEmpty, setIsEmpty] = useState(true);
  const [inputType, setInputType] = useState(type);
  const [localValue, setLocalValue] = useState(reduxValue);

  useEffect(() => {
    setLocalValue(reduxValue);
    setIsEmpty(reduxValue === '');
  }, [reduxValue]);

  const handleHidePasswordClick = () => {
    setShowPassword(!showPassword);
    if (!canShowPassword) return;
    switch (inputType) {
      case 'password':
        setInputType('text');
        break;
      case 'text':
        setInputType('password');
        break;
    }
  };

  const handleOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLocalValue(e.target.value);
    onChange(e);
    setIsEmpty(e.target.value === '');
  };

  return (
    <div className={`inputGroup ${type}`}>
      <input
        type={inputType}
        className={`hoverable ${isEmpty ? '' : 'notEmpty'}`}
        autoComplete="off"
        onChange={handleOnChange}
        value={localValue}
      />
      <label>{label}</label>
      {type === 'password' && canShowPassword && (
        <>
          <GrFormViewHide
            className={`inputGroup-icon ${showPassword ? 'hidden' : ''}`}
            onClick={handleHidePasswordClick}
          />
          <GrFormView
            className={`inputGroup-icon ${showPassword ? '' : 'hidden'}`}
            onClick={handleHidePasswordClick}
          />
        </>
      )}
    </div>
  );
};

export default Input;
