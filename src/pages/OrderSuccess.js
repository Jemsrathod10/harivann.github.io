import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';

const API = process.env.REACT_APP_API_URL;

const OrderSuccess = () => {
  const { orderId } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrder();
  }, [orderId]);

  const fetchOrder = async () => {
    try {
      const response = await axios.get(`${API}/api/orders/${orderId}`);
      setOrder(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching order:', error);
      setLoading(false);
    }
  };

  const styles = `
  .os-container {
    padding: 40px 10px;
    min-height: 100vh;
    background: linear-gradient(120deg,#f0fff7 60%,#e0faea 100%);
    display: flex;
    align-items: flex-start;
    justify-content: center;
    font-family: 'Segoe UI', 'Roboto', sans-serif;
  }
  .os-section {
    width: 100%;
    max-width: 850px;
    margin: auto;
    box-shadow: 0 8px 32px rgba(44,174,104,0.11);
    background: #fff;
    border-radius: 16px;
    padding: 32px 24px;
    margin-top: 30px;
    margin-bottom: 30px;
    overflow: hidden;
  }
  .os-success-header {
    text-align: center;
    margin-bottom: 2.2rem;
  }
  .os-checkmark {
    width: 82px;
    height: 82px;
    background: linear-gradient(120deg,#34e289 60%,#00b685 100%);
    border-radius: 50%;
    margin: 0 auto 1rem auto;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 2.8rem;
    color: #fff;
    box-shadow: 0 4px 16px rgba(44,174,104,0.17);
    border: 4px solid #fbfffa;
  }
  .os-success-title {
    color: #27ae60;
    margin-bottom: 0.5rem;
    font-weight: 700;
    font-size: 2rem;
    letter-spacing: 1px;
  }
  .os-success-desc {
    color: #606d71;
    font-size: 1.1rem;
  }
  .os-card {
    padding: 2rem;
    background: #f7fbfa;
    border-radius: 12px;
    margin-bottom: 2rem;
    box-shadow: 0 2px 14px 0 rgba(46,204,113,0.025);
  }
  .os-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 2.2rem;
    margin-bottom: 2rem;
  }
  .os-grid p {
    margin: 0.4rem 0;
    color: #353b3c;
    font-size: 1.02rem;
  }
  .os-status-green {
    color: #27ae60;
    font-weight: 600;
    margin-left: 7px;
  }
  .os-status-yellow {
    color: #ffc107;
    margin-left: 7px;
    font-weight: 600;
  }
  .os-status-grey {
    color: #666;
    margin-left: 7px;
    font-weight: 600;
  }
  .os-shipping {
    margin-bottom: 2rem;
  }
  .os-shipping-title {
    color: #179156;
    font-size: 1.14rem;
    font-weight: bold;
    margin-bottom: 0.6rem;
  }
  .os-shipping-details {
    padding: 1rem;
    background: #edfcf3;
    border-radius: 7px;
    color: #385f42;
    font-size: 1.01rem;
  }
  .os-items-title {
    color: #179156;
    font-weight: 600;
    margin-bottom: 1rem;
    font-size: 1.13rem;
  }
  .os-item-row {
    display: flex;
    align-items: center;
    gap: 1.2rem;
    padding: 1rem;
    background: #efefef;
    border-radius: 7px;
    margin-bottom: 0.5rem;
    box-shadow: 0 1px 3px 0 rgba(46,204,113,0.03);
  }
  .os-item-row img {
    width: 60px;
    height: 60px;
    object-fit: cover;
    border-radius: 7px;
    border: 1px solid #dcefe6;
  }
  .os-item-info h5 {
    margin: 0 0 0.29rem 0;
    color: #23ad6b;
    font-size: 1.01rem;
    font-weight: 600;
  }
  .os-item-info p {
    margin: 0;
    color: #545c5b;
    font-size: 0.98rem;
  }
  .os-item-price {
    text-align: right;
    color: #1a302a;
    min-width: 90px;
    font-size: 1.08rem;
    font-weight: 600;
  }
  .os-item-each {
    color: #88968c;
    font-size: 0.93rem;
    font-weight: 400;
    margin-top: 2px;
  }
  .os-btns {
    display: flex;
    gap: 1rem;
    justify-content: center;
    margin-top: 1.2rem;
    margin-bottom: 0.4rem;
  }
  .btn {
    padding: 9px 22px;
    border-radius: 50px;
    font-size: 1rem;
    border: none;
    cursor: pointer;
    transition: background 0.21s, color 0.22s, box-shadow 0.2s;
    text-decoration: none;
    display: inline-block;
    font-weight: 600;
  }
  .btn-primary {
    background: linear-gradient(90deg,#32e09a 0%,#12a17c 100%);
    color: #fff;
    box-shadow: 0 2px 6px -2px #16c77a35;
  }
  .btn-primary:hover {
    background: linear-gradient(90deg,#12a17c 0%,#32e09a 100%);
    color: #fff;
  }
  .btn-secondary {
    background: #e3f2ee;
    color: #179156;
    box-shadow: 0 1px 3px 0 #9ecfb91a;
    border: 1px solid #c6efe4;
  }
  .btn-secondary:hover {
    background: #d1ede5;
    color: #117c49;
  }
  .loading {
    text-align: center;
    padding: 80px 0;
    font-size: 1.25rem;
    color: #179156;
    font-weight: 600;
    letter-spacing: 0.5px;
  }
  @media (max-width: 700px) {
    .os-section {
      padding: 10px 4px;
    }
    .os-card {
      padding: 1.2rem;
    }
    .os-grid {
      grid-template-columns: 1fr;
      gap: 1.1rem;
    }
    .os-btns {
      flex-direction: column;
    }
  }
  `;

  if (loading) {
    return (
      <>
        <style>{styles}</style>
        <div className="loading">Loading order details...</div>
      </>
    );
  }

  if (!order) {
    return (
      <>
        <style>{styles}</style>
        <div className="os-container">
          <div className="os-section">
            <div style={{textAlign: 'center', padding: '30px 0'}}>
              <h2>Order not found</h2>
              <Link to="/" className="btn btn-primary">Go Home</Link>
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <style>{styles}</style>
      <div className="os-container">
        <div className="os-section">
          {/* Success Header */}
          <div className="os-success-header">
            <div className="os-checkmark">✓</div>
            <div className="os-success-title">Order Placed Successfully!</div>
            <div className="os-success-desc">
              Thank you for your order. We'll send you updates via email.
            </div>
          </div>
          {/* Order Details */}
          <div className="os-card">
            <h3 style={{color: '#2d5a27', marginBottom: '1rem', fontWeight:'700'}}>Order Details</h3>
            <div className="os-grid">
              <div>
                <p><strong>Order ID:</strong> {order._id}</p>
                <p><strong>Order Date:</strong> {new Date(order.createdAt).toLocaleDateString()}</p>
                <p><strong>Payment Method:</strong> {order.paymentMethod}</p>
                <p>
                  <strong>Status:</strong> 
                  <span className="os-status-green">
                    {order.orderStatus}
                  </span>
                </p>
              </div>
              <div>
                <p><strong>Total Amount:</strong> ₹{order.totalPrice.toFixed(2)}</p>
                <p>
                  <strong>Payment Status:</strong>
                  <span className={order.isPaid ? "os-status-green" : "os-status-yellow"}>
                    {order.isPaid ? 'Paid' : 'Pending'}
                  </span>
                </p>
                <p>
                  <strong>Delivery Status:</strong>
                  <span className={order.isDelivered ? "os-status-green" : "os-status-grey"}>
                    {order.isDelivered ? 'Delivered' : 'Processing'}
                  </span>
                </p>
              </div>
            </div>
            {/* Shipping Address */}
            <div className="os-shipping">
              <div className="os-shipping-title">Shipping Address</div>
              <div className="os-shipping-details">
                <p style={{margin: 0}}>{order.shippingAddress.address}</p>
                <p style={{margin: 0}}>{order.shippingAddress.city}, {order.shippingAddress.postalCode}</p>
                <p style={{margin: 0}}>{order.shippingAddress.country}</p>
                <p style={{margin: 0}}>Phone: {order.shippingAddress.phone}</p>
              </div>
            </div>
            {/* Order Items */}
            <div>
              <div className="os-items-title">Order Items</div>
              {order.orderItems.map(item => (
                <div key={item._id} className="os-item-row">
                  <img src={item.image} alt={item.name} />
                  <div className="os-item-info" style={{flex: 1}}>
                    <h5>{item.name}</h5>
                    <p>Quantity: {item.qty}</p>
                  </div>
                  <div className="os-item-price">
                    ₹{(item.price * item.qty).toFixed(2)}
                    <div className="os-item-each">₹{item.price} each</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          {/* Action Buttons */}
          <div className="os-btns">
            <Link to="/products" className="btn btn-primary">
              Continue Shopping
            </Link>
            <Link to="/orders" className="btn btn-secondary">
              View All Orders
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default OrderSuccess;
