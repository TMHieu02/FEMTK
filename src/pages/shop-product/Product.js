import React, { Fragment, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useParams, useLocation } from 'react-router-dom';
import SEO from '../../components/seo';
import LayoutOne from '../../layouts/LayoutOne';
import Breadcrumb from '../../wrappers/breadcrumb/Breadcrumb';
import RelatedProductSlider from '../../wrappers/product/RelatedProductSlider';
import ProductDescriptionTab from '../../wrappers/product/ProductDescriptionTab';
import ProductImageDescription from '../../wrappers/product/ProductImageDescription';
import ProductAPI from '../../api/ProductAPI';

const Product = () => {
  let { pathname } = useLocation();
  let { Id } = useParams();
  // const { products } = useSelector((state) => state.product);
  // const product = products.find(product => product.Id === Id);
  const [isLoading, setIsLoading] = useState(true);
  const [product, setProduct] = useState({});

  useEffect(() => {
    const getProduct = async () => {
      console.log(Id);

      try {
        const response = await ProductAPI.getPost(Id);
        setProduct(response.data);
        setIsLoading(false);
      } catch (error) {
        console.log('faild to fetch product: ', error);
      }
    };
    getProduct();
  }, []);

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
      <SEO
        titleTemplate="Product Page"
        description="Product Page of flone react minimalist eCommerce template."
      />

      <LayoutOne headerTop="visible">
        {/* breadcrumb */}
        <Breadcrumb
          pages={[
            { label: 'Home', path: process.env.PUBLIC_URL + '/' },
            { label: 'Post', path: process.env.PUBLIC_URL + pathname },
          ]}
        />

        {/* product description with image */}
        <ProductImageDescription spaceTopClass="pt-100" spaceBottomClass="pb-100" product={product} />

        {/* product description tab */}
        <ProductDescriptionTab
          spaceBottomClass="pb-90"
          productFullDesc={product.description}
          product={product}
        />

        {/* related product slider */}
        <RelatedProductSlider spaceBottomClass="pb-95" category={'product.category[0]'} />
      </LayoutOne>
    </Fragment>
  );
};

export default Product;
