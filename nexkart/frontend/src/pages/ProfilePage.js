import React, { useState, useEffect } from "react";
import { Container, Row, Col, Form, Tab, Nav } from "react-bootstrap";
import { toast } from "react-toastify";
import { userAPI } from "../services/api";
import { useAuth } from "../context/AuthContext";

const ProfilePage = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState({
    firstName: "",
    lastName: "",
    phone: "",
  });
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    userAPI
      .getProfile()
      .then((r) => {
        setProfile({
          firstName: r.data.firstName,
          lastName: r.data.lastName,
          phone: r.data.phone || "",
        });
      })
      .catch(console.error);
    userAPI
      .getAddresses()
      .then((r) => setAddresses(r.data))
      .catch(console.error);
  }, []);

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await userAPI.updateProfile(profile);
      toast.success("Profile updated!");
    } catch (err) {
      toast.error("Update failed");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAddress = async (id) => {
    try {
      await userAPI.deleteAddress(id);
      setAddresses((prev) => prev.filter((a) => a.id !== id));
      toast.success("Address deleted");
    } catch (err) {
      toast.error("Failed");
    }
  };

  return (
    <Container className="py-4">
      <h3 style={{ fontFamily: "Syne, sans-serif", fontWeight: 800 }}>
        My Profile
      </h3>
      <Tab.Container defaultActiveKey="profile">
        <Row className="g-4 mt-1">
          <Col md={3}>
            <div
              style={{
                background: "white",
                borderRadius: "var(--nk-radius)",
                boxShadow: "var(--nk-shadow)",
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  background: "var(--nk-secondary)",
                  padding: "1.5rem",
                  textAlign: "center",
                  color: "white",
                }}
              >
                <div style={{ fontSize: "3rem" }}>👤</div>
                <div
                  style={{ fontWeight: 700, fontFamily: "Syne, sans-serif" }}
                >
                  {user?.firstName} {user?.lastName}
                </div>
                <small style={{ opacity: 0.8 }}>{user?.email}</small>
              </div>
              <Nav variant="pills" className="flex-column p-2">
                <Nav.Item>
                  <Nav.Link eventKey="profile" style={{ borderRadius: 8 }}>
                    👤 Profile Info
                  </Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link eventKey="addresses" style={{ borderRadius: 8 }}>
                    📍 Addresses
                  </Nav.Link>
                </Nav.Item>
              </Nav>
            </div>
          </Col>
          <Col md={9}>
            <Tab.Content>
              <Tab.Pane eventKey="profile">
                <div
                  style={{
                    background: "white",
                    borderRadius: "var(--nk-radius)",
                    padding: "1.5rem",
                    boxShadow: "var(--nk-shadow)",
                  }}
                >
                  <h5
                    style={{ fontFamily: "Syne, sans-serif", fontWeight: 700 }}
                  >
                    Personal Information
                  </h5>
                  <Form onSubmit={handleUpdateProfile} className="mt-3">
                    <Row className="g-3">
                      <Col sm={6}>
                        <Form.Group>
                          <Form.Label>First Name</Form.Label>
                          <Form.Control
                            value={profile.firstName}
                            onChange={(e) =>
                              setProfile((p) => ({
                                ...p,
                                firstName: e.target.value,
                              }))
                            }
                          />
                        </Form.Group>
                      </Col>
                      <Col sm={6}>
                        <Form.Group>
                          <Form.Label>Last Name</Form.Label>
                          <Form.Control
                            value={profile.lastName}
                            onChange={(e) =>
                              setProfile((p) => ({
                                ...p,
                                lastName: e.target.value,
                              }))
                            }
                          />
                        </Form.Group>
                      </Col>
                      <Col sm={6}>
                        <Form.Group>
                          <Form.Label>Email</Form.Label>
                          <Form.Control value={user?.email} disabled />
                        </Form.Group>
                      </Col>
                      <Col sm={6}>
                        <Form.Group>
                          <Form.Label>Phone</Form.Label>
                          <Form.Control
                            value={profile.phone}
                            onChange={(e) =>
                              setProfile((p) => ({
                                ...p,
                                phone: e.target.value,
                              }))
                            }
                          />
                        </Form.Group>
                      </Col>
                    </Row>
                    <button
                      type="submit"
                      className="btn-nk-primary mt-3"
                      disabled={loading}
                    >
                      {loading ? "Saving..." : "Save Changes"}
                    </button>
                  </Form>
                </div>
              </Tab.Pane>
              <Tab.Pane eventKey="addresses">
                <div
                  style={{
                    background: "white",
                    borderRadius: "var(--nk-radius)",
                    padding: "1.5rem",
                    boxShadow: "var(--nk-shadow)",
                  }}
                >
                  <h5
                    style={{ fontFamily: "Syne, sans-serif", fontWeight: 700 }}
                  >
                    Saved Addresses
                  </h5>
                  {addresses.length === 0 ? (
                    <p style={{ color: "#6c757d" }}>No saved addresses</p>
                  ) : (
                    addresses.map((addr) => (
                      <div
                        key={addr.id}
                        style={{
                          border: "1px solid #eee",
                          borderRadius: 8,
                          padding: "1rem",
                          marginBottom: "0.75rem",
                        }}
                      >
                        <div className="d-flex justify-content-between">
                          <div>
                            <strong>{addr.name}</strong> | {addr.phone}
                            <br />
                            <small style={{ color: "#6c757d" }}>
                              {addr.addressLine1}, {addr.city}, {addr.state} -{" "}
                              {addr.pincode}
                            </small>
                          </div>
                          <button
                            onClick={() => handleDeleteAddress(addr.id)}
                            style={{
                              background: "none",
                              border: "none",
                              color: "#dc3545",
                              cursor: "pointer",
                            }}
                          >
                            🗑
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </Tab.Pane>
            </Tab.Content>
          </Col>
        </Row>
      </Tab.Container>
    </Container>
  );
};

export default ProfilePage;
