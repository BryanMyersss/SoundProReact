import React, { useState, useRef, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../../state/store';
import { addStock, setStockQty, deleteStock } from '../../../state/admin/createProduct.slice';
import { imageAssets } from '../../../constants/index';
import diacritics from 'diacritics';
import { AutoResizeInput } from '../'

import './LocationPicker.css';
import { MdAddCircleOutline, MdDelete } from "react-icons/md";

import LocationInterface from '../../../interfaces/config/location.interface';
import { StockInterface } from '../../../interfaces/product.interface';


const LocationPicker = ({ locationList, language = 'default' }: { locationList: LocationInterface[], language?: keyof LocationInterface['displayName'] }) => {

  const selectedStock = useSelector((state: RootState) => state.createProduct.stock as StockInterface[]);
  const dispatch = useDispatch();

  const queriedLocationsRef = useRef(locationList);

  useEffect(() => {
    queriedLocationsRef.current = locationList;
    setFilteredQueriedLocations(locationList);
  }, [locationList]);


  const [filteredQueriedLocations, setFilteredQueriedLocations] = useState(queriedLocationsRef.current);
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
      setFilteredQueriedLocations(queriedLocationsRef.current);
    }
  };

  const hasLocations = selectedStock.length > 0;

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const normalizedInputValue = diacritics.remove(event.target.value.toLowerCase());

    const filteredLocations = queriedLocationsRef.current.filter((location) => {
      return diacritics.remove(location.displayName.default.toLowerCase()).includes(normalizedInputValue);
    })
    setFilteredQueriedLocations(filteredLocations);
  }

  const addLocation = (_id: string) => {
    dispatch(addStock(_id));
  }

  const selectedStockClickHandler = (_id: string, canBeDeleted: boolean) => (event: React.MouseEvent<HTMLDivElement>) => {
    event.stopPropagation();
    if (canBeDeleted) dispatch(deleteStock(_id));
  }

  return (
    <div className={`locationPicker ${isOpen ? 'open' : 'closed'} ${hasLocations ? 'has-location' : ''} hoverable`}
      ref={dropdownRef} onMouseDown={() => { setIsOpen(true) }}>
      <label>Locations</label>
      <div className='locationPicker_input-overflow'>
        <div className='locationPicker_input-container'>
          <input
            type="text" className={`locationPicker_input ${isOpen ? 'open' : ''}`} onChange={handleInputChange}
            required autoComplete="off" placeholder={`${isOpen || hasLocations ? 'Search location...' : ''}`}
            ref={inputRef} onFocus={() => setIsOpen(true)}
          />
          <MdAddCircleOutline className={`locationPicker_icon add-icon ${isOpen ? 'hidden' : ''}`} />
          <MdDelete className={`locationPicker_icon delete-icon ${isOpen ? '' : 'hidden'} ${currentlyDeletable ? 'deletable' : ''}`}
            onClick={() => { setCurrentlyDeletable(!currentlyDeletable) }} />
        </div>
      </div>
      <div className={`locationPicker_selected-container ${isOpen ? 'open' : ''}`}>
        <div className={`locationPicker_selected-locations`}>
          {selectedStock.map((stock) => (
            <div className={`product_location hoverable ${currentlyDeletable ? 'deletable' : ''}`} style={{ backgroundColor: stock.location.backgroundColor }} key={stock.location._id}
              onClick={selectedStockClickHandler(stock.location._id, currentlyDeletable)}>
              <span>{stock.location.displayName[language]}</span>
              <AutoResizeInput onChange={(value: number) => { dispatch(setStockQty({ qty: value, _id: stock.location._id })) }} type='number' />
            </div>
          ))}
        </div>
      </div>
      <div className={`locationPicker_menu ${isOpen ? 'open' : ''}`}>
        <hr className='locationPicker_hr' />
        <div className='locationPicker_menu-container'>
          <div className='locationPicker_menu-locations'>
            {filteredQueriedLocations.map((location) => (
              <div className='filters_location hoverable' style={{ backgroundColor: location.backgroundColor }}
                onClick={() => addLocation(location._id)} key={location._id}>
                <img src={imageAssets.Location} alt="Location" />
                <span>{location.displayName[language]}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default LocationPicker
