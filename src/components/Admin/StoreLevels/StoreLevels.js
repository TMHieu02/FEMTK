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
  fetchStoreLevels,
  updateStoreLevel,
  selectStoreLevels,
  addStoreLevel,
} from '../../../store/slices/store-levels-slice';
import cogoToast from 'cogo-toast';

function StoreLevels() {
  const dispatch = useDispatch();
  const storeLevels = useSelector(selectStoreLevels);

  const [showAddModal, setShowAddModal] = React.useState(false);
  const [showEditModal, setShowEditModal] = React.useState(false);
  const [showDeleteModal, setShowDeleteModal] = React.useState(false);
  const [selectedStoreLevel, setSelectedStoreLevel] = React.useState(null);
  const [searchText, setSearchText] = React.useState('');
  const [currentPage, setCurrentPage] = React.useState(0);
  const [size] = React.useState(5);
  const [orderBy, setOrderBy] = React.useState('-updateAt');
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
        Header: 'Min Point',
        accessor: 'minPoint',
        sortType: 'basic',
      },
      {
        Header: 'Discount',
        accessor: 'discount',
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
    [storeLevels]
  );

  const { getTableProps, getTableBodyProps, headerGroups, page, prepareRow } = useTable(
    {
      columns,
      data: storeLevels.data,
      initialState: { pageIndex: 0 },
      manualPagination: true,
      pageCount: Math.ceil(storeLevels.pagination.total / size),
      manualSortBy: true,
    },
    useSortBy,
    usePagination
  );

  useEffect(() => {
    dispatch(fetchStoreLevels({ currentPage, pageSize: size, searchText, orderBy }));
  }, [currentPage, orderBy]);

  const debouncedFetchStoreLevels = debounce((searchText) => {
    dispatch(fetchStoreLevels({ currentPage, pageSize: size, searchText, orderBy }));
  }, 500);

  const handleSearchChange = (event) => {
    setSearchText(event.target.value);
    debouncedFetchStoreLevels(event.target.value);
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
    const minPoint = parseInt(event.target.elements.minPoint.value);
    const discount = parseFloat(event.target.elements.discount.value);
    const newStoreLevel = { name, minPoint, discount };
    cogoToast
      .loading('Adding new store level...', {
        position: 'bottom-right',
      })
      .then(() => dispatch(addStoreLevel(newStoreLevel)))
      .then((res) => {
        if (!res.error)
          cogoToast.success('Successfully add new store level', {
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
    (storeLevelId) => {
      const storeLevel = storeLevels.data.find((storeLevel) => storeLevel.Id === storeLevelId);
      setSelectedStoreLevel(storeLevel);
      setShowEditModal(true);
    },
    [storeLevels]
  );
  const handleEditClose = () => {
    setShowEditModal(false);
  };

  const handleEditSubmit = (event) => {
    event.preventDefault();
    const name = event.target.elements.name.value;
    const minPoint = parseInt(event.target.elements.minPoint.value);
    const discount = parseFloat(event.target.elements.discount.value);
    const updatedStoreLevel = { ...selectedStoreLevel, name, minPoint, discount };
    cogoToast
      .loading('Updating store level...', {
        position: 'bottom-right',
      })
      .then(() => {
        return dispatch(updateStoreLevel(updatedStoreLevel));
      })
      .then((res) => {
        if (!res.error)
          cogoToast.info('Successfully edit store level', {
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

  const handleUpdateStatus = (stauts, storeLevelId) => {
    const storeLevel = storeLevels.data.find((storeLevel) => storeLevel.Id === storeLevelId);
    setSelectedStoreLevel(storeLevel);
    if (stauts === true) {
      cogoToast
        .loading('Enabling store level...', {
          position: 'bottom-right',
        })
        .then(() => dispatch(updateStoreLevel({ Id: selectedStoreLevel.Id, isDeleted: false })))
        .then((res) => {
          if (!res.error)
            cogoToast.info('Successfully edit store level', {
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
      .loading('Disabling store level...', {
        position: 'bottom-right',
      })
      .then(() => dispatch(updateStoreLevel({ Id: selectedStoreLevel.Id, isDeleted: true })))
      .then((res) => {
        if (!res.error)
          cogoToast.info('Successfully disable store level', {
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
        <Breadcrumb.Item active>StoreLevels</Breadcrumb.Item>
      </Breadcrumb>
      <div className="d-flex justify-content-between align-items-center mb-3 w-100">
        <div className="search-box">
          <i className="fa fa-search"></i>
          <input
            type="text"
            placeholder="Search storeLevels..."
            value={searchText}
            onChange={handleSearchChange}
          />
        </div>
        <button className="btn btn-primary" onClick={handleAddClick}>
          Add Store Level
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
          pageCount={Math.ceil(storeLevels.pagination.total / size)}
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
            <Modal.Title>Add Store Level</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form.Group controlId="name">
              <Form.Label>Name</Form.Label>
              <Form.Control type="text" placeholder="Enter name" />
            </Form.Group>
            <Form.Group controlId="minPoint">
              <Form.Label>minPoint</Form.Label>
              <Form.Control type="number" min="0" placeholder="Enter min point" />
            </Form.Group>
            <Form.Group controlId="discount">
              <Form.Label>discount</Form.Label>
              <Form.Control type="number" placeholder="Enter discount" min="0" max="1" step="0.01" />
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
            <Modal.Title>Edit Store Level</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form.Group controlId="name">
              <Form.Label>Name</Form.Label>
              <Form.Control type="text" defaultValue={selectedStoreLevel?.name} />
            </Form.Group>
            <Form.Group controlId="discount">
              <Form.Label>Discount</Form.Label>
              <Form.Control
                type="number"
                defaultValue={selectedStoreLevel?.discount}
                min="0"
                max="1"
                step="0.01"
              />
            </Form.Group>
            <Form.Group controlId="minPoint">
              <Form.Label>Min Point</Form.Label>
              <Form.Control type="number" defaultValue={selectedStoreLevel?.minPoint} min="0" />
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
            <Modal.Title>Disable Store level</Modal.Title>
          </Modal.Header>
          <Modal.Body>Are you sure you want to disable the store level?</Modal.Body>
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

export default React.memo(StoreLevels);
