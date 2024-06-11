import React, { useState } from 'react'
import { Navbar, Product, PopupText } from '../../components'
import { ShopFilters } from '../../container'
import { useEffect, useRef } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { RootState, AppDispatch } from '../../state/store'
import { setNavbarMenuOpen } from '../../state/ui/ui.slice'
import { fetchShop, setSearchQuery } from '../../state/shop/shop.slice'

import './Shop.css'


const Shop = () => {
  const lastProductRef = useRef<HTMLDivElement>(null);
  const blanksRefs = useRef<Array<HTMLDivElement>>([]);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth)

  const blankProducts = [];
  for (let i = 0; i < 8; i++) {
    blankProducts.push(<div key={i} className='product blank-product' ref={(i) => { if (i) blanksRefs.current.push(i) }} ></div>);
  }

  const isNavbarMenuOpen = useSelector((state: RootState) => state.ui.isNavbarMenuOpen);
  const shop = useSelector((state: RootState) => state.shop);
  const dispatch = useDispatch<AppDispatch>();


  useEffect(() => {
    console.log(shop)

  }, [shop])

  useEffect(() => {
    dispatch(setNavbarMenuOpen(false))
    window.addEventListener('resize', () => {
      setWindowWidth(window.innerWidth)
    });

    dispatch(fetchShop())

    return () => {
      window.removeEventListener('resize', () => {
        setWindowWidth(window.innerWidth)
      });
      dispatch(setNavbarMenuOpen(false))
    }
  }, [])

  useEffect(() => {
    const calculateYPos = (ref: HTMLElement | null) => {
      if (!ref) return;
      const yPos = ref.getBoundingClientRect().top;
      return yPos + document.documentElement.scrollTop
    }

    blanksRefs.current.forEach((blank: HTMLElement) => {
      blank.style.display = 'block';
    })

    const referenceYPos = calculateYPos(lastProductRef.current);
    blanksRefs.current.forEach((blank: HTMLElement) => {
      if (referenceYPos !== calculateYPos(blank)) {
        blank.style.display = 'none';
      }
    })

  }, [windowWidth, shop.products]);

  return (
    <>
      <Navbar searchBarOnChange={(e) => dispatch(setSearchQuery(e.target.value))}/>
      <div className={`shop_main-container canBeDarkened ${isNavbarMenuOpen ? 'darkened' : ''}`}>
        <div className={`shop_filters-rail ${shop.loading ? 'loading' : ''}`}>
          <ShopFilters />
        </div>
        <div className={`shop_products-container ${shop.loading ? 'notFetched' : ''}`}>

          {shop.loading && Array.from({ length: 40 }, (_, index) => (
            <div key={index} className='product blank-product-loading'></div>
          ))}

          {shop.products.map((product, index) => (
            <Product key={index} product={product} ref={index === shop.products.length - 1 ? lastProductRef : null} windowWidth={windowWidth} />
          ))}

          {shop.error && <PopupText text={`Ha occurrido un error: ${shop.error}`} /> }

          {blankProducts}
        </div>
      </div>
      <div className='footer'>
      </div>
    </>
  )
}

export default Shop