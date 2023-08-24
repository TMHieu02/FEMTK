import React, { useEffect } from 'react';
import { Form, Button, Modal } from 'react-bootstrap';
import './ConfirmPin.css';
import { createRef } from 'react';
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { requestPin, validatePin } from '../../store/slices/auth-slice';
import { useParams } from 'react-router-dom';

const ConfirmPin = () => {
  const [pinValues, setPinValues] = useState(Array(6).fill(''));
  const [error, setError] = useState(false);
  const [textError, setTextError] = useState('');
  const pinRefs = Array.from({ length: 6 }, () => createRef());
  const [showResendButton, setShowResendButton] = useState(false);
  const [countdown, setCountdown] = useState(60);
  const [Alert, setAlert] = useState(false);
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const { phoneNumber } = useParams();
  useEffect(() => {
    if (countdown > 0 && !showResendButton) {
      const timer = setTimeout(() => {
        setCountdown(countdown - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else if (countdown === 0) {
      setAlert(false);
      setShowResendButton(true);
    }
  }, [countdown, showResendButton]);

  const resendPin = () => {
    // Thực hiện gửi lại mã pin ở đây
    dispatch(requestPin(phoneNumber)).then((res) => {
      if (!res.error) {
        setShowResendButton(false);
        setAlert(() => true);
        setCountdown(60);
      } else {
        setError(true);
        setTextError(res.error);
      }
    });
  };

  const handleFocus = (e) => {
    e.target.select();
  };
  const handlePinChange = (e, index) => {
    const enteredValue = e.target.value;
    const newPinValues = [...pinValues];
    newPinValues[index] = enteredValue;

    if (/^[0-9]$/.test(enteredValue)) {
      setPinValues(newPinValues);
      if (index < pinRefs.length - 1 && pinRefs[index + 1]) {
        pinRefs[index + 1].current.focus();
      }
    } else if (enteredValue.length === 0) {
      // allow empty input
    } else {
      e.target.value = enteredValue.slice(0, 1);
      handlePinChange(e, index);
    }
  };
  const handleCloseAlter = (e) => {
    e.preventDefault();
    setError(false);
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    if (pinValues.join('').length === 6) {
      dispatch(validatePin({ phone: phoneNumber, token: pinValues.join('') })).then((res) => {
        setLoading(false);
        if (!res.error) {
          window.location.assign(res.payload.data);
        } else {
          setError(true);
          setTextError('Sai mã PIN');
        }
      });
    } else {
      setTextError('Please enter 6 digits');
      setError(true);
      setLoading(false);
    }
  };
  return (
    <section className="vh-100 gradient-custom">
      <div className="container py-5 h-100 ">
        <div className="row d-flex justify-content-center align-items-center h-100">
          <div className="col-12 col-md-8 ">
            <div className="card-body p-4 text-center">
              <h1 className="text-center" style={{ color: 'white' }}>
                CONFIRM PIN
              </h1>
              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3 d-flex justify-content-between">
                  {Array.from(new Array(6)).map((_, index) => (
                    <div key={index} style={{ width: '10%' }}>
                      <Form.Control
                        type="text"
                        maxLength={1}
                        inputMode="numeric"
                        pattern="[0-9]"
                        className="text-center"
                        style={{
                          width: '100px',
                          height: '100px',
                          borderRadius: '10px',
                          fontSize: '1.5rem',
                          outline: 'none',
                          textAlign: 'center',
                        }}
                        value={pinValues[index]}
                        onChange={(e) => handlePinChange(e, index)}
                        onFocus={handleFocus}
                        ref={pinRefs[index]}
                      />
                    </div>
                  ))}
                </Form.Group>
                <div className="d-grid gap-2 justify-content-center" style={{ width: '100%' }}>
                  <Button variant="secondary" type="submit">
                    Submit
                  </Button>
                </div>
              </Form>
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
              {showResendButton ? (
                <div className="text-center my-3">
                  <Button style={{ color: 'white' }} onClick={resendPin} variant="outline-primary">
                    Gửi lại mã PIN
                  </Button>
                </div>
              ) : (
                <div className="text-center my-3">
                  <p style={{ color: 'white' }}>
                    Gửi lại mã PIN sau <strong>{countdown}</strong> giây
                  </p>
                </div>
              )}
              {Alert ? (
                <p style={{ color: 'white' }} className=" mt-2">
                  Mã PIN đã được gửi lại thành công
                </p>
              ) : (
                ''
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ConfirmPin;
