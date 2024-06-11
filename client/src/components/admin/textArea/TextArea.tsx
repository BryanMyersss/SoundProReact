import React, { useEffect, useState } from 'react';
import './TextArea.css';

interface textAreaInterface {
  label: string;
  onChange?: React.ChangeEventHandler;
  controlledComponent?: boolean;
  reduxValue?: string[];
  formatText?: boolean;
}

const TextArea = ({ label, onChange, controlledComponent = true, reduxValue = [''], formatText = false}: textAreaInterface) => {
  function formatReduxValue(value: string[]) {
    return value.join('\n');
  }

  const [localValue, setLocalValue] = useState(formatReduxValue(reduxValue));

  useEffect(() => {
    setLocalValue(formatReduxValue(reduxValue));
  }, [reduxValue]);

  const handleChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    let value = event.target.value;

    if (formatText) {
      value = event.target.value.replace(/\n{2,}/g, '\n'); // Remove excess newlines
      event.target.value = value;
    }

    setLocalValue(value);
    if (onChange) {
      onChange(event);
    }
  };

  return (
    <div className="textArea">
      <textarea
        className="hoverable"
        required
        autoComplete="off"
        onChange={handleChange}
        value={controlledComponent ? localValue : undefined}
      />
      <label>{label}</label>
    </div>
  );
};

export default TextArea;
