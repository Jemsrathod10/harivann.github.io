import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const API = process.env.REACT_APP_API_URL;


function OrderDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState('');
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    console.log('Fetching order with token:', token);

    fetch(`${API}/api/orders/${id}`, {   // <-- FULL URL
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => {
        console.log('Order API response:', data);
        if (data.success && data.order) {
          setOrder(data.order);
          setStatus(data.order.status);
        } else {
          setOrder(null);
        }
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching order:', err);
        setOrder(null);
        setLoading(false);
      });
  }, [id]);

  const handleStatusChange = async () => {
    setUpdating(true);
    const token = localStorage.getItem('token');

    try {
      const res = await fetch(`${API}/api/orders/${id}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ status })
      });
      const data = await res.json();
      if (data.success) {
        alert('Status updated successfully');
        navigate('/admin/orders');
      } else {
        alert('Failed to update status');
      }
    } catch (err) {
      console.error('Status update error:', err);
      alert('Failed to update status');
    }
    setUpdating(false);
  };

  if (loading) return <div>Loading order details...</div>;
  if (!order) return <div>Order not found</div>;

  return (
    <div>
      <h2>Order Details</h2>
      <p><strong>Order Number:</strong> {order.orderNumber}</p>
      <p><strong>User:</strong> {order.user?.name || order.user?.email || 'N/A'}</p>
      <p>
        <strong>Status:</strong> 
        <select value={status || ''} onChange={e => setStatus(e.target.value)}>
          <option value="pending">Pending</option>
          <option value="confirmed">Confirmed</option>
          <option value="processing">Processing</option>
          <option value="shipped">Shipped</option>
          <option value="out_for_delivery">Out for Delivery</option>
          <option value="delivered">Delivered</option>
          <option value="cancelled">Cancelled</option>
          <option value="returned">Returned</option>
          <option value="refunded">Refunded</option>
        </select>
      </p>
      <button onClick={handleStatusChange} disabled={updating}>
        {updating ? 'Updating...' : 'Update Status'}
      </button>

      <h3>Items</h3>
      <ul>
        {order.items.map(item => (
          <li key={item._id || item.sku}>
            {(item.product && item.product.name) ? item.product.name : item.name} - Qty: {item.quantity} - Price: {Number(item.price).toFixed(2)}
          </li>
        ))}
      </ul>

      <p><strong>Total:</strong> {order.pricing?.total !== undefined ? Number(order.pricing.total).toFixed(2) : '0.00'}</p>
    </div>
  );
}

export default OrderDetail;
