import React from 'react';
import { useCart } from '../context/CartContext';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProductCard = ({ product, isAdmin, onEdit, onDelete }) => {
  const { addToCart } = useCart();
  const { user } = useAuth();   // 👈 login થયેલો છે કે નહિ એ અહીંથી ચેક થશે
  const navigate = useNavigate();

  const handleAddToCart = () => {
    if (!user) {
      navigate('/login');  // 👈 login પર મોકલી દેવું
      return;
    }
    addToCart(product, 1);
    alert(`${product?.name || 'Plant'} added to cart!`);
  };

  const handleBuyNow = () => {
    if (!user) {
      navigate('/login');  // 👈 login પર મોકલી દેવું
      return;
    }
    addToCart(product, 1); 
    navigate('/cart');     
  };

  if (!product) {
    return (
      <div style={styles.card}>
        <div style={{ padding: '2rem', textAlign: 'center' }}>
          <p>Product data unavailable</p>
        </div>
      </div>
    );
  }

  const imageUrl =
    product?.images?.[0]?.url || 'https://placehold.co/300x300?text=Plant+Image';
  const stockQuantity = product?.stock?.quantity ?? 0;

  return (
    <div style={styles.card}>
      <img
        src={imageUrl}
        alt={product?.name || 'Plant'}
        style={styles.image}
        onError={(e) => {
          e.currentTarget.src = 'https://placehold.co/300x300?text=Plant+Image';
        }}
      />
      <div style={styles.info}>
        <h3 style={styles.name}>{product?.name || 'Unknown Plant'}</h3>

        <div style={styles.priceDisplay}>
          <span style={styles.currentPrice}>₹{product?.price || 0}</span>
          {product?.originalPrice && product.originalPrice > product.price && (
            <>
              <span style={styles.originalPrice}>₹{product.originalPrice}</span>
              <span style={styles.discountBadge}>
                {product?.discount ? `${product.discount}% OFF` : ''}
              </span>
            </>
          )}
        </div>

        <p style={styles.description}>
          {product?.shortDescription ||
            product?.description ||
            'No description available'}
        </p>

        <p style={styles.stockInfo}>
          <span
            style={stockQuantity > 0 ? styles.inStock : styles.outOfStock}
          >
            {stockQuantity > 0
              ? `In Stock (${stockQuantity})`
              : 'Out of Stock'}
          </span>
        </p>

        <p style={styles.category}>
          Category: {product?.category?.name || product?.category || 'Uncategorized'}
        </p>

        {product?.rating && product.rating > 0 && (
          <div style={{ marginBottom: '1rem' }}>
            <div style={{ color: '#ffc107' }}>
              {'★'.repeat(Math.floor(product.rating))}
              {'☆'.repeat(5 - Math.floor(product.rating))}
            </div>
            <span style={styles.ratingText}>
              {product.rating}/5 ({product?.numReviews || 0} reviews)
            </span>
          </div>
        )}

        {product?.benefits && product.benefits.length > 0 && (
          <div style={{ marginBottom: '1rem' }}>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.25rem' }}>
              {product.benefits.slice(0, 3).map((benefit, index) => (
                <span key={index} style={styles.benefitTag}>
                  {benefit}
                </span>
              ))}
            </div>
          </div>
        )}

        {isAdmin ? (
          <div style={styles.actionButtons}>
            <button
              onClick={() => onEdit(product)}
              style={{ ...styles.btn, ...styles.btnWarning }}
            >
              Edit
            </button>
            <button
              onClick={() => onDelete(product._id)}
              style={{ ...styles.btn, ...styles.btnDanger }}
            >
              Delete
            </button>
          </div>
        ) : (
          <div style={styles.actionButtons}>
            <button
              style={{
                ...styles.btn,
                ...(stockQuantity > 0 ? styles.btnPrimary : styles.btnSecondary),
                flex: 1,
              }}
              disabled={stockQuantity === 0}
              onClick={handleAddToCart}
            >
              {stockQuantity > 0 ? 'Add to Cart' : 'Out of Stock'}
            </button>
            {stockQuantity > 0 && (
              <button
                style={{ ...styles.btn, ...styles.btnBuyNow, flex: 1 }}
                onClick={handleBuyNow}
              >
                Buy Now
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

const styles = {
  card: {
    background: '#fff',
    borderRadius: '16px',
    boxShadow: '0 4px 15px rgba(0,0,0,0.08)',
    overflow: 'hidden',
    transition: 'all 0.3s ease',
    display: 'flex',
    flexDirection: 'column',
    margin: '1rem',
  },
  image: {
    width: '100%',
    height: '220px',
    objectFit: 'contain',
    backgroundColor: '#f9f9f9',
    padding: '10px',
    borderBottom: '1px solid #eee',
  },
  info: {
    padding: '1.2rem',
    display: 'flex',
    flexDirection: 'column',
    flexGrow: 1,
  },
  name: {
    fontSize: '1.25rem',
    fontWeight: '600',
    color: '#2f3e46',
    marginBottom: '0.5rem',
  },
  priceDisplay: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    marginBottom: '0.5rem',
  },
  currentPrice: {
    fontSize: '1.1rem',
    fontWeight: '700',
    color: '#00796b',
  },
  originalPrice: {
    fontSize: '0.95rem',
    color: '#9e9e9e',
    textDecoration: 'line-through',
  },
  discountBadge: {
    fontSize: '0.8rem',
    color: '#e53935',
    fontWeight: '600',
  },
  description: {
    fontSize: '0.9rem',
    color: '#546e7a',
    margin: '0.5rem 0',
    flexGrow: 1,
  },
  stockInfo: {
    fontSize: '0.9rem',
    marginBottom: '0.3rem',
  },
  inStock: { color: '#2e7d32', fontWeight: '500' },
  outOfStock: { color: '#c62828', fontWeight: '500' },
  category: {
    fontSize: '0.85rem',
    color: '#616161',
    marginBottom: '1rem',
  },
  benefitTag: {
    fontSize: '0.8rem',
    backgroundColor: '#e8f5e8',
    color: '#2d5a27',
    padding: '0.2rem 0.5rem',
    borderRadius: '10px',
  },
  ratingText: {
    fontSize: '0.85rem',
    color: '#555',
    marginLeft: '0.5rem',
  },
  btn: {
    border: 'none',
    padding: '0.6rem 1rem',
    borderRadius: '8px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.25s ease',
  },
  btnPrimary: {
    background: 'linear-gradient(135deg, #43a047, #2e7d32)',
    color: 'white',
  },
  btnSecondary: {
    background: '#b0bec5',
    color: 'white',
  },
  btnWarning: {
    background: '#ffa726',
    color: 'white',
  },
  btnDanger: {
    background: '#ef5350',
    color: 'white',
  },
  btnBuyNow: {
    background: 'linear-gradient(135deg, #ff5722, #e64a19)',
    color: 'white',
  },
  actionButtons: {
    display: 'flex',
    gap: '0.5rem',
    marginTop: '1rem',
  },
};

export default ProductCard;
