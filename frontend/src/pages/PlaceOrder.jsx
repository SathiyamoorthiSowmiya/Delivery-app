// src/pages/PlaceOrder.jsx
import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/api.js";
import { AuthContext } from "../context/AuthContext.jsx";
import { ToastContext } from "../context/ToastContext.jsx";

// Static menu items (image + name + price + type)
const PRODUCTS = [
  {
    id: 1,
    name: "Veg Burger",
    price: 120,
    image: "/images/burger.jpg",
    desc: "Fresh veg patty with cheese.",
    type: "veg",
  },
  {
    id: 2,
    name: "Margherita Pizza",
    price: 250,
    image: "/images/pizza.jpg",
    desc: "Classic cheese pizza.",
    type: "veg",
  },
  {
    id: 3,
    name: "French Fries",
    price: 90,
    image: "/images/fries.jpg",
    desc: "Crispy salted fries.",
    type: "veg",
  },
  {
    id: 4,
    name: "Coke (500ml)",
    price: 50,
    image: "/images/coke.jpg",
    desc: "Chilled soft drink.",
    type: "veg",
  },
  {
    id: 5,
    name: "Chicken Biryani",
    price: 220,
    image: "/images/chicken-biryani.jpg",
    desc: "Spicy chicken biryani with raita.",
    type: "non-veg",
  },
  {
    id: 6,
    name: "Veg Biryani",
    price: 190,
    image: "/images/veg-biryani.jpg",
    desc: "Aromatic veg biryani.",
    type: "veg",
  },
  {
    id: 7,
    name: "White Sauce Pasta",
    price: 210,
    image: "/images/white-pasta.jpg",
    desc: "Creamy white sauce pasta.",
    type: "veg",
  },
  {
    id: 8,
    name: "Red Sauce Pasta",
    price: 200,
    image: "/images/red-pasta.jpg",
    desc: "Tangy tomato pasta.",
    type: "veg",
  },
  {
    id: 9,
    name: "Mushroom Fry",
    price: 160,
    image: "/images/mushroom-fry.jpg",
    desc: "Crispy masala mushrooms.",
    type: "veg",
  },
  {
    id: 10,
    name: "Chicken Lollipop",
    price: 230,
    image: "/images/chicken-lollipop.jpg",
    desc: "Spicy fried chicken lollipops.",
    type: "non-veg",
  },

  {
  id: 11,
  name: "Chicken shawarma",
  price: 230,
  veg: false,
  image: "/images/Chicken shawarma.jpg",
  desc: "Juicy grilled chicken wrap.",
  type: "non-veg",
},
{
  id: 12,
  name: "Mutton Biryani",
  price: 320,
  veg: false,
  image: "/images/Mutton Biryani.webp",
  desc: "Rich mutton biryani with spice.",
  type: "non-veg",
},
{
  id: 13,
  name: "Paneer Butter Masala",
  price: 210,
  veg: true,
  image: "/images/Paneer Butter Masala.avif",
  desc: "Creamy buttery paneer curry..",
  type: "veg",
},
{
  id: 14,
  name: "Gobi Manchurian",
  price: 140,
  veg: true,
  image: "/images/Gobi Manchurian.jpg",
  desc: "Spicy crispy gobi bites.",
  type: "veg",
},
{
  id: 15,
  name: "Egg Fried Rice",
  price: 160,
  veg: false,
  image: "/images/Egg Fried Rice.webp",
  desc: "Fluffy rice with egg stir-fry.",
  type: "non-veg",
},
{
  id: 16,
  name: "Prawn Biriyani",
  price: 290,
  veg: true,
  image: "/images/Prawn Biriyani.avif",
  desc: "Spicy prawn loaded biryani.",
  type: "non-veg",
},
{
  id: 17,
  name: "Pav Bhaji",
  price: 110,
  veg: true,
  image: "/images/PavBhaji.webp",
  desc: "Buttery pav with spicy bhaji.",
  type: "veg",
},
{
  id: 18,
  name: "Fish Fry",
  price: 240,
  veg: false,
  image: "/images/Fish Fry.jpg",
  desc: "Crispy spicy fish fry.",
  type: "non-veg",
},

];

const PlaceOrder = () => {
  const { user } = useContext(AuthContext);
  const { showToast } = useContext(ToastContext);
  const navigate = useNavigate();

  const [address, setAddress] = useState("");
  const [cart, setCart] = useState({});
  const [filter, setFilter] = useState("all"); // all | veg | non-veg
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");
  const [success, setSuccess] = useState("");

  if (!user) {
    return <div style={{ padding: 24 }}>Please login to place an order.</div>;
  }

  // change quantity of a product in cart
  const changeQty = (id, delta) => {
    setCart((prev) => {
      const old = prev[id] || 0;
      const next = Math.max(0, old + delta);
      const copy = { ...prev };
      if (next === 0) {
        delete copy[id];
      } else {
        copy[id] = next;
      }
      return copy;
    });
  };

  // Cart → items array (for backend)
  const items = PRODUCTS.filter((p) => cart[p.id]).map((p) => ({
    name: p.name,
    quantity: cart[p.id],
    price: p.price,
  }));

  const subTotal = items.reduce(
    (sum, it) => sum + it.price * it.quantity,
    0
  );
  const gst = Math.round(subTotal * 0.05); // 5% GST
  const deliveryCharge = subTotal > 0 ? 40 : 0;
  const grandTotal = subTotal + gst + deliveryCharge;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErr("");
    setSuccess("");

    if (items.length === 0) {
      setErr("Please select at least one product.");
      return;
    }

    try {
      setLoading(true);

      await api.post("/orders/new", {
        address,
        items,
        total: grandTotal,
      });

      setSuccess("Order placed! Admin will review.");
      showToast("Order placed successfully!", "success");

      setAddress("");
      setCart({});
      setTimeout(() => navigate("/my-orders"), 1000);
    } catch (e) {
      console.log(e);
      const msg = e.response?.data?.message || "Order failed";
      setErr(msg);
      showToast("Order failed. Please try again.", "error");
    } finally {
      setLoading(false);
    }
  };

  // Filter products for menu (veg / non-veg / all)
  const visibleProducts = PRODUCTS.filter((p) =>
    filter === "all" ? true : p.type === filter
  );

  return (
    <div style={{ minHeight: "100vh", padding: 24, background: "#f8fafc" }}>
      <div
        style={{
          maxWidth: 1000,
          margin: "24px auto",
          display: "grid",
          gridTemplateColumns: "2fr 1.3fr",
          gap: 20,
        }}
      >
        {/* LEFT: product cards */}
        <div>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: 12,
            }}
          >
            <div>
              <h2 style={{ margin: 0 }}>Menu</h2>
              <p style={{ marginTop: 4, color: "#64748b" }}>
                Select items to add to your order.
              </p>
            </div>

            {/* Veg / Non-veg filter */}
            <div
              style={{
                display: "flex",
                gap: 8,
                background: "#e2e8f0",
                padding: 4,
                borderRadius: 999,
                fontSize: 13,
              }}
            >
              <button
                type="button"
                onClick={() => setFilter("all")}
                style={{
                  border: "none",
                  borderRadius: 999,
                  padding: "4px 10px",
                  cursor: "pointer",
                  background: filter === "all" ? "#fff" : "transparent",
                }}
              >
                All
              </button>
              <button
                type="button"
                onClick={() => setFilter("veg")}
                style={{
                  border: "none",
                  borderRadius: 999,
                  padding: "4px 10px",
                  cursor: "pointer",
                  background: filter === "veg" ? "#fff" : "transparent",
                }}
              >
                🟢 Veg
              </button>
              <button
                type="button"
                onClick={() => setFilter("non-veg")}
                style={{
                  border: "none",
                  borderRadius: 999,
                  padding: "4px 10px",
                  cursor: "pointer",
                  background:
                    filter === "non-veg" ? "#fff" : "transparent",
                }}
              >
                🔴 Non-veg
              </button>
            </div>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))",
              gap: 16,
            }}
          >
            {visibleProducts.map((p) => {
              const qty = cart[p.id] || 0;
              return (
                <div
                  key={p.id}
                  style={{
                    background: "#fff",
                    borderRadius: 16,
                    overflow: "hidden",
                    boxShadow: "0 10px 25px rgba(15,23,42,0.08)",
                    display: "flex",
                    flexDirection: "column",
                  }}
                >
                  <div style={{ height: 120, overflow: "hidden" }}>
                    <img
                      src={p.image}
                      alt={p.name}
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                      }}
                    />
                  </div>
                  <div style={{ padding: 12, flexGrow: 1 }}>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      <h4 style={{ margin: "0 0 4px" }}>{p.name}</h4>
                      <span style={{ fontSize: 12 }}>
                        {p.type === "veg" ? "🟢" : "🔴"}
                      </span>
                    </div>
                    <p
                      style={{
                        margin: "0 0 8px",
                        fontSize: 13,
                        color: "#64748b",
                      }}
                    >
                      {p.desc}
                    </p>
                    <p style={{ margin: 0, fontWeight: 600 }}>₹{p.price}</p>
                  </div>
                  <div
                    style={{
                      padding: "8px 12px 12px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    {/* centered +/- controls */}
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: 10,
                      }}
                    >
                      <button
                        type="button"
                        onClick={() => changeQty(p.id, -1)}
                        style={{
                          width: 30,
                          height: 30,
                          borderRadius: "999px",
                          border: "1px solid #e2e8f0",
                          cursor: "pointer",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          padding: 0,
                          fontSize: 18,
                          lineHeight: 1,
                        }}
                      >
                        -
                      </button>

                      <span
                        style={{
                          minWidth: 20,
                          textAlign: "center",
                          fontWeight: 600,
                        }}
                      >
                        {qty}
                      </span>

                      <button
                        type="button"
                        onClick={() => changeQty(p.id, 1)}
                        style={{
                          width: 30,
                          height: 30,
                          borderRadius: "999px",
                          border: "none",
                          cursor: "pointer",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          padding: 0,
                          fontSize: 18,
                          lineHeight: 1,
                          background:
                            "linear-gradient(to right,#fb923c,#ec4899)",
                          color: "#fff",
                        }}
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* RIGHT: address + summary */}
        <div>
          <h2 style={{ marginTop: 0 }}>Checkout</h2>

          {err && <p className="error">{err}</p>}
          {success && (
            <p
              style={{
                padding: "8px 10px",
                borderRadius: 10,
                background: "#dcfce7",
                color: "#166534",
                fontSize: 13,
                marginBottom: 12,
              }}
            >
              {success}
            </p>
          )}

          <form
            onSubmit={handleSubmit}
            style={{ display: "flex", flexDirection: "column", gap: 12 }}
          >
            <label>
              Delivery Address
              <textarea
                required
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                style={{
                  marginTop: 4,
                  width: "100%",
                  minHeight: 80,
                  borderRadius: 10,
                  border: "1px solid #cbd5f5",
                  padding: "8px 10px",
                  resize: "vertical",
                }}
              />
            </label>

            <div
              style={{
                marginTop: 8,
                padding: 16,
                borderRadius: 12,
                background: "#fff",
                boxShadow: "0 8px 20px rgba(15,23,42,0.06)",
              }}
            >
              <h4 style={{ marginTop: 0 }}>Order Summary</h4>

              {items.length === 0 ? (
                <p style={{ margin: 0, fontSize: 13, color: "#64748b" }}>
                  No items selected.
                </p>
              ) : (
                <ul style={{ paddingLeft: 16, marginTop: 4 }}>
                  {items.map((it, idx) => (
                    <li key={idx}>
                      {it.name} – {it.quantity} × ₹{it.price}
                    </li>
                  ))}
                </ul>
              )}

              <hr style={{ margin: "8px 0" }} />

              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  fontSize: 14,
                  marginBottom: 4,
                }}
              >
                <span>Subtotal</span>
                <span>₹{subTotal}</span>
              </div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  fontSize: 14,
                  marginBottom: 4,
                }}
              >
                <span>GST (5%)</span>
                <span>₹{gst}</span>
              </div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  fontSize: 14,
                  marginBottom: 8,
                }}
              >
                <span>Delivery Charge</span>
                <span>₹{deliveryCharge}</span>
              </div>

              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  fontWeight: 700,
                  fontSize: 15,
                }}
              >
                <span>Total to Pay</span>
                <span>₹{grandTotal}</span>
              </div>
            </div>
                        <button
              type="submit"
              disabled={loading}
              style={{
                width: "100%",
                borderRadius: "999px",
                border: "none",
                padding: "14px 20px",
                cursor: loading ? "not-allowed" : "pointer",
                fontSize: 16,
                fontWeight: 700,
                letterSpacing: "0.5px",
                background: loading
                  ? "linear-gradient(to right,#9ca3af,#6b7280)"
                  : "linear-gradient(to right,#fb923c,#f97316,#ec4899)",
                color: "#ffffff",
                boxShadow: loading
                  ? "none"
                  : "0 14px 35px rgba(236,72,153,0.45)",
                transition: "all 0.25s ease",
                transform: "scale(1)",
              }}
              onMouseEnter={(e) => {
                if (!loading) e.currentTarget.style.transform = "scale(1.05)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "scale(1)";
              }}
            >
              {loading ? "Placing..." : "🚀 Place Order"}
            </button>  
          </form>
        </div>
      </div>
    </div>
  );
};

export default PlaceOrder;
