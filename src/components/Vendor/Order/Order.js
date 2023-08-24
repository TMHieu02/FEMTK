import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './Order.css';
import { useState } from 'react';
import { useEffect } from 'react';
import 'react-datepicker/dist/react-datepicker.css';
import { useDispatch, useSelector } from 'react-redux';
import { Button, Dropdown, Form, Modal } from 'react-bootstrap';
import ReactPaginate from 'react-paginate';
import { usePagination, useSortBy, useTable } from 'react-table';
import { debounce } from 'lodash';
import { getOrdersByMyStore, getTotalStatisticStore, selectStores } from '../../../store/slices/stores-slice';
import { acceptOrder, cancelOrder, selectOrders } from '../../../store/slices/orders-slice';
import cogoToast from 'cogo-toast';
import { Link } from 'react-router-dom';
function Order() {
  const dispatch = useDispatch();
  const [showCancelOrder, setShowCancelOrder] = useState(false);
  const [showAcceptOrder, setShowAcceptOrder] = useState(false);
  const [currentPage, setCurrentPage] = React.useState(0);
  const [orderBy, setOrderBy] = React.useState('-updateAt');
  const [searchText, setSearchText] = React.useState('');
  const [selectedId, setSelectedId] = React.useState(null);
  const [selectedStatus, setSelectedStatus] = React.useState({ key: 0, value: 'Tất cả' });
  const stores = useSelector(selectStores);

  useEffect(() => {
    dispatch(
      getOrdersByMyStore({
        currentPage,
        pageSize: 10,
        searchText,
        orderBy,
        otherCondition: selectedStatus.key === 0 ? null : `&status%7B%7Beq%7D%7D=${selectedStatus.key - 1}`,
      })
    );
  }, [currentPage, orderBy, selectedStatus]);
  const columns = React.useMemo(() => {
    const baseColumns = [
      {
        Header: 'OrderID',
        accessor: 'code',
        Cell: ({ row }) => {
          console.log(row.original);
          return (
            <div>
              <Link to={`/vendor/orders/${row.original.Id}`}>{row.original.code}</Link>
            </div>
          );
        },
      },
      {
        Header: 'Order Item',
        accessor: 'orderItems',
        Cell: ({ value }) => {
          return <div>{value?.map((x) => x.product.name).join(', ')}</div>;
        },
      },
      {
        Header: 'Money',
        accessor: 'amountToStore',
        Cell: ({ value }) => {
          return <div>{(value ? value?.toString() : 0) + ' VND'}</div>;
        },
      },
      {
        Header: 'COD',
        accessor: 'description',
        Cell: ({ value }) => {
          return (
            <div>
              {
                <div
                  style={{
                    color: value?.isPaidBefore ? 'green' : 'red',
                    fontWeight: 'bold',
                  }}
                >
                  {!value ? 'TRUE' : 'FALSE'}
                </div>
              }
            </div>
          );
        },
      },
      {
        Header: 'Status',
        accessor: 'status',
        Cell: ({ value }) => {
          return <div>{displayStatus(value)}</div>;
        },
      },
    ];
    if (selectedStatus.key == 1 || selectedStatus.key == 0) {
      baseColumns.push({
        Header: 'Action',
        Cell: ({ row }) => {
          if (row.original.status == 0)
            return (
              <div style={{ display: 'flex', justifyContent: 'space-evenly', alignItems: 'center' }}>
                <Button
                  style={{ backgroundColor: '#4CAF50', color: 'white', padding: '5px 10px' }}
                  onClick={() => handleAcceptClick(row.original.Id)}
                >
                  Accept
                </Button>
                <Button
                  style={{ backgroundColor: '#f44336', color: 'white', padding: '5px 10px' }}
                  onClick={() => handleCancelClick(row.original.Id)}
                >
                  Cancel
                </Button>
              </div>
            );
          else return <div>Not Permission</div>;
        },
        id: 'action',
      });
    }
    return baseColumns;
  }, [selectedStatus]);

  const displayStatus = (value) => {
    switch (value) {
      case '0':
        return 'Đang chờ xử lý';
      case '1':
        return 'Đang xử lý';
      case '2':
        return 'Đang vận chuyển';
      case '3':
        return 'Đã nhận hàng';
      default:
        return 'Đã hủy';
    }
  };
  const { getTableProps, getTableBodyProps, headerGroups, page, prepareRow } = useTable(
    {
      columns,
      data: stores.data,
      initialState: { pageIndex: 0 },
      manualPagination: true,
      pageCount: Math.ceil(stores.pagination.total / 10),
      manualSortBy: true,
    },
    useSortBy,
    usePagination
  );

  const debouncedFetchOrders = debounce((searchText) => {
    dispatch(
      getOrdersByMyStore({
        currentPage,
        pageSize: 10,
        searchText,
        orderBy,
        otherCondition: selectedStatus.key === 0 ? null : `&status%7B%7Beq%7D%7D=${selectedStatus.key - 1}`,
      })
    );
  }, 500);

  const handleSearchChange = (event) => {
    setSearchText(event.target.value);
    debouncedFetchOrders(event.target.value);
  };
  const handleAcceptClick = (id) => {
    setSelectedId(id);
    setShowAcceptOrder(true);
  };
  const handleCancelClick = (id) => {
    setSelectedId(id);
    setShowCancelOrder(true);
  };
  const handleConfirmOrderClose = (id) => {
    setShowAcceptOrder(false);
  };
  const handleCancelClose = (id) => {
    setShowCancelOrder(false);
  };
  const handleCancelOrder = (e) => {
    e.preventDefault();
    cogoToast
      .loading('Updating...', {
        position: 'bottom-right',
      })
      .then(() => dispatch(cancelOrder(selectedId)))
      .then((res) => {
        if (!res.error)
          cogoToast.success('Successfully Cancel Order', {
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
    setShowCancelOrder(false);
  };
  const handleConfirmOrder = (e) => {
    e.preventDefault();
    cogoToast
      .loading('Updating...', {
        position: 'bottom-right',
      })
      .then(() => dispatch(acceptOrder(selectedId)))
      .then((res) => {
        if (!res.error) {
          cogoToast.success('Successfully Accept Order', {
            position: 'bottom-right',
            hideAfter: 3,
            onClick: () => console.log('Clicked'),
          });
          setTimeout(function () {
            window.location.reload();
          }, 3000);
        } else
          cogoToast.error(res.error.message, {
            position: 'bottom-right',
            hideAfter: 3,
            onClick: () => console.log('Clicked'),
          });
      });
    setShowAcceptOrder(false);
  };
  useEffect(() => {}, [selectedStatus]);
  return (
    <div className="content-wrapper">
      <h1 className="title main-title">Order</h1>
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
        <Dropdown>
          <Dropdown.Toggle variant="secondary" id="statusDropdown" style={{ maxWidth: '200px' }}>
            {selectedStatus.value || 'Chọn trạng thái'}
          </Dropdown.Toggle>
          <Dropdown.Menu>
            <Dropdown.Item
              eventKey={selectedStatus}
              onClick={() => setSelectedStatus({ key: 0, value: 'Tất cả' })}
            >
              Tất cả
            </Dropdown.Item>
            <Dropdown.Item onClick={() => setSelectedStatus({ key: 1, value: 'Đang chờ xử lý' })}>
              Đang chờ xử lý
            </Dropdown.Item>
            <Dropdown.Item onClick={() => setSelectedStatus({ key: 2, value: 'Đang xử lý' })}>
              Đang xử lý
            </Dropdown.Item>
            <Dropdown.Item onClick={() => setSelectedStatus({ key: 3, value: 'Đang vận chuyển' })}>
              Đang vận chuyển
            </Dropdown.Item>
            <Dropdown.Item onClick={() => setSelectedStatus({ key: 4, value: 'Đã nhận hàng' })}>
              Đã nhận hàng
            </Dropdown.Item>
            <Dropdown.Item onClick={() => setSelectedStatus({ key: 5, value: 'Đã hủy' })}>
              Đã hủy
            </Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
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
          pageCount={Math.ceil(stores.pagination.total / 10)}
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
      <Modal show={showAcceptOrder} onHide={handleConfirmOrderClose} centered backdrop="static">
        <Form onSubmit={handleConfirmOrder}>
          <Modal.Header closeButton>
            <Modal.Title>Confirm Order</Modal.Title>
          </Modal.Header>
          <Modal.Body>Are you sure to confirm this order?</Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleConfirmOrderClose}>
              Cancel
            </Button>
            <Button type="submit" variant="danger">
              Confirm
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
      <Modal show={showCancelOrder} onHide={handleCancelClose} centered backdrop="static">
        <Form onSubmit={handleCancelOrder}>
          <Modal.Header closeButton>
            <Modal.Title>Cancel Order</Modal.Title>
          </Modal.Header>
          <Modal.Body>Are you sure to cancel this Order?</Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleCancelClose}>
              No
            </Button>
            <Button type="submit" variant="danger">
              Yes
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </div>
  );
}

export default Order;
