import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Navbar as BSNavbar, Nav, Container, Form, Badge, Dropdown } from 'react-bootstrap';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';

const Navbar = () => {
  const { user, logout, isAuthenticated, isAdmin } = useAuth();
  const { cartCount } = useCart();
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) navigate(`/products?keyword=${searchQuery}`);
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <BSNavbar className="nexkart-navbar" expand="lg" sticky="top">
      <Container>
        <BSNavbar.Brand as={Link} to="/" className="nexkart-brand">
          Nex<span>Kart</span>
        </BSNavbar.Brand>
        <BSNavbar.Toggle aria-controls="navbar-nav" />
        <BSNavbar.Collapse id="navbar-nav">
          <Form className="d-flex mx-auto navbar-search" style={{ width: '40%' }} onSubmit={handleSearch}>
            <Form.Control
              type="search"
              placeholder="Search products, brands..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
            />
            <button type="submit" className="btn-search px-3">🔍</button>
          </Form>
          <Nav className="ms-auto align-items-center gap-1">
            <Nav.Link as={Link} to="/products">Products</Nav.Link>
            {isAuthenticated() ? (
              <>
                <Nav.Link as={Link} to="/cart" className="position-relative">
                  🛒 Cart
                  {cartCount > 0 && (
                    <Badge bg="danger" pill className="position-absolute top-0 start-100 translate-middle">
                      {cartCount}
                    </Badge>
                  )}
                </Nav.Link>
                <Dropdown align="end">
                  <Dropdown.Toggle variant="link" className="nav-link text-white border-0">
                    👤 {user?.firstName}
                  </Dropdown.Toggle>
                  <Dropdown.Menu>
                    <Dropdown.Item as={Link} to="/profile">My Profile</Dropdown.Item>
                    <Dropdown.Item as={Link} to="/orders">My Orders</Dropdown.Item>
                    {isAdmin() && (
                      <>
                        <Dropdown.Divider />
                        <Dropdown.Item as={Link} to="/admin">Admin Dashboard</Dropdown.Item>
                      </>
                    )}
                    <Dropdown.Divider />
                    <Dropdown.Item onClick={handleLogout}>Logout</Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>
              </>
            ) : (
              <>
                <Nav.Link as={Link} to="/login">Login</Nav.Link>
                <Link to="/register" className="btn-nk-primary ms-2" style={{ fontSize: '0.9rem' }}>
                  Sign Up
                </Link>
              </>
            )}
          </Nav>
        </BSNavbar.Collapse>
      </Container>
    </BSNavbar>
  );
};

export default Navbar;
