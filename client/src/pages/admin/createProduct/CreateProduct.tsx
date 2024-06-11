import React, { useEffect } from 'react'
import './CreateProduct.css'
import { Navbar, Product, PopupText } from '../../../components'
import { ProductForm, AiCreator } from '../../../container/admin'

import { useSelector, useDispatch } from 'react-redux'
import { AppDispatch, RootState } from '../../../state/store'
import { fetchShopConfig, setImageLink, CreateProductState } from '../../../state/admin/createProduct.slice'

import {postCreateProduct} from '../../../api/admin.api'

async function postProduct(image: File, product: CreateProductState) {
  product.priceDay ||= 0
  product.investedAmount ||= 0

  const formData = new FormData();
  formData.append("image", image)
  formData.append("manufacturer", product.manufacturer)
  formData.append("name", product.name)
  formData.append("priceDay", product.priceDay.toString())
  formData.append("investedAmount", product.investedAmount.toString())
  formData.append("category", JSON.stringify(product.category))
  formData.append("bulletPoints", JSON.stringify(product.bulletPoints))
  formData.append("properties", JSON.stringify(product.properties))
  formData.append("stock", JSON.stringify(product.stock))
  formData.append("lookupNames", JSON.stringify(product.lookupNames))

  const response = await postCreateProduct(formData);

  return response
}


const CreateProduct = () => {

  const [file, setFile] = React.useState<File | null>(null)
  const product = useSelector((state: RootState) => state.createProduct)
  const dispatch = useDispatch<AppDispatch>();


  useEffect(() => {
    console.log('fetchShopConfig')
    dispatch(fetchShopConfig())
  }, [])

  useEffect(() => {
    console.log(product)
  }, [product])

  async function submit() {
    try {
      const response = await postProduct(file as File, product)
      console.log('response:')
      console.log(response)
      dispatch(setImageLink(response.data.imageLink))
    } catch (error: any) {
      console.error(error.response)
    }
  }

  return (
    <>
      <Navbar />
      <main className='createProduct'>
        <div className='createProduct_header'>
          <span>Añade una nueva familia de productos</span>
          <button className='createProduct_draft-button hoverable'>Añadir al borrador</button>
          <button className='createProduct_create-button hoverable' onClick={submit}>Crear familia</button>
        </div>
        <hr />
        <div className='createProduct_container'>
          {product.aiCreator?.message && <PopupText text={product.aiCreator.message} expireSeconds={6} /> }
          <div>
            <Product product={{ ...product, images: [product.base64image || ''] }} />
          </div>
          <ProductForm setFile={setFile} />
          <AiCreator />
        </div>
      </main>
    </>
  )
}

export default CreateProduct