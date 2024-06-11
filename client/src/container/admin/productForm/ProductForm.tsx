import React, { useState } from 'react'
import './ProductForm.css'
import { useDispatch, useSelector } from 'react-redux'
import { Input, Dropdown, PropPicker, TextArea, FilePicker, LocationPicker } from '../../../components/admin'
import { setManufacturer, setName, setPriceDay, setInvestedAmount, setCategory, setBulletPoints, setBase64Image, removeCategory, setLookupNames } from '../../../state/admin/createProduct.slice'
import { RootState } from '../../../state/store'

const ProductForm = ({ setFile }: { setFile?: React.Dispatch<React.SetStateAction<File | null>> }) => {
  const createProduct = useSelector((state: RootState) => state.createProduct)
  const dispatch = useDispatch()

  const [currentTab, setCurrentTab] = useState('main')

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    if (e.target.files && e.target.files.length > 0) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target && event.target.result) {
          dispatch(setBase64Image(event.target.result.toString()));
        }
      };
      reader.readAsDataURL(e.target.files[0]);
    }
  }

  return (
    <div className='productForm'>

      <div className='productForm_tabs'>
        <button className={`${currentTab === 'main' ? 'selected' : ''}`} onClick={() => setCurrentTab('main')}>Principal</button>
        <button className={`${currentTab === 'config' ? 'selected' : ''}`} onClick={() => setCurrentTab('config')}>Configuración</button>
        <button className={`${currentTab === 'products' ? 'selected' : ''}`} onClick={() => setCurrentTab('products')}>Productos</button>
      </div>
      <div className='productForm_tab-spacing productForm_maintab'>

        {currentTab === 'main' && <>
          <Input label={'Marca'} onChange={(event) => dispatch(setManufacturer(event.target.value))} reduxValue={createProduct.manufacturer} />
          <Input label={'Nombre'} onChange={(event) => dispatch(setName(event.target.value))} reduxValue={createProduct.name} />
          <div className='productForm_maintab-price-container'>
            <Input label={'Precio por día'} type='number' onChange={(event) => dispatch(setPriceDay(event.target.value))} reduxValue={createProduct.priceDay} />
            <Input label={'Inversión total'} type='number' onChange={(event) => dispatch(setInvestedAmount(event.target.value))} reduxValue={createProduct.investedAmount} />
          </div>
          <Dropdown categoryList={createProduct.queriedCategories} onSelect={(categoryId) => dispatch(setCategory(categoryId))} reduxValue={createProduct.category} 
          onChange={(e) => dispatch(removeCategory())}/>
          <PropPicker propList={createProduct.queriedProps} />
          <TextArea label={'Descripción'} onChange={(event: React.ChangeEvent<HTMLTextAreaElement>) => { dispatch(setBulletPoints(event.target.value)) }} reduxValue={createProduct.bulletPoints?.spanish} />
          <FilePicker onChange={handleFileChange} setFile={setFile} />
        </>}

        {currentTab === 'config' && <>
          <LocationPicker locationList={createProduct.queriedLocations} />
          <TextArea label='Nombres de búsqueda' onChange={(event: React.ChangeEvent<HTMLTextAreaElement>) => { dispatch(setLookupNames({language: 'spanish' ,value: event.target.value}))}} 
          reduxValue={createProduct.lookupNames.spanish}/>
        </>}

        {currentTab === 'products' && <>
          No disponible
        </>}

      </div>
    </div>
  )
}

export default ProductForm