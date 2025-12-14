import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

const Cart = () => {
  const { cartItems, removeFromCart, updateCartQty, getCartTotal } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleQuantityChange = (id, qty) => {
    if (qty <= 0) {
      removeFromCart(id);
    } else {
      updateCartQty(id, qty);
    }
  };

  const handleCheckout = () => {
    if (!user) {
      navigate('/login');
      return;
    }
    navigate('/checkout');
  };

  const subtotal = getCartTotal();
  const shippingPrice = subtotal > 1000 ? 0 : 50;
  const taxPrice = subtotal * 0.18;
  const totalPrice = subtotal + shippingPrice + taxPrice;

  if (cartItems.length === 0) {
    return (
      <div className="container">
        <div className="empty-cart">
          <h2>Your cart is empty</h2>
          <p>Add some plants to your cart to see them here!</p>
          <Link to="/products" className="btn btn-primary">
            Continue Shopping
          </Link>
        </div>
        <style>{internalCSS}</style>
      </div>
    );
  }

  return (
    <div className="container">
      <h1 className="section-title">Shopping Cart</h1>
      <div className="cart-grid">
        {/* Cart Items */}
        <div>
          {cartItems.map(item => (
            <div key={item._id} className="cart-item">
              <img
                src={item.image}
                alt={item.name}
                onError={(e) => {
                  e.target.src = 'https://via.placeholder.com/100x100?text=Plant';
                }}
              />
              <div className="cart-item-details">
                <h3>{item.name}</h3>
                <p>₹{item.price} each</p>
              </div>
              <div className="qty-controls">
                <button onClick={() => handleQuantityChange(item._id, item.qty - 1)} className="btn btn-secondary">-</button>
                <span>{item.qty}</span>
                <button
                  onClick={() => handleQuantityChange(item._id, item.qty + 1)}
                  className="btn btn-primary"
                  disabled={item.qty >= item.stock}
                >+</button>
              </div>
              <div className="item-price">
                ₹{(item.price * item.qty).toFixed(2)}
                <button onClick={() => removeFromCart(item._id)} className="btn btn-danger btn-sm">Remove</button>
              </div>
            </div>
          ))}
        </div>

        {/* Order Summary */}
        <div className="order-summary">
          <h3>Order Summary</h3>
          <div>
            <span>Subtotal ({cartItems.reduce((acc, item) => acc + item.qty, 0)} items):</span>
            <span>₹{subtotal.toFixed(2)}</span>
          </div>
          <div>
            <span>Shipping:</span>
            <span>{shippingPrice === 0 ? 'Free' : `₹${shippingPrice.toFixed(2)}`}</span>
          </div>
          <div>
            <span>Tax (18% GST):</span>
            <span>₹{taxPrice.toFixed(2)}</span>
          </div>
          <hr />
          <div className="total">
            <span>Total:</span>
            <span>₹{totalPrice.toFixed(2)}</span>
          </div>
          {subtotal < 1000 && <p>Add ₹{(1000 - subtotal).toFixed(2)} more for free shipping!</p>}
          <button onClick={handleCheckout} className="btn btn-primary full-btn">Proceed to Checkout</button>
          <Link to="/products" className="btn btn-secondary full-btn">Continue Shopping</Link>
        </div>
      </div>

      <style>{internalCSS}</style>
    </div>
  );
};

// Internal CSS as a JS string
const internalCSS = `
.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
  font-family: 'Arial', sans-serif;
}

.section-title {
  font-size: 2rem;
  font-weight: bold;
  color: #2d5a27;
  margin-bottom: 2rem;
  text-align: center;
}

.cart-grid {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 2rem;
  align-items: start;
}

.cart-item {
  background-color: #fff;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  padding: 1rem;
  display: grid;
  grid-template-columns: 100px 1fr auto auto;
  gap: 1rem;
  align-items: center;
  margin-bottom: 1rem;
  transition: box-shadow 0.3s;
}

.cart-item:hover {
  box-shadow: 0 4px 12px rgba(0,0,0,0.08);
}

.cart-item img {
  width: 100px;
  height: 100px;
  object-fit: cover;
  border-radius: 5px;
}

.cart-item-details h3 {
  margin: 0 0 0.5rem 0;
  color: #2d5a27;
  font-size: 1.1rem;
}

.cart-item-details p {
  margin: 0;
  color: #666;
}

.qty-controls {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.qty-controls button {
  padding: 0.3rem 0.6rem;
  font-size: 0.9rem;
  border-radius: 4px;
  cursor: pointer;
  border: none;
  transition: background-color 0.2s;
}

.qty-controls .btn-secondary {
  background-color: #ccc;
  color: #333;
}

.qty-controls .btn-secondary:hover {
  background-color: #bbb;
}

.qty-controls .btn-primary {
  background-color: #2d5a27;
  color: #fff;
}

.qty-controls .btn-primary:disabled {
  background-color: #a0a0a0;
  cursor: not-allowed;
}

.item-price {
  text-align: right;
  font-weight: bold;
  font-size: 1.1rem;
  color: #2d5a27;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.btn-danger {
  background-color: #e74c3c;
  color: #fff;
  padding: 0.3rem 0.6rem;
  font-size: 0.8rem;
  border-radius: 4px;
  border: none;
  cursor: pointer;
  transition: background-color 0.2s;
}

.btn-danger:hover {
  background-color: #c0392b;
}

.order-summary {
  background-color: #fff;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
}

.order-summary h3 {
  margin: 0 0 1rem 0;
  color: #2d5a27;
  font-size: 1.2rem;
  font-weight: bold;
}

.order-summary div {
  display: flex;
  justify-content: space-between;
  margin-bottom: 0.5rem;
  color: #333;
  font-size: 1rem;
}

.order-summary hr {
  margin: 1rem 0;
  border: 0;
  border-top: 1px solid #e0e0e0;
}

.order-summary .total {
  font-size: 1.2rem;
  font-weight: bold;
  color: #2d5a27;
}

.order-summary p {
  font-size: 0.9rem;
  color: #666;
  margin: 0.5rem 0;
}

.btn {
  border-radius: 5px;
  border: none;
  padding: 0.8rem 1rem;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.2s;
  text-align: center;
  display: inline-block;
}

.btn-primary {
  background-color: #2d5a27;
  color: #fff;
}

.btn-primary:hover {
  background-color: #1f3e1b;
}

.btn-secondary {
  background-color: #ccc;
  color: #333;
}

.btn-secondary:hover {
  background-color: #bbb;
}

.full-btn {
  width: 100%;
  margin-top: 1rem;
}

.empty-cart {
  text-align: center;
  padding: 3rem;
}

.empty-cart h2 {
  font-size: 1.8rem;
  color: #2d5a27;
}

.empty-cart p {
  margin: 1rem 0;
  color: #666;
}

@media (max-width: 768px) {
  .cart-grid {
    grid-template-columns: 1fr;
  }

  .cart-item {
    grid-template-columns: 80px 1fr auto;
  }

  .qty-controls {
    gap: 0.3rem;
  }
}
`;

export default Cart;
