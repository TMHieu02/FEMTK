import { Fragment } from 'react';
import SEO from '../../components/seo';
import LayoutOne from '../../layouts/LayoutOne';
import TabProduct from '../../wrappers/product/TabProduct';
import HeroSliderEleven from '../../wrappers/hero-slider/HeroSliderEleven';
import { Link } from 'react-router-dom';

const HomeFashion = () => {
  return (
    <Fragment>
      <SEO
        titleTemplate="Fashion Home"
        description="Fashion home of flone react minimalist eCommerce template."
      />
      <LayoutOne headerContainerClass="container-fluid" headerPaddingClass="header-padding-1">
        {/* hero slider */}
        <HeroSliderEleven />

        {/* featured icon */}
        {/* <FeatureIcon spaceTopClass="pt-100" spaceBottomClass="pb-60" /> */}

        {/* tab product */}
        <TabProduct spaceBottomClass="pb-60" category="fashion" />

        <div class="d-flex justify-content-center">
          <Link to={'/shop-grid-standard'} className="btn btn-lg btn-primary">
            Xem thêm
          </Link>
        </div>
      </LayoutOne>
    </Fragment>
  );
};

export default HomeFashion;
