// src/pages/AdminOrders.jsx
import { useEffect, useState, useContext, useMemo } from "react";
import api from "../api/api.js";
import { AuthContext } from "../context/AuthContext.jsx";
import { ToastContext } from "../context/ToastContext.jsx";

const AdminOrders = () => {
  const { user } = useContext(AuthContext);
  const { showToast } = useContext(ToastContext);

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedOrder, setSelectedOrder] = useState(null);

  const isAdmin = user?.role === "admin";

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        const res = await api.get("/orders");
        setOrders(res.data);
      } catch (e) {
        console.log(e);
        setErr(e.response?.data?.message || "Failed to load orders");
      } finally {
        setLoading(false);
      }
    };

    if (isAdmin) fetchOrders();
  }, [isAdmin]);

  const updateStatus = async (id, status) => {
    try {
      await api.put(`/orders/${id}`, { status });
      setOrders((prev) =>
        prev.map((o) => (o._id === id ? { ...o, status } : o))
      );
      showToast(`Order status updated to "${status}"`, "success");
    } catch (e) {
      console.log(e);
      showToast(
        e.response?.data?.message || "Failed to update status",
        "error"
      );
    }
  };

  const filteredOrders = useMemo(
    () =>
      orders.filter((o) => {
        const text = `${o.user?.name || ""} ${
          o.user?.email || ""
        }`.toLowerCase();
        const s = search.toLowerCase();
        const matchText = text.includes(s);
        const matchStatus =
          statusFilter === "all" ? true : o.status === statusFilter;
        return matchText && matchStatus;
      }),
    [orders, search, statusFilter]
  );

  if (!isAdmin) {
    return <div style={{ padding: 24 }}>Access denied (admin only).</div>;
  }

  const statusChip = (status) => {
    const colors = {
      pending: "#f97316",
      accepted: "#22c55e",
      "on-the-way": "#0ea5e9",
      delivered: "#16a34a",
      rejected: "#ef4444",
    };
    return (
      <span
        style={{
          padding: "3px 10px",
          borderRadius: 999,
          fontSize: 12,
          color: "#fff",
          background: colors[status] || "#6b7280",
          textTransform: "capitalize",
        }}
      >
        {status}
      </span>
    );
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        padding: 24,
        background:
          "linear-gradient(135deg,#f9fafb 0%,#e0f2fe 40%,#fef9c3 100%)",
      }}
    >
      <div
        style={{
          maxWidth: 1000,
          margin: "0 auto",
        }}
      >
        <h2 style={{ marginTop: 0, marginBottom: 12 }}>Admin – Orders</h2>
        {err && <p style={{ color: "red" }}>{err}</p>}

        {/* Search + status filter */}
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: 10,
            margin: "4px 0 18px",
          }}
        >
          <input
            type="text"
            placeholder="Search by user name or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{
              flex: "1 1 220px",
              padding: "10px 14px",
              borderRadius: 999,
              border: "1px solid #cbd5f5",
              fontSize: 13,
              background: "#cae3f1ff",
            }}
          />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            style={{
              padding: "10px 14px",
              borderRadius: 999,
              border: "1px solid #cbd5f5",
              fontSize: 13,
              background: "#e0f2fe",
            }}
          >
            <option value="all">All status</option>
            <option value="pending">Pending</option>
            <option value="accepted">Accepted</option>
            <option value="on-the-way">On the way</option>
            <option value="delivered">Delivered</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>

        {loading ? (
          <p>Loading...</p>
        ) : filteredOrders.length === 0 ? (
          <p>No orders found.</p>
        ) : (
          <div style={{ marginTop: 8 }}>
            {filteredOrders.map((order) => (
              <div
                key={order._id}
                onClick={() => setSelectedOrder(order)}
                style={{
                  background:
                    "linear-gradient(135deg, rgba(141, 210, 223, 0.96), rgba(214, 83, 192, 0.96))",
                  padding: 18,
                  marginBottom: 16,
                  borderRadius: 24,
                  boxShadow: "0 16px 34px rgba(82, 125, 226, 0.18)",
                  cursor: "pointer",
                  border: "1px solid rgba(56, 123, 218, 0.45)",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginBottom: 6,
                  }}
                >
                  <div>
                    <strong>{order.user?.name || "Unknown user"}</strong>{" "}
                    <span style={{ color: "#8698c490", fontSize: 12 }}>
                      ({order.user?.email})
                    </span>
                    <div style={{ fontSize: 12, color: "#959caca0" }}>
                      {new Date(order.createdAt).toLocaleString("en-IN")}
                    </div>
                  </div>
                  <div>{statusChip(order.status)}</div>
                </div>

                <p style={{ margin: "4px 0" }}>
                  <strong>Address:</strong> {order.address}
                </p>
                <p style={{ margin: "4px 0" }}>
                  <strong>Total:</strong> ₹{order.total}
                </p>

                <div
                  style={{
                    display: "flex",
                    gap: 10,
                    marginTop: 10,
                    flexWrap: "wrap",
                  }}
                  onClick={(e) => e.stopPropagation()} // avoid opening modal
                >
                  {order.status === "pending" && (
                    <>
                      <button
                        onClick={() =>
                          updateStatus(order._id, "accepted")
                        }
                        style={{
                          borderRadius: 999,
                          border: "none",
                          padding: "8px 18px",
                          cursor: "pointer",
                          fontSize: 13,
                          fontWeight: 600,
                          background:
                            "linear-gradient(to right,#22c55e,#16a34a)",
                          color: "#ec9494ff",
                          boxShadow:
                            "0 6px 14px rgba(34,197,94,0.45)",
                        }}
                      >
                        Approve
                      </button>
                      <button
                        onClick={() =>
                          updateStatus(order._id, "rejected")
                        }
                        style={{
                          borderRadius: 999,
                          border: "none",
                          padding: "8px 18px",
                          cursor: "pointer",
                          fontSize: 13,
                          fontWeight: 600,
                          background:
                            "linear-gradient(to right,#fb7185,#ef4444)",
                          color: "#fff",
                          boxShadow:
                            "0 6px 14px rgba(248,113,113,0.45)",
                        }}
                      >
                        Reject
                      </button>
                    </>
                  )}
                  {order.status === "accepted" && (
                    <button
                      onClick={() =>
                        updateStatus(order._id, "on-the-way")
                      }
                      style={{
                        borderRadius: 999,
                        border: "none",
                        padding: "8px 18px",
                        cursor: "pointer",
                        fontSize: 13,
                        fontWeight: 600,
                        background:
                          "linear-gradient(to right, #38bdf8, #0ea5e9)",
                        color: "#fff",
                        boxShadow:
                          "0 6px 14px rgba(56,189,248,0.4)",
                      }}
                    >
                      Mark On-the-way
                    </button>
                  )}
                  {order.status === "on-the-way" && (
                    <button
                      onClick={() =>
                        updateStatus(order._id, "delivered")
                      }
                      style={{
                        borderRadius: 999,
                        border: "none",
                        padding: "8px 18px",
                        cursor: "pointer",
                        fontSize: 13,
                        fontWeight: 600,
                        background:
                          "linear-gradient(to right,#22c55e,#16a34a)",
                        color: "#fff",
                        boxShadow:
                          "0 6px 14px rgba(34,197,94,0.45)",
                      }}
                    >
                      Mark Delivered
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ORDER DETAILS MODAL */}
        {selectedOrder && (
          <div
            onClick={() => setSelectedOrder(null)}
            style={{
              position: "fixed",
              inset: 0,
              background: "rgba(0,0,0,0.75)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              zIndex: 100,
            }}
          >
            <div
              onClick={(e) => e.stopPropagation()}
              style={{
                width: "95%",
                maxWidth: 520,
                background: "linear-gradient(to right, #e05cb9ff, #9f7bdfff)",
                borderRadius: 18,
                padding: 22,
                boxShadow: "0 20px 50px rgba(235, 236, 228, 0.6)",
                color: "#1d86d6ff",
                border: "1px solid #334155",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: 14,
                }}
              >
                <h3 style={{ margin: 0, color: "#fff" }}>
                  Order #{selectedOrder._id.slice(-6)}
                </h3>

                <button
                  onClick={() => setSelectedOrder(null)}
                  style={{
                    borderRadius: "50%",
                    border: "none",
                    width: 32,
                    height: 32,
                    background: "#f7f0f0ff",
                    color: "#070303ff",
                    cursor: "pointer",
                    fontSize: 16,
                  }}
                >
                  ✕
                </button>
              </div>

              <p style={{ margin: "6px 0", color: "#e5e7eb" }}>
                <strong>User:</strong> {selectedOrder.user?.name} (
                {selectedOrder.user?.email})
              </p>

              <p style={{ margin: "6px 0", color: "#e5e7eb" }}>
                <strong>Address:</strong> {selectedOrder.address}
              </p>

              <p style={{ margin: "6px 0" }}>
                <strong>Status:</strong>{" "}
                <span
                  style={{
                    padding: "4px 12px",
                    borderRadius: 999,
                    background:
                      selectedOrder.status === "rejected"
                        ? "#dc2626"
                        : "#f97316",
                    color: "#fff",
                    fontSize: 12,
                    fontWeight: 600,
                    textTransform: "capitalize",
                  }}
                >
                  {selectedOrder.status}
                </span>
              </p>

              <p style={{ margin: "12px 0 6px", fontWeight: 600 }}>
                Items:
              </p>
              <ul
                style={{
                  marginTop: 0,
                  paddingLeft: 18,
                  color: "#e5e7eb",
                }}
              >
                {selectedOrder.items.map((it, idx) => (
                  <li key={idx}>
                    {it.name} – {it.quantity} × ₹{it.price}
                  </li>
                ))}
              </ul>

              <div
                style={{
                  marginTop: 14,
                  paddingTop: 12,
                  borderTop: "1px dashed #475569",
                  display: "flex",
                  justifyContent: "space-between",
                  fontWeight: 700,
                  fontSize: 16,
                  color: "#fff",
                }}
              >
                <span>Total</span>
                <span>₹{selectedOrder.total}</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminOrders;
