import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Container, Row, Col, Spinner } from 'react-bootstrap';
import { productAPI, orderAPI, userAPI } from '../../services/api';

const StatCard = ({ icon, title, value, color, link }) => (
  <div style={{ background: 'white', borderRadius: 'var(--nk-radius)', padding: '1.5rem', boxShadow: 'var(--nk-shadow)', borderLeft: `4px solid ${color}` }}>
    <div className="d-flex justify-content-between align-items-center">
      <div>
        <div style={{ color: '#6c757d', fontSize: '0.85rem', fontWeight: 600, textTransform: 'uppercase' }}>{title}</div>
        <div style={{ fontFamily: 'Syne, sans-serif', fontWeight: 800, fontSize: '2rem', color: color }}>{value}</div>
      </div>
      <div style={{ fontSize: '2.5rem' }}>{icon}</div>
    </div>
    {link && <Link to={link} style={{ color: color, fontSize: '0.85rem', fontWeight: 600, textDecoration: 'none' }}>View All →</Link>}
  </div>
);

const AdminDashboardPage = () => {
  const [stats, setStats] = useState({ products: 0, orders: 0, users: 0, revenue: 0 });
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [prodRes, orderRes, userRes] = await Promise.all([
          productAPI.getAll({ size: 1 }),
          orderAPI.getAllOrders({ size: 5 }),
          userAPI.getProfile().catch(() => null),
        ]);
        const orders = orderRes.data.content || [];
        const revenue = orders.reduce((sum, o) => sum + Number(o.finalAmount || 0), 0);
        setStats({
          products: prodRes.data.totalElements || 0,
          orders: orderRes.data.totalElements || 0,
          revenue,
        });
        setRecentOrders(orders);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return <div className="nexkart-spinner"><Spinner animation="border" /></div>;

  return (
    <div style={{ display: 'flex', minHeight: 'calc(100vh - 60px)' }}>
      {/* Sidebar */}
      <div className="admin-sidebar" style={{ width: 240, flexShrink: 0 }}>
        <div style={{ padding: '1rem 1.5rem', color: 'white', fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: '1rem', borderBottom: '1px solid rgba(255,255,255,0.1)', marginBottom: '0.5rem' }}>
          ⚙️ Admin Panel
        </div>
        <nav>
          {[
            { to: '/admin', label: '📊 Dashboard' },
            { to: '/admin/products', label: '📦 Products' },
            { to: '/admin/orders', label: '🛒 Orders' },
            { to: '/', label: '🏪 View Store' },
          ].map(({ to, label }) => (
            <Link key={to} to={to} className="nav-link d-block" style={{ padding: '0.75rem 1.5rem', color: 'rgba(255,255,255,0.75)', textDecoration: 'none', fontWeight: 500, transition: 'all 0.2s' }}
              onMouseEnter={e => { e.target.style.background = 'rgba(255,69,0,0.2)'; e.target.style.color = 'white'; }}
              onMouseLeave={e => { e.target.style.background = 'transparent'; e.target.style.color = 'rgba(255,255,255,0.75)'; }}>
              {label}
            </Link>
          ))}
        </nav>
      </div>

      {/* Main Content */}
      <div style={{ flex: 1, padding: '2rem', background: '#f8f9fa', overflowY: 'auto' }}>
        <h3 style={{ fontFamily: 'Syne, sans-serif', fontWeight: 800 }}>Dashboard</h3>
        <p style={{ color: '#6c757d' }}>Welcome back, Admin! Here's what's happening.</p>

        <Row className="g-4 mb-4">
          <Col sm={6} xl={3}><StatCard icon="📦" title="Total Products" value={stats.products} color="#FF4500" link="/admin/products" /></Col>
          <Col sm={6} xl={3}><StatCard icon="🛒" title="Total Orders" value={stats.orders} color="#0d6efd" link="/admin/orders" /></Col>
          <Col sm={6} xl={3}><StatCard icon="💰" title="Revenue" value={`₹${Number(stats.revenue).toLocaleString('en-IN')}`} color="#28a745" /></Col>
          <Col sm={6} xl={3}><StatCard icon="⭐" title="Avg Rating" value="4.5" color="#FFB800" /></Col>
        </Row>

        {/* Recent Orders */}
        <div style={{ background: 'white', borderRadius: 'var(--nk-radius)', padding: '1.5rem', boxShadow: 'var(--nk-shadow)' }}>
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h5 style={{ fontFamily: 'Syne, sans-serif', fontWeight: 700, marginBottom: 0 }}>Recent Orders</h5>
            <Link to="/admin/orders" style={{ color: 'var(--nk-primary)', fontWeight: 600, textDecoration: 'none', fontSize: '0.9rem' }}>View All →</Link>
          </div>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid #f0f0f0' }}>
                  {['Order #', 'Customer', 'Amount', 'Status', 'Date'].map(h => (
                    <th key={h} style={{ padding: '0.75rem', textAlign: 'left', fontSize: '0.8rem', textTransform: 'uppercase', color: '#6c757d', fontWeight: 700 }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {recentOrders.length === 0 ? (
                  <tr><td colSpan={5} style={{ textAlign: 'center', padding: '2rem', color: '#6c757d' }}>No orders yet</td></tr>
                ) : recentOrders.map(order => (
                  <tr key={order.id} style={{ borderBottom: '1px solid #f0f0f0' }}>
                    <td style={{ padding: '0.75rem', fontWeight: 600, fontSize: '0.9rem' }}>#{order.orderNumber}</td>
                    <td style={{ padding: '0.75rem', fontSize: '0.9rem' }}>{order.items?.[0]?.productName || 'N/A'}</td>
                    <td style={{ padding: '0.75rem', fontWeight: 700, color: 'var(--nk-primary)' }}>₹{Number(order.finalAmount).toLocaleString('en-IN')}</td>
                    <td style={{ padding: '0.75rem' }}><span className={`status-badge status-${order.status}`}>{order.status}</span></td>
                    <td style={{ padding: '0.75rem', fontSize: '0.85rem', color: '#6c757d' }}>{new Date(order.createdAt).toLocaleDateString('en-IN')}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Quick Actions */}
        <div style={{ marginTop: '1.5rem' }}>
          <h5 style={{ fontFamily: 'Syne, sans-serif', fontWeight: 700 }}>Quick Actions</h5>
          <div className="d-flex gap-3 flex-wrap mt-2">
            <Link to="/admin/products" className="btn-nk-primary" style={{ fontSize: '0.9rem' }}>+ Add Product</Link>
            <Link to="/admin/orders" style={{ background: '#0d6efd', color: 'white', padding: '0.6rem 1.5rem', borderRadius: 'var(--nk-radius)', fontWeight: 600, textDecoration: 'none', fontSize: '0.9rem' }}>Manage Orders</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboardPage;
