import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { user } = useAuth();

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const token = localStorage.getItem('token');

      if (!token) {
        setError('No authentication token found');
        setOrders([]);
        setLoading(false);
        return;
      }

      console.log('Fetching admin orders...');
      
      const response = await fetch('http://localhost:5000/api/orders', {
        method: 'GET',
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      console.log('Admin orders response status:', response.status);

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP ${response.status}: ${errorText}`);
      }

      const data = await response.json();
      console.log('Admin orders data:', data);

      if (data.success && Array.isArray(data.orders)) {
        setOrders(data.orders);
        setError('');
      } else {
        setOrders([]);
        setError(data.message || 'Invalid response format');
      }
      
    } catch (err) {
      console.error('Error fetching admin orders:', err);
      setError('Failed to fetch orders: ' + err.message);
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (orderId, newStatus) => {
    try {
      const token = localStorage.getItem('token');
      
      const response = await fetch(`http://localhost:5000/api/orders/${orderId}/status`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ status: newStatus })
      });

      if (response.ok) {
        // Refresh orders after status update
        fetchOrders();
        alert('Order status updated successfully!');
      } else {
        const errorData = await response.json();
        alert('Failed to update status: ' + errorData.message);
      }
    } catch (error) {
      console.error('Error updating order status:', error);
      alert('Error updating order status: ' + error.message);
    }
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'pending': return '#ffc107';
      case 'confirmed': return '#17a2b8';
      case 'processing': return '#6f42c1';
      case 'shipped': return '#20c997';
      case 'delivered': return '#28a745';
      case 'cancelled': return '#dc3545';
      default: return '#6c757d';
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    try {
      return new Date(dateString).toLocaleDateString('en-IN', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return 'Invalid Date';
    }
  };

  if (loading) {
    return (
      <div style={styles.container}>
        <h2>Loading admin orders...</h2>
        <p>Please wait while we fetch all orders.</p>
      </div>
    );
  }

  if (error) {
    return (
      <div style={styles.container}>
        <h2>Error Loading Orders</h2>
        <p style={{ color: '#dc3545', margin: '1rem 0' }}>{error}</p>
        <button onClick={fetchOrders} style={styles.retryBtn}>
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h2>Admin Orders Management</h2>
        <p>Total Orders: {orders.length}</p>
        <button onClick={fetchOrders} style={styles.refreshBtn}>
          Refresh Orders
        </button>
      </div>

      {orders.length === 0 ? (
        <div style={styles.emptyState}>
          <h3>No orders found</h3>
          <p>No orders have been placed yet.</p>
        </div>
      ) : (
        <div style={styles.tableContainer}>
          <table style={styles.table}>
            <thead>
              <tr style={styles.headerRow}>
                <th style={styles.th}>Order #</th>
                <th style={styles.th}>User</th>
                <th style={styles.th}>Items</th>
                <th style={styles.th}>Status</th>
                <th style={styles.th}>Total</th>
                <th style={styles.th}>Created At</th>
                <th style={styles.th}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order, index) => {
                const orderNumber = order.orderNumber || `ORD-${order._id?.slice(-8)}` || `ORDER-${index + 1}`;
                const userName = order.user?.name || order.user?.firstName || 'Unknown User';
                const userEmail = order.user?.email || 'N/A';
                const orderStatus = order.status || 'pending';
                const orderTotal = order.pricing?.total || order.totalPrice || 0;
                const itemsCount = order.items?.length || 0;

                return (
                  <tr key={order._id || index} style={styles.row}>
                    <td style={styles.td}>
                      <strong>{orderNumber}</strong>
                    </td>
                    <td style={styles.td}>
                      <div>
                        <div><strong>{userName}</strong></div>
                        <div style={styles.email}>{userEmail}</div>
                      </div>
                    </td>
                    <td style={styles.td}>
                      {itemsCount} item{itemsCount !== 1 ? 's' : ''}
                    </td>
                    <td style={styles.td}>
                      <select
                        value={orderStatus}
                        onChange={(e) => handleStatusUpdate(order._id, e.target.value)}
                        style={{
                          ...styles.statusSelect,
                          backgroundColor: getStatusColor(orderStatus),
                          color: '#fff'
                        }}
                      >
                        <option value="pending">Pending</option>
                        <option value="confirmed">Confirmed</option>
                        <option value="processing">Processing</option>
                        <option value="shipped">Shipped</option>
                        <option value="delivered">Delivered</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                    </td>
                    <td style={styles.td}>
                      <strong>₹{Number(orderTotal).toFixed(2)}</strong>
                    </td>
                    <td style={styles.td}>
                      {formatDate(order.createdAt)}
                    </td>
                    <td style={styles.td}>
                      <div style={styles.actions}>
                        <Link 
                          to={`/admin/order/${order._id}`} 
                          style={styles.viewBtn}
                        >
                          View Details
                        </Link>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

const styles = {
  container: {
    padding: '2rem',
    fontFamily: 'Arial, sans-serif',
    maxWidth: '1400px',
    margin: '0 auto'
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '2rem',
    padding: '1rem',
    backgroundColor: '#f8f9fa',
    borderRadius: '8px'
  },
  refreshBtn: {
    padding: '0.5rem 1rem',
    backgroundColor: '#007bff',
    color: '#fff',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer'
  },
  retryBtn: {
    padding: '0.75rem 1.5rem',
    backgroundColor: '#dc3545',
    color: '#fff',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer'
  },
  emptyState: {
    textAlign: 'center',
    padding: '3rem',
    backgroundColor: '#f8f9fa',
    borderRadius: '8px'
  },
  tableContainer: {
    overflow: 'auto',
    backgroundColor: '#fff',
    borderRadius: '8px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    minWidth: '800px'
  },
  headerRow: {
    backgroundColor: '#343a40',
    color: '#fff'
  },
  th: {
    padding: '1rem',
    textAlign: 'left',
    fontWeight: 'bold',
    borderBottom: '2px solid #dee2e6'
  },
  row: {
    borderBottom: '1px solid #dee2e6'
  },
  td: {
    padding: '1rem',
    verticalAlign: 'middle'
  },
  email: {
    fontSize: '0.875rem',
    color: '#6c757d'
  },
  statusSelect: {
    padding: '0.5rem',
    border: 'none',
    borderRadius: '4px',
    fontWeight: 'bold',
    cursor: 'pointer'
  },
  actions: {
    display: 'flex',
    gap: '0.5rem'
  },
  viewBtn: {
    padding: '0.5rem 1rem',
    backgroundColor: '#28a745',
    color: '#fff',
    textDecoration: 'none',
    borderRadius: '4px',
    fontSize: '0.875rem'
  }
};

export default AdminOrders;