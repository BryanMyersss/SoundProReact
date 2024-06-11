import { imageAssets } from '../../constants/index'
import PriceSelector from './components/PriceSelector'
import Category from './components/Category'

import { RootState } from '../../state/store'
import { useSelector, useDispatch } from 'react-redux'
import { toggleCategoryFilter, toggleLocationFilter, setPriceDayRange } from '../../state/shop/shop.slice'

import './ShopFilters.css'

const ShopFilters = ({language = 'default'} : {language?: string}) => {
  const shop = useSelector((state: RootState) => state.shop);
  const dispatch = useDispatch();

  return (
    <aside className='filters'>

      <span className='filters_heading'><img src={imageAssets.FiltersIcon} alt="Filters" />Ajusta tu búsqueda</span>
      <hr />

      <span className='filters_label date-pickup-label'>Fecha de recogida</span>
      <div className='filters_date-container'>
        <input type="date" id="pickup_date" className='filters_date hoverable' />
        <img src={imageAssets.Date} alt="Date" />
      </div>

      <span className='filters_label date-return-label'>Fecha de entrega</span>
      <div className='filters_date-container'>
        <input type="date" id="return_date" className='filters_date hoverable' />
        <img src={imageAssets.Date} alt="Date" />
      </div>

      <span className='filters_label location-label'>Punto de recogida</span>
      <div className='filters_location-container'>
        {shop.queriedConfig?.locations.map((location, index) => (
          <div key={index} className={`filters_location hoverable ${shop.filters.pickupLocationsIds.includes(location._id) ? 'selected' : ''}`} 
          style={{ backgroundColor: location.backgroundColor }} onClick={() => dispatch(toggleLocationFilter(location._id))}>
            <img src={imageAssets.Location} alt="Location" />
            <span>{location.displayName[language as keyof typeof location.displayName]}</span>
          </div>
        ))}
      </div>

      <hr />

      <span className='filters_label'>Precio por día</span>
      <PriceSelector onChange={({min, max}) => {dispatch(setPriceDayRange({min, max}))}}/>

      <span className='filters_label category-filter'>Categoría</span>
      <div className='filters_category-container'>
        {shop.queriedConfig?.categories.map((category, index) => (
          <Category key={index} text={category.displayName[language as keyof typeof category.displayName]!}
          onClick={() => {dispatch(toggleCategoryFilter(category._id))}} />
        ))}
      </div>

    </aside>
  )
}

export default ShopFilters;