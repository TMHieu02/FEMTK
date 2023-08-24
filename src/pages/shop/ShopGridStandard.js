import { Fragment, useState, useEffect } from 'react';
import ReactPaginate from "react-paginate";
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useParams } from 'react-router-dom';
import { getSortedProducts } from '../../helpers/product';
import SEO from '../../components/seo';
import LayoutOne from '../../layouts/LayoutOne';
import Breadcrumb from '../../wrappers/breadcrumb/Breadcrumb';
import ShopSidebar from '../../wrappers/product/ShopSidebar';
import ShopTopbar from '../../wrappers/product/ShopTopbar';
import ShopProducts from '../../wrappers/product/ShopProducts';
import { setProducts, setPaginationProduct } from '../../store/slices/product-slice';
import productAPI from '../../api/ProductAPI';
import queryString from 'query-string';


const ShopGridStandard = () => {
  const [layout, setLayout] = useState('grid three-column');
  const [sortType, setSortType] = useState('');
  const [sortValue, setSortValue] = useState('');
  const [filterSortType, setFilterSortType] = useState('');
  const [filterSortValue, setFilterSortValue] = useState('');
  const [offset, setOffset] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);
  const [currentData, setCurrentData] = useState([]);
  const [sortedProducts, setSortedProducts] = useState([]);
  const { products, pagination } = useSelector((state) => state.product);
  const [totalPages, setTotalPages] = useState(0);
  const location = useLocation();
  const pageLimit = 15;
  let { pathname } = useLocation();
  const dispatch = useDispatch();
  const handlePageChange = (selectedPage) => {
    setCurrentPage(selectedPage.selected);
  };

  useEffect(() => {
    const handleQueryChange = async () => {
      const parsedQuery = queryString.parse(location.search);
      if (!parsedQuery) return;
      try {
        let params = {
          size: 15,
          page: currentPage,
          sortBy: "postDate",
          title: parsedQuery.search ? parsedQuery.search : '',
        };
        let response;
        if (parsedQuery.categoryId) {
            params = {
              size: 15,
              page: currentPage,
              sortBy: "postDate",
            categoryId: parsedQuery.categoryId ? parsedQuery.categoryId : '',
          };
          response = await productAPI.getProductsByCategory(params);
          setTotalPages(Math.ceil(response.data.totalPages));


        }
        else{
            response = await productAPI.searchProduct(params);
            setTotalPages(Math.ceil(response.data.totalPages));

        }
        
        dispatch(setProducts(response.data.posts));
        dispatch(setPaginationProduct(response.data.totalPages));
      } catch (error) {}
      // Perform any action you need when the query string changes
    };

    handleQueryChange();
  }, [location.search, currentPage]);
  const getLayout = (layout) => {
    setLayout(layout);
  };

  const getSortParams = (sortType, sortValue) => {
    setSortType(sortType);
    setSortValue(sortValue);
  };

  const getFilterSortParams = (sortType, sortValue) => {
    setFilterSortType(sortType);
    setFilterSortValue(sortValue);
  };

  useEffect(() => {
    let sortedProducts = getSortedProducts(products, sortType, sortValue);
    const filterSortedProducts = getSortedProducts(sortedProducts, filterSortType, filterSortValue);
    sortedProducts = filterSortedProducts;
    setSortedProducts(sortedProducts);
    setCurrentData(sortedProducts);
  }, [offset, products, sortType, sortValue, filterSortType, filterSortValue]);

  return (
    <Fragment>
      <SEO titleTemplate="Shop Page" description="Shop page of flone react minimalist eCommerce template." />

      <LayoutOne headerTop="visible">
        {/* breadcrumb */}
        <Breadcrumb
          pages={[
            { label: 'Home', path: process.env.PUBLIC_URL + '/' },
            { label: 'Shop', path: process.env.PUBLIC_URL + pathname },
          ]}
        />

        <div className="shop-area pt-95 pb-100">
          <div className="container">
            <div className="row">
              <div className="col-lg-3 order-2 order-lg-1">
                {/* shop sidebar */}
                <ShopSidebar products={products} getSortParams={getSortParams} sideSpaceClass="mr-30" />
              </div>
              <div className="col-lg-9 order-1 order-lg-2">
                {/* shop topbar default */}
                <ShopTopbar
                  getLayout={getLayout}
                  getFilterSortParams={getFilterSortParams}
                  productCount={products?.length}
                  sortedProductCount={currentData?.length}
                />

                {/* shop page content default */}
                <ShopProducts layout={layout} products={currentData} />

                {/* shop product pagination */}
                <div style={{ display: "flex", justifyContent: "center" }}>

            <ReactPaginate
              previousLabel={"Previous"}
              nextLabel={"Next"}
              pageCount={totalPages}
              onPageChange={handlePageChange}
              containerClassName={"pagination"}
              pageClassName={"page-item"}
              pageLinkClassName={"page-link"}
              previousClassName={"page-item"}
              previousLinkClassName={"page-link"}
              nextClassName={"page-item"}
              nextLinkClassName={"page-link"}
              activeClassName={"active"}
              disabledClassName={"disabled"}
            />
            </div>
              </div>
            </div>
          </div>
        </div>
      </LayoutOne>
    </Fragment>
  );
};

export default ShopGridStandard;
