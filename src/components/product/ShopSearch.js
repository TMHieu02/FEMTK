import { debounce } from 'lodash';
import { useDispatch } from 'react-redux';
import { setProducts } from '../../store/slices/product-slice';
import productAPI from '../../api/ProductAPI';
import { useState } from 'react';

const ShopSearch = () => {
  const [searchText, setSearchText] = useState('');
  const dispatch = useDispatch();

  const debouncedFetchSearch = debounce(async (searchText) => {
    try {
      const params = {
        size: 9,
        page: 0,
        sortBy: 'postDate',
        title: searchText,
      };
      console.log(params);

      const response = await productAPI.searchProduct(params);

      dispatch(setProducts(response.data.posts));
    } catch (error) {
      console.log('faild', error);
    }
  }, 500);

  const handleSearchChange = (event) => {
    setSearchText(event.target.value);
    debouncedFetchSearch(event.target.value);
  };

  return (
    <div className="sidebar-widget">
      <h4 className="pro-sidebar-title">Search </h4>
      <div className="pro-sidebar-search mb-50 mt-25">
        <form className="pro-sidebar-search-form" action="#">
          <input type="text" placeholder="Search here..." value={searchText} onChange={handleSearchChange} />
          <button>
            <i className="pe-7s-search" />
          </button>
        </form>
      </div>
    </div>
  );
};

export default ShopSearch;
