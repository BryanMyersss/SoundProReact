import React, { useEffect, useState } from 'react';
import './AutoResizeInput.css';

interface AutoResizeInputProps {
  placeholder?: string;
  onChange: Function;
  type?: string;
  reduxValue?: string;
}

const AutoResizeInput = ({placeholder, onChange, type = 'text', reduxValue }: AutoResizeInputProps ) => {
  const [localValue, setLocalValue] = useState(reduxValue || '');

  useEffect(() => {
    setLocalValue(reduxValue || '');
  }, [reduxValue]);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    let inputValue = event.target.value;
    setLocalValue(inputValue);

    // Block letters if type is 'number'
    if (type === 'number') {
      inputValue = inputValue.replace(/[^0-9]/g, '');
    }

    onChange(inputValue);
  };

  if (!placeholder ) placeholder = '...';

  const getWidth = (text: string) => {
    // Create an invisible span element with the same text
    const span = document.createElement('span');
    span.style.visibility = 'hidden';
    span.style.fontFamily = 'var(--font-inter)';
    span.style.fontSize = '15px';
    span.style.whiteSpace = 'pre';
    span.style.fontWeight = '600';
    span.textContent = text || '';

    // Append the span to the body to calculate its width
    document.body.appendChild(span);
    const width = span.offsetWidth;
    // Remove the span from the body
    document.body.removeChild(span);

    // Return the width
    return width;
  };

  let inputWidth = getWidth(localValue);
  if (!localValue) {
    inputWidth = 13;
  }

  return (
    <input
      className='auto-resize-input'
      placeholder={placeholder}
      type='text'
      value={localValue}
      onChange={handleChange}
      style={{ width: `${inputWidth}px` }}
    />
  );
};

export default AutoResizeInput;