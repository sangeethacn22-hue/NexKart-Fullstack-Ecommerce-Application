import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Container, Form, Alert } from 'react-bootstrap';
import { toast } from 'react-toastify';
import { useAuth } from '../context/AuthContext';

export const LoginPage = () => {
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const user = await login(form.email, form.password);
      toast.success(`Welcome back, ${user.firstName}!`);
      navigate(user.role === 'ADMIN' ? '/admin' : '/');
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', background: '#f8f9fa' }}>
      <Container style={{ maxWidth: 440 }}>
        <div style={{ background: 'white', borderRadius: 'var(--nk-radius)', padding: '2.5rem', boxShadow: 'var(--nk-shadow-lg)' }}>
          <div className="text-center mb-4">
            <h2 style={{ fontFamily: 'Syne, sans-serif', fontWeight: 800 }}>
              Nex<span style={{ color: 'var(--nk-primary)' }}>Kart</span>
            </h2>
            <p style={{ color: '#6c757d' }}>Sign in to your account</p>
          </div>
          {error && <Alert variant="danger">{error}</Alert>}
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Email</Form.Label>
              <Form.Control type="email" placeholder="you@email.com" value={form.email}
                onChange={e => setForm(p => ({ ...p, email: e.target.value }))} required />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Password</Form.Label>
              <Form.Control type="password" placeholder="••••••••" value={form.password}
                onChange={e => setForm(p => ({ ...p, password: e.target.value }))} required />
            </Form.Group>
            <button type="submit" className="btn-nk-primary w-100 mt-2" disabled={loading}>
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </Form>
          <p className="text-center mt-3" style={{ fontSize: '0.9rem' }}>
            Don't have an account? <Link to="/register" style={{ color: 'var(--nk-primary)', fontWeight: 600 }}>Sign Up</Link>
          </p>
        </div>
      </Container>
    </div>
  );
};

export const RegisterPage = () => {
  const [form, setForm] = useState({ firstName: '', lastName: '', email: '', password: '', phone: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await register(form);
      toast.success('Account created! Please log in.');
      navigate('/login');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', background: '#f8f9fa', padding: '2rem 0' }}>
      <Container style={{ maxWidth: 500 }}>
        <div style={{ background: 'white', borderRadius: 'var(--nk-radius)', padding: '2.5rem', boxShadow: 'var(--nk-shadow-lg)' }}>
          <div className="text-center mb-4">
            <h2 style={{ fontFamily: 'Syne, sans-serif', fontWeight: 800 }}>
              Join Nex<span style={{ color: 'var(--nk-primary)' }}>Kart</span>
            </h2>
            <p style={{ color: '#6c757d' }}>Create your account</p>
          </div>
          {error && <Alert variant="danger">{error}</Alert>}
          <Form onSubmit={handleSubmit}>
            <div className="d-flex gap-2">
              <Form.Group className="mb-3 flex-fill">
                <Form.Label>First Name</Form.Label>
                <Form.Control value={form.firstName} onChange={e => setForm(p => ({ ...p, firstName: e.target.value }))} required />
              </Form.Group>
              <Form.Group className="mb-3 flex-fill">
                <Form.Label>Last Name</Form.Label>
                <Form.Control value={form.lastName} onChange={e => setForm(p => ({ ...p, lastName: e.target.value }))} required />
              </Form.Group>
            </div>
            <Form.Group className="mb-3">
              <Form.Label>Email</Form.Label>
              <Form.Control type="email" value={form.email} onChange={e => setForm(p => ({ ...p, email: e.target.value }))} required />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Phone</Form.Label>
              <Form.Control type="tel" value={form.phone} onChange={e => setForm(p => ({ ...p, phone: e.target.value }))} />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Password</Form.Label>
              <Form.Control type="password" value={form.password} onChange={e => setForm(p => ({ ...p, password: e.target.value }))} required minLength={6} />
            </Form.Group>
            <button type="submit" className="btn-nk-primary w-100 mt-2" disabled={loading}>
              {loading ? 'Creating account...' : 'Create Account'}
            </button>
          </Form>
          <p className="text-center mt-3" style={{ fontSize: '0.9rem' }}>
            Already have an account? <Link to="/login" style={{ color: 'var(--nk-primary)', fontWeight: 600 }}>Sign In</Link>
          </p>
        </div>
      </Container>
    </div>
  );
};

export default LoginPage;
