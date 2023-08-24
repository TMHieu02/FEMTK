import React, { useState } from 'react';
import { Row, Col, Form, Button, Alert, Modal } from 'react-bootstrap';
import { CheckCircle } from 'react-bootstrap-icons';
import './ResetPassword.css';
import { useDispatch } from 'react-redux';
import { requestResetPasswordByEmail } from '../../store/slices/auth-slice';
const EmailSent = () => {
  const dispatch = useDispatch();
  const [email, setEmail] = useState('');
  const [isValidEmail, setIsValidEmail] = useState(true);
  const [showSuccess, setShowSuccess] = useState(false);
  const [error, setError] = useState(false);
  const [textError, setTextError] = useState('');
  const emailRegex = /^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/;
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    if (emailRegex.test(email)) {
      dispatch(requestResetPasswordByEmail(email)).then((res) => {
        if (!res.error) {
          setIsValidEmail(true);
          setShowSuccess(true);
        } else {
          setError(true);
          setTextError(res.error);
        }
      });
      setLoading(false);
    } else {
      setIsValidEmail(false);
      setLoading(false);
    }
  };

  const handleClose = () => {
    setShowSuccess(false);
  };
  const handleCloseAlter = (e) => {
    e.preventDefault();
    setError(false);
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
                  {!isValidEmail && <Alert variant="danger">Email không hợp lệ. Vui lòng thử lại.</Alert>}
                  <Form onSubmit={handleSubmit}>
                    <Form.Group className="mb-3" controlId="email">
                      <Form.Control
                        type="email"
                        placeholder="Enter your email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
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
              <Modal show={error} onHide={() => {}}>
                <Modal.Body className="text-center">
                  <i className="fa fa-times-circle text-danger fa-3x mb-3"></i>
                  <p style={{ fontSize: '20px' }}>{textError}</p>
                  <Button onClick={handleCloseAlter}>Ok</Button>
                </Modal.Body>
              </Modal>
              <Modal show={showSuccess} onHide={handleClose} centered>
                <Modal.Header closeButton>
                  <Modal.Title>
                    <CheckCircle className="me-2" />
                    Thành công
                  </Modal.Title>
                </Modal.Header>
                <Modal.Body>Email reset password đã được gửi về mail của bạn.</Modal.Body>
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

export default EmailSent;
