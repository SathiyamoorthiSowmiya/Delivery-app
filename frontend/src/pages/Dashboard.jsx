// src/pages/Dashboard.jsx
import {
  useContext,
  useMemo,
  useState,
  useEffect
} from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext.jsx";
import api from "../api/api.js";

const USER_QUOTES = [
  "Good food is good mood. 😋",
  "One order away from happiness.",
  "Life is short. Order the extra fries.",
  "Great days start with great meals.",
  "Delivering cravings, not just orders.",
];

const ADMIN_QUOTES = [
  "Great admins keep every order on time. 🚚",
  "Review, approve, deliver – all in one place.",
  "Small decisions, big impact on every delivery.",
];

const Dashboard = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const isAdmin = user?.role === "admin";

  // ---- Dark mode ----
  const [dark, setDark] = useState(
    () => localStorage.getItem("theme") === "dark"
  );

  useEffect(() => {
    if (dark) {
      document.body.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.body.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [dark]);

  const firstLetter = (user?.name || "U").charAt(0).toUpperCase();

  // ---- Quotes ----
  const quote = useMemo(
    () =>
      (isAdmin ? ADMIN_QUOTES : USER_QUOTES)[
        Math.floor(
          Math.random() *
            (isAdmin ? ADMIN_QUOTES.length : USER_QUOTES.length)
        )
      ],
    [isAdmin]
  );

  // ---- Admin stats (total / pending / delivered) ----
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    delivered: 0,
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await api.get("/orders");
        const orders = res.data || [];
        const total = orders.length;
        const pending = orders.filter((o) => o.status === "pending").length;
        const delivered = orders.filter(
          (o) => o.status === "delivered"
        ).length;
        setStats({ total, pending, delivered });
      } catch {
        // ignore small errors on dashboard
      }
    };

    if (isAdmin) fetchStats();
  }, [isAdmin]);

  // COMMON background
  const bg = dark
    ? "radial-gradient(circle at top left,#020617,#020617 40%,#020617 90%)"
    : "radial-gradient(circle at top left,#ffe4e6,#f9fafb 45%,#dbeafe 90%)";

  // ------- ADMIN LAYOUT -------
  if (isAdmin) {
    return (
      <div
        style={{
          minHeight: "100vh",
          padding: "40px 16px 60px",
          background: bg,
          transition: "background 0.3s ease",
        }}
      >
        <div style={{ maxWidth: 900, margin: "0 auto" }}>
          <div
            style={{
              borderRadius: 26,
              padding: "24px 28px",
              background: dark
                ? "linear-gradient(135deg,#020617,#020617)"
                : "linear-gradient(135deg,#f9fafb,#ffffff)",
              boxShadow: dark
                ? "0 18px 45px rgba(15,23,42,0.8)"
                : "0 18px 45px rgba(15,23,42,0.12)",
              color: dark ? "#e5e7eb" : "#0f172a",
              transition: "all 0.25s ease",
            }}
          >
            {/* top row */}
            <div
              style={{
                display: "flex",
                alignItems: "flex-start",
                gap: 16,
              }}
            >
              <div
                style={{
                  width: 46,
                  height: 46,
                  borderRadius: "999px",
                  background: dark ? "#1f2937" : "#eff6ff",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontWeight: 700,
                  fontSize: 20,
                  color: dark ? "#e5e7eb" : "#1d4ed8",
                }}
              >
                {firstLetter}
              </div>

              <div style={{ flex: 1 }}>
                <h2
                  style={{
                    margin: 0,
                    fontSize: 28,
                  }}
                >
                  Hi, {user?.name || "Admin"} 👋
                </h2>
                <p
                  style={{
                    margin: "6px 0 0",
                    fontSize: 14,
                    color: dark ? "#9ca3af" : "#64748b",
                  }}
                >
                  Welcome back to your admin dashboard.
                </p>

                <span
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 6,
                    marginTop: 10,
                    padding: "4px 10px",
                    borderRadius: 999,
                    background: dark ? "#111827" : "#fef3c7",
                    fontSize: 12,
                    color: dark ? "#fde68a" : "#92400e",
                    fontWeight: 600,
                  }}
                >
                  <span
                    style={{
                      width: 8,
                      height: 8,
                      borderRadius: "50%",
                      background: "#f97316",
                    }}
                  />
                  Admin panel
                </span>
              </div>

              {/* right buttons */}
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "flex-end",
                  gap: 8,
                }}
              >
                {/* THEME TOGGLE */}
                <button
                  onClick={() => setDark((d) => !d)}
                  style={{
                    borderRadius: 999,
                    padding: "5px 12px",
                    cursor: "pointer",
                    fontSize: 12,
                    display: "flex",
                    alignItems: "center",
                    gap: 6,
                    background: dark ? "transparent" : "#ffffff",
                    border: dark
                      ? "1px solid #4b5563"
                      : "1px solid rgba(148,163,184,0.6)",
                    color: dark ? "#e5e7eb" : "#0f172a",
                    boxShadow: "none",
                  }}
                >
                  {dark ? "🌙 Dark" : "☀️ Light"}
                </button>

                {/* LOGOUT */}
                <button
                  onClick={logout}
                  style={{
                    borderRadius: 999,
                    border: "none",
                    padding: "8px 20px",
                    cursor: "pointer",
                    fontSize: 14,
                    fontWeight: 600,
                    background:
                      "linear-gradient(to right,#22c55e,#16a34a,#059669)",
                    color: "#ffffff",
                    boxShadow: "0 10px 25px rgba(34,197,94,0.55)",
                  }}
                >
                  Logout
                </button>
              </div>
            </div>

            {/* quote */}
            <div
              style={{
                marginTop: 18,
                padding: "10px 14px",
                borderRadius: 18,
                background: dark
                  ? "linear-gradient(135deg,#0f172a,#111827)"
                  : "linear-gradient(135deg,#e0f2fe,#fef9c3)",
                display: "flex",
                alignItems: "center",
                gap: 10,
                fontSize: 13,
                color: dark ? "#e5e7eb" : "#334155",
              }}
            >
              <span style={{ fontSize: 18 }}>🛠️</span>
              <span>{quote}</span>
            </div>

            {/* stats row */}
            <div
              style={{
                marginTop: 20,
                display: "grid",
                gridTemplateColumns:
                  "repeat(auto-fit,minmax(180px,1fr))",
                gap: 12,
              }}
            >
              <div
                style={{
                  padding: "12px 14px",
                  borderRadius: 18,
                  background: dark
                    ? "#020617"
                    : "linear-gradient(135deg,#e0f2fe,#eff6ff)",
                  fontSize: 13,
                }}
              >
                <div style={{ color: dark ? "#9ca3af" : "#64748b" }}>
                  Total orders
                </div>
                <div
                  style={{ fontSize: 22, fontWeight: 700, marginTop: 4 }}
                >
                  {stats.total}
                </div>
              </div>

              <div
                style={{
                  padding: "12px 14px",
                  borderRadius: 18,
                  background: dark
                    ? "#020617"
                    : "linear-gradient(135deg,#fef3c7,#fffbeb)",
                  fontSize: 13,
                }}
              >
                <div style={{ color: "#92400e" }}>Pending</div>
                <div
                  style={{ fontSize: 22, fontWeight: 700, marginTop: 4 }}
                >
                  {stats.pending}
                </div>
              </div>

              <div
                style={{
                  padding: "12px 14px",
                  borderRadius: 18,
                  background: dark
                    ? "#020617"
                    : "linear-gradient(135deg,#dcfce7,#ecfdf5)",
                  fontSize: 13,
                }}
              >
                <div style={{ color: "#166534" }}>Delivered</div>
                <div
                  style={{ fontSize: 22, fontWeight: 700, marginTop: 4 }}
                >
                  {stats.delivered}
                </div>
              </div>
            </div>

            {/* main CTA */}
            <div style={{ marginTop: 24 }}>
              <button
                onClick={() => navigate("/admin/orders")}
                style={{
                  borderRadius: 999,
                  border: "none",
                  padding: "11px 26px",
                  cursor: "pointer",
                  fontSize: 14,
                  fontWeight: 600,
                  background:
                    "linear-gradient(to right,#22c55e,#16a34a,#0ea5e9)",
                  color: "#fff",
                  boxShadow: "0 12px 30px rgba(34,197,94,0.55)",
                }}
              >
                View All Orders
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ------- USER LAYOUT -------
  return (
    <div
      style={{
        minHeight: "100vh",
        padding: "40px 16px 60px",
        background: bg,
        transition: "background 0.3s ease",
      }}
    >
      <div
        style={{
          maxWidth: "900px",
          margin: "0 auto",
        }}
      >
        <div
          style={{
            borderRadius: "26px",
            padding: "24px 28px",
            background: dark
              ? "linear-gradient(135deg,#020617,#020617)"
              : "linear-gradient(135deg, rgba(248,250,252,0.98), rgba(255,255,255,0.96))",
            boxShadow: dark
              ? "0 18px 45px rgba(15,23,42,0.8)"
              : "0 18px 45px rgba(15,23,42,0.12), inset 0 0 0 1px rgba(148,163,184,0.12)",
            color: dark ? "#e5e7eb" : "#0f172a",
            transition: "all 0.25s ease",
          }}
        >
          {/* Top row */}
          <div
            style={{
              display: "flex",
              alignItems: "flex-start",
              gap: 16,
            }}
          >
            <div
              style={{
                width: 46,
                height: 46,
                borderRadius: "999px",
                background: dark ? "#1f2937" : "#eff6ff",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontWeight: 700,
                fontSize: 20,
                color: dark ? "#e5e7eb" : "#1d4ed8",
              }}
            >
              {firstLetter}
            </div>

            <div style={{ flex: 1 }}>
              <h2
                style={{
                  margin: 0,
                  fontSize: 28,
                  letterSpacing: 0.2,
                }}
              >
                Hi, {user?.name || "User"} 👋
              </h2>
              <p
                style={{
                  margin: "6px 0 0",
                  fontSize: 14,
                  color: dark ? "#9ca3af" : "#64748b",
                }}
              >
                Welcome back to your delivery dashboard.
              </p>

              <span
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 6,
                  marginTop: 10,
                  padding: "4px 10px",
                  borderRadius: 999,
                  background: dark ? "#111827" : "#eff6ff",
                  fontSize: 12,
                  color: dark ? "#bfdbfe" : "#1d4ed8",
                  fontWeight: 600,
                }}
              >
                <span
                  style={{
                    width: 8,
                    height: 8,
                    borderRadius: "50%",
                    background: "#22c55e",
                  }}
                />
                Role: {user?.role}
              </span>
            </div>

            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "flex-end",
                gap: 8,
              }}
            >
              {/* Dark mode toggle */}
              <button
                onClick={() => setDark((d) => !d)}
                style={{
                  borderRadius: 999,
                  border: "1px solid rgba(148,163,184,0.6)",
                  padding: "5px 12px",
                  background: dark ? "#020617" : "#ffffff",
                  cursor: "pointer",
                  fontSize: 12,
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                  color: dark ? "#e5e7eb" : "#0f172a",
                }}
              >
                {dark ? "🌙 Dark" : "☀️ Light"}
              </button>

              <button
                onClick={logout}
                style={{
                  borderRadius: 999,
                  border: "1px solid #e2e8f0",
                  padding: "8px 18px",
                  background: dark ? "#111827" : "white",
                  cursor: "pointer",
                  fontSize: 14,
                  fontWeight: 500,
                  boxShadow: "0 4px 10px rgba(148,163,184,0.25)",
                  color: dark ? "#e5e7eb" : "#0f172a",
                }}
              >
                Logout
              </button>
            </div>
          </div>

          {/* Motivational quote */}
          <div
            style={{
              marginTop: 18,
              padding: "10px 14px",
              borderRadius: 18,
              background: dark
                ? "linear-gradient(135deg,#0f172a,#111827)"
                : "linear-gradient(135deg, rgba(251,113,133,0.08), rgba(129,140,248,0.08))",
              display: "flex",
              alignItems: "center",
              gap: 10,
              fontSize: 13,
              color: dark ? "#e5e7eb" : "#334155",
            }}
          >
            <span style={{ fontSize: 18 }}>✨</span>
            <span>{quote}</span>
          </div>

          {/* Action buttons */}
          <div
            style={{
              marginTop: 22,
              display: "flex",
              gap: 12,
              flexWrap: "wrap",
            }}
          >
            <button
              onClick={() => navigate("/place-order")}
              style={{
                borderRadius: 999,
                border: "none",
                padding: "10px 22px",
                cursor: "pointer",
                fontSize: 14,
                fontWeight: 600,
                background:
                  "linear-gradient(to right,#fb923c,#f97316,#ec4899)",
                color: "#fff",
                boxShadow: "0 10px 25px rgba(248,113,113,0.45)",
              }}
            >
              Place Order
            </button>

            <button
              onClick={() => navigate("/my-orders")}
              style={{
                borderRadius: 999,
                border: "1px solid #e2e8f0",
                padding: "10px 20px",
                cursor: "pointer",
                fontSize: 14,
                fontWeight: 600,
                background: dark ? "#020617" : "#ffffff",
                color: dark ? "#e5e7eb" : "#0f172a",
              }}
            >
              My Orders
            </button>
          </div>
        </div>

        {/* USER feature cards bottom – 6 cards */}
        <div style={{ marginTop: 28 }}>
          <div style={{ marginBottom: 10 }}>
            <p
              style={{
                margin: 0,
                fontSize: 14,
                color: dark ? "#9ca3af" : "#6b7280",
              }}
            >
              Why you’ll love using this app
            </p>
          </div>

          <div className="dashboard-feature-grid">
            {/* 1 */}
            <div className="feature-card feature-card--orange">
              <div className="feature-icon">🚴‍♂️</div>
              <h4>Fast approvals</h4>
              <p>
                Place your order and let the admin approve or reject it in a
                single click.
              </p>
            </div>

            {/* 2 */}
            <div className="feature-card feature-card--blue">
              <div className="feature-icon">📦</div>
              <h4>Live order status</h4>
              <p>
                Track every order as it moves from{" "}
                <strong>pending → on-the-way → delivered</strong>.
              </p>
            </div>

            {/* 3 */}
            <div className="feature-card feature-card--pink">
              <div className="feature-icon">🍕</div>
              <h4>Curated menu</h4>
              <p>
                Browse veg &amp; non-veg dishes with photos, prices and smart
                totals.
              </p>
            </div>

            {/* 4 */}
            <div className="feature-card feature-card--green">
              <div className="feature-icon">📍</div>
              <h4>Smart addresses</h4>
              <p>
                Save your favourite addresses and reorder in just a couple of
                taps.
              </p>
            </div>

            {/* 5 */}
            <div className="feature-card feature-card--purple">
              <div className="feature-icon">📊</div>
              <h4>Order history</h4>
              <p>
                See your past deliveries, totals and items in a clean history
                view.
              </p>
            </div>

            {/* 6 */}
            <div className="feature-card feature-card--yellow">
              <div className="feature-icon">🛡️</div>
              <h4>Secure experience</h4>
              <p>
                JWT based login with role-based access for users and admins.
              </p>
            </div>

                {/* 7 */}
    <div className="feature-card feature-card--red">
      <div className="feature-icon">🔥</div>
      <h4>Hot deals</h4>
      <p>
        Enjoy special discounts and limited-time offers on selected dishes.
      </p>
    </div>

    {/* 8 */}
    <div className="feature-card feature-card--teal">
      <div className="feature-icon">💬</div>
      <h4>Instant support</h4>
      <p>
        Get quick help for payment, orders or delivery issues in just a tap.
      </p>
    </div>

    {/* 9 */}
    <div className="feature-card feature-card--gray">
      <div className="feature-icon">📱</div>
      <h4>Use it anywhere</h4>
      <p>
        Responsive design that works smoothly on mobile, tablet and desktop.
      </p>
    </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
