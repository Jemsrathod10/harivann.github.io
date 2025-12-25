import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import axios from 'axios';

const EditProduct = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { id } = useParams();

  const [product, setProduct] = useState(null);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user || !user.isAdmin) {
      navigate('/');
      return;
    }

    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token');

        // Fetch product
        const productRes = await axios.get
        (`https://plant-selling-backend.onrender.com/api/products)${id}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        const p = productRes.data.product;
        setProduct({
          ...p,
          stock: p.stock?.quantity || 0,
          image: p.images?.[0]?.url || '',
        });

        // Fetch categories
        const categoriesRes = await axios.get('http://localhost:5000/api/categories');
        setCategories(categoriesRes.data.categories || []);
      } catch (err) {
        console.error(err);
        alert(err.response?.data?.message || 'Failed to load product or categories');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id, user, navigate]);

  const handleChange = (e) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setProduct({ ...product, [e.target.name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');

      // Clean payload for backend
      const payload = {
        name: product.name,
        description: product.description,
        category: product.category,
        price: Number(product.price),
        stock: { quantity: Number(product.stock), trackInventory: true },
        images: [{ url: product.image || '', isPrimary: true }],
        featured: Boolean(product.featured),
        shortDescription: product.shortDescription,
        originalPrice: product.originalPrice ? Number(product.originalPrice) : undefined,
        discount: product.discount ? Number(product.discount) : undefined,
        specifications: product.specifications,
        benefits: product.benefits,
        tags: product.tags,
      };

      await axios.put(`http://localhost:5000/api/products/${id}`, payload, {
        headers: { Authorization: `Bearer ${token}` },
      });

      alert('✅ Product updated successfully');
      navigate('/admin/manage-products');
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || '❌ Failed to update product');
    }
  };

  if (loading) return <div>Loading product...</div>;
  if (!product) return <div>Product not found</div>;

  return (
    <div className="edit-product-container">
      <h2>Edit Product</h2>
      <form onSubmit={handleSubmit} className="edit-product-form">
        <div className="form-group">
          <label>Name</label>
          <input
            type="text"
            name="name"
            value={product.name}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Description</label>
          <textarea
            name="description"
            value={product.description}
            onChange={handleChange}
            rows="4"
            required
          />
        </div>

        <div className="form-group">
          <label>Category</label>
          <select
            name="category"
            value={product.category}
            onChange={handleChange}
            required
          >
            <option value="">Select category</option>
            {categories.map((cat) => (
              <option key={cat._id} value={cat._id}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label>Price (₹)</label>
          <input
            type="number"
            name="price"
            value={product.price}
            onChange={handleChange}
            min="0"
            step="0.01"
            required
          />
        </div>

        <div className="form-group">
          <label>Stock</label>
          <input
            type="number"
            name="stock"
            value={product.stock}
            onChange={handleChange}
            min="0"
            required
          />
        </div>

        <div className="form-group">
          <label>Image URL</label>
          <input
            type="url"
            name="image"
            value={product.image}
            onChange={handleChange}
          />
        </div>

        <div className="form-group checkbox-group">
          <label>
            <input
              type="checkbox"
              name="featured"
              checked={product.featured}
              onChange={handleChange}
            /> Featured Product
          </label>
        </div>

        <button type="submit" className="btn-submit">
          Update Product
        </button>
      </form>

      {/* Professional CSS */}
      <style>{`
        .edit-product-container {
          max-width: 700px;
          margin: 2rem auto;
          padding: 2rem;
          background: #ffffff;
          border-radius: 12px;
          box-shadow: 0 4px 15px rgba(0,0,0,0.1);
        }
        .edit-product-container h2 {
          text-align: center;
          margin-bottom: 1.5rem;
          color: #2d5a27;
        }
        .edit-product-form .form-group {
          margin-bottom: 1.2rem;
        }
        .edit-product-form label {
          display: block;
          font-weight: 600;
          margin-bottom: 0.5rem;
          color: #333;
        }
        .edit-product-form input,
        .edit-product-form textarea,
        .edit-product-form select {
          width: 100%;
          padding: 0.65rem 0.85rem;
          border: 1px solid #ccc;
          border-radius: 8px;
          font-size: 1rem;
          transition: border-color 0.3s, box-shadow 0.3s;
        }
        .edit-product-form input:focus,
        .edit-product-form textarea:focus,
        .edit-product-form select:focus {
          border-color: #2d5a27;
          box-shadow: 0 0 6px rgba(45, 90, 39, 0.3);
          outline: none;
        }
        .edit-product-form textarea {
          resize: vertical;
        }
        .checkbox-group {
          display: flex;
          align-items: center;
        }
        .checkbox-group input {
          margin-right: 0.5rem;
        }
        .btn-submit {
          width: 100%;
          padding: 0.85rem;
          background: linear-gradient(135deg, #4caf50, #2d5a27);
          color: #fff;
          font-size: 1.05rem;
          font-weight: 600;
          border: none;
          border-radius: 8px;
          cursor: pointer;
          transition: transform 0.2s, box-shadow 0.3s;
        }
        .btn-submit:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 12px rgba(0,0,0,0.15);
        }
      `}</style>
    </div>
  );
};

export default EditProduct;
