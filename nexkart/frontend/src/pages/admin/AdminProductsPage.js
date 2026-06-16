import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Modal, Form, Row, Col, Spinner, Pagination } from "react-bootstrap";
import { toast } from "react-toastify";
import { productAPI, categoryAPI } from "../../services/api";

const AdminSidebar = () => (
  <div className="admin-sidebar" style={{ width: 240, flexShrink: 0 }}>
    <div
      style={{
        padding: "1rem 1.5rem",
        color: "white",
        fontFamily: "Syne, sans-serif",
        fontWeight: 700,
        fontSize: "1rem",
        borderBottom: "1px solid rgba(255,255,255,0.1)",
        marginBottom: "0.5rem",
      }}
    >
      ⚙️ Admin Panel
    </div>
    <nav>
      {[
        { to: "/admin", label: "📊 Dashboard" },
        { to: "/admin/products", label: "📦 Products" },
        { to: "/admin/orders", label: "🛒 Orders" },
        { to: "/", label: "🏪 View Store" },
      ].map(({ to, label }) => (
        <Link
          key={to}
          to={to}
          className="nav-link d-block"
          style={{
            padding: "0.75rem 1.5rem",
            color: "rgba(255,255,255,0.75)",
            textDecoration: "none",
            fontWeight: 500,
          }}
          onMouseEnter={(e) => {
            e.target.style.background = "rgba(255,69,0,0.2)";
            e.target.style.color = "white";
          }}
          onMouseLeave={(e) => {
            e.target.style.background = "transparent";
            e.target.style.color = "rgba(255,255,255,0.75)";
          }}
        >
          {label}
        </Link>
      ))}
    </nav>
  </div>
);

const emptyProduct = {
  name: "",
  description: "",
  price: "",
  discountPrice: "",
  stock: "",
  imageUrl: "",
  brand: "",
  categoryId: "",
  featured: false,
};

const AdminProductsPage = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editProduct, setEditProduct] = useState(null);
  const [form, setForm] = useState(emptyProduct);
  const [saving, setSaving] = useState(false);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [search, setSearch] = useState("");

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const params = { page, size: 10, sortBy: "createdAt", sortDir: "desc" };
      if (search) params.keyword = search;
      const res = await productAPI.getAll(params);
      setProducts(res.data.content || []);
      setTotalPages(res.data.totalPages || 0);
    } catch (err) {
      toast.error("Failed to load products");
    } finally {
      setLoading(false);
    }
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    fetchProducts();
  }, [page, search]);
  useEffect(() => {
    categoryAPI
      .getAll()
      .then((r) => setCategories(r.data))
      .catch(console.error);
  }, []);

  const openAdd = () => {
    setEditProduct(null);
    setForm(emptyProduct);
    setShowModal(true);
  };
  const openEdit = (p) => {
    setEditProduct(p);
    setForm({
      name: p.name,
      description: p.description || "",
      price: p.price,
      discountPrice: p.discountPrice || "",
      stock: p.stock,
      imageUrl: p.imageUrl || "",
      brand: p.brand || "",
      categoryId: p.categoryId || "",
      featured: p.featured || false,
    });
    setShowModal(true);
  };

  const handleSave = async () => {
    if (!form.name || !form.price || !form.stock || !form.categoryId) {
      toast.error("Please fill all required fields");
      return;
    }
    setSaving(true);
    try {
      const payload = {
        ...form,
        price: parseFloat(form.price),
        discountPrice: form.discountPrice
          ? parseFloat(form.discountPrice)
          : null,
        stock: parseInt(form.stock),
        categoryId: parseInt(form.categoryId),
      };
      if (editProduct) {
        await productAPI.update(editProduct.id, payload);
        toast.success("Product updated!");
      } else {
        await productAPI.create(payload);
        toast.success("Product created!");
      }
      setShowModal(false);
      fetchProducts();
    } catch (err) {
      toast.error(err.response?.data?.message || "Save failed");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Delete "${name}"?`)) return;
    try {
      await productAPI.delete(id);
      toast.success("Product deleted");
      fetchProducts();
    } catch (err) {
      toast.error("Delete failed");
    }
  };

  return (
    <div style={{ display: "flex", minHeight: "calc(100vh - 60px)" }}>
      <AdminSidebar />
      <div
        style={{
          flex: 1,
          padding: "2rem",
          background: "#f8f9fa",
          overflowY: "auto",
        }}
      >
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h3
            style={{
              fontFamily: "Syne, sans-serif",
              fontWeight: 800,
              marginBottom: 0,
            }}
          >
            Products Management
          </h3>
          <button className="btn-nk-primary" onClick={openAdd}>
            + Add Product
          </button>
        </div>

        {/* Search */}
        <div className="mb-3">
          <input
            type="text"
            placeholder="🔍 Search products..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(0);
            }}
            style={{
              padding: "0.6rem 1rem",
              border: "1px solid #ddd",
              borderRadius: "var(--nk-radius)",
              width: "100%",
              maxWidth: 400,
              fontFamily: "DM Sans, sans-serif",
            }}
          />
        </div>

        {/* Table */}
        <div
          style={{
            background: "white",
            borderRadius: "var(--nk-radius)",
            boxShadow: "var(--nk-shadow)",
            overflowX: "auto",
          }}
        >
          {loading ? (
            <div className="nexkart-spinner">
              <Spinner animation="border" />
            </div>
          ) : (
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr
                  style={{ background: "var(--nk-secondary)", color: "white" }}
                >
                  {[
                    "Image",
                    "Name",
                    "Category",
                    "Price",
                    "Discount",
                    "Stock",
                    "Status",
                    "Actions",
                  ].map((h) => (
                    <th
                      key={h}
                      style={{
                        padding: "0.9rem 1rem",
                        textAlign: "left",
                        fontSize: "0.8rem",
                        fontWeight: 700,
                        whiteSpace: "nowrap",
                      }}
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {products.length === 0 ? (
                  <tr>
                    <td
                      colSpan={8}
                      style={{
                        textAlign: "center",
                        padding: "2rem",
                        color: "#6c757d",
                      }}
                    >
                      No products found
                    </td>
                  </tr>
                ) : (
                  products.map((p, i) => (
                    <tr
                      key={p.id}
                      style={{
                        borderBottom: "1px solid #f0f0f0",
                        background: i % 2 === 0 ? "white" : "#fafafa",
                      }}
                    >
                      <td style={{ padding: "0.75rem 1rem" }}>
                        <img
                          src={p.imageUrl || "https://via.placeholder.com/50"}
                          alt={p.name}
                          style={{
                            width: 50,
                            height: 50,
                            objectFit: "cover",
                            borderRadius: 8,
                          }}
                          onError={(e) => {
                            e.target.src = "https://via.placeholder.com/50";
                          }}
                        />
                      </td>
                      <td style={{ padding: "0.75rem 1rem" }}>
                        <div
                          style={{
                            fontWeight: 600,
                            fontSize: "0.9rem",
                            maxWidth: 180,
                          }}
                        >
                          {p.name}
                        </div>
                        {p.brand && (
                          <small style={{ color: "#6c757d" }}>{p.brand}</small>
                        )}
                      </td>
                      <td
                        style={{ padding: "0.75rem 1rem", fontSize: "0.85rem" }}
                      >
                        {p.categoryName || "—"}
                      </td>
                      <td style={{ padding: "0.75rem 1rem", fontWeight: 600 }}>
                        ₹{Number(p.price).toLocaleString("en-IN")}
                      </td>
                      <td
                        style={{
                          padding: "0.75rem 1rem",
                          color: "var(--nk-primary)",
                        }}
                      >
                        {p.discountPrice
                          ? `₹${Number(p.discountPrice).toLocaleString("en-IN")}`
                          : "—"}
                      </td>
                      <td style={{ padding: "0.75rem 1rem" }}>
                        <span
                          style={{
                            color:
                              p.stock > 10
                                ? "#28a745"
                                : p.stock > 0
                                  ? "#FFB800"
                                  : "#dc3545",
                            fontWeight: 600,
                          }}
                        >
                          {p.stock}
                        </span>
                      </td>
                      <td style={{ padding: "0.75rem 1rem" }}>
                        <span
                          className={`status-badge status-${p.stock > 0 ? "CONFIRMED" : "CANCELLED"}`}
                          style={{ fontSize: "0.72rem" }}
                        >
                          {p.status}
                        </span>
                      </td>
                      <td style={{ padding: "0.75rem 1rem" }}>
                        <div className="d-flex gap-1">
                          <button
                            onClick={() => openEdit(p)}
                            style={{
                              background: "#0d6efd",
                              color: "white",
                              border: "none",
                              padding: "0.3rem 0.7rem",
                              borderRadius: 6,
                              cursor: "pointer",
                              fontSize: "0.8rem",
                            }}
                          >
                            ✏️
                          </button>
                          <button
                            onClick={() => handleDelete(p.id, p.name)}
                            style={{
                              background: "#dc3545",
                              color: "white",
                              border: "none",
                              padding: "0.3rem 0.7rem",
                              borderRadius: 6,
                              cursor: "pointer",
                              fontSize: "0.8rem",
                            }}
                          >
                            🗑
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="d-flex justify-content-center mt-3">
            <Pagination size="sm">
              <Pagination.Prev
                disabled={page === 0}
                onClick={() => setPage((p) => p - 1)}
              />
              {Array.from({ length: totalPages }, (_, i) => (
                <Pagination.Item
                  key={i}
                  active={i === page}
                  onClick={() => setPage(i)}
                >
                  {i + 1}
                </Pagination.Item>
              ))}
              <Pagination.Next
                disabled={page === totalPages - 1}
                onClick={() => setPage((p) => p + 1)}
              />
            </Pagination>
          </div>
        )}
      </div>

      {/* Add/Edit Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)} size="lg">
        <Modal.Header
          closeButton
          style={{ background: "var(--nk-secondary)", color: "white" }}
        >
          <Modal.Title
            style={{ fontFamily: "Syne, sans-serif", fontWeight: 700 }}
          >
            {editProduct ? "✏️ Edit Product" : "+ Add New Product"}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Row className="g-3">
              <Col sm={8}>
                <Form.Group>
                  <Form.Label>
                    Product Name <span style={{ color: "red" }}>*</span>
                  </Form.Label>
                  <Form.Control
                    value={form.name}
                    onChange={(e) =>
                      setForm((p) => ({ ...p, name: e.target.value }))
                    }
                    placeholder="e.g. Samsung Galaxy S24"
                  />
                </Form.Group>
              </Col>
              <Col sm={4}>
                <Form.Group>
                  <Form.Label>Brand</Form.Label>
                  <Form.Control
                    value={form.brand}
                    onChange={(e) =>
                      setForm((p) => ({ ...p, brand: e.target.value }))
                    }
                    placeholder="e.g. Samsung"
                  />
                </Form.Group>
              </Col>
              <Col sm={12}>
                <Form.Group>
                  <Form.Label>Description</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    value={form.description}
                    onChange={(e) =>
                      setForm((p) => ({ ...p, description: e.target.value }))
                    }
                    placeholder="Describe the product..."
                  />
                </Form.Group>
              </Col>
              <Col sm={4}>
                <Form.Group>
                  <Form.Label>
                    Price (₹) <span style={{ color: "red" }}>*</span>
                  </Form.Label>
                  <Form.Control
                    type="number"
                    value={form.price}
                    onChange={(e) =>
                      setForm((p) => ({ ...p, price: e.target.value }))
                    }
                    placeholder="0.00"
                    min="0"
                    step="0.01"
                  />
                </Form.Group>
              </Col>
              <Col sm={4}>
                <Form.Group>
                  <Form.Label>Discount Price (₹)</Form.Label>
                  <Form.Control
                    type="number"
                    value={form.discountPrice}
                    onChange={(e) =>
                      setForm((p) => ({ ...p, discountPrice: e.target.value }))
                    }
                    placeholder="Optional"
                    min="0"
                    step="0.01"
                  />
                </Form.Group>
              </Col>
              <Col sm={4}>
                <Form.Group>
                  <Form.Label>
                    Stock <span style={{ color: "red" }}>*</span>
                  </Form.Label>
                  <Form.Control
                    type="number"
                    value={form.stock}
                    onChange={(e) =>
                      setForm((p) => ({ ...p, stock: e.target.value }))
                    }
                    placeholder="0"
                    min="0"
                  />
                </Form.Group>
              </Col>
              <Col sm={8}>
                <Form.Group>
                  <Form.Label>Image URL</Form.Label>
                  <Form.Control
                    value={form.imageUrl}
                    onChange={(e) =>
                      setForm((p) => ({ ...p, imageUrl: e.target.value }))
                    }
                    placeholder="https://..."
                  />
                </Form.Group>
              </Col>
              <Col sm={4}>
                <Form.Group>
                  <Form.Label>
                    Category <span style={{ color: "red" }}>*</span>
                  </Form.Label>
                  <Form.Select
                    value={form.categoryId}
                    onChange={(e) =>
                      setForm((p) => ({ ...p, categoryId: e.target.value }))
                    }
                  >
                    <option value="">Select Category</option>
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col sm={12}>
                <Form.Check
                  type="switch"
                  id="featured"
                  label="Featured Product (shows on homepage)"
                  checked={form.featured}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, featured: e.target.checked }))
                  }
                />
              </Col>
            </Row>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <button
            onClick={() => setShowModal(false)}
            style={{
              background: "#f0f0f0",
              border: "none",
              padding: "0.6rem 1.5rem",
              borderRadius: 8,
              cursor: "pointer",
              fontWeight: 600,
            }}
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="btn-nk-primary"
            disabled={saving}
          >
            {saving
              ? "Saving..."
              : editProduct
                ? "Update Product"
                : "Add Product"}
          </button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default AdminProductsPage;
