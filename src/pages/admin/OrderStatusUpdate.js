import React from 'react';

function OrderStatusUpdate({ currentStatus, onChange, disabled }) {
  return (
    <select
      value={currentStatus || ''}
      onChange={e => onChange(e.target.value)}
      disabled={disabled}
    >
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
  );
}

export default OrderStatusUpdate;