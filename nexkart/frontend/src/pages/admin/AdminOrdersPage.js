import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Modal, Form, Spinner, Pagination } from "react-bootstrap";
import { toast } from "react-toastify";
import { orderAPI } from "../../services/api";

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

const STATUS_OPTIONS = [
  "PENDING",
  "CONFIRMED",
  "PROCESSING",
  "SHIPPED",
  "DELIVERED",
  "CANCELLED",
];

const AdminOrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [newStatus, setNewStatus] = useState("");
  const [updating, setUpdating] = useState(false);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const res = await orderAPI.getAllOrders({ page, size: 10 });
      setOrders(res.data.content || []);
      setTotalPages(res.data.totalPages || 0);
    } catch (err) {
      toast.error("Failed to load orders");
    } finally {
      setLoading(false);
    }
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    fetchOrders();
  }, [page]);

  const openStatusModal = (order) => {
    setSelectedOrder(order);
    setNewStatus(order.status);
    setShowModal(true);
  };

  const handleUpdateStatus = async () => {
    setUpdating(true);
    try {
      await orderAPI.updateStatus(selectedOrder.id, newStatus);
      toast.success("Order status updated!");
      setShowModal(false);
      fetchOrders();
    } catch (err) {
      toast.error("Update failed");
    } finally {
      setUpdating(false);
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
        <h3
          style={{
            fontFamily: "Syne, sans-serif",
            fontWeight: 800,
            marginBottom: "1.5rem",
          }}
        >
          Orders Management
        </h3>

        {/* Status Summary Cards */}
        <div className="d-flex gap-3 flex-wrap mb-4">
          {[
            {
              label: "Pending",
              status: "PENDING",
              color: "#856404",
              bg: "#fff3cd",
            },
            {
              label: "Confirmed",
              status: "CONFIRMED",
              color: "#0a58ca",
              bg: "#cff4fc",
            },
            {
              label: "Shipped",
              status: "SHIPPED",
              color: "#0c5460",
              bg: "#d1ecf1",
            },
            {
              label: "Delivered",
              status: "DELIVERED",
              color: "#155724",
              bg: "#d4edda",
            },
          ].map(({ label, status, color, bg }) => {
            const count = orders.filter((o) => o.status === status).length;
            return (
              <div
                key={status}
                style={{
                  background: bg,
                  borderRadius: "var(--nk-radius-sm)",
                  padding: "0.75rem 1.25rem",
                  minWidth: 120,
                }}
              >
                <div style={{ color, fontWeight: 700, fontSize: "1.3rem" }}>
                  {count}
                </div>
                <div style={{ color, fontSize: "0.8rem", fontWeight: 600 }}>
                  {label}
                </div>
              </div>
            );
          })}
        </div>

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
                    "Order #",
                    "Items",
                    "Total",
                    "Payment",
                    "Status",
                    "Date",
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
                {orders.length === 0 ? (
                  <tr>
                    <td
                      colSpan={7}
                      style={{
                        textAlign: "center",
                        padding: "2rem",
                        color: "#6c757d",
                      }}
                    >
                      No orders found
                    </td>
                  </tr>
                ) : (
                  orders.map((order, i) => (
                    <tr
                      key={order.id}
                      style={{
                        borderBottom: "1px solid #f0f0f0",
                        background: i % 2 === 0 ? "white" : "#fafafa",
                      }}
                    >
                      <td
                        style={{
                          padding: "0.75rem 1rem",
                          fontWeight: 700,
                          fontSize: "0.85rem",
                        }}
                      >
                        #{order.orderNumber}
                      </td>
                      <td
                        style={{ padding: "0.75rem 1rem", fontSize: "0.85rem" }}
                      >
                        <div style={{ display: "flex", gap: 4 }}>
                          {order.items?.slice(0, 2).map((item, j) => (
                            <img
                              key={j}
                              src={
                                item.productImage ||
                                "https://via.placeholder.com/35"
                              }
                              alt=""
                              style={{
                                width: 35,
                                height: 35,
                                objectFit: "cover",
                                borderRadius: 6,
                              }}
                              onError={(e) => {
                                e.target.src = "https://via.placeholder.com/35";
                              }}
                            />
                          ))}
                          {order.items?.length > 2 && (
                            <span
                              style={{
                                fontSize: "0.75rem",
                                color: "#6c757d",
                                alignSelf: "center",
                              }}
                            >
                              +{order.items.length - 2}
                            </span>
                          )}
                        </div>
                      </td>
                      <td
                        style={{
                          padding: "0.75rem 1rem",
                          fontWeight: 700,
                          color: "var(--nk-primary)",
                        }}
                      >
                        ₹{Number(order.finalAmount).toLocaleString("en-IN")}
                      </td>
                      <td
                        style={{ padding: "0.75rem 1rem", fontSize: "0.85rem" }}
                      >
                        <span
                          className={`status-badge status-${order.paymentStatus === "PAID" ? "DELIVERED" : order.paymentStatus === "FAILED" ? "CANCELLED" : "PENDING"}`}
                          style={{ fontSize: "0.72rem" }}
                        >
                          {order.paymentStatus}
                        </span>
                      </td>
                      <td style={{ padding: "0.75rem 1rem" }}>
                        <span className={`status-badge status-${order.status}`}>
                          {order.status}
                        </span>
                      </td>
                      <td
                        style={{
                          padding: "0.75rem 1rem",
                          fontSize: "0.8rem",
                          color: "#6c757d",
                        }}
                      >
                        {new Date(order.createdAt).toLocaleDateString("en-IN")}
                      </td>
                      <td style={{ padding: "0.75rem 1rem" }}>
                        <button
                          onClick={() => openStatusModal(order)}
                          style={{
                            background: "var(--nk-secondary)",
                            color: "white",
                            border: "none",
                            padding: "0.3rem 0.7rem",
                            borderRadius: 6,
                            cursor: "pointer",
                            fontSize: "0.8rem",
                          }}
                        >
                          Update Status
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          )}
        </div>

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

      {/* Status Update Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header
          closeButton
          style={{ background: "var(--nk-secondary)", color: "white" }}
        >
          <Modal.Title
            style={{ fontFamily: "Syne, sans-serif", fontWeight: 700 }}
          >
            Update Order Status
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedOrder && (
            <div>
              <p>
                <strong>Order:</strong> #{selectedOrder.orderNumber}
              </p>
              <p>
                <strong>Current Status:</strong>{" "}
                <span className={`status-badge status-${selectedOrder.status}`}>
                  {selectedOrder.status}
                </span>
              </p>
              <Form.Group className="mt-3">
                <Form.Label>
                  <strong>New Status</strong>
                </Form.Label>
                <Form.Select
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value)}
                >
                  {STATUS_OPTIONS.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>
            </div>
          )}
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
            onClick={handleUpdateStatus}
            className="btn-nk-primary"
            disabled={updating}
          >
            {updating ? "Updating..." : "Update Status"}
          </button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default AdminOrdersPage;
