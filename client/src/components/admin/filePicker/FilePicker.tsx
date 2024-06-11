import React, { useState } from 'react'
import './FilePicker.css'

interface FilePickerProps {
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  setFile?: React.Dispatch<React.SetStateAction<File | null>>
}

const FilePicker = ({ onChange, setFile }: FilePickerProps) => {

  const [imageName, setImageName] = useState('' as string);

  function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    const files = event.target.files;
    if (files && files.length > 0) {
      const file = files[0];
      if (file.type === 'image/jpeg' || file.type === 'image/png') {
        // Read the selected image as a data URL
        setImageName(file.name);
        if(setFile) setFile(file);
        onChange(event);
      } 
    } else {
      setImageName('');
    }
  }

  return (
    <div className={`filePicker hoverable ${imageName ? 'has-image' : ''}`}>
      <label className='filePicker-labelBox' htmlFor="image-picker">{imageName ? imageName : ''}</label>
      <input id='image-picker' type="file" accept="image/jpeg, image/png" onChange={handleChange} multiple={false} />
      <label className={`filePicker-label ${imageName ? 'has-image' : ''}`}>Imagen</label>
    </div>
  )
}

export default FilePicker