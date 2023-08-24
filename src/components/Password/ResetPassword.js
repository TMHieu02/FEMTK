import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Row, Col, Form, Button, Modal } from 'react-bootstrap';
import { CheckCircle } from 'react-bootstrap-icons';
import './ResetPassword.css';
import { useDispatch } from 'react-redux';
import { resetPasswordByToken } from '../../store/slices/auth-slice';

const ResetPassword = () => {
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [showError, setShowError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const params = new URLSearchParams(window.location.search);

  useEffect(() => {
    checkPasswordsMatch();
  }, [confirmNewPassword]);
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (newPassword.trim() !== '' && newPassword === confirmNewPassword) {
      setLoading(true);
      // Thực hiện đặt lại mật khẩu
      const token = decodeURIComponent(params.get('token'));

      dispatch(resetPasswordByToken({ newPassword, token })).then((res) => {
        if (!res.error) {
          setLoading(false);
          setSuccess(true);
          setTimeout(() => {
            // Chuyển đến trang đăng nhập
            navigate('/login');
          }, 2000);
        }
      });
      // await new Promise((resolve) => setTimeout(resolve, 2000)); // Giả lập thời gian chờ 2 giây
    } else {
      setShowError(true);
    }
  };

  const handleClose = () => {
    setShowError(false);
  };
  const checkPasswordsMatch = () => {
    if (newPassword !== confirmNewPassword) {
      setShowError(true);
    } else {
      setShowError(false);
    }
  };
  return (
    <section className="vh-100 gradient-custom">
      <div className="container py-5 h-100 ">
        <div className="row d-flex justify-content-center align-items-center h-100">
          <div className="col-12 col-md-8 ">
            <div className="card bg-dark text-white">
              <div className="card-body p-4 text-center">
                <Row className="justify-content-center mt-5">
                  <Col xs={12} md={6}>
                    <h1 className="text-center title-header">Reset Password</h1>
                    <Form onSubmit={handleSubmit}>
                      <Form.Group className="mb-3">
                        <Form.Control
                          type="password"
                          placeholder="Enter new password"
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                          className="floating-label-input"
                        />
                      </Form.Group>
                      <Form.Group className="mb-3 w-100" controlId="confirmNewPassword">
                        <Form.Control
                          type="password"
                          placeholder="Confirm new password"
                          value={confirmNewPassword}
                          onChange={(e) => {
                            setConfirmNewPassword(e.target.value);
                          }}
                          className={`form-control floatingInput ${showError ? 'is-invalid' : ''}`}
                        />
                        <div className={`invalid-feedback ${showError ? 'show' : ''}`}>
                          Mật khẩu mới không khớp. Vui lòng thử lại.
                        </div>
                      </Form.Group>
                      <div className="d-grid gap-2">
                        <Button variant="primary" type="submit">
                          Submit
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
                    <p>Resetting password...</p>
                  </Modal.Body>
                </Modal>

                <Modal show={success} onHide={() => {}} centered backdrop="static">
                  <Modal.Header>
                    <Modal.Title>
                      <CheckCircle className="me-2 text-success" />
                      Reset Password Successful
                    </Modal.Title>
                  </Modal.Header>
                  <Modal.Body>
                    Password has been reset successfully. Redirecting to the login page...
                  </Modal.Body>
                </Modal>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ResetPassword;
