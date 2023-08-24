import React, { useState, useEffect, Fragment } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button, Dropdown, Form, Modal, Table } from "react-bootstrap";
import SEO from "../../components/seo";
import LayoutOne from "../../layouts/LayoutOne";
import Breadcrumb from "../../wrappers/breadcrumb/Breadcrumb";
import cogoToast from "cogo-toast";
import "react-datepicker/dist/react-datepicker.css";
import "./Order.css";
import productAPI from "../../api/ProductAPI";
import ReactPaginate from "react-paginate";

const MyPost = () => {
  let { pathname } = useLocation();
  const [currentPage, setCurrentPage] = useState(0);
  const [searchText, setSearchText] = useState("");
  const [posts, setPosts] = useState([]);
  const [totalPages, setTotalPages] = useState(0);
  const [showModal, setShowModal] = useState(false);


  const navigate = useNavigate();

  const getMyPost = async () => {
    let params = {
      size: 10,
      page: currentPage,
      sortBy: "postDate",
    };
    try {
      const response = await productAPI.getMyPost(params);
      setPosts(response.data.posts);
      setTotalPages(Math.ceil(response.data.totalPages));
    } catch {
      // Handle error
    }
  };

  useEffect(() => {
    
    getMyPost();
  }, [currentPage]);

  const [editPostId, setEditPostId] = useState(null);
  const [editedTitle, setEditedTitle] = useState("");
  const [editedDescription, setEditedDescription] = useState("");
  const [editedAddress, setEditedAddress] = useState("");
  const [editedPrice, setEditedPrice] = useState("");

  const handleEditPost = (postId) => {
    const post = posts.find((post) => post.id === postId);
    if (post) {
      setEditPostId(postId);
      setEditedTitle(post.title);
      setEditedDescription(post.description);
      setEditedAddress(post.address);
      setEditedPrice(post.price);
      setShowModal(true);
    }
  };


  const handleUpdatePost = async  () => {
    // Thực hiện cập nhật thông tin bài đăng
    if (editPostId) {
      const post = posts.find((post) => post.id === editPostId);

      const params = {...post, title : editedTitle, price: editedPrice, description: editedDescription, address : editedAddress};
      
      console.log(params);
      try {
        const response = await productAPI.updatePost(params);
        if (response.status === 200) {
          cogoToast.success("Cập nhật thành công");
          getMyPost(); 
        } else {
          cogoToast.error("Cập nhật thất bại"); 
        }
      } catch (error) {
        console.log(error);
      }
      setShowModal(false);
      setEditPostId(null);
    }
  };

  const handleCancelEdit = () => {
    setShowModal(false);
    setEditPostId(null);
    setEditedTitle("");
    setEditedDescription("");
  };

  const handleRemovePost = async (postId) => {
    const response = await productAPI.deletePost(postId);
    if(response.status === 200)
    cogoToast.success("Xoá thành công");
    else
    cogoToast.success("Xoá thất bại");
    getMyPost();
  };

  const handlePageChange = (selectedPage) => {
    setCurrentPage(selectedPage.selected);
  };

  return (
    <Fragment>
      <SEO titleTemplate="MyOrder" description="" />
      <LayoutOne headerTop="visible">
        {/* breadcrumb */}
        <Breadcrumb
          pages={[
            { label: "Home", path: process.env.PUBLIC_URL + "/" },
            { label: "MyOrder", path: process.env.PUBLIC_URL + pathname },
          ]}
        />
        <div className="cart-main-area pt-90 pb-100">
          <div className="container">
            <h1 className="title main-title">My Post</h1>
            <button style={{backgroundColor: 'lime'}} onClick={() => navigate('/createpost')}>Create Post</button>

            <Table striped bordered hover>
              <thead>
                <tr>
                  <th>Post</th>
                  <th>Title</th>
                  <th>Price</th>
                  <th>Description</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {posts.map((post) => (
                  <tr key={post.id}>
                    <td><img src={post.postImageDTOs[0].imageDTO.url} alt="" style={{height : "50px"}} onClick={() => navigate(`/product/${post.id}`)}></img></td>
                    <td>{post.title}</td>
                    <td>{post.price}</td>
                    <td>{post.description}</td>
                    <td>
                    <Button
                        variant="danger"
                        onClick={() => handleEditPost(post.id)}
                      >
                        Edit
                      </Button>
                      <Button
                        variant="danger"
                        onClick={() => handleRemovePost(post.id)}
                      >
                        Delete
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
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

        {/* Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Post</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="formTitle">
              <Form.Label>Title</Form.Label>
              <Form.Control
                type="text"
                value={editedTitle}
                onChange={(e) => setEditedTitle(e.target.value)}
              />
            </Form.Group>
            <Form.Group controlId="formDescription">
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                value={editedDescription}
                onChange={(e) => setEditedDescription(e.target.value)}
              />
            </Form.Group>
            <Form.Group controlId="formAddress">
              <Form.Label>Address</Form.Label>
              <Form.Control
                type="text"
                value={editedAddress}
                onChange={(e) => setEditedAddress(e.target.value)}
              />
            </Form.Group>
            <Form.Group controlId="formPrice">
              <Form.Label>Price</Form.Label>
              <Form.Control
                type="number" 
                min={0}
                value={editedPrice}
                onChange={(e) => setEditedPrice(e.target.value)}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCancelEdit}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleUpdatePost}>
            Save
          </Button>
        </Modal.Footer>
      </Modal>
      </LayoutOne>
    </Fragment>
  );
};

export default MyPost;
