import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Row, Col, Button } from 'react-bootstrap';
import './ForgotPassword.css';

const ForgotPassword = () => {
  const navigate = useNavigate();
  const selectMethod = (method) => {
    if (method === 'email') {
      navigate('/forgot-password/email-sent');
    } else {
      navigate('/forgot-password/phone-sent');
    }
  };

  return (
    <section className="vh-100 gradient-custom">
      <div className="container py-5 h-100">
        <div className="row d-flex justify-content-center align-items-center h-100">
          <div className="col-12 col-md-8 col-lg-6 col-xl-5">
            <div className="card bg-dark text-white" style={{ borderRadius: '1rem' }}>
              <div className="card-body p-5">
                <h2
                  className="text-uppercase text-center mb-5"
                  style={{ color: 'green', fontWeight: 'bold' }}
                >
                  Forgot Password
                </h2>
                <div className="d-grid gap-2 mt-3">
                  <Button variant="outline-light" onClick={() => selectMethod('email')}>
                    Reset via Email
                  </Button>
                  <Button variant="outline-light" onClick={() => selectMethod('phone')}>
                    Reset via Phone
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ForgotPassword;
