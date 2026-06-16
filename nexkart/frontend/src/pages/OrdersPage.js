import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Container, Spinner, Badge } from 'react-bootstrap';
import { orderAPI } from '../services/api';
import { toast } from 'react-toastify';

export const OrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    orderAPI.getMyOrders().then(r => {
      setOrders(r.data.content || []);
    }).catch(console.error).finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="nexkart-spinner"><Spinner animation="border" /></div>;

  return (
    <Container className="py-4">
      <h3 style={{ fontFamily: 'Syne, sans-serif', fontWeight: 800 }}>My Orders</h3>
      {orders.length === 0 ? (
        <div className="text-center py-5">
          <div style={{ fontSize: '4rem' }}>📦</div>
          <h5>No orders yet</h5>
          <Link to="/products" className="btn-nk-primary">Start Shopping</Link>
        </div>
      ) : (
        orders.map(order => (
          <div key={order.id} style={{ background: 'white', borderRadius: 'var(--nk-radius)', padding: '1.5rem', marginBottom: '1rem', boxShadow: 'var(--nk-shadow)' }}>
            <div className="d-flex justify-content-between align-items-start flex-wrap gap-2">
              <div>
                <strong>#{order.orderNumber}</strong>
                <div style={{ fontSize: '0.85rem', color: '#6c757d', marginTop: '0.2rem' }}>
                  {order.items?.length} item(s) | {new Date(order.createdAt).toLocaleDateString('en-IN')}
                </div>
              </div>
              <div className="d-flex align-items-center gap-2">
                <span className={`status-badge status-${order.status}`}>{order.status}</span>
                <strong style={{ fontFamily: 'Syne, sans-serif', color: 'var(--nk-primary)' }}>₹{Number(order.finalAmount).toLocaleString('en-IN')}</strong>
              </div>
            </div>
            <div className="d-flex gap-2 mt-3">
              {order.items?.slice(0, 3).map((item, i) => (
                <img key={i} src={item.productImage || 'https://via.placeholder.com/50'} alt={item.productName}
                  style={{ width: 50, height: 50, objectFit: 'cover', borderRadius: 6 }}
                  onError={e => { e.target.src = 'https://via.placeholder.com/50'; }} />
              ))}
            </div>
            <div className="mt-3">
              <Link to={`/orders/${order.id}`} style={{ color: 'var(--nk-primary)', fontWeight: 600, textDecoration: 'none', fontSize: '0.9rem' }}>
                View Details →
              </Link>
            </div>
          </div>
        ))
      )}
    </Container>
  );
};

export const OrderDetailPage = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    orderAPI.getOrderById(id).then(r => setOrder(r.data)).catch(console.error).finally(() => setLoading(false));
  }, [id]);

  const handleCancel = async () => {
    if (!window.confirm('Are you sure you want to cancel this order?')) return;
    try {
      await orderAPI.cancelOrder(id);
      toast.success('Order cancelled');
      const r = await orderAPI.getOrderById(id);
      setOrder(r.data);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Cannot cancel order');
    }
  };

  if (loading) return <div className="nexkart-spinner"><Spinner animation="border" /></div>;
  if (!order) return <Container className="py-4"><p>Order not found</p></Container>;

  return (
    <Container className="py-4" style={{ maxWidth: 800 }}>
      <Link to="/orders" style={{ color: 'var(--nk-primary)', textDecoration: 'none', fontWeight: 600 }}>← Back to Orders</Link>
      <div className="d-flex justify-content-between align-items-center mt-3 mb-4">
        <h4 style={{ fontFamily: 'Syne, sans-serif', fontWeight: 800 }}>Order #{order.orderNumber}</h4>
        <span className={`status-badge status-${order.status}`}>{order.status}</span>
      </div>

      <div style={{ background: 'white', borderRadius: 'var(--nk-radius)', padding: '1.5rem', boxShadow: 'var(--nk-shadow)', marginBottom: '1rem' }}>
        <h6 style={{ fontFamily: 'Syne, sans-serif', fontWeight: 700 }}>Items Ordered</h6>
        {order.items?.map((item, i) => (
          <div key={i} className="d-flex align-items-center gap-3 mb-2 pb-2" style={{ borderBottom: '1px solid #f0f0f0' }}>
            <img src={item.productImage || 'https://via.placeholder.com/60'} alt={item.productName} style={{ width: 60, height: 60, objectFit: 'cover', borderRadius: 8 }} />
            <div className="flex-grow-1">
              <div style={{ fontWeight: 600 }}>{item.productName}</div>
              <small style={{ color: '#6c757d' }}>Qty: {item.quantity} × ₹{Number(item.unitPrice).toLocaleString('en-IN')}</small>
            </div>
            <strong>₹{Number(item.totalPrice).toLocaleString('en-IN')}</strong>
          </div>
        ))}
        <div className="d-flex justify-content-between mt-2"><span>Subtotal</span><span>₹{Number(order.totalAmount).toLocaleString('en-IN')}</span></div>
        <div className="d-flex justify-content-between"><span>Delivery</span><span>₹{Number(order.shippingAmount).toLocaleString('en-IN')}</span></div>
        <div className="d-flex justify-content-between mt-2" style={{ fontWeight: 700, fontSize: '1.1rem', borderTop: '2px solid #f0f0f0', paddingTop: '0.5rem' }}>
          <span>Total</span>
          <span style={{ color: 'var(--nk-primary)', fontFamily: 'Syne, sans-serif' }}>₹{Number(order.finalAmount).toLocaleString('en-IN')}</span>
        </div>
      </div>

      {order.shippingAddress && (
        <div style={{ background: 'white', borderRadius: 'var(--nk-radius)', padding: '1.5rem', boxShadow: 'var(--nk-shadow)', marginBottom: '1rem' }}>
          <h6 style={{ fontFamily: 'Syne, sans-serif', fontWeight: 700 }}>Delivery Address</h6>
          <p style={{ marginBottom: 0, color: '#444' }}>
            {order.shippingAddress.name} | {order.shippingAddress.phone}<br />
            {order.shippingAddress.addressLine1}, {order.shippingAddress.city}, {order.shippingAddress.state} - {order.shippingAddress.pincode}
          </p>
        </div>
      )}

      {(order.status === 'PENDING' || order.status === 'CONFIRMED') && (
        <button onClick={handleCancel} style={{ background: '#dc3545', color: 'white', border: 'none', padding: '0.75rem 1.5rem', borderRadius: 'var(--nk-radius)', fontWeight: 600, cursor: 'pointer' }}>
          Cancel Order
        </button>
      )}
    </Container>
  );
};

export default OrdersPage;
