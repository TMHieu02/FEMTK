import React, { Fragment } from 'react';
import { Card, Row, Col, ListGroup, Button, Table } from 'react-bootstrap';
import './OrderDetail.css';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { convertTimeStamp } from '../../utils/convertDate';
import { getOrder, cancelOrder, selectOrders } from '../../store/slices/orders-slice';
import LayoutOne from '../../layouts/LayoutOne';

const OrderDetail = () => {
  const dispatch = useDispatch();
  const orders = useSelector(selectOrders);
  const { orderCode } = useParams();
  let total = 0;
  useEffect(() => {
    dispatch(getOrder(orderCode)).then((res) => console.log(res));
  }, []);
  return (
    <Fragment>
      <LayoutOne headerTop="visible">
        {/* breadcrumb */}
        <div className="order-detail">
          <nav aria-label="breadcrumb">
            <ol className="breadcrumb">
              <li className="breadcrumb-item">
                <Link to="/MyOrder">Orders</Link>
              </li>
              <li className="breadcrumb-item active" aria-current="page">
                Order Detail
              </li>
            </ol>
          </nav>
          <h2>Order #{orders.order?.code}</h2>
          <p>Time: {orders.order ? convertTimeStamp(orders.order.createAt) : ''}</p>
          <h3>Items</h3>
          {orders.order?.orderItems.map((item) => {
            total += item.product.price * item.quantity;
            return (
              <Card key={item.Id} className="mb-3 item-card">
                <Card.Body>
                  <Row>
                    <Col md={2} className="content-order-wrapper">
                      <Card.Img
                        style={{ width: '200px', height: '200px' }}
                        src={item.product.images[0].location}
                      />
                    </Col>
                    <Col md={7} className="d-flex flex-column justify-content-center ">
                      <Card.Title>{item.product.name}</Card.Title>
                      {item.product.attributeValues?.length > 0 && (
                        <ListGroup.Item>
                          Phân loại hàng:{' '}
                          {item.product.attributes.map((attribute, index) => (
                            <span key={index}>
                              {attribute.value}
                              {index < item.product.attributes.length - 1 ? ', ' : ''}
                            </span>
                          ))}
                        </ListGroup.Item>
                      )}
                    </Col>
                    <Col
                      md={3}
                      className="detail-price d-flex flex-column justify-content-center"
                      style={{ right: '0' }}
                    >
                      <div>
                        <ListGroup.Item>Quantity: {item.quantity}</ListGroup.Item>
                        <ListGroup.Item>Price: {item.product.price * item.quantity} VNĐ</ListGroup.Item>
                      </div>
                    </Col>
                  </Row>
                </Card.Body>
              </Card>
            );
          })}
          <div className="customer-info">
            <h3>Customer Information</h3>
            <p>Name: {orders.order?.address.split('|')[0]}</p>
            <p>Phone: {orders.order?.address.split('|')[0]}</p>
            <p>Address: {orders.order?.address.split('|')[0]}</p>
          </div>
          <div className="order-total">
            <Table striped bordered hover>
              <tbody>
                <tr>
                  <td>Tổng tiền hàng</td>
                  <td>{total} VNĐ</td>
                </tr>
                <tr>
                  <td>Phí vận chuyển</td>
                  <td>{orders.order?.amountToStore} VNĐ</td>
                </tr>
                <tr>
                  <td className="grand-total-label">Thành tiền</td>
                  <td className="grand-total">{orders.order?.amountFromUser} VNĐ</td>
                </tr>
              </tbody>
            </Table>
            {orders.order?.status === 1 && (
              <Button variant="danger" onClick={() => console.log('Cancel Order')}>
                Cancel Order
              </Button>
            )}
          </div>
        </div>
      </LayoutOne>
    </Fragment>
  );
};

export default OrderDetail;
