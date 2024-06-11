import React, { useState, useRef, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../../state/store';
import { addProp, deleteProp, setPropText } from '../../../state/admin/createProduct.slice';
import diacritics from 'diacritics';

import './PropPicker.css';
import Prop from '../../product/components/Prop';
import { MdAddCircleOutline, MdDelete  } from "react-icons/md";
import PropInterface from '../../../interfaces/config/prop.interface'



const PropPicker = ({propList} : {propList: PropInterface[] }) => {

  const selectedProps = useSelector((state: RootState) => state.createProduct.properties as {prop: PropInterface, propText: string}[]);
  const dispatch = useDispatch();

  const queriedPropsRef = useRef(propList);

  useEffect(() => {
    queriedPropsRef.current = propList;
    setFilteredQueriedProps(propList);
  }, [propList]);

  
  const [filteredQueriedProps, setFilteredQueriedProps] = useState(queriedPropsRef.current);
  const [currentlyDeletable, setCurrentlyDeletable] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const dropdownRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    document.addEventListener('click', handleDocumentClick);

    return () => {
      document.removeEventListener('click', handleDocumentClick);
    }
  }, []);

  const handleDocumentClick = (event: MouseEvent) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
      setIsOpen(false);
      setCurrentlyDeletable(false);
      if (inputRef.current) inputRef.current.value = '';
      setFilteredQueriedProps(queriedPropsRef.current);
    }
  };
  
  const hasProps = selectedProps.length > 0;

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const normalizedInputValue = diacritics.remove(event.target.value.toLowerCase());

    const filteredProps = queriedPropsRef.current.filter((prop) => {
      if(prop.lookupNames.spanish) {
        return prop.lookupNames.spanish.some((lookupName) => diacritics.remove(lookupName.toLowerCase()).includes(normalizedInputValue));
      }
    })
    setFilteredQueriedProps(filteredProps);
  }

  return (
    <div className={`propPicker ${isOpen ? 'open' : 'closed'} ${hasProps ? 'has-prop' : ''} hoverable`} 
    ref={dropdownRef} onMouseDown={() => { setIsOpen(true) }}>
      <label>Propiedades</label>
      <div className='propPicker_input-overflow'>
        <div className='propPicker_input-container'>
          <input
            type="text" className={`propPicker_input ${isOpen ? 'open' : ''}`} onChange={handleInputChange}
            required autoComplete="off" placeholder={`${isOpen || hasProps ? 'Buscar propiedad...' : ''}`}
            ref={inputRef} onFocus={() => setIsOpen(true)}
          />
          <MdAddCircleOutline className={`propPicker_icon add-icon ${isOpen ? 'hidden' : ''}`} />
          <MdDelete className={`propPicker_icon delete-icon ${isOpen ? '' : 'hidden'} ${currentlyDeletable ?  'deletable' : ''}`}
          onClick={() => {setCurrentlyDeletable(!currentlyDeletable)}} />
        </div>
      </div>
      <div className={`propPicker_selected-container ${isOpen ? 'open' : ''}`}>
        <div className={`propPicker_selected-props`}>
          {selectedProps.map(({prop, propText}) => (
            <Prop key={prop._id} icon={prop.icon} label={prop.displayName.spanish || prop.displayName.default}
              placeholder={prop.placeholder.spanish || prop.placeholder.default} deleteCallback={() => { dispatch(deleteProp(prop._id))}}
              currentlyDeletable={currentlyDeletable} onChange={(text: string) => {dispatch(setPropText({_id: prop._id, text}))}} 
              reduxValue={propText}/>
          ))}
        </div>
      </div>
      <div className={`propPicker_menu ${isOpen ? 'open' : ''}`}>
        <hr className='propPicker_hr' />
        <div className='propPicker_menu-container'>
          <div className='propPicker_menu-props'>
            {filteredQueriedProps.map((prop) => (
              <Prop key={prop._id} icon={prop.icon} label={prop.displayName.spanish || prop.displayName.default}
                placeholder={prop.placeholder.spanish || prop.placeholder.default} onClick={() => { dispatch(addProp(prop._id)) }} />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default PropPicker