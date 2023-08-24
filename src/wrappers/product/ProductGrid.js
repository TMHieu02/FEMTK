import { Fragment, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import ProductGridSingle from '../../components/product/ProductGridSingle';
import productAPI from '../../api/ProductAPI';
import { setProducts } from '../../store/slices/product-slice';
const ProductGrid = ({ spaceBottomClass, category, type, limit }) => {
  const [isLoading, setIsLoading] = useState(true);
  const dispatch = useDispatch();
  const { products } = useSelector((state) => state.product);
  const currency = useSelector((state) => state.currency);
  const { cartItems } = useSelector((state) => state.cart);
  const { wishlistItems } = useSelector((state) => state.wishlist);

  useEffect(() => {
    const fetchProductList = async () => {
      try {
        const params = { size: 9, page: 0, sortBy: 'postDate' };
        const response = await productAPI.getNewProduct(params);
        console.log(response.data.posts);
        dispatch(setProducts(response.data.posts));
        setIsLoading(false);
      } catch (error) {
        console.log('faild', error);
        setIsLoading(false);
      }
    };

    fetchProductList();
  }, [type]);

  if (isLoading) {
    return (
      <div className="flone-preloader-wrapper">
        <div className="flone-preloader">
          <span></span>
          <span></span>
        </div>
      </div>
    );
  }

  return (
    <Fragment>
      {products &&
        products.length > 0 &&
        products?.map((product) => {
          return (
            <div className="col-xl-3 col-md-6 col-lg-4 col-sm-6" key={product.Id}>
              <ProductGridSingle
                spaceBottomClass={spaceBottomClass}
                product={product}
                currency={currency}
                cartItem={cartItems.find((cartItem) => cartItem.Id === product.Id)}
                wishlistItem={wishlistItems.find((wishlistItem) => wishlistItem.Id === product.Id)}
              />
            </div>
          );
        })}
    </Fragment>
  );
};

ProductGrid.propTypes = {
  spaceBottomClass: PropTypes.string,
  category: PropTypes.string,
  type: PropTypes.string,
  limit: PropTypes.number,
};

export default ProductGrid;
