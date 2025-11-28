import { useEffect, useState, useContext } from "react";
import api from "../api/api.js";
import { AuthContext } from "../context/AuthContext.jsx";

const MyOrders = () => {
  const { user } = useContext(AuthContext);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        const res = await api.get("/orders/my");
        setOrders(res.data);
      } catch (e) {
        console.log(e);
        setErr(e.response?.data?.message || "Failed to load orders");
      } finally {
        setLoading(false);
      }
    };

    if (user) fetchOrders();
  }, [user]);

  if (!user) {
    return <div style={{ padding: 24 }}>Please login to view your orders.</div>;
  }

  // ---- mini stats ----
  const total = orders.length;
  const pending = orders.filter((o) => o.status === "pending").length;
  const delivered = orders.filter((o) => o.status === "delivered").length;

  const statusColor = (status) => {
    switch (status) {
      case "pending":
        return "#f97316";
      case "accepted":
        return "#22c55e";
      case "on-the-way":
        return "#0ea5e9";
      case "delivered":
        return "#16a34a";
      case "rejected":
        return "#ef4444";
      default:
        return "#6b7280";
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        padding: 24,
        background: "#f8fafc",
      }}
    >
      <div
        style={{
          maxWidth: 900,
          margin: "0 auto",
        }}
      >
        <h2 style={{ marginTop: 0 }}>My Orders</h2>
        {err && <p style={{ color: "red" }}>{err}</p>}

        {/* Stats bar */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(170px, 1fr))",
            gap: 10,
            margin: "10px 0 18px",
          }}
        >
          <div
            style={{
              padding: "10px 14px",
              borderRadius: 18,
              background:
                "linear-gradient(135deg,#e0f2fe,#eff6ff)",
              fontSize: 13,
            }}
          >
            <div style={{ color: "#64748b" }}>Total orders</div>
            <div style={{ fontSize: 20, fontWeight: 700 }}>{total}</div>
          </div>
          <div
            style={{
              padding: "10px 14px",
              borderRadius: 18,
              background:
                "linear-gradient(135deg,#fef3c7,#fffbeb)",
              fontSize: 13,
            }}
          >
            <div style={{ color: "#92400e" }}>Pending</div>
            <div style={{ fontSize: 20, fontWeight: 700 }}>{pending}</div>
          </div>
          <div
            style={{
              padding: "10px 14px",
              borderRadius: 18,
              background:
                "linear-gradient(135deg,#dcfce7,#ecfdf5)",
              fontSize: 13,
            }}
          >
            <div style={{ color: "#166534" }}>Delivered</div>
            <div style={{ fontSize: 20, fontWeight: 700 }}>{delivered}</div>
          </div>
        </div>

        {/* Orders list */}
        {loading ? (
          <p>Loading...</p>
        ) : orders.length === 0 ? (
          <p>You have not placed any orders yet.</p>
        ) : (
          <div style={{ marginTop: 8 }}>
            {orders.map((order) => (
              <div
                key={order._id}
                style={{
                  background: "#fff",
                  padding: 16,
                  marginBottom: 12,
                  borderRadius: 16,
                  boxShadow: "0 10px 25px rgba(15,23,42,0.06)",
                  borderLeft: `4px solid ${statusColor(order.status)}`,
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: 6,
                  }}
                >
                  <div>
                    <strong>Order #{order._id.slice(-6)}</strong>
                    <div style={{ fontSize: 12, color: "#6b7280" }}>
                      {new Date(order.createdAt).toLocaleString("en-IN")}
                    </div>
                  </div>
                  <div
                    style={{
                      padding: "4px 10px",
                      borderRadius: 999,
                      fontSize: 12,
                      fontWeight: 600,
                      color: "#fff",
                      background: statusColor(order.status),
                    }}
                  >
                    {order.status}
                  </div>
                </div>

                <p style={{ margin: "4px 0" }}>
                  <strong>Address:</strong> {order.address}
                </p>

                <p style={{ margin: "6px 0 4px" }}>
                  <strong>Items:</strong>
                </p>
                <ul style={{ marginTop: 0, paddingLeft: 18 }}>
                  {order.items.map((it, idx) => (
                    <li key={idx}>
                      {it.name} – {it.quantity} × ₹{it.price}
                    </li>
                  ))}
                </ul>

                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginTop: 6,
                    fontSize: 14,
                  }}
                >
                  <span style={{ color: "#64748b" }}>
                    Payment mode: Cash on delivery
                  </span>
                  <strong>₹{order.total}</strong>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyOrders;
