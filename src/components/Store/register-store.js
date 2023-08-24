import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Col, Container, Form, Modal, Row, Spinner } from 'react-bootstrap';
import ReactDropzone from 'react-dropzone';
import AvatarEditor from 'react-avatar-editor';
import './register-store.css';
import { register } from '../../store/slices/stores-slice';
const RegisterShop = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [shopInfo, setShopInfo] = useState({
    avatar: null,
    bio: '',
    cover: null,
    featuredImages: null,
    name: '',
    address: '',
  });

  const [imagePreviews, setImagePreviews] = useState({
    avatar: null,
    cover: null,
    featuredImages: null,
  });

  const onDrop = (acceptedFiles, fieldName) => {
    const file = acceptedFiles[0];
    setShopInfo({ ...shopInfo, [fieldName]: file });
    setImagePreviews({ ...imagePreviews, [fieldName]: URL.createObjectURL(file) });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    dispatch(register(shopInfo)).then((res) => {
      if (!res.error) {
        navigate('/');
        setIsSubmitting(false);
      } else {
        console.log(res.error);
        setIsSubmitting(false);
      }
    });
  };

  return (
    <Container>
      <h1 style={{ textAlign: 'center' }}>Đăng ký mở shop bán hàng</h1>
      <Form onSubmit={handleSubmit}>
        <Row>
          <Col>
            <Form.Group controlId="name">
              <Form.Label>Tên shop</Form.Label>
              <Form.Control
                type="text"
                value={shopInfo.name}
                onChange={(e) => setShopInfo({ ...shopInfo, name: e.target.value })}
                required
              />
            </Form.Group>
          </Col>
          <Col>
            <Form.Group controlId="address">
              <Form.Label>Địa chỉ</Form.Label>
              <Form.Control
                type="text"
                value={shopInfo.address}
                onChange={(e) => setShopInfo({ ...shopInfo, address: e.target.value })}
                required
              />
            </Form.Group>
          </Col>
        </Row>
        <Form.Group controlId="bio">
          <Form.Label>Mô tả ngắn</Form.Label>
          <Form.Control
            as="textarea"
            rows={3}
            value={shopInfo.bio}
            onChange={(e) => setShopInfo({ ...shopInfo, bio: e.target.value })}
            required
          />
        </Form.Group>
        <Form.Group controlId="avatar">
          <Form.Label>Ảnh đại diện</Form.Label>
          <ReactDropzone accept="image/*" onDrop={(acceptedFiles) => onDrop(acceptedFiles, 'avatar')}>
            {({ getRootProps, getInputProps }) => (
              <section>
                <div {...getRootProps()} className="dropzone">
                  <input {...getInputProps()} />
                  <p>Thả ảnh vào đây hoặc nhấp vào đây để chọn ảnh đại diện</p>
                </div>
              </section>
            )}
          </ReactDropzone>
          {imagePreviews.avatar && (
            <div className="image-preview">
              <AvatarEditor
                image={imagePreviews.avatar}
                width={200}
                height={200}
                border={50}
                color={[255, 255, 255, 0.6]}
                scale={1}
              />
            </div>
          )}
        </Form.Group>{' '}
        <Form.Group controlId="cover">
          <Form.Label>Ảnh bìa</Form.Label>
          <ReactDropzone accept="image/*" onDrop={(acceptedFiles) => onDrop(acceptedFiles, 'cover')}>
            {({ getRootProps, getInputProps }) => (
              <section>
                <div {...getRootProps()} className="dropzone">
                  <input {...getInputProps()} />
                  <p>Thả ảnh vào đây hoặc nhấp vào đây để chọn ảnh bìa</p>
                </div>
              </section>
            )}
          </ReactDropzone>
          {imagePreviews.cover && (
            <img style={{ width: '200px' }} src={imagePreviews.cover} alt="Cover preview" />
          )}
        </Form.Group>
        <Form.Group controlId="featuredImages">
          <Form.Label>Ảnh nổi bật</Form.Label>
          <ReactDropzone accept="image/*" onDrop={(acceptedFiles) => onDrop(acceptedFiles, 'featuredImages')}>
            {({ getRootProps, getInputProps }) => (
              <section>
                <div {...getRootProps()} className="dropzone">
                  <input {...getInputProps()} />
                  <p>Thả ảnh vào đây hoặc nhấp vào đây để chọn ảnh nổi bật</p>
                </div>
              </section>
            )}
          </ReactDropzone>
          {imagePreviews.featuredImages && (
            <img
              style={{ width: '200px' }}
              src={imagePreviews.featuredImages}
              alt="Featured image preview"
              className="image-preview"
            />
          )}
        </Form.Group>
        <button type="submit" className="btn btn-primary">
          Đăng ký
        </button>
      </Form>
      {isSubmitting && (
        <Modal show={isSubmitting} centered backdrop="static">
          <Modal.Body className="text-center">
            <Spinner animation="border" role="status" />
            <p>Đang xử lý...</p>
          </Modal.Body>
        </Modal>
      )}
    </Container>
  );
};
export default RegisterShop;
