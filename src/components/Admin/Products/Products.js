import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './Product.css';
import { useState } from 'react';
import { useEffect } from 'react';
import 'react-datepicker/dist/react-datepicker.css';
import { useDispatch, useSelector } from 'react-redux';
import { Button, Form, Modal } from 'react-bootstrap';
import ReactPaginate from 'react-paginate';
import { usePagination, useSortBy, useTable } from 'react-table';
import { debounce } from 'lodash';
import { getProductsByStore, getTotalStatisticStore, selectStores } from '../../../store/slices/stores-slice';
import cogoToast from 'cogo-toast';
import { useNavigate } from 'react-router-dom';
import {
  activeProduct,
  fetchProducts,
  selectProducts,
  updateStatus,
} from '../../../store/slices/product-vendor-slice';

function Product() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [showInactiveModel, setshowInactiveModel] = useState(false);
  const [showDisableModel, setShowDisableModel] = useState(false);
  const [currentPage, setCurrentPage] = React.useState(0);
  const [orderBy, setOrderBy] = React.useState('postDate');
  const [searchText, setSearchText] = React.useState('');
  const [selectedId, setSelectedId] = React.useState(null);
  const products = useSelector(selectProducts);
  useEffect(() => {
    dispatch(
      fetchProducts({
        currentPage,
        pageSize: 10,
        searchText,
        orderBy,
      })
    );
  }, [currentPage, orderBy]);
  const columns = React.useMemo(
    () => [
      {
        Header: 'ID',
        accessor: 'id',
        Cell: ({ row }) => {
          const rowIndex = row.index + 1 + currentPage * 10;
          return <div>{rowIndex}</div>;
        },
      },
      {
        Header: 'Name',
        accessor: 'name',
        sortType: 'basic',
      },
      {
        Header: 'Image',
        accessor: 'images',
        Cell: ({ value }) => {
          return (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
              <img
                src={value?.length > 0 ? value[0]?.location : ''}
                alt="Hình ảnh thể loại"
                style={{ width: '150px', height: '150px', objectFit: 'cover' }}
              />
            </div>
          );
        },
      },
      {
        Header: 'Price',
        accessor: 'price',
        sortType: 'basic',
      },
      {
        Header: 'Quantity',
        accessor: 'quantity',
        sortType: 'basic',
      },
      {
        Header: 'Sold',
        accessor: 'sold',
        sortType: 'basic',
      },
      {
        Header: 'Status',
        accessor: 'isActive',
        sortType: 'basic',
        Cell: ({ value }) => {
          return (
            <div
              style={{
                color: value ? 'green' : 'red',
                fontWeight: 'bold',
              }}
            >
              {value ? 'ACTIVE' : 'INACTIVE'}
            </div>
          );
        },
      },
      {
        Header: 'Action',
        Cell: ({ row }) => {
          return (
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              {row.original.isDeleted ? (
                <Button
                  style={{ backgroundColor: '#4CAF50', color: 'white', padding: '5px 10px' }}
                  onClick={() => handleEnable(row.original.Id)}
                >
                  ENABLE
                </Button>
              ) : (
                <Button
                  style={{ backgroundColor: '#f44336', color: 'white', padding: '5px 10px' }}
                  onClick={() => handleDisable(row.original.Id)}
                >
                  DISABLE
                </Button>
              )}
              {!row.original.isActive ? (
                <Button
                  style={{ backgroundColor: '#4CAF50', color: 'white', padding: '5px 10px' }}
                  onClick={() => handleActive(row.original.Id)}
                >
                  ACTIVE
                </Button>
              ) : (
                <Button
                  style={{ backgroundColor: '#f44336', color: 'white', padding: '5px 10px' }}
                  onClick={() => handleInActive(row.original.Id)}
                >
                  INACTIVE
                </Button>
              )}
            </div>
          );
        },
        id: 'action',
      },
    ],
    []
  );

  const { getTableProps, getTableBodyProps, headerGroups, page, prepareRow } = useTable(
    {
      columns,
      data: products.data,
      initialState: { pageIndex: 0 },
      manualPagination: true,
      pageCount: Math.ceil(products.pagination.total / 10),
      manualSortBy: true,
    },
    useSortBy,
    usePagination
  );

  const debouncedFetchOrders = debounce((searchText) => {
    dispatch(
      fetchProducts({
        currentPage,
        pageSize: 10,
        searchText,
        orderBy,
      })
    );
  }, 500);
  const handleAddClick = () => {
    navigate(`/vendor/products/create`);
  };
  const handleSearchChange = (event) => {
    setSearchText(event.target.value);
    debouncedFetchOrders(event.target.value);
  };
  const handleInActiveSubmit = () => {
    setshowInactiveModel(false);
    cogoToast
      .loading('Updating product...', {
        position: 'bottom-right',
      })
      .then(() => {
        return dispatch(activeProduct({ id: selectedId, status: false }));
      })
      .then((res) => {
        if (!res.error)
          cogoToast.info('Successfully edit product', {
            position: 'bottom-right',
            hideAfter: 3,
            onClick: () => console.log('Clicked'),
          });
        else
          cogoToast.error(res.error.message, {
            position: 'bottom-right',
            hideAfter: 3,
            onClick: () => console.log('Clicked'),
          });
      });
  };
  const handleInactiveClose = () => {
    setshowInactiveModel(false);
  };
  const handleActive = (id) => {
    cogoToast
      .loading('Updating product...', {
        position: 'bottom-right',
      })
      .then(() => {
        return dispatch(activeProduct({ id, status: true }));
      })
      .then((res) => {
        if (!res.error)
          cogoToast.info('Successfully edit product', {
            position: 'bottom-right',
            hideAfter: 3,
            onClick: () => console.log('Clicked'),
          });
        else
          cogoToast.error(res.error.message, {
            position: 'bottom-right',
            hideAfter: 3,
            onClick: () => console.log('Clicked'),
          });
      });
  };
  const handleInActive = (id) => {
    setSelectedId(id);
    setshowInactiveModel(true);
  };

  /// deleted

  const handleDisableSubmit = () => {
    setShowDisableModel(false);
    cogoToast
      .loading('Updating product...', {
        position: 'bottom-right',
      })
      .then(() => {
        return dispatch(updateStatus({ id: selectedId, status: true }));
      })
      .then((res) => {
        if (!res.error)
          cogoToast.info('Successfully edit product', {
            position: 'bottom-right',
            hideAfter: 3,
            onClick: () => console.log('Clicked'),
          });
        else
          cogoToast.error(res.error.message, {
            position: 'bottom-right',
            hideAfter: 3,
            onClick: () => console.log('Clicked'),
          });
      });
  };
  const handleDisableClose = () => {
    setShowDisableModel(false);
  };
  const handleEnable = (id) => {
    cogoToast
      .loading('Updating product...', {
        position: 'bottom-right',
      })
      .then(() => {
        return dispatch(updateStatus({ id, status: false }));
      })
      .then((res) => {
        if (!res.error)
          cogoToast.info('Successfully edit product', {
            position: 'bottom-right',
            hideAfter: 3,
            onClick: () => console.log('Clicked'),
          });
        else
          cogoToast.error(res.error.message, {
            position: 'bottom-right',
            hideAfter: 3,
            onClick: () => console.log('Clicked'),
          });
      });
  };
  const handleDisable = (id) => {
    setSelectedId(id);
    setShowDisableModel(true);
  };
  return (
    <div className="content-wrapper">
      <h1 className="title main-title">Product</h1>
      <div className="d-flex justify-content-between align-items-center mb-3 w-100">
        <div className="search-box">
          <span className="search-wrapper">
            <i className="fa fa-search"></i>
            <input
              type="text"
              placeholder="Search orders..."
              value={searchText}
              onChange={handleSearchChange}
            />
          </span>
        </div>
        <button className="btn btn-primary" onClick={handleAddClick}>
          Add Product
        </button>
      </div>
      <table
        {...getTableProps()}
        className="table table-bordered table-striped"
        style={{ textAlign: 'center' }}
      >
        <thead>
          {headerGroups.map((headerGroup) => (
            <tr {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map((column) => (
                <th
                  {...column.getHeaderProps(column.getSortByToggleProps())}
                  onClick={(e) => {
                    column.getSortByToggleProps().onClick(e);
                    setTimeout(() => {
                      if (column.isSorted === true) {
                        if (column.id !== 'id' && column.id !== 'status')
                          setOrderBy(column.isSortedDesc ? `-${column.id}` : column.id);
                        else if (column.id === 'status')
                          setOrderBy(column.isSortedDesc ? '-isDeleted' : 'isDeleted');
                        else setOrderBy(column.isSortedDesc ? '-updateAt' : 'updateAt');
                      } else {
                        setOrderBy('-updateAt');
                      }
                    });
                  }}
                  className={`${column.isSorted ? (column.isSortedDesc ? 'sort-desc' : 'sort-asc') : ''} ${
                    column.id === 'action' ? 'action-column' : ''
                  }`}
                >
                  {column.render('Header')}
                  <span>{column.isSorted ? (column.isSortedDesc ? ' 🔽' : ' 🔼') : ''}</span>
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody {...getTableBodyProps()}>
          {page.map((row) => {
            prepareRow(row);
            return (
              <tr {...row.getRowProps()}>
                {row.cells.map((cell) => {
                  return (
                    <td
                      {...cell.getCellProps()}
                      className={cell.column.id === 'action' ? 'action-column' : ''}
                    >
                      {cell.render('Cell')}
                    </td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
      <div className="pagination-wrapper">
        <ReactPaginate
          containerClassName="pagination"
          pageCount={Math.ceil(products.pagination.total / 10)}
          marginPagesDisplayed={2}
          pageRangeDisplayed={5}
          onPageChange={({ selected }) => setCurrentPage(selected)}
          activeClassName="active"
          previousClassName="page-item"
          nextClassName="page-item"
          pageClassName="page-item"
          breakClassName="page-item"
          pageLinkClassName="page-link"
          previousLinkClassName="page-link"
          nextLinkClassName="page-link"
          breakLinkClassName="page-link"
          disableInitialCallback={true}
        />
      </div>
      <Modal show={showInactiveModel} onHide={handleInactiveClose} centered>
        <Form onSubmit={handleInActiveSubmit}>
          <Modal.Header closeButton>
            <Modal.Title>InActive Product</Modal.Title>
          </Modal.Header>
          <Modal.Body>Are you sure you want to InActive the product?</Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleInactiveClose}>
              Cancel
            </Button>
            <Button variant="danger" type="submit">
              InActive
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
      <Modal show={showDisableModel} onHide={handleDisableClose} centered>
        <Form onSubmit={handleDisableSubmit}>
          <Modal.Header closeButton>
            <Modal.Title>Disable Product</Modal.Title>
          </Modal.Header>
          <Modal.Body>Are you sure you want to disable the product?</Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleDisableClose}>
              Cancel
            </Button>
            <Button variant="danger" type="submit">
              Disable
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </div>
  );
}

export default Product;
