import React, { useEffect } from 'react';
import { useTable, useSortBy, usePagination } from 'react-table';
import 'bootstrap/dist/css/bootstrap.min.css';
import ReactPaginate from 'react-paginate';
import { Form, Button, Modal, DropdownButton, Dropdown } from 'react-bootstrap';
import { Breadcrumb } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { debounce } from 'lodash';
import Select from 'react-select';
import {
  fetchCategories,
  updateCategory,
  selectCategories,
  addCategory,
  fetchAllCategories,
} from '../../../store/slices/categories-slice';
import cogoToast from 'cogo-toast';

function Categories() {
  const dispatch = useDispatch();
  const categories = useSelector(selectCategories);

  const [showAddModal, setShowAddModal] = React.useState(false);
  const [showEditModal, setShowEditModal] = React.useState(false);
  const [showDeleteModal, setShowDeleteModal] = React.useState(false);
  const [selectedCategory, setSelectedCategory] = React.useState(null);
  const [searchText, setSearchText] = React.useState('');
  const [currentPage, setCurrentPage] = React.useState(0);
  const [size] = React.useState(5);
  const [orderBy, setOrderBy] = React.useState('updateAt');
  const [imagePreviewUrl, setImagePreviewUrl] = React.useState('');
  const [parentCategory, setParentCategory] = React.useState(null);

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
        Header: 'Image',
        accessor: 'image',
        Cell: ({ value }) => {
          return (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
              <img
                src={value}
                alt="Hình ảnh thể loại"
                style={{ width: '150px', height: '150px', objectFit: 'cover' }}
              />
            </div>
          );
        },
      },
      {
        Header: 'Parrent Category',
        accessor: 'parentCategory',
        sortType: 'basic',
        Cell: ({ value }) => {
          return <div>{value?.name || 'null'}</div>;
        },
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
    [categories]
  );

  useEffect(() => {
    dispatch(fetchAllCategories());
    dispatch(fetchCategories({ currentPage, pageSize: size, searchText, orderBy }));
  }, []);

  useEffect(() => {
    dispatch(fetchCategories({ currentPage, pageSize: size, searchText, orderBy }));
  }, [currentPage, orderBy]);
  const { getTableProps, getTableBodyProps, headerGroups, page, prepareRow } = useTable(
    {
      columns,
      data: categories.data,
      initialState: { pageIndex: 0 },
      manualPagination: true,
      pageCount: Math.ceil(categories.pagination.total / size),
      manualSortBy: true,
    },
    useSortBy,
    usePagination
  );

  useEffect(() => {
    if (selectedCategory?.parentCategory) {
      setParentCategory({
        value: selectedCategory.parentCategory.Id,
        label: selectedCategory.parentCategory.name,
      });
    } else {
      setParentCategory({ value: '', label: 'None' });
    }
  }, [selectedCategory]);

  useEffect(() => {
    if (!showAddModal && !showEditModal) {
      setParentCategory({ value: '', label: 'None' });
      setImagePreviewUrl(null);
    }
  }, [showAddModal, showEditModal]);
  const debouncedFetchCategories = debounce((searchText) => {
    dispatch(fetchCategories({ currentPage, pageSize: size, searchText, orderBy }));
  }, 500);

  const handleSearchChange = (event) => {
    setSearchText(event.target.value);
    debouncedFetchCategories(event.target.value);
  };

  const handleAddClick = () => {
    setShowAddModal(true);
  };

  const handleAddClose = () => {
    setShowAddModal(false);
  };

  const handleParentCategoryChange = (selectedOption) => {
    setParentCategory(selectedOption);
  };

  let parentCategoryOptions = categories.list.map((category) => ({
    value: category.Id,
    label: category.name,
  }));

  const handleAddSubmit = (event) => {
    event.preventDefault();
    const name = event.target.elements.name.value;
    const image = event.target.elements.formImage.files[0];
    const parentCategoryId = parentCategory?.value || null;
    const newCategory = { name, image, parentCategoryId };

    cogoToast
      .loading('Adding new category...', {
        position: 'bottom-right',
      })
      .then(() => {
        return dispatch(addCategory(newCategory));
      })
      .then((res) => {
        if (!res.error) {
          parentCategoryOptions = categories.list.map((category) => ({
            value: category.Id,
            label: category.name,
          }));
          cogoToast.success('Successfully add new category', {
            position: 'bottom-right',
            hideAfter: 3,
            onClick: () => console.log('Clicked'),
          });
        } else
          cogoToast.error(res.error.message, {
            position: 'bottom-right',
            hideAfter: 3,
            onClick: () => console.log('Clicked'),
          });
      });

    setShowAddModal(false);
  };
  const handleImageChange = (e) => {
    e.preventDefault();
    const reader = new FileReader();
    const file = e.target.files[0];

    reader.onloadend = () => {
      setImagePreviewUrl(reader.result);
    };

    if (file) {
      reader.readAsDataURL(file);
    }
  };
  const handleEditClick = React.useCallback(
    (categoryId) => {
      const category = categories.data.find((category) => category.Id === categoryId);
      setSelectedCategory(category);
      setImagePreviewUrl(category.image);
      setShowEditModal(true);
    },
    [categories]
  );
  const handleEditClose = () => {
    setShowEditModal(false);
  };

  const handleEditSubmit = (event) => {
    event.preventDefault();
    const name = event.target.elements.name.value;
    const image = imagePreviewUrl ? event.target.elements.formImage.files[0] : null;
    const parentCategoryId = parentCategory?.value || null;
    const updatedCategory = { ...selectedCategory, name, image, parentCategoryId };
    cogoToast
      .loading('Updating category...', {
        position: 'bottom-right',
      })
      .then(() => {
        return dispatch(updateCategory(updatedCategory));
      })
      .then((res) => {
        if (!res.error)
          cogoToast.info('Successfully edit category', {
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

  const handleUpdateStatus = (stauts, categoryId) => {
    const category = categories.data.find((category) => category.Id === categoryId);
    setSelectedCategory(category);
    if (stauts === true) {
      cogoToast
        .loading('Enabling category...', {
          position: 'bottom-right',
        })
        .then(() => dispatch(updateCategory({ Id: selectedCategory.Id, isDeleted: false })))
        .then((res) => {
          if (!res.error)
            cogoToast.info('Successfully edit category', {
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
      .loading('Disabling category...', {
        position: 'bottom-right',
      })
      .then(() => dispatch(updateCategory({ Id: selectedCategory.Id, isDeleted: true })))
      .then((res) => {
        if (!res.error)
          cogoToast.info('Successfully disable category', {
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
        <Breadcrumb.Item active>Categories</Breadcrumb.Item>
      </Breadcrumb>
      <div className="d-flex justify-content-between align-items-center mb-3 w-100">
        <div className="search-box">
          <i className="fa fa-search"></i>
          <input
            type="text"
            placeholder="Search categories..."
            value={searchText}
            onChange={handleSearchChange}
          />
        </div>
        <button className="btn btn-primary" onClick={handleAddClick}>
          Add Category
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
                      //   if (column.isSorted === true) {
                      //     if (column.id !== 'id' && column.id !== 'status')
                      //       setOrderBy(column.isSortedDesc ? `-${column.id}` : column.id);
                      //     else if (column.id === 'status')
                      //       setOrderBy(column.isSortedDesc ? '-isDeleted' : 'isDeleted');
                      //     else setOrderBy(column.isSortedDesc ? '-updateAt' : 'updateAt');
                      //   } else {
                      //     setOrderBy('-updateAt');
                      //   }
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
          pageCount={Math.ceil(categories.pagination.total / size)}
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
            <Modal.Title>Add Category</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form.Group controlId="name">
              <Form.Label>Name</Form.Label>
              <Form.Control type="text" placeholder="Enter name" />
            </Form.Group>
            <Form.Group controlId="formImage">
              <Form.Label>Image</Form.Label>
              <Form.Control type="file" accept="image/*" onChange={handleImageChange} />
              {imagePreviewUrl && (
                <img
                  src={imagePreviewUrl}
                  alt="Preview"
                  style={{
                    width: '100px',
                    height: '100px',
                    objectFit: 'cover',
                    marginTop: '10px',
                  }}
                />
              )}
            </Form.Group>
            <Form.Group controlId="parentCategory">
              <Form.Label>Parent Category</Form.Label>
              <Select
                options={parentCategoryOptions}
                onChange={handleParentCategoryChange}
                value={parentCategory}
                isSearchable
              />
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
            <Modal.Title>Edit Category</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form.Group controlId="name">
              <Form.Label>Name</Form.Label>
              <Form.Control type="text" defaultValue={selectedCategory?.name} />
            </Form.Group>
            <Form.Group controlId="formImage">
              <Form.Label>Image</Form.Label>
              <Form.Control type="file" accept="image/*" onChange={handleImageChange} />
              {imagePreviewUrl && (
                <img
                  src={imagePreviewUrl}
                  alt="Preview"
                  style={{
                    width: '100px',
                    height: '100px',
                    objectFit: 'cover',
                    marginTop: '10px',
                  }}
                />
              )}
            </Form.Group>
            <Form.Group controlId="parentCategory">
              <Form.Label>Parent Category</Form.Label>
              <Select
                options={parentCategoryOptions}
                onChange={handleParentCategoryChange}
                value={parentCategory}
                isSearchable
              />
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
            <Modal.Title>Disable Category</Modal.Title>
          </Modal.Header>
          <Modal.Body>Are you sure you want to disable the category?</Modal.Body>
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

export default React.memo(Categories);
