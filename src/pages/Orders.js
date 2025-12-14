import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';

const Orders = () => {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (user) fetchOrders();
  }, [user]);

  const fetchOrders = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:5000/api/orders/myorders', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setOrders(Array.isArray(response.data.orders) ? response.data.orders : []);
      setLoading(false);
    } catch {
      setError('Failed to load orders');
      setLoading(false);
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
      case 'returned': return '#fd7e14';
      default: return '#666';
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    try {
      return new Date(dateString).toLocaleDateString('en-IN', {
        year: 'numeric', month: 'short', day: 'numeric',
        hour: '2-digit', minute: '2-digit'
      });
    } catch {
      return 'Invalid Date';
    }
  };

  // Enhanced Invoice with user details for Plant Store
const generateInvoice = (order) => {
  const doc = new jsPDF('p', 'pt', 'a4');
  const margin = 40;
  const lineHeight = 15;
  let y = margin;

  // BRAND HEADER
  doc.setFontSize(22);
  doc.setFont(undefined, 'bold');
  doc.setTextColor('#2d5a27');
  doc.text('Plant Shop', margin, y);
  y += 30;

  // ORDER INFO
  doc.setFontSize(12);
  doc.setFont(undefined, 'normal');
  const orderNumber = order.orderNumber || order._id;
  doc.text(`Invoice No: ${orderNumber}`, margin, y);
  doc.text(`Order Date: ${formatDate(order.createdAt)}`, margin, y + lineHeight);
  doc.text(`Payment Method: ${order.payment?.method || 'COD'}`, margin, y + lineHeight * 2);
  doc.text(`Payment Status: ${order.payment?.status || (order.isPaid ? 'Completed' : 'Pending')}`, margin, y + lineHeight * 3);
  y += lineHeight * 4 + 10;

  // CUSTOMER DETAILS
  doc.setFont(undefined, 'bold');
  doc.text('Customer Details:', margin, y);
  doc.setFont(undefined, 'normal');

  const userName = order.user?.name || order.customerName || 'N/A';
  const userEmail = order.user?.email || order.customerEmail || 'N/A';
  const userPhone = order.user?.phone || order.customerPhone || 'N/A';
  const shipping = order.shippingAddress || {};

  y += lineHeight;
  doc.text(`Name: ${userName}`, margin, y);
  doc.text(`Email: ${userEmail}`, margin, y + lineHeight);
  doc.text(`Phone: ${userPhone}`, margin, y + lineHeight * 2);
  const shippingText = `${shipping.address || 'N/A'}, ${shipping.city || ''}, ${shipping.state || ''} - ${shipping.zip || ''}`;
  doc.text(`Shipping Address: ${shippingText}`, margin, y + lineHeight * 3);
  y += lineHeight * 4 + 20;

  // ORDER ITEMS TABLE
  const orderItems = order.items || order.orderItems || [];
  const tableData = orderItems.map((item, index) => [
    index + 1,
    item.name || 'Unknown Plant',
    item.quantity || item.qty || 1,
    `₹${Number(item.price || 0).toFixed(2)}`,
    `₹${((item.price || 0) * (item.quantity || item.qty || 1)).toFixed(2)}`
  ]);

  autoTable(doc, {
    startY: y,
    head: [['#', 'Item', 'Qty', 'Price', 'Total']],
    body: tableData,
    theme: 'grid',
    headStyles: { fillColor: '#28a745', textColor: '#fff', fontStyle: 'bold' },
    styles: { fontSize: 10, cellPadding: 5 },
    columnStyles: { 0: { cellWidth: 20 }, 2: { halign: 'center' }, 3: { halign: 'right' }, 4: { halign: 'right' } }
  });

  const finalY = doc.lastAutoTable.finalY + 20;

  // SUMMARY TABLE (RIGHT SIDE)
  const summaryX = 350;
  const summaryY = finalY;
  const subtotal = order.pricing?.subtotal || order.subTotal || 0;
  const tax = order.pricing?.tax || 0;
  const discount = order.pricing?.discount || 0;
  const total = order.pricing?.total || order.totalPrice || 0;

  doc.setFont(undefined, 'bold');
  doc.text('Invoice Summary', summaryX, summaryY);
  doc.setFont(undefined, 'normal');

  const summaryData = [
    ['Subtotal', `₹${Number(subtotal).toFixed(2)}`],
    ['Tax', `₹${Number(tax).toFixed(2)}`],
    ['Discount', `₹${Number(discount).toFixed(2)}`],
    ['Total', `₹${Number(total).toFixed(2)}`]
  ];

  let ySummary = summaryY + lineHeight;
  summaryData.forEach(([label, value], i) => {
    doc.setFont(undefined, i === summaryData.length - 1 ? 'bold' : 'normal');
    doc.text(label, summaryX, ySummary);
    doc.text(value, summaryX + 80, ySummary, { align: 'right' });
    ySummary += lineHeight;
  });

  // FOOTER
  doc.setFontSize(10);
  doc.setFont(undefined, 'normal');
  doc.setTextColor('#666');
  doc.text("Thank you for shopping with Plant Shop! Visit us again.", margin, ySummary + 20);

  // SAVE PDF
  doc.save(`Invoice-${orderNumber}.pdf`);
};

  if (!user) {
    return (
      <div style={styles.container}>
        <div style={styles.centerCard}>
          <h2>Please Login</h2>
          <p>You need to login to view your orders.</p>
          <Link to="/login" style={{ ...styles.btn, ...styles.primaryBtn }}>Login</Link>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div style={styles.container}>
        <div style={styles.centerCard}>
          <h2>Loading your orders...</h2>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={styles.container}>
        <div style={styles.centerCard}>
          <h2>Error Loading Orders</h2>
          <p style={{ color: '#dc3545', marginBottom: '1rem' }}>{error}</p>
          <button onClick={fetchOrders} style={{ ...styles.btn, ...styles.primaryBtn }}>Try Again</button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ ...styles.container, padding: '2rem 1rem' }}>
      <h1 style={styles.pageTitle}>My Orders ({orders.length})</h1>

      {orders.length === 0 ? (
        <div style={styles.centerCard}>
          <h3>No orders yet</h3>
          <p style={{ color: '#666', margin: '1rem 0' }}>Start shopping to see your orders here!</p>
          <Link to="/products" style={{ ...styles.btn, ...styles.primaryBtn }}>Start Shopping</Link>
        </div>
      ) : (
        <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
          {orders.map((order, index) => {
            const orderItems = order.items || order.orderItems || [];
            const orderNumber = order.orderNumber || `ORD-${order._id?.slice(-8)}` || `ORDER-${index + 1}`;
            const orderStatus = order.status || order.orderStatus || 'pending';
            const orderTotal = order.pricing?.total || order.totalPrice || 0;
            const paymentMethod = order.payment?.method || order.paymentMethod || 'N/A';
            const paymentStatus = order.payment?.status || (order.isPaid ? 'completed' : 'pending');

            return (
              <div key={order._id || index} style={styles.orderCard}>
                <div style={styles.orderHeader}>
                  <div>
                    <h3 style={styles.orderNumber}>{orderNumber}</h3>
                    <p style={styles.orderDate}>Placed on {formatDate(order.createdAt)}</p>
                    <p style={styles.orderItemCount}>{orderItems.length} item{orderItems.length !== 1 ? 's' : ''}</p>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ ...styles.statusBadge, backgroundColor: getStatusColor(orderStatus) }}>{orderStatus}</div>
                    <p style={styles.orderTotal}>₹{Number(orderTotal).toFixed(2)}</p>
                  </div>
                </div>

                <div style={{ marginBottom: '1.5rem' }}>
                  <h4 style={styles.itemsTitle}>Order Items:</h4>
                  {orderItems.length > 0 ? orderItems.map((item, itemIndex) => (
                    <div key={item._id || itemIndex} style={styles.itemRow}>
                      <img src={item.image || '/placeholder-product.jpg'} alt={item.name || 'Unknown Plant'} style={styles.itemImage} onError={e => e.target.src = '/placeholder-product.jpg'} />
                      <div style={{ flex: 1 }}>
                        <h5 style={styles.itemName}>{item.name || 'Unknown Plant'}</h5>
                        <p style={styles.itemQty}>Quantity: {item.quantity || item.qty || 1} × ₹{Number(item.price || 0).toFixed(2)}</p>
                      </div>
                      <div style={styles.itemTotal}>₹{((item.price || 0) * (item.quantity || item.qty || 1)).toFixed(2)}</div>
                    </div>
                  )) : <p style={{ color: '#666', fontStyle: 'italic' }}>No items found in this order</p>}
                </div>

                <div style={styles.orderFooter}>
                  <div>
                    <p style={styles.paymentInfo}><strong>Payment:</strong> {paymentMethod.toUpperCase()}</p>
                    <p style={styles.paymentInfo}><strong>Payment Status:</strong>
                      <span style={{ color: paymentStatus === 'completed' ? '#28a745' : '#ffc107', marginLeft: '0.5rem', fontWeight: 'bold', textTransform: 'capitalize' }}>
                        {paymentStatus}
                      </span>
                    </p>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <button onClick={() => generateInvoice(order)} style={{ ...styles.btn, ...styles.outlinePrimaryBtn, marginRight: '0.5rem' }}>Get Invoice</button>
                    {(orderStatus === 'pending' || orderStatus === 'confirmed') &&
                      <button style={{ ...styles.btn, ...styles.outlineDangerBtn }} onClick={() => { if (window.confirm('Cancel this order?')) console.log('Cancel:', order._id) }}>Cancel Order</button>
                    }
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  );
};

const styles = {
  container: { minHeight: '100vh', fontFamily: 'Arial,sans-serif', background: '#f4f6f7' },
  centerCard: { textAlign: 'center', padding: '3rem', background: '#fff', borderRadius: '12px', margin: '2rem auto', maxWidth: '450px', boxShadow: '0 6px 15px rgba(0,0,0,0.1)' },
  pageTitle: { textAlign: 'center', color: '#2d5a27', marginBottom: '2rem', fontSize: '2rem', fontWeight: '700' },
  orderCard: { background: '#fff', borderRadius: '12px', marginBottom: '2rem', boxShadow: '0 6px 12px rgba(0,0,0,0.08)', padding: '1.5rem' },
  orderHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem' },
  orderNumber: { margin: 0, color: '#2d5a27', fontSize: '1.3rem' },
  orderDate: { margin: '0.5rem 0', color: '#666' },
  orderItemCount: { margin: 0, color: '#666', fontSize: '0.9rem' },
  statusBadge: { padding: '0.5rem 1rem', borderRadius: '20px', color: '#fff', fontSize: '0.9rem', fontWeight: 'bold', textTransform: 'capitalize', marginBottom: '0.5rem', display: 'inline-block' },
  orderTotal: { margin: 0, fontSize: '1.2rem', fontWeight: 'bold', color: '#2d5a27' },
  itemsTitle: { color: '#2d5a27', marginBottom: '1rem', fontSize: '1.1rem' },
  itemRow: { display: 'flex', alignItems: 'center', gap: '1rem', padding: '0.75rem', background: '#f8f9fa', borderRadius: '8px', marginBottom: '0.5rem' },
  itemImage: { width: '60px', height: '60px', objectFit: 'cover', borderRadius: '8px', background: '#e9ecef' },
  itemName: { margin: '0 0 0.25rem 0', color: '#2d5a27' },
  itemQty: { margin: 0, color: '#666', fontSize: '0.9rem' },
  itemTotal: { fontWeight: 'bold', color: '#2d5a27' },
  orderFooter: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '1rem', borderTop: '1px solid #e9ecef' },
  paymentInfo: { margin: '0 0 0.5rem 0', color: '#666' },
  btn: { padding: '0.6rem 1rem', borderRadius: '6px', cursor: 'pointer', textDecoration: 'none', display: 'inline-block', fontWeight: '600', transition: '0.3s', border: 'none' },
  primaryBtn: { background: '#28a745', color: '#fff', border: 'none', textAlign: 'center' },
  outlinePrimaryBtn: { background: '#fff', color: '#28a745', border: '2px solid #28a745' },
  outlineDangerBtn: { background: '#fff', color: '#dc3545', border: '2px solid #dc3545' },
};

export default Orders;
