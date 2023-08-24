import React, { useState, useEffect, Fragment } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button, Dropdown, Form, Modal, Table } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import ReactPaginate from "react-paginate";
import cogoToast from "cogo-toast";
import productAPI from "../../../api/ProductAPI";

const UsersPost = () => {
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
      const response = await productAPI.getPostAdmin(params);
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
  const [editedPost, setEditedPost] = useState();

  const handleEditPost = (postId) => {
    const post = posts.find((post) => post.id === postId);
    if (post) {
      setEditedPost(post);
      setEditPostId(postId);
      setEditedTitle(post.title);
      setEditedDescription(post.description);
      setEditedAddress(post.address);
      setEditedPrice(post.price);
      setShowModal(true);
      console.log(editedPost);
    }
  };

  const handleCancelEdit = () => {
    setShowModal(false);
  };

  const handleRemovePost = async (postId) => {
    const response = await productAPI.deletePost(postId);
    cogoToast.success("Xoá thành công");

    getMyPost();
  };

  const handleApprovePost = async (postId) => {
    const response = await productAPI.approvePost(postId);
    cogoToast.success("Duyệt thành công");

    getMyPost();
  };

  const handlePageChange = (selectedPage) => {
    setCurrentPage(selectedPage.selected);
  };

  return (
    <Fragment>
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
              <td>
                <img
                  src={post.postImageDTOs[0].imageDTO.url}
                  alt=""
                  style={{ height: "50px" }}
                  onClick={() => navigate(`/product/${post.id}`)}
                ></img>
              </td>
              <td>{post.title}</td>
              <td>{post.price}</td>
              <td>{post.description}</td>
              <td>
                <Button
                  variant="primary"
                  onClick={() => handleEditPost(post.id)}
                >
                  View
                </Button>
                <Button
                  variant="danger"
                  onClick={() => handleRemovePost(post.id)}
                >
                  Delete
                </Button>
                <Button
                  variant="success"
                  onClick={() => handleApprovePost(post.id)}
                  disabled={post.published}
                >
                  Approve
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

      {/* Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Post</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            {editedPost?.postImageDTOs.map((image, index) => (
              <img
              style={{height:"100px"}}
                key={index}
                src={image.imageDTO.url}
                alt={`Image ${index}`}
              />
            ))}
            <Form.Group controlId="formTitle">
              <Form.Label>Title</Form.Label>
              <Form.Control type="text" value={editedTitle} />
            </Form.Group>
            <Form.Group controlId="formDescription">
              <Form.Label>Description</Form.Label>
              <Form.Control as="textarea" rows={3} value={editedDescription} />
            </Form.Group>
            <Form.Group controlId="formAddress">
              <Form.Label>Address</Form.Label>
              <Form.Control type="text" value={editedAddress} />
            </Form.Group>
            <Form.Group controlId="formPrice">
              <Form.Label>Price</Form.Label>
              <Form.Control type="number" min={0} value={editedPrice} />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCancelEdit}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </Fragment>
  );
};

export default UsersPost;
