import React from 'react'

const PriceSelector = ({onChange} : {onChange: ({min, max} : {min?: string, max?: string}) => void}) => {
  const handlePriceChange = (targetId: string, value: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
    // console.log(e.target.value);
    let inputValue = e.target.value.replace(/\D/g, ''); // Remove non-numeric characters
    inputValue = inputValue.slice(0, 4); // Limit to 4 characters
    e.target.value = inputValue; // Update the input value

    // Create a temporary span to measure the width of the input value
    const tempSpan = document.createElement('span');
    tempSpan.textContent = inputValue;
    tempSpan.style.fontFamily = 'var(--font-inter)';
    tempSpan.style.visibility = 'hidden';
    tempSpan.style.position = 'absolute';
    document.body.appendChild(tempSpan);

    const euroSign = document.getElementById(targetId) as HTMLInputElement;

    // Set the input width based on the width of the span
    e.target.style.width = `${tempSpan.offsetWidth + 10 - 8}px`;
    euroSign.style.opacity = '1'
    if (!inputValue) {
      e.target.style.width = '10px';
      euroSign.style.opacity = '0.7'
    }

    // Remove the temporary span
    document.body.removeChild(tempSpan);
    if (!inputValue) inputValue = '0';
    onChange({[value]: inputValue})
  }

  const handleOverlayClick = (targetId: string) => (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    // e.target.style.opacity = 0;
    // e.target.style.cursor = 'text'
    e.currentTarget.style.opacity = '0';
    e.currentTarget.style.cursor = 'text';
    const inputElement = document.getElementById(targetId) as HTMLInputElement | null;
    if (inputElement) {
      inputElement.focus();
    }
  };

  const handleOverlayEnterLeave = (boolean: boolean) => (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    e.currentTarget.style.opacity = boolean ? '1' : '0';
    e.currentTarget.style.cursor = 'pointer';
    // e.target.style.opacity = boolean ? 1 : 0;
    // e.target.style.cursor = 'pointer'
  }

  return (
    <div className='filters_price hoverable'>
      <div className='filters_price-input-container'>
        <input type="text" name="min_price" id="min_price" onChange={handlePriceChange('min_price_sign', 'min')} placeholder='0' />
        <span id='min_price_sign'>€</span>
      </div>
      <div className='filter-price-separator-line'></div>
      <div className='filters_price-input-container'>
        <input type="text" name="max_price" id="max_price" onChange={handlePriceChange('max_price_sign', 'max')} placeholder='0' />
        <span id='max_price_sign'>€</span>
      </div>
      <div id='min_price_left_overlay_clicker' onClick={handleOverlayClick('min_price')}
        onMouseEnter={handleOverlayEnterLeave(true)} onMouseLeave={handleOverlayEnterLeave(false)}></div>
      <div id='max_price_right_overlay_clicker' onClick={handleOverlayClick('max_price')}
        onMouseEnter={handleOverlayEnterLeave(true)} onMouseLeave={handleOverlayEnterLeave(false)} ></div>
    </div>
  )
}

export default PriceSelector