import PropTypes from 'prop-types';
import clsx from 'clsx';
import ShopSearch from '../../components/product/ShopSearch';
import ShopCategories from '../../components/product/ShopCategories';

const ShopSidebar = ({ products, getSortParams, sideSpaceClass }) => {
  return (
    <div className={clsx('sidebar-style', sideSpaceClass)}>
      {/* shop search */}
      <ShopSearch />

      {/* filter by categories */}
      <ShopCategories getSortParams={getSortParams} />

      {/* filter by color */}
      {/* <ShopColor colors={uniqueColors} getSortParams={getSortParams} /> */}

      {/* filter by size */}
      {/* <ShopSize sizes={uniqueSizes} getSortParams={getSortParams} /> */}

      {/* filter by tag */}
    </div>
  );
};

ShopSidebar.propTypes = {
  getSortParams: PropTypes.func,
  products: PropTypes.array,
  sideSpaceClass: PropTypes.string,
};

export default ShopSidebar;
