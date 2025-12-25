import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import ProductCard from '../../components/ProductCard';

const ManageProducts = () => {
  const { user } = useAuth();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingProduct, setEditingProduct] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('All');

  useEffect(() => {
    if (!user || !user.isAdmin) window.location.href = '/';
    fetchProducts();
    fetchCategories();
  }, [user]);

  const fetchProducts = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get("https://plant-selling-backend.onrender.com/api/products", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProducts(res.data.products || []);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get("https://plant-selling-backend.onrender.com/api/products", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCategories(res.data.categories || []);
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`https://plant-selling-backend.onrender.com/api/products/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProducts(products.filter((p) => p._id !== id));
      alert('✅ Product deleted successfully');
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.error || '❌ Failed to delete product');
    }
  };

  const handleEdit = (product) => {
    setEditingProduct({
      ...product,
      stock: product.stock?.quantity || 0,
      image: product.images?.[0]?.url || '',
      category: product.category?._id || product.category,
    });
  };

  const handleEditChange = (e) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setEditingProduct({ ...editingProduct, [e.target.name]: value });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const payload = {
        ...editingProduct,
        stock: { quantity: Number(editingProduct.stock) },
        images: [{ url: editingProduct.image || 'https://via.placeholder.com/400', isPrimary: true }],
      };

      const res = await axios.put(`https://plant-selling-backend.onrender.com/api/products/${editingProduct._id}`, payload, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setProducts(products.map((p) => (p._id === editingProduct._id ? res.data.product : p)));
      setEditingProduct(null);
      alert('✅ Product updated successfully');
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.error || '❌ Failed to update product');
    }
  };

  const filteredProducts = products.filter((p) => {
    const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === 'All' || (p.category?._id || p.category) === filterCategory;
    return matchesSearch && matchesCategory;
  });

  if (loading) return <div>Loading products...</div>;

  return (
    <div className="manage-products-container">
      <h1>Manage Products</h1>

      {/* Search & Filter */}
      <div className="search-filter">
        <input
          type="text"
          placeholder="Search..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          aria-label="Search products"
        />
        <select value={filterCategory} onChange={(e) => setFilterCategory(e.target.value)} aria-label="Filter by category">
          <option value="All">All Categories</option>
          {categories.map((c) => (
            <option key={c._id} value={c._id}>
              {c.name}
            </option>
          ))}
        </select>
      </div>

      {/* Products Grid */}
      <div className="products-grid">
        {filteredProducts.map((p) => (
          <ProductCard key={p._id} product={p} isAdmin={true} onEdit={() => handleEdit(p)} onDelete={() => handleDelete(p._id)} />
        ))}
      </div>

      {/* Edit Modal */}
      {editingProduct && (
        <div className="modal-overlay" role="dialog" aria-modal="true" aria-labelledby="editProductTitle">
          <div className="modal-content">
            <h3 id="editProductTitle">Edit Product</h3>
            <form onSubmit={handleUpdate}>
              <input
                name="name"
                value={editingProduct.name}
                onChange={handleEditChange}
                placeholder="Name"
                required
                aria-label="Product Name"
              />
              <textarea
                name="description"
                value={editingProduct.description}
                onChange={handleEditChange}
                placeholder="Description"
                required
                aria-label="Product Description"
              />
              <input
                name="price"
                type="number"
                value={editingProduct.price}
                onChange={handleEditChange}
                placeholder="Price"
                required
                aria-label="Product Price"
                step="0.01"
                min="0"
              />
              <input
                name="stock"
                type="number"
                value={editingProduct.stock}
                onChange={handleEditChange}
                placeholder="Stock"
                required
                aria-label="Product Stock Quantity"
                min="0"
              />
              <input
                name="image"
                type="url"
                value={editingProduct.image}
                onChange={handleEditChange}
                placeholder="Image URL"
                aria-label="Product Image URL"
              />
              <label>
                <input
                  type="checkbox"
                  name="featured"
                  checked={editingProduct.featured}
                  onChange={handleEditChange}
                  aria-label="Featured Product"
                />{' '}
                Featured
              </label>
              <div className="modal-buttons">
                <button type="submit" className="btn-update">
                  Update
                </button>
                <button type="button" className="btn-cancel" onClick={() => setEditingProduct(null)}>
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Internal CSS */}
      <style>{`
        .manage-products-container {
          max-width: 1200px;
          margin: 2rem auto;
          padding: 2rem;
          background: #fff;
          border-radius: 12px;
          box-shadow: 0 4px 15px rgba(0,0,0,0.08);
        }
        h1 {
          text-align: center;
          margin-bottom: 2rem;
          color: #2d5a27;
          font-size: 2rem;
          font-weight: 700;
        }
        /* Search & Filter */
        .search-filter {
          display: flex;
          gap: 1rem;
          margin-bottom: 2rem;
          flex-wrap: wrap;
        }
        .search-filter input,
        .search-filter select {
          flex: 1;
          padding: 0.75rem 1rem;
          border: 1px solid #ccc;
          border-radius: 8px;
          font-size: 1rem;
          transition: all 0.3s;
        }
        .search-filter input:focus,
        .search-filter select:focus {
          border-color: #2d5a27;
          box-shadow: 0 0 6px rgba(45,90,39,0.25);
          outline: none;
        }
        /* Products Grid */
        .products-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
          gap: 1.5rem;
        }
        /* Modal Overlay */
        .modal-overlay {
          position: fixed;
          top: 0; left: 0; right: 0; bottom: 0;
          background-color: rgba(0,0,0,0.6);
          display: flex;
          justify-content: center;
          align-items: center;
          z-index: 1000;
          animation: fadeIn 0.3s ease-in-out;
        }
        .modal-content {
          background-color: #fff;
          width: 100%;
          max-width: 550px;
          padding: 2rem;
          border-radius: 12px;
          box-shadow: 0 6px 20px rgba(0,0,0,0.2);
          animation: slideUp 0.35s ease-in-out;
        }
        .modal-content h3 {
          margin-bottom: 1.5rem;
          text-align: center;
          color: #2d5a27;
          font-size: 1.4rem;
        }
        /* Inputs */
        .modal-content input,
        .modal-content textarea,
        .modal-content select {
          width: 100%;
          padding: 0.7rem 1rem;
          margin-bottom: 1rem;
          border: 1px solid #ccc;
          border-radius: 8px;
          font-size: 1rem;
          transition: all 0.3s;
        }
        .modal-content input:focus,
        .modal-content textarea:focus,
        .modal-content select:focus {
          border-color: #2d5a27;
          box-shadow: 0 0 6px rgba(45,90,39,0.25);
          outline: none;
        }
        .modal-content textarea {
          resize: vertical;
          min-height: 80px;
        }
        .modal-content label {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-weight: 500;
          margin-bottom: 1rem;
          color: #333;
        }
        /* Modal Buttons */
        .modal-buttons {
          display: flex;
          gap: 1rem;
          margin-top: 1rem;
        }
        .btn-update {
          flex: 1;
          padding: 0.75rem;
          background: linear-gradient(135deg, #4caf50, #2d5a27);
          color: #fff;
          border: none;
          border-radius: 8px;
          font-weight: 600;
          font-size: 1rem;
          cursor: pointer;
          transition: all 0.3s;
        }
        .btn-update:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 14px rgba(0,0,0,0.15);
        }
        .btn-cancel {
          flex: 1;
          padding: 0.75rem;
          background-color: #e0e0e0;
          color: #333;
          border: none;
          border-radius: 8px;
          font-weight: 600;
          cursor: pointer;
          transition: background-color 0.3s;
        }
        .btn-cancel:hover {
          background-color: #c2c2c2;
        }
        /* Animations */
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideUp {
          from { transform: translateY(50px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
      `}</style>
    </div>
  );
};

export default ManageProducts;
