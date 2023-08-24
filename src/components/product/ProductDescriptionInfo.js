import PropTypes from 'prop-types';
import React, { Fragment, useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { getProductCartQuantity } from '../../helpers/product';
import Rating from './sub-components/ProductRating';
import { addToCart } from '../../store/slices/cart-slice';
import { addToWishlist } from '../../store/slices/wishlist-slice';
import { addToCompare } from '../../store/slices/compare-slice';
import './ProductDescriptionInfo.scss';
import CartAPI from '../../api/CartAPI';
import WishListAPI from '../../api/WishListAPI';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ProductDescriptionInfo = ({
  product,
  discountedPrice,
  currency,
  finalDiscountedPrice,
  finalProductPrice,
  cartItems,
  wishlistItem,
  compareItem,
}) => {
  const [selectedBtnAttibute, setSelectedBtnAttibute] = useState({});
  const navigate = useNavigate();

  const handleButtonClick = (attributeName, valueName) => {
    setSelectedBtnAttibute((prevState) => ({ ...prevState, [attributeName]: valueName }));
    handleAttributeChange(attributeName, valueName);
  };

  const isSelected = (attributeName, valueName) => {
    return selectedBtnAttibute[attributeName] === valueName;
  };

  const dispatch = useDispatch();
  const [selectedProductColor, setSelectedProductColor] = useState(
    product.variation ? product.variation[0].color : ''
  );
  const [selectedProductSize, setSelectedProductSize] = useState(
    product.variation ? product.variation[0].size[0].name : ''
  );
  const [productStock, setProductStock] = useState(
    product.variation ? product.variation[0].size[0].stock : product.stock
  );
  const [quantityCount, setQuantityCount] = useState(1);

  const productCartQty = getProductCartQuantity(
    cartItems,
    product,
    selectedProductColor,
    selectedProductSize
  );

  function attributesToString(attributes) {
    if (!Array.isArray(attributes)) {
      return undefined;
    }
    return attributes.map((attr) => `${attr.name}: ${attr.value}`).join(', ');
  }

  const [selectedAttributes, setSelectedAttributes] = useState([]);

  useEffect(() => {
    console.log(selectedAttributes);
    console.log(product.Id, quantityCount, attributesToString(selectedAttributes));
  }, [selectedAttributes]);

  const addWishlist = async () => {
    try {
      
      const response = await WishListAPI.add(product.id);
      console.log(response);

      if (response.error) navigate('/login-register');

      
    } catch (error) {
      console.log(error);
    }
  };

  function handleAttributeChange(attributeName, selectedValue) {
    setSelectedAttributes((prevSelectedAttributes) => {
      const attributesArray = Array.isArray(prevSelectedAttributes) ? prevSelectedAttributes : [];
      const attributeIndex = attributesArray.findIndex((attr) => attr.name === attributeName);
      if (attributeIndex !== -1) {
        // Nếu thuộc tính đã tồn tại trong mảng, ghi đè giá trị của nó
        const updatedAttributes = [...attributesArray];
        updatedAttributes[attributeIndex] = { name: attributeName, value: selectedValue };
        return updatedAttributes;
      } else {
        // Nếu thuộc tính chưa tồn tại trong mảng, thêm vào mảng
        return [...attributesArray, { name: attributeName, value: selectedValue }];
      }
    });
  }

  return (
    <div className="product-details-content ml-70">
      <h1>{product.title}</h1>
      <div className="product-details-price">
        {discountedPrice !== null ? (
          <Fragment>
            <span>{currency.currencySymbol + finalDiscountedPrice}</span>{' '}
            <span className="old">{currency.currencySymbol + finalProductPrice}</span>
          </Fragment>
        ) : (
          <span>{finalProductPrice + " VNĐ"} </span>
        )}
      </div>
      <ToastContainer />
      <div className="attribute">
        <span style={{ fontSize: "30px" }}> {product.address}</span>
      </div>
      {product.rating && product.rating > 0 ? (
        <div className="pro-details-rating-wrap">
          <div className="pro-details-rating">
            <Rating ratingValue={product.rating} />
          </div>
        </div>
      ) : (
        ''
      )}
      <div className="pro-details-list">
        <p style={{ fontSize: "30px" }}>{product.shortDescription}</p>
      </div>

      {product.variation ? (
        <div className="pro-details-size-color">
          <div className="pro-details-color-wrap">
            <span>Color</span>
            <div className="pro-details-color-content">
              {product.variation.map((single, key) => {
                return (
                  <label className={`pro-details-color-content--single ${single.color}`} key={key}>
                    <input
                      type="radio"
                      value={single.color}
                      name="product-color"
                      checked={single.color === selectedProductColor ? 'checked' : ''}
                      onChange={() => {
                        setSelectedProductColor(single.color);
                        setSelectedProductSize(single.size[0].name);
                        setProductStock(single.size[0].stock);
                        setQuantityCount(1);
                      }}
                    />
                    <span className="checkmark"></span>
                  </label>
                );
              })}
            </div>
          </div>
          <div className="pro-details-size">
            <span>Size</span>
            <div className="pro-details-size-content">
              {product.variation &&
                product.variation.map((single) => {
                  return single.color === selectedProductColor
                    ? single.size.map((singleSize, key) => {
                        return (
                          <label className={`pro-details-size-content--single`} key={key}>
                            <input
                              type="radio"
                              value={singleSize.name}
                              checked={singleSize.name === selectedProductSize ? 'checked' : ''}
                              onChange={() => {
                                setSelectedProductSize(singleSize.name);
                                setProductStock(singleSize.stock);
                                setQuantityCount(1);
                              }}
                            />
                            <span className="size-name">{singleSize.name}</span>
                          </label>
                        );
                      })
                    : '';
                })}
            </div>
          </div>
        </div>
      ) : (
        ''
      )}
      {product.affiliateLink ? (
        <div className="pro-details-quality">
          <div className="pro-details-cart btn-hover ml-0">
            <a href={product.affiliateLink} rel="noopener noreferrer" target="_blank">
              Buy Now
            </a>
          </div>
        </div>
      ) : (
        <div className="pro-details-quality">
          <div className="pro-details-wishlist">
            <button
              className={wishlistItem !== undefined ? 'active' : ''}
              disabled={wishlistItem !== undefined}
              title={wishlistItem !== undefined ? 'Added to wishlist' : 'Add to wishlist'}
              onClick={() => {
                dispatch(addToWishlist(product));
                addWishlist();
              }}
            >
              <i className="pe-7s-like" style={{ fontSize: "30px" }} />
            </button>
          </div>
          {/* <div className="pro-details-compare">
            <button
              className={compareItem !== undefined ? "active" : ""}
              disabled={compareItem !== undefined}
              title={
                compareItem !== undefined
                  ? "Added to compare"
                  : "Add to compare"
              }
              onClick={() => dispatch(addToCompare(product))}
            >
              <i className="pe-7s-shuffle" />
            </button>
          </div> */}
        </div>
      )}
      {product.category && product.category.name ? (
        <div className="pro-details-meta">
          <span>Category:</span>
          <ul>
            <li>
              <Link to={process.env.PUBLIC_URL + '/shop-grid-standard'}>{product.category.name}</Link>
            </li>
          </ul>
        </div>
      ) : (
        ''
      )}
      {/* {console.log(product.attributes[0][" attributeValues"][0])} */}
      <div className="attribute">
        <span style={{ fontSize: "30px" }}>Thể Loại: {product.categoryDTO.name}</span>
      </div>
      {product.tag ? (
        <div className="pro-details-meta">
          <span>Tags :</span>
          <ul>
            {product.tag.map((single, key) => {
              return (
                <li key={key}>
                  <Link to={process.env.PUBLIC_URL + '/shop-grid-standard'}>{single}</Link>
                </li>
              );
            })}
          </ul>
        </div>
      ) : (
        ''
      )}

      {/* <div className="pro-details-social">
        <ul>
          <li>
            <a href="//facebook.com">
              <i className="fa fa-facebook" />
            </a>
          </li>
          <li>
            <a href="//dribbble.com">
              <i className="fa fa-dribbble" />
            </a>
          </li>
          <li>
            <a href="//pinterest.com">
              <i className="fa fa-pinterest-p" />
            </a>
          </li>
          <li>
            <a href="//twitter.com">
              <i className="fa fa-twitter" />
            </a>
          </li>
          <li>
            <a href="//linkedin.com">
              <i className="fa fa-linkedin" />
            </a>
          </li>
        </ul>
      </div> */}
    </div>
  );
};

ProductDescriptionInfo.propTypes = {
  cartItems: PropTypes.array,
  compareItem: PropTypes.shape({}),
  currency: PropTypes.shape({}),
  discountedPrice: PropTypes.number,
  finalDiscountedPrice: PropTypes.number,
  finalProductPrice: PropTypes.number,
  product: PropTypes.shape({}),
  wishlistItem: PropTypes.shape({}),
};

export default ProductDescriptionInfo;
