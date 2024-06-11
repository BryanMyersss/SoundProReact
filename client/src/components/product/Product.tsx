import React, { useEffect, useRef, useState } from 'react'
import './Product.css'
import { imageAssets } from '../../constants';
import Prop from './components/Prop';
import ProductInterface, {DisplayName} from '../../interfaces/product.interface';


interface ProductComponentInterface {
  product?: ProductInterface;
  windowWidth?: number;
  language?: keyof DisplayName;
}


const Product = React.forwardRef(({ product, windowWidth, language = 'default' }: ProductComponentInterface, ref: React.Ref<HTMLDivElement>) => {

  // Calculate total owned
  let totalOwned = 0;
  if (product?.stock) {
    product.stock.forEach(stock => {
      totalOwned += Number(stock.qty) || 0;
    });
  }

  // Text element height check
  const [isSmallFormat, setIsSmallFormat] = useState(false);
  const textRef = useRef<HTMLElement>(null);

  let intervalId: NodeJS.Timeout | undefined;
  
  const [isAtDetails, setIsAtDetails] = useState(false);
  function handleProductClick() {
    setIsAtDetails(!isAtDetails);
  }
  
  const imageLinks = product?.images || [];

  useEffect(() => {
    const textElement = textRef.current;
    if (!textElement) return;

    // Get the height of the text element
    const elementHeight = textElement.clientHeight;
    setIsSmallFormat(elementHeight > 24);

    // Clear any existing interval
    if (intervalId) {
      clearInterval(intervalId);
    }

    // Set a new interval after 500ms
    intervalId = setInterval(() => {
      // Your code here
      const textElement = textRef.current;
      if (!textElement) return;

      // Get the height of the text element
      const elementHeight = textElement.clientHeight;
      setIsSmallFormat(elementHeight > 24);
    }, 10);

    // Clean up the interval on component unmount
    return () => {
      clearInterval(intervalId);
    };
  }, [windowWidth]);

  return (
    <div className={`product ${isAtDetails ? 'details' : ''} ${isSmallFormat ? 'small-format' : ''}`} ref={ref} onClick={handleProductClick}>
      <img src={imageLinks[0]} alt="Product" className='product_image' />
      <span className='product_title' ref={textRef} ><b>{product?.manufacturer}</b> {product?.name}</span>
      <hr />
      <span className={`product_category ${isAtDetails ? 'hidden' : ''}`}><b>{product?.priceDay}€</b> un día · {product?.category?.displayName[language]} </span>
      <b className={`product_special-price ${isAtDetails ? 'hidden' : ''}`}>
        Desde 15€ al día
        <span className='product_special-price-hidden-stock'>{isSmallFormat ? ` · Stock total: ${totalOwned}` : ''}</span>
      </b>
      <span className={`product_stock ${isAtDetails ? 'hidden' : ''}`}><b>Stock</b>En propiedad: {totalOwned}</span>
      <div className={`product_location-container ${isAtDetails ? 'hidden' : ''}`}>
        {product?.stock?.map((stock, index) => (
          <div className='product_location' key={index} style={{backgroundColor: stock.location.backgroundColor}}>
            <img src={imageAssets.Location} alt="Location" />
            <span>{stock.location.displayName.default} {stock.qty}/{stock.qty}</span>
          </div>
        ))}
      </div>

      {/* Hidden details tab */}
      <div className={`product_details ${isAtDetails ? '' : 'hidden'}`}>
        <div className="product_details-props">
          {product?.properties?.map(({ prop, propText }) => (
            <Prop key={prop._id} icon={prop.icon} label={prop.displayName?.spanish || prop.displayName?.default || ''}
            text={propText} />
          ))}
        </div>
        <ul className='product_details-bulletpoints'>
          {product?.bulletPoints?.spanish?.map((bulletPoint, index) => (
            <li key={index}>{bulletPoint}</li>
          ))}
        </ul>
      </div>
      {/* Hidden details tab */}

      <hr />
      <div className='product_price'>
        <div className='product_price-prices-container'>
          <span className='product_main-price'>Total: {product?.priceDay ? product?.priceDay * 3 : '0'},00€</span>
          <span className='product_divided-price'>Día: {product?.priceDay},00€</span>
        </div>
        <button className='product_add-to-basket'>
          <img src={imageAssets.ShoppingBasket} alt="Add to cart" />
        </button>
      </div>
    </div>
  )
});

export default Product