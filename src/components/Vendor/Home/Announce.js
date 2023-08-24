import React from 'react';
import { Container, Button, Row, Col } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

function Announce() {
  const goHome = () => {
    // Thay đổi đường dẫn này thành đường dẫn của trang chủ trong dự án của bạn
    window.location.href = '/';
  };

  return (
    <Container className="d-flex justify-content-center align-items-center min-vh-100">
      <Row>
        <Col xs={12} className="text-center">
          <h1>Đang chờ admin xác nhận</h1>
          <p>Vui lòng đợi trong giây lát, thông tin của bạn đang được xử lý.</p>
          <Button variant="primary" onClick={goHome}>
            Quay về trang chủ
          </Button>
        </Col>
      </Row>
    </Container>
  );
}

export default Announce;
