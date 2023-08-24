import PropTypes from 'prop-types';
import clsx from 'clsx';
import Tab from 'react-bootstrap/Tab';
import Nav from 'react-bootstrap/Nav';
import { useState } from 'react';
import { FaStar } from 'react-icons/fa';
import { useEffect } from 'react';
import ReviewAPI from '../../api/ReviewAPI';
import { set } from 'lodash';

const ProductDescriptionTab = ({ spaceBottomClass, productFullDesc, product }) => {
  const [hover, setHover] = useState(null);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  let [reviews, setReviews] = useState([]);
  const [checkBuy, setCheckBuy] = useState(false);
  const handleSubmitComment = async (e) => {
    e.preventDefault();
    if (!checkBuy) {
      alert('bạn phải mua hàng mới được đánh giá.');
    }
    if (comment.trim() === '' || rating === 0) return;
    const res = await ReviewAPI.createReview({
      content: comment,
      rating: rating,
      productId: product.Id,
    });
    if (!res.error) {
      setComment('');
      setRating(5);
      setReviews([...reviews, res.data]);
    }
  };
  useEffect(() => {
    const getPreview = async () => {
      // const [reviews, checkBuy] = await Promise.all([
      //   ReviewAPI.getReviewByProduct(product.Id),
      //   ReviewAPI.checkBuy(product.Id),
      // ]);
      const reviews = await ReviewAPI.getReviewByProduct(product.Id);
      setReviews(reviews.data);
      const checkBuy = await ReviewAPI.checkBuy(product.Id);
      setCheckBuy(checkBuy.data);
    };
    getPreview();
  }, []);
  const disabledStyle = {
    pointerEvents: 'none',
    opacity: 0.5,
  };
  return (
    <div className={clsx('description-review-area', spaceBottomClass)}>
      <div className="container">
        <div className="description-review-wrapper">
          <Tab.Container defaultActiveKey="productDescription">
            <Nav variant="pills" className="description-review-topbar">
              <Nav.Item>
                <Nav.Link eventKey="productDescription">Sản phẩm</Nav.Link>
              </Nav.Item>
            </Nav>
            <Tab.Content className="description-review-bottom">
              <Tab.Pane eventKey="additionalInfo">
                <div className="product-anotherinfo-wrapper">
                  <p>{product.categoryDTO.name}</p>
                </div>
              </Tab.Pane>
              <Tab.Pane eventKey="productDescription"><p style={{fontSize : "20px"}}>{productFullDesc}</p> </Tab.Pane>
              
            </Tab.Content>
          </Tab.Container>
        </div>
      </div>
    </div>
  );
};

ProductDescriptionTab.propTypes = {
  productFullDesc: PropTypes.string,
  spaceBottomClass: PropTypes.string,
  product: PropTypes.shape({}),
};

export default ProductDescriptionTab;
