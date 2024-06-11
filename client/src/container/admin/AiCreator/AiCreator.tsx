import React, {useState} from 'react'
import './AiCreator.css'
import { TextArea } from '../../../components/admin'
import { imageAssets } from '../../../constants'

import { useDispatch, useSelector } from 'react-redux'
import { AppDispatch, RootState } from '../../../state/store'
import { createWithAi } from '../../../state/admin/createProduct.slice'

const AiCreator = () => {
  const AiCreator = useSelector((state: RootState) => state.createProduct.aiCreator)
  const dispatch = useDispatch<AppDispatch>()
  const [text, setText] = useState('')


  const onClickHandler = () => {
    dispatch(createWithAi(text))
  }

  return (
    <div className={`AiCreator ${AiCreator?.loading ? 'loading' : ''}`}>
      <span className='AiCreator_title'><b>AutoCreate</b> con <b>ChatGPT</b></span>
      <TextArea label='Texto en crudo' onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setText(e.target.value)} controlledComponent={false} 
      formatText={true}/>
      <div className='AiCreator_end-container'>
        <button onClick={onClickHandler} className='AiCreator_button'>
          <img src={imageAssets.chatGPT} alt="Extract with chatGPT" />
        </button>
      </div>
    </div>
  )
}

export default AiCreator