import React, { useState } from 'react';
import { Row, Col, Form, Button, Alert, Modal } from 'react-bootstrap';
import { CheckCircle } from 'react-bootstrap-icons';
import './ResetPassword.css';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { requestPin } from '../../store/slices/auth-slice';
const PhoneSent = () => {
  const [phone, setPhone] = useState('');
  const [isValidPhone, setIsValidPhone] = useState(true);
  const [showSuccess, setShowSuccess] = useState(false);
  const phoneRegex = /^\d{10,11}$/;
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    if (phoneRegex.test(phone)) {
      dispatch(requestPin(phone)).then((res) => {
        if (!res.error) {
          setIsValidPhone(true);
          setShowSuccess(true);
          navigate(`/confirm-pin/${phone}`);
        } else {
        }
        setLoading(false);
      });
    } else {
      setLoading(false);

      setIsValidPhone(false);
    }
  };

  const handleClose = () => {
    setShowSuccess(false);
  };

  return (
    <section className="vh-100 gradient-custom">
      <div className="container py-5 h-100 ">
        <div className="row d-flex justify-content-center align-items-center h-100">
          <div className="col-12 col-md-8 ">
            <div className="card-body p-4 text-center">
              <Row className="justify-content-center mt-5">
                <Col xs={12} md={6}>
                  <h1 className="text-center title-header">Reset Password</h1>
                  {!isValidPhone && <Alert variant="danger">Phone không hợp lệ. Vui lòng thử lại.</Alert>}
                  <Form onSubmit={handleSubmit}>
                    <Form.Group className="mb-3" controlId="phone">
                      <Form.Control
                        type="phone"
                        placeholder="Enter your phone"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                      />
                    </Form.Group>
                    <div className="d-grid gap-2">
                      <Button variant="primary" type="submit">
                        Send Reset Link
                      </Button>
                    </div>
                  </Form>
                </Col>
              </Row>
              <Modal show={loading} onHide={() => {}} centered backdrop="static">
                <Modal.Body className="text-center">
                  <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </div>
                  <p>Requesting...</p>
                </Modal.Body>
              </Modal>
              <Modal show={showSuccess} onHide={handleClose} centered>
                <Modal.Header closeButton>
                  <Modal.Title>
                    <CheckCircle className="me-2" />
                    Thành công
                  </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                  Mã code đã được gửi về số điện thoại tự động chuyển qua trang nhập mã pin sau 2s.
                </Modal.Body>
                <Modal.Footer>
                  <Button variant="secondary" onClick={handleClose}>
                    Close
                  </Button>
                </Modal.Footer>
              </Modal>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PhoneSent;
