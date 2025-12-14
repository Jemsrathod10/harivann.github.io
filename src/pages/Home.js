import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ProductCard from '../components/ProductCard';

const Home = () => {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFeaturedProducts();
  }, []);

  const fetchFeaturedProducts = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/products');
      if (response.data && response.data.products) {
        const products = response.data.products;
        const sortedProducts = products.sort((a, b) => new Date(b.createdAt || b._id) - new Date(a.createdAt || a._id));
        setFeaturedProducts(sortedProducts.slice(0, 3));
      } else {
        setFeaturedProducts([]);
      }
      setLoading(false);
    } catch (error) {
      console.error('Error fetching products:', error);
      setLoading(false);
    }
  };

  const styles = `
    .home-container {
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      color: #333;
      background: #f9fef9;
      min-height: 100vh;
    }
    .banner {
      position: relative;
      background: url('https://images.unsplash.com/photo-1501004318641-b39e6451bec6?auto=format&fit=crop&w=1650&q=80') center center/cover no-repeat;
      height: 480px;
      border-radius: 14px;
      margin-bottom: 3rem;
      display: flex;
      align-items: center;
      justify-content: center;
      text-align: center;
      color: white;
      box-shadow: inset 0 0 0 1000px rgba(0, 90, 25, 0.55);
      user-select: none;
    }
    .banner-content {
      max-width: 800px;
      padding: 0 1rem;
    }
    .banner-title {
      font-size: 3.5rem;
      font-weight: 900;
      margin-bottom: 1rem;
      letter-spacing: 1.2px;
      text-shadow: 2px 2px 9px rgba(0,0,0,0.7);
    }
    .banner-text {
      font-size: 1.3rem;
      line-height: 1.75;
      margin-bottom: 2.5rem;
      text-shadow: 1px 1px 6px rgba(0,0,0,0.65);
    }
    .btn-banner {
      background-color: #28a745;
      color: white;
      font-weight: 700;
      padding: 1.15rem 2.5rem;
      font-size: 1.1rem;
      border-radius: 35px;
      text-decoration: none;
      transition: background-color 0.3s ease, box-shadow 0.3s ease;
      box-shadow: 0 8px 20px rgba(40, 167, 69, 0.55);
      user-select: none;
      display: inline-block;
    }
    .btn-banner:hover {
      background-color: #1e7e34;
      box-shadow: 0 10px 28px rgba(30, 126, 52, 0.75);
    }
    section {
      padding: 4rem 1rem 6rem 1rem;
      max-width: 1200px;
      margin: 0 auto;
    }
    section h2 {
      text-align: center;
      font-weight: 800;
      font-size: 2.2rem;
      color: #2d5a27;
      margin-bottom: 3rem;
      letter-spacing: 0.7px;
    }
    .products-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 2.4rem;
    }
    .features-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
      gap: 2.4rem;
    }
    .feature-card {
      background-color: #f0fff4;
      padding: 2.5rem;
      border-radius: 16px;
      text-align: center;
      box-shadow: 0 6px 18px rgba(0,0,0,0.1);
      user-select: none;
      transition: transform 0.3s ease, box-shadow 0.3s ease;
    }
    .feature-card:hover {
      transform: translateY(-10px);
      box-shadow: 0 12px 35px rgba(0, 150, 60, 0.2);
    }
    .feature-card h3 {
      font-size: 1.65rem;
      margin-bottom: 1rem;
      color: #1a6329;
    }
    .feature-card p {
      font-size: 1.05rem;
      color: #444;
      line-height: 1.6;
    }
    @media (max-width: 768px) {
      .banner-title {
        font-size: 2.6rem;
      }
      .banner-text {
        font-size: 1.1rem;
      }
      section {
        padding: 3rem 1rem 4rem 1rem;
      }
    }
  `;

  if (loading) {
    return (
      <>
        <style>{styles}</style>
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '70vh',
            fontSize: '1.5rem',
            fontWeight: '500',
            color: '#28a745',
            fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
          }}
        >
          Loading...
        </div>
      </>
    );
  }

  return (
    <>
      <style>{styles}</style>
      <div className="home-container">
        {/* Banner */}
        <section className="banner" aria-label="Welcome to PlantShop banner">
          <div className="banner-content">
            <h1 className="banner-title">Welcome to PlantShop</h1>
            <p className="banner-text">
              Discover beautiful plants that will transform your space into a green paradise. From indoor succulents to outdoor flowering plants, we have everything you need.
            </p>
            <a href="/products" className="btn-banner" aria-label="Shop Now">
              Shop Now
            </a>
          </div>
        </section>

        {/* Featured Products */}
        <section aria-label="Featured Plants" style={{ backgroundColor: '#f9f9f9' }}>
          <h2>Featured Plants</h2>
          <div className="products-grid">
            {featuredProducts.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        </section>

        {/* Why Choose Us */}
        <section aria-label="Why Choose PlantShop" style={{ backgroundColor: '#fff' }}>
          <h2>Why Choose PlantShop?</h2>
          <div className="features-grid">
            <div className="feature-card">
              <h3>🌿 Fresh Quality</h3>
              <p>All plants are carefully selected and maintained to ensure you receive the healthiest specimens.</p>
            </div>
            <div className="feature-card">
              <h3>🚚 Fast Delivery</h3>
              <p>Quick and safe delivery to your doorstep with proper packaging to protect your plants.</p>
            </div>
            <div className="feature-card">
              <h3>💬 Expert Support</h3>
              <p>Our plant experts are here to help you with care instructions and plant selection.</p>
            </div>
          </div>
        </section>
      </div>
    </>
  );
};

export default Home;
