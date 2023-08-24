import React from 'react';
import { useTable, useSortBy, usePagination } from 'react-table';
import 'bootstrap/dist/css/bootstrap.min.css';
import './ContentWrapper.css';
import ReactPaginate from 'react-paginate';
import { Button, Modal, Form } from 'react-bootstrap';
import { DropdownButton, Dropdown } from 'react-bootstrap';
import { Breadcrumb } from 'react-bootstrap';
function ContentWrapper() {
  const [products, setProducts] = React.useState([
    {
      id: 1,
      name: 'Product 1',
      price: 10,
    },
    {
      id: 2,
      name: 'Product 2',
      price: 20,
    },
    // Add more rows as needed
  ]);

  const [showAddModal, setShowAddModal] = React.useState(false);
  const [showEditModal, setShowEditModal] = React.useState(false);
  const [showDeleteModal, setShowDeleteModal] = React.useState(false);
  const [selectedProduct, setSelectedProduct] = React.useState(null);
  const [searchText, setSearchText] = React.useState('');

  const columns = React.useMemo(
    () => [
      {
        Header: 'ID',
        accessor: 'id',
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
        Header: 'Action',
        Cell: ({ row }) => (
          <DropdownButton id={`dropdown-button-${row.id}`} title={<i className="fa fa-ellipsis-v"></i>}>
            <Dropdown.Item onClick={() => handleEditClick(row.original.id)}>Edit</Dropdown.Item>
            <Dropdown.Item onClick={() => handleDeleteClick(row.original.id)}>Delete</Dropdown.Item>
          </DropdownButton>
        ),
        id: 'action',
      },
    ],
    []
  );

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    page,
    nextPage,
    previousPage,
    canPreviousPage,
    pageOptions,
    state,
    prepareRow,
  } = useTable({ columns, data: products }, useSortBy, usePagination);

  const handleSearchChange = (event) => {
    setSearchText(event.target.value);
  };

  const filteredProducts = React.useMemo(() => {
    return products.filter((product) => product.name.toLowerCase().includes(searchText.toLowerCase()));
  }, [products, searchText]);

  const handleAddClick = () => {
    setShowAddModal(true);
  };

  const handleAddClose = () => {
    setShowAddModal(false);
  };

  const handleAddSubmit = (event) => {
    event.preventDefault();
    const id = products.length + 1;
    const name = event.target.elements.name.value;
    const price = parseInt(event.target.elements.price.value);
    const newProduct = { id, name, price };
    setProducts([...products, newProduct]);
    setShowAddModal(false);
  };

  const handleEditClick = (productId) => {
    const product = products.find((product) => product.id === productId);
    setSelectedProduct(product);
    setShowEditModal(true);
  };

  const handleEditClose = () => {
    setShowEditModal(false);
  };

  const handleEditSubmit = (event) => {
    event.preventDefault();
    const name = event.target.elements.name.value;
    const price = parseInt(event.target.elements.price.value);
    const updatedProduct = { ...selectedProduct, name, price };
    const updatedProducts = products.map((product) =>
      product.id === selectedProduct.id ? updatedProduct : product
    );
    setProducts(updatedProducts);
    setShowEditModal(false);
  };

  const handleDeleteClick = (productId) => {
    const product = products.find((product) => product.id === productId);
    setSelectedProduct(product);
    setShowDeleteModal(true);
  };

  const handleDeleteClose = () => {
    setShowDeleteModal(false);
  };

  const handleDeleteSubmit = (event) => {
    event.preventDefault();
    const updatedProducts = products.filter((product) => product.id !== selectedProduct.id);
    setProducts(updatedProducts);
    setShowDeleteModal(false);
  };

  return (
    <div className="content-wrapper">
      <Breadcrumb>
        <Breadcrumb.Item href="/admin">Home</Breadcrumb.Item>
        <Breadcrumb.Item active>Products</Breadcrumb.Item>
      </Breadcrumb>
      <div className="d-flex justify-content-between align-items-center mb-3 w-100">
        <div className="search-box">
          <i className="fa fa-search"></i>
          <input
            type="text"
            placeholder="Search products..."
            value={searchText}
            onChange={handleSearchChange}
          />
        </div>
        <button className="btn btn-primary" onClick={handleAddClick}>
          Add Product
        </button>
      </div>
      <table {...getTableProps()} className="table table-bordered table-striped">
        <thead>
          {headerGroups.map((headerGroup) => (
            <tr {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map((column) => (
                <th
                  {...column.getHeaderProps(column.getSortByToggleProps())}
                  className={`${column.isSorted ? (column.isSortedDesc ? 'sort-desc' : 'sort-asc') : ''} ${
                    column.id === 'action' ? 'action-column' : ''
                  }`}
                >
                  {column.render('Header')}
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
          pageCount={pageOptions.length}
          marginPagesDisplayed={2}
          pageRangeDisplayed={5}
          onPageChange={({ selected }) => state.gotoPage(selected)}
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
            <Modal.Title>Add Product</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form.Group controlId="name">
              <Form.Label>Name</Form.Label>
              <Form.Control type="text" placeholder="Enter name" />
            </Form.Group>
            <Form.Group controlId="price">
              <Form.Label>Price</Form.Label>
              <Form.Control type="number" placeholder="Enter price" />
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
            <Modal.Title>Edit Product</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form.Group controlId="name">
              <Form.Label>Name</Form.Label>
              <Form.Control type="text" defaultValue={selectedProduct?.name} />
            </Form.Group>
            <Form.Group controlId="price">
              <Form.Label>Price</Form.Label>
              <Form.Control type="number" defaultValue={selectedProduct?.price} />
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
        <Form onSubmit={handleDeleteSubmit}>
          <Modal.Header closeButton>
            <Modal.Title>Delete Product</Modal.Title>
          </Modal.Header>
          <Modal.Body>Are you sure you want to delete the product?</Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleDeleteClose}>
              Cancel
            </Button>
            <Button variant="danger" type="submit">
              Delete
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </div>
  );
}

export default ContentWrapper;
