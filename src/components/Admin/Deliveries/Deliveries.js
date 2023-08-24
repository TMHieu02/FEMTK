import React, { useEffect } from 'react';
import { useTable, useSortBy, usePagination } from 'react-table';
import 'bootstrap/dist/css/bootstrap.min.css';
import ReactPaginate from 'react-paginate';
import { Button, Modal, Form } from 'react-bootstrap';
import { DropdownButton, Dropdown } from 'react-bootstrap';
import { Breadcrumb } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { debounce } from 'lodash';
import {
  fetchDeliveries,
  updateDelivery,
  selectDeliveries,
  addDelivery,
} from '../../../store/slices/deliveries-slice';
import cogoToast from 'cogo-toast';

function Deliveries() {
  const dispatch = useDispatch();
  const deliveries = useSelector(selectDeliveries);

  const [showAddModal, setShowAddModal] = React.useState(false);
  const [showEditModal, setShowEditModal] = React.useState(false);
  const [showDeleteModal, setShowDeleteModal] = React.useState(false);
  const [selectedDelivery, setSelectedDelivery] = React.useState(null);
  const [searchText, setSearchText] = React.useState('');
  const [currentPage, setCurrentPage] = React.useState(0);
  const [orderBy, setOrderBy] = React.useState('-updateAt');
  const [size] = React.useState(5);
  const columns = React.useMemo(
    () => [
      {
        Header: 'ID',
        accessor: 'id',
        Cell: ({ row }) => {
          const rowIndex = row.index + 1 + currentPage * size;
          return <div>{rowIndex}</div>;
        },
      },
      {
        Header: 'Name',
        accessor: 'name',
      },
      {
        Header: 'Price',
        accessor: 'price',
        sortType: 'basic',
      },
      {
        Header: 'Description',
        accessor: 'description',
        sortType: 'basic',
      },
      {
        Header: 'Status',
        accessor: 'isDeleted',
        sortType: 'basic',
        Cell: ({ value }) => {
          return (
            <div
              style={{
                color: !value ? 'green' : 'red',
                fontWeight: 'bold',
              }}
            >
              {!value ? 'ACTIVE' : 'INACTIVE'}
            </div>
          );
        },
      },
      {
        Header: 'Action',
        Cell: ({ row }) => {
          const isActive = !row.original.isDeleted;
          return (
            <DropdownButton id={`dropdown-button-${row.id}`} title={<i className="fa fa-ellipsis-v"></i>}>
              <Dropdown.Item style={{ color: 'blue' }} onClick={() => handleEditClick(row.original.Id)}>
                Edit
              </Dropdown.Item>
              {isActive ? (
                <Dropdown.Item
                  style={{ color: 'red' }}
                  onClick={() => handleUpdateStatus(false, row.original.Id)}
                >
                  Disable
                </Dropdown.Item>
              ) : (
                <Dropdown.Item
                  style={{ color: 'green' }}
                  onClick={() => handleUpdateStatus(true, row.original.Id)}
                >
                  Enable
                </Dropdown.Item>
              )}
            </DropdownButton>
          );
        },
        id: 'action',
      },
    ],
    [deliveries]
  );

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    page,
    prepareRow,
    // state: { sortBy },
  } = useTable(
    {
      columns,
      data: deliveries.data,
      initialState: { pageIndex: 0 },
      manualPagination: true,
      pageCount: Math.ceil(deliveries.pagination.total / size),
      manualSortBy: true,
    },
    useSortBy,
    usePagination
  );

  useEffect(() => {
    dispatch(fetchDeliveries({ currentPage, pageSize: size, searchText, orderBy }));
  }, [currentPage, orderBy]);

  const debouncedFetchDeliveries = debounce((searchText) => {
    dispatch(fetchDeliveries({ currentPage, pageSize: size, searchText, orderBy }));
  }, 500);

  const handleSearchChange = (event) => {
    setSearchText(event.target.value);
    debouncedFetchDeliveries(event.target.value);
  };

  const handleAddClick = () => {
    setShowAddModal(true);
  };

  const handleAddClose = () => {
    setShowAddModal(false);
  };

  const handleAddSubmit = (event) => {
    event.preventDefault();
    const name = event.target.elements.name.value;
    const price = parseInt(event.target.elements.price.value);
    const description = event.target.elements.description.value;
    const newDelivery = { name, price, description };
    cogoToast
      .loading('Adding new delivery...', {
        position: 'bottom-right',
      })
      .then(() => dispatch(addDelivery(newDelivery)))
      .then((res) => {
        if (!res.error)
          cogoToast.success('Successfully add new delivery', {
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
    setShowAddModal(false);
  };
  const handleEditClick = React.useCallback(
    (deliveryId) => {
      const delivery = deliveries.data.find((delivery) => delivery.Id === deliveryId);
      setSelectedDelivery(delivery);
      setShowEditModal(true);
    },
    [deliveries]
  );
  const handleEditClose = () => {
    setShowEditModal(false);
  };

  const handleEditSubmit = (event) => {
    event.preventDefault();
    const name = event.target.elements.name.value;
    const price = parseInt(event.target.elements.price.value);
    const description = event.target.elements.description.value;
    const updatedDelivery = { ...selectedDelivery, name, price, description };
    cogoToast
      .loading('Updating delivery...', {
        position: 'bottom-right',
      })
      .then(() => {
        return dispatch(updateDelivery(updatedDelivery));
      })
      .then((res) => {
        if (!res.error)
          cogoToast.info('Successfully edit delivery', {
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

    setShowEditModal(false);
  };

  const handleUpdateStatus = (stauts, deliveryId) => {
    const delivery = deliveries.data.find((delivery) => delivery.Id === deliveryId);
    setSelectedDelivery(delivery);
    if (stauts === true) {
      cogoToast
        .loading('Enabling delivery...', {
          position: 'bottom-right',
        })
        .then(() => dispatch(updateDelivery({ Id: selectedDelivery.Id, isDeleted: false })))
        .then((res) => {
          if (!res.error)
            cogoToast.info('Successfully edit delivery', {
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
    } else {
      setShowDeleteModal(true);
    }
  };

  const handleUpdateStatusSubmit = (event) => {
    event.preventDefault();
    cogoToast
      .loading('Disabling delivery...', {
        position: 'bottom-right',
      })
      .then(() => dispatch(updateDelivery({ Id: selectedDelivery.Id, isDeleted: true })))
      .then((res) => {
        if (!res.error)
          cogoToast.info('Successfully edit delivery', {
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
    setShowDeleteModal(false);
  };

  const handleDeleteClose = () => {
    setShowDeleteModal(false);
  };

  return (
    <div className="content-wrapper">
      <Breadcrumb>
        <Breadcrumb.Item href="/admin">Home</Breadcrumb.Item>
        <Breadcrumb.Item active>Deliveries</Breadcrumb.Item>
      </Breadcrumb>
      <div className="d-flex justify-content-between align-items-center mb-3 w-100">
        <div className="search-box">
          <i className="fa fa-search"></i>
          <input
            type="text"
            placeholder="Search deliveries..."
            value={searchText}
            onChange={handleSearchChange}
          />
        </div>
        <button className="btn btn-primary" onClick={handleAddClick}>
          Add Delivery
        </button>
      </div>
      <table {...getTableProps()} className="table table-bordered table-striped">
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
          pageCount={Math.ceil(deliveries.pagination.total / size)}
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
      <Modal show={showAddModal} onHide={handleAddClose} centered>
        <Form onSubmit={handleAddSubmit}>
          <Modal.Header closeButton>
            <Modal.Title>Add Delivery</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form.Group controlId="name">
              <Form.Label>Name</Form.Label>
              <Form.Control type="text" placeholder="Enter name" />
            </Form.Group>
            <Form.Group controlId="price">
              <Form.Label>Price</Form.Label>
              <Form.Control type="number" min="0" placeholder="Enter min point" />
            </Form.Group>
            <Form.Group controlId="description">
              <Form.Label>Description</Form.Label>
              <Form.Control type="text" placeholder="Enter description" />
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleAddClose}>
              Cancel
            </Button>
            <Button variant="primary" type="submit">
              Add
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
      <Modal show={showEditModal} onHide={handleEditClose} centered>
        <Form onSubmit={handleEditSubmit}>
          <Modal.Header closeButton>
            <Modal.Title>Edit Delivery</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form.Group controlId="name">
              <Form.Label>Name</Form.Label>
              <Form.Control type="text" defaultValue={selectedDelivery?.name} />
            </Form.Group>
            <Form.Group controlId="price">
              <Form.Label>Price</Form.Label>
              <Form.Control type="number" defaultValue={selectedDelivery?.price} min="0" />
            </Form.Group>
            <Form.Group controlId="description">
              <Form.Label>Description</Form.Label>
              <Form.Control type="text" defaultValue={selectedDelivery?.description} />
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleEditClose}>
              Cancel
            </Button>
            <Button variant="primary" type="submit">
              Save Changes
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
      <Modal show={showDeleteModal} onHide={handleDeleteClose} centered>
        <Form onSubmit={handleUpdateStatusSubmit}>
          <Modal.Header closeButton>
            <Modal.Title>Disable Delivery</Modal.Title>
          </Modal.Header>
          <Modal.Body>Are you sure you want to disable the delivery?</Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleDeleteClose}>
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

export default React.memo(Deliveries);
