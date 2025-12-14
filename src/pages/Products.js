import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import ProductCard from '../components/ProductCard';

const Products = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filterCategory, setFilterCategory] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');

  // ✅ fetch products
  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true);
      setError('');
      const response = await axios.get('http://localhost:5000/api/products');
      let productsData = Array.isArray(response.data)
        ? response.data
        : response.data?.products;
      if (!Array.isArray(productsData)) {
        productsData = [];
      }
      setProducts(productsData);
    } catch (err) {
      setError(
        err.response?.data?.message ||
        err.message ||
        'Failed to connect to server'
      );
      setProducts([]);
    } finally {
      setLoading(false);
    }
  }, []);

  // ✅ fetch categories
  const fetchCategories = useCallback(async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/categories');
      let categoriesData = Array.isArray(response.data)
        ? response.data
        : response.data?.categories;
      if (!Array.isArray(categoriesData)) {
        categoriesData = [];
      }
      setCategories(categoriesData);
    } catch (err) {
      console.error('Error fetching categories:', err.message);
      setCategories([]);
    }
  }, []);

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, [fetchProducts, fetchCategories]);

  // ✅ filter products
  const filteredProducts = products.filter((p) => {
    if (!p) return false;
    const matchesSearch =
      searchTerm === '' ||
      (p.name && p.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (p.description && p.description.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesCategory =
      filterCategory === 'All' ||
      (p.category?._id || p.category) === filterCategory;

    return matchesSearch && matchesCategory;
  });

  // ✅ Internal CSS
  const styles = `
  .products-container {
    padding: 30px 0;
    min-height: 100vh;
    background: linear-gradient(112deg, #e0ffef 0%, #f9fff5 100%);
    font-family: 'Segoe UI', 'Roboto', 'Arial', sans-serif;
  }
  .products-section {
    background: #fff;
    max-width: 1100px;
    margin: 28px auto 18px auto;
    border-radius: 18px;
    box-shadow: 0 8px 40px 0 rgba(48, 174, 104, 0.13);
    padding: 32px 24px 28px 24px;
    overflow: hidden;
  }
  .section-title {
    font-size: 2.1rem;
    font-weight: 700;
    letter-spacing: 1px;
    color: #179156;
    text-align: center;
    margin-bottom: 2rem;
  }
  .products-controls {
    margin-bottom: 2rem;
    display: flex;
    gap: 1rem;
    flex-wrap: wrap;
    align-items: center;
    background: #fafcfb;
    border-radius: 11px;
    padding: 1.4rem 1rem;
    box-shadow: 0 2px 7px rgba(0,0,0,0.05);
  }
  .products-controls .form-control, 
  .products-controls .select {
    border: 1.7px solid #c2f7d1;
    padding: 12px 14px;
    border-radius: 8px;
    font-size: 1rem;
    background: #f6fff7;
    transition: border 0.17s;
  }
  .products-controls .form-control:focus, 
  .products-controls .select:focus {
    border-color: #00b894;
    outline: none;
  }
  .products-info-block {
    margin-bottom: 2rem;
    padding: 1rem;
    background: #f7fdfa;
    border-radius: 6px;
    box-shadow: 0 2px 5px rgba(0,0,0,0.04);
  }
  .products-info-block strong {
    color: #179156;
  }
  .products-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px,1fr));
    gap: 24px 20px;
    padding-bottom: 1rem;
  }
  .loading, .products-error, .products-empty {
    text-align: center;
    padding: 3.3rem 0;
    background: #fff;
    border-radius: 12px;
    margin-top: 2.2rem;
    box-shadow: 0 2px 12px 0 rgba(82, 193, 120, 0.13);
  }
  .spinner {
    border: 4px solid #f3f3f3;
    border-top: 4px solid #28a745;
    border-radius: 50%;
    width: 40px;
    height: 40px;
    animation: spin 1s linear infinite;
    margin: 18px auto;
    display: block;
  }
  @keyframes spin {
    0% { transform: rotate(0deg);}
    100% { transform: rotate(360deg);}
  }
  `;

  if (loading) {
    return (
      <>
        <style>{styles}</style>
        <div className="products-container">
          <div className="products-section">
            <div className="loading">
              <h2>Loading Products...</h2>
              <div className="spinner"></div>
              <p>Fetching fresh plants from our database...</p>
            </div>
          </div>
        </div>
      </>
    );
  }

  if (error) {
    return (
      <>
        <style>{styles}</style>
        <div className="products-container">
          <div className="products-section">
            <div className="products-error">
              <h2>❌ Unable to Load Products</h2>
              <p><strong>Error:</strong> {error}</p>
              <button onClick={fetchProducts} className="btn btn-primary">
                🔄 Try Again
              </button>
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <style>{styles}</style>
      <div className="products-container">
        <div className="products-section">
          <h1 className="section-title">Our Plants Collection</h1>

          {/* ✅ Search & Category Filter */}
          <div className="products-controls">
            <input
              type="text"
              placeholder="Search plants..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="form-control"
              style={{ flex: 1, minWidth: '250px' }}
            />
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="form-control select"
              style={{ width: '200px' }}
            >
              <option value="All">All Categories</option>
              {categories.map((c) => (
                <option key={c._id} value={c._id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          {/* Results Info */}
          <div className="products-info-block">
            <p style={{ margin: 0 }}>
              <strong>
                Showing {filteredProducts.length} of {products.length} products
              </strong>
              {searchTerm && <span> matching "{searchTerm}"</span>}
              {filterCategory !== 'All' && (
                <span> in {categories.find(c => c._id === filterCategory)?.name}</span>
              )}
            </p>
          </div>

          {/* Products Grid */}
          {filteredProducts.length > 0 ? (
            <div className="products-grid">
              {filteredProducts.map((product) => (
                <ProductCard key={product._id || product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="products-empty">
              <h3>No Products Found</h3>
              <p style={{ color: '#666' }}>
                {products.length === 0
                  ? 'No products available in the database.'
                  : 'Try adjusting your search or filter criteria.'}
              </p>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Products;
