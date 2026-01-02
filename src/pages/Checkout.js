import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

const API = process.env.REACT_APP_API_URL;

const Checkout = () => {
  const { cartItems, getCartTotal, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const [shippingData, setShippingData] = useState({
    firstName: user?.name?.split(' ')[0] || '',
    lastName: user?.name?.split(' ').slice(1).join(' ') || '',
    address: '',
    city: '',
    state: 'Gujarat',
    postalCode: '',
    country: 'India',
    phone: ''
  });
  
  const [paymentMethod, setPaymentMethod] = useState('cod');

  const shippingPrice = getCartTotal() > 1000 ? 0 : 50;
  const taxPrice = Math.round(getCartTotal() * 0.18);
  const totalPrice = getCartTotal() + shippingPrice + taxPrice;

  useEffect(() => {
    if (cartItems.length === 0) {
      setTimeout(() => navigate('/cart'), 100);
    }
  }, [cartItems.length, navigate]);

  const handleShippingSubmit = (e) => {
    e.preventDefault();
    setCurrentStep(2);
  };

  const handleShippingChange = (e) => {
    setShippingData({
      ...shippingData,
      [e.target.name]: e.target.value
    });
  };

  const handlePlaceOrder = async () => {
    setLoading(true);
    setError('');
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        alert('Please login first');
        navigate('/login');
        return;
      }

      const orderData = {
        orderItems: cartItems.map(item => ({
          name: item.name,
          qty: item.qty,
          price: Number(item.price),
          product: item._id,
          image: item.image || ''
        })),
        shippingAddress: {
          firstName: shippingData.firstName || 'Customer',
          lastName: shippingData.lastName || 'Name',
          address: shippingData.address || 'Address not provided',
          city: shippingData.city || 'City not provided',
          state: shippingData.state || 'Gujarat',
          postalCode: shippingData.postalCode || '395001',
          country: shippingData.country || 'India',
          phone: shippingData.phone || '9999999999'
        },
        paymentMethod,
        itemsPrice: getCartTotal(),
        taxPrice,
        shippingPrice,
        totalPrice
      };

      const response = await fetch(`${API}/api/orders/simple`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(orderData)
      });

      const result = await response.json();
      if (result.success) {
        clearCart();
        alert(`Order placed successfully! Order Number: ${result.orderNumber}`);
        navigate('/orders');
      } else {
        throw new Error(result.message || 'Order placement failed');
      }
      
    } catch (error) {
      setError(error.message);
      alert('Order failed: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className="container">
        <div className="empty-cart">
          <h2>Cart is empty</h2>
          <p>Redirecting to cart...</p>
        </div>
        <style>{internalCSS}</style>
      </div>
    );
  }

  return (
    <div className="container">
      <h1 className="section-title">Checkout</h1>
      
      {/* Progress Steps */}
      <div className="progress-steps">
        <div className={`step ${currentStep >= 1 ? 'active' : ''}`}>1<span>Shipping</span></div>
        <div className={`line ${currentStep >= 2 ? 'active' : ''}`}></div>
        <div className={`step ${currentStep >= 2 ? 'active' : ''}`}>2<span>Payment</span></div>
        <div className={`line ${currentStep >= 3 ? 'active' : ''}`}></div>
        <div className={`step ${currentStep >= 3 ? 'active' : ''}`}>3<span>Review</span></div>
      </div>

      <div className="checkout-grid">
        <div>
          {currentStep === 1 && (
            <div className="form-container">
              <h2>Shipping Information</h2>
              <form onSubmit={handleShippingSubmit}>
                <div className="form-row">
                  <div className="form-group">
                    <label>First Name</label>
                    <input type="text" name="firstName" value={shippingData.firstName} onChange={handleShippingChange} required placeholder="First Name"/>
                  </div>
                  <div className="form-group">
                    <label>Last Name</label>
                    <input type="text" name="lastName" value={shippingData.lastName} onChange={handleShippingChange} required placeholder="Last Name"/>
                  </div>
                </div>
                <div className="form-group">
                  <label>Address</label>
                  <textarea name="address" rows="3" value={shippingData.address} onChange={handleShippingChange} required placeholder="Full Address"></textarea>
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label>City</label>
                    <input type="text" name="city" value={shippingData.city} onChange={handleShippingChange} required placeholder="City"/>
                  </div>
                  <div className="form-group">
                    <label>State</label>
                    <input type="text" name="state" value={shippingData.state} onChange={handleShippingChange} required placeholder="State"/>
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label>Postal Code</label>
                    <input type="text" name="postalCode" value={shippingData.postalCode} onChange={handleShippingChange} required placeholder="Postal Code"/>
                  </div>
                  <div className="form-group">
                    <label>Phone</label>
                    <input type="tel" name="phone" value={shippingData.phone} onChange={handleShippingChange} required placeholder="+91 9876543210"/>
                  </div>
                </div>
                <div className="form-group">
                  <label>Country</label>
                  <select name="country" value={shippingData.country} onChange={handleShippingChange} required>
                    <option value="India">India</option>
                  </select>
                </div>
                <button type="submit" className="btn btn-primary full-btn">Continue to Payment</button>
              </form>
            </div>
          )}

          {currentStep === 2 && (
            <div className="form-container">
              <h2>Payment Method</h2>
              <label className="payment-option">
                <input type="radio" value="cod" checked={paymentMethod==='cod'} onChange={e=>setPaymentMethod(e.target.value)}/> Cash on Delivery
              </label>
              <div className="form-row">
                <button className="btn btn-secondary" onClick={()=>setCurrentStep(1)}>Back to Shipping</button>
                <button className="btn btn-primary" onClick={()=>setCurrentStep(3)}>Review Order</button>
              </div>
            </div>
          )}

          {currentStep === 3 && (
            <div className="form-container">
              <h2>Order Review</h2>
              <div className="product-card">
                <h4>Shipping Address</h4>
                <p>{shippingData.firstName} {shippingData.lastName}</p>
                <p>{shippingData.address}</p>
                <p>{shippingData.city}, {shippingData.state} {shippingData.postalCode}</p>
                <p>{shippingData.country}</p>
                <p>Phone: {shippingData.phone}</p>
              </div>

              <div className="product-card">
                <h4>Order Items</h4>
                {cartItems.map(item=>(
                  <div key={item._id} className="order-item">
                    <img src={item.image} alt={item.name}/>
                    <div>
                      <p>{item.name}</p>
                      <p>Qty: {item.qty} × ₹{item.price}</p>
                    </div>
                    <p className="price">₹{(item.price*item.qty).toFixed(2)}</p>
                  </div>
                ))}
              </div>

              {error && <div className="error-msg">{error}</div>}

              <div className="form-row">
                <button className="btn btn-secondary" onClick={()=>setCurrentStep(2)} disabled={loading}>Back to Payment</button>
                <button className="btn btn-primary" onClick={handlePlaceOrder} disabled={loading}>
                  {loading ? 'Placing Order...' : 'Place Order'}
                </button>
              </div>
            </div>
          )}
        </div>

        <div className="product-card summary">
          <h3>Order Summary</h3>
          {cartItems.map(item=>(
            <div key={item._id} className="summary-item">
              <span>{item.name} × {item.qty}</span>
              <span>₹{(item.price*item.qty).toFixed(2)}</span>
            </div>
          ))}
          <hr/>
          <div className="summary-item"><span>Subtotal:</span><span>₹{getCartTotal().toFixed(2)}</span></div>
          <div className="summary-item"><span>Shipping:</span><span>{shippingPrice===0?'Free':`₹${shippingPrice.toFixed(2)}`}</span></div>
          <div className="summary-item"><span>Tax (18% GST):</span><span>₹{taxPrice.toFixed(2)}</span></div>
          <hr/>
          <div className="summary-item total"><span>Total:</span><span>₹{totalPrice.toFixed(2)}</span></div>
        </div>
      </div>
      <style>{internalCSS}</style>
    </div>
  );
};

// Internal CSS
const internalCSS = `
.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
  font-family: 'Arial', sans-serif;
}

.section-title { font-size: 2rem; color: #2d5a27; text-align: center; margin-bottom: 2rem; }

.checkout-grid { display: grid; grid-template-columns: 2fr 1fr; gap: 2rem; align-items: start; }

.progress-steps { display: flex; justify-content: center; align-items: center; gap: 1rem; margin-bottom: 3rem; }
.step { width: 40px; height: 40px; border-radius: 50%; background: #e0e0e0; color: white; display: flex; align-items: center; justify-content: center; font-weight: bold; position: relative; }
.step span { position: absolute; top: 50px; font-size: 0.85rem; color: #666; white-space: nowrap; }
.step.active { background-color: #28a745; }
.line { width: 50px; height: 2px; background: #e0e0e0; }
.line.active { background-color: #28a745; }

.form-container { background: #fff; padding: 2rem; border-radius: 8px; border:1px solid #e0e0e0; margin-bottom: 2rem; }
.form-container h2 { margin-bottom: 1.5rem; color: #2d5a27; }
.form-row { display: flex; gap: 1rem; margin-bottom: 1rem; }
.form-group { flex: 1; display: flex; flex-direction: column; margin-bottom: 1rem; }
.form-group label { margin-bottom: 0.3rem; font-weight: 500; }
.form-group input, .form-group textarea, .form-group select { padding: 0.6rem; border-radius: 5px; border:1px solid #ccc; }
.form-group textarea { resize: none; }
.btn { padding: 0.8rem 1rem; border-radius: 5px; border:none; font-weight: bold; cursor: pointer; transition: all 0.2s; }
.btn-primary { background: #28a745; color:#fff; }
.btn-primary:hover { background:#218838; }
.btn-secondary { background:#ccc; color:#333; }
.btn-secondary:hover { background:#bbb; }
.full-btn { width: 100%; margin-top:1rem; }

.product-card { background:#fff; border:1px solid #e0e0e0; border-radius:8px; padding:1rem; margin-bottom:1rem; }
.summary { padding:1.5rem; }
.summary-item { display:flex; justify-content:space-between; margin-bottom:0.5rem; }
.summary-item.total { font-weight:bold; font-size:1.1rem; color:#28a745; }

.order-item { display:flex; align-items:center; gap:1rem; margin-bottom:0.5rem; }
.order-item img { width:60px; height:60px; object-fit:cover; border-radius:5px; }
.order-item p { margin:0; }
.order-item .price { font-weight:bold; color:#28a745; margin-left:auto; }

.payment-option { display:flex; align-items:center; padding:1rem; border:2px solid #28a745; border-radius:5px; background:#f8f9fa; cursor:pointer; margin-bottom:1rem; }

.error-msg { padding:1rem; background:#f8d7da; color:#721c24; border-radius:5px; border:1px solid #f5c6cb; margin-bottom:1rem; }

@media(max-width:768px) { .checkout-grid { grid-template-columns:1fr; } .form-row { flex-direction: column; } }
`;

export default Checkout;
