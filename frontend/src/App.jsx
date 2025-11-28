import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import PlaceOrder from "./pages/PlaceOrder.jsx";
import AdminLogin from "./pages/AdminLogin.jsx";
import AdminOrders from "./pages/AdminOrders.jsx";
import PrivateRoute from "./components/PrivateRoute.jsx";
import MyOrders from "./pages/MyOrders.jsx";



export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* User side */}
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          }
        />
        <Route
          path="/place-order"
          element={
            <PrivateRoute>
              <PlaceOrder />
            </PrivateRoute>
          }
          />
          <Route
            path="/my-orders"
            element={
              <PrivateRoute>
                <MyOrders />
              </PrivateRoute>
           }
           />

        {/* Admin side */}
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route
          path="/admin/orders"
          element={
            <PrivateRoute>
              <AdminOrders />
            </PrivateRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}
