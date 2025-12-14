import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import axios from 'axios';

const AdminDashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalUsers: 0,
    lowStock: 0,
    totalRevenue: 0,
  });
  const [recentProducts, setRecentProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!user || !user.isAdmin) return;
    fetchDashboardData();
  }, [user]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError('');

      const productsResponse = await axios.get('http://localhost:5000/api/products');
      const products = Array.isArray(productsResponse.data)
        ? productsResponse.data
        : productsResponse.data.products || [];

      const lowStockProducts = products.filter((p) => {
        const stockQty = typeof p.stock === 'object' ? p.stock.quantity : p.stock;
        return stockQty < 5;
      });

      setStats({
        totalProducts: products.length,
        totalUsers: 3, // Mock
        lowStock: lowStockProducts.length,
        totalRevenue: 125000, // Mock
      });

      const recentProductsList = products
        .sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0))
        .slice(0, 5);

      setRecentProducts(recentProductsList);
    } catch (error) {
      setError(error.response?.data?.message || error.message || 'Failed to load dashboard data');
      setStats({
        totalProducts: 0,
        totalUsers: 0,
        lowStock: 0,
        totalRevenue: 0,
      });
      setRecentProducts([]);
    } finally {
      setLoading(false);
    }
  };

  if (!user || !user.isAdmin) {
    return (
      <div className="container">
        <div className="form-container" style={{ textAlign: 'center' }}>
          <h2>Access Denied</h2>
          <p>You need admin privileges to access this page.</p>
          <Link to="/" className="btn btn-primary">
            Go Home
          </Link>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="loading" style={{ textAlign: 'center', padding: '3rem' }}>
        <h2>Loading Dashboard...</h2>
        <div className="spinner"></div>
        <style>{`
          .spinner {
            border: 4px solid #f3f3f3;
            border-top: 4px solid #28a745;
            border-radius: 50%;
            width: 40px;
            height: 40px;
            animation: spin 1s linear infinite;
            margin: 20px auto;
          }
          @keyframes spin {
            0% { transform: rotate(0deg);}
            100% { transform: rotate(360deg);}
          }
        `}</style>
      </div>
    );
  }

  return (
    <>
      <div className="admin-container">
        <div className="admin-header">
          <h1>Admin Dashboard</h1>
          <p>Welcome back, {user.name}! Here's your store overview.</p>
        </div>

        {error && (
          <div className="error-box" role="alert">
            <strong>⚠️ Dashboard Error:</strong> {error}
            <button onClick={fetchDashboardData} className="btn btn-sm btn-secondary">
              🔄 Retry
            </button>
          </div>
        )}
{/* Stats Cards */}
<div className="admin-stats">
  <div className="stat-card">
    <div className="stat-number">{stats.totalProducts}</div>
    <div className="stat-label">Total Products</div>
  </div>
  <div className="stat-card">
    <div className="stat-number">{stats.totalUsers}</div>
    <div className="stat-label">Total Users</div>
  </div>
  <div className="stat-card">
    <div className="stat-number">{stats.lowStock}</div>
    <div className="stat-label">Low Stock Items</div>
  </div>
  <div className="stat-card">
    <div className="stat-number">--</div>
    <div className="stat-label">Total Revenue (Coming Soon)</div>
  </div>
</div>


        {/* Quick Actions */}
        <div className="admin-actions">
          <Link to="/admin/add-product" className="btn btn-primary">
            ➕ Add New Product
          </Link>
          <Link to="/admin/manage-products" className="btn btn-secondary">
            📦 Manage Products
          </Link>
          <Link to="/admin/orders" className="btn btn-secondary">
            📄 View All Orders
          </Link>
          <Link to="/products" className="btn btn-secondary">
            👁️ View Store
          </Link>
          <button onClick={fetchDashboardData} className="btn btn-secondary">
            🔄 Refresh Data
          </button>
        </div>

        {/* Recent Products */}
        <div className="product-table">
          <h3>Recent Products ({recentProducts.length})</h3>

          {recentProducts.length > 0 ? (
            <table>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Category</th>
                  <th>Price</th>
                  <th>Stock</th>
                  <th>Status</th>
                  <th>Created</th>
                </tr>
              </thead>
              <tbody>
                {recentProducts.map((product) => {
                  const stockQty =
                    typeof product.stock === 'object' ? product.stock.quantity : product.stock || 0;

                  return (
                    <tr key={product._id || Math.random()}>
                      <td>{product.name || 'Unknown'}</td>
                      <td>{product.category?.name || product.category || 'Uncategorized'}</td>
                      <td>₹{product.price || 0}</td>
                      <td>{stockQty}</td>
                      <td>
                        <span className={stockQty > 0 ? 'in-stock' : 'out-of-stock'}>
                          {stockQty > 0 ? 'In Stock' : 'Out of Stock'}
                        </span>
                      </td>
                      <td>{product.createdAt ? new Date(product.createdAt).toLocaleDateString() : 'Unknown'}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          ) : (
            <div className="no-products">
              <p>No products available</p>
              <Link to="/admin/add-product" className="btn btn-primary">
                Add Your First Product
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Internal CSS */}
      <style>{`
        .admin-container {
          max-width: 1100px;
          margin: 2rem auto;
          padding: 2.5rem 2rem;
          background: #fff;
          border-radius: 18px;
          box-shadow: 0 12px 30px rgba(0, 0, 0, 0.08);
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          color: #2c2c2c;
        }
        .admin-header {
          background: #f5f5f5;
          padding: 1.8rem 2rem;
          border-radius: 12px;
          margin-bottom: 2rem;
          box-shadow: inset 0 0 6px rgba(0,0,0,0.06);
        }
        .admin-header h1 {
          font-size: 2.8rem;
          font-weight: 900;
          margin: 0 0 0.3rem 0;
          color: #333;
          letter-spacing: 1px;
        }
        .admin-header p {
          color: #666;
          font-size: 1.25rem;
          font-weight: 600;
        }
        .error-box {
          padding: 1rem 1.5rem;
          background-color: #f8d7da;
          color: #842029;
          border-radius: 12px;
          margin-bottom: 2.5rem;
          border: 1.5px solid #f5c2c7;
          font-weight: 700;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        .error-box button {
          background: #a71d2a;
          color: white;
          padding: 0.4rem 1rem;
          border-radius: 8px;
          border: none;
          cursor: pointer;
          font-weight: 600;
          transition: background-color 0.3s ease;
        }
        .error-box button:hover {
          background: #6f1320;
        }
        .admin-stats {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
          gap: 2rem;
          margin-bottom: 3rem;
        }
        .stat-card {
          background: #f1f3f5;
          padding: 2rem;
          border-radius: 18px;
          text-align: center;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.05);
          transition: transform 0.3s ease, box-shadow 0.3s ease;
          cursor: default;
        }
        .stat-card:hover {
          transform: translateY(-8px);
          box-shadow: 0 16px 45px rgba(0, 0, 0, 0.1);
        }
        .stat-number {
          font-size: 2.6rem;
          font-weight: 900;
          color: #212529;
          letter-spacing: 1.3px;
          margin-bottom: 0.4rem;
        }
        .stat-label {
          color: #6c757d;
          font-size: 1.05rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.8px;
        }
        .admin-actions {
          display: flex;
          flex-wrap: wrap;
          gap: 1.8rem;
          margin-bottom: 3rem;
          justify-content: center;
        }
        .btn {
          padding: 0.75rem 1.6rem;
          border-radius: 14px;
          font-weight: 700;
          text-align: center;
          cursor: pointer;
          user-select: none;
          border: none;
          min-width: 160px;
          box-shadow: 0 6px 18px rgba(108, 117, 125, 0.25);
          background-color: #6c757d;
          color: white;
          transition: all 0.3s ease;
        }
        .btn-primary {
          background-color: #495057;
        }
        .btn-primary:hover {
          background-color: #343a40;
          box-shadow: 0 9px 26px rgba(52, 58, 64, 0.7);
          transform: translateY(-3px);
        }
        .btn-secondary {
          background-color: #e9ecef;
          color: #495057;
          box-shadow: 0 4px 12px rgba(108, 117, 125, 0.15);
        }
        .btn-secondary:hover {
          background-color: #dee2e6;
          color: #212529;
        }
        /* Only changed "View All Orders" to btn-secondary color */
        /* Product table */
        .product-table {
          margin-top: 3rem;
          border: 1.8px solid #dee2e6;
          border-radius: 16px;
          overflow: hidden;
          box-shadow: 0 10px 30px rgba(108, 117, 125, 0.1);
        }
        .product-table h3 {
          padding: 1.3rem 2rem;
          margin: 0;
          background: #f8f9fa;
          color: #343a40;
          font-weight: 800;
          font-size: 1.6rem;
          letter-spacing: 0.5px;
        }
        table {
          width: 100%;
          border-collapse: collapse;
          font-weight: 600;
          color: #212529;
        }
        table th,
        table td {
          padding: 1.1rem 1.8rem;
          border-bottom: 1.3px solid #dee2e6;
          text-align: left;
        }
        table th {
          background: #e9ecef;
          font-weight: 700;
        }
        table tr:hover {
          background: #f1f3f5;
        }
        .in-stock {
          color: #2d6a4f;
          font-weight: 700;
        }
        .out-of-stock {
          color: #b02a37;
          font-weight: 700;
        }
        .no-products {
          padding: 2.5rem;
          text-align: center;
          color: #6c757d;
          font-weight: 700;
        }
        /* Accessibility */
        .btn:focus,
        .btn-primary:focus,
        .btn-secondary:focus {
          outline: 3px solid #adb5bd;
          outline-offset: 3px;
        }
      `}</style>
    </>
  );
};
export default AdminDashboard; // ✅ aapvu j chhe
