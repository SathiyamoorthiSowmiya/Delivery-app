# 🍔 Delivery Management System 

This Delivery Management system is designed to manage food ordering and delivery operations efficiently. The system has two main roles: **Admin** and **User**.  

- 👩‍💼 **Admin Role**: Responsible for reviewing orders, approving or rejecting them, and updating delivery status.  
- 👨‍💻 **User Role**: Enables users to browse food items, place orders, track order status, and manage their order history.

---

## 🚀 Live Demo

- **Frontend deployed with Netlify / Vercel**:  
  https://your-frontend-link.com  

- **Backend deployed with Render.com**:  
  https://your-backend-link.com  

---

## ✨ Features

### 👩‍💼 Admin Side  

- 📋 **View All Orders**: Admins can view all user orders with full details.  
- ✅❌ **Approve or Reject Orders**: Admins can approve or reject user orders.  
- 🚚 **Update Delivery Status**: Change status from pending → accepted → on-the-way → delivered.  
- 🔍 **Search & Filter Orders**: Search by user name/email and filter by status.  
- 📊 **Admin Dashboard**: Shows total orders, pending orders, and delivered orders.  
- 🌙 **Dark Mode**: Separate dark theme for admin panel.  

---

### 👨‍💻 User Side

- 🍽️ **Browse Menu**: Users can view food items with images, description, and price.  
- 🟢🔴 **Veg / Non-Veg Filter**: Filter dishes based on category.  
- ➕➖ **Add to Cart**: Increase or decrease quantity using + / – buttons.  
- 🏠 **Add Delivery Address**: Enter delivery address during checkout.  
- 🧮 **Auto Price Calculation**: Subtotal + GST + Delivery charge.  
- 📦 **Place Order**: Submit order for admin review.  
- 📜 **Order History**: Users can view their previous orders and their status.  
- 🌓 **Light / Dark Mode Dashboard**: User dashboard supports theme toggle.  

---

## 📥 Installation

### 📦 Backend (Node.js)  
1. Navigate to the backend directory:  
   ```bash
   cd backend

   Install dependencies:

npm install


Set up the database:

Create a .env file inside the backend folder.

Add the following:

MONGO_URL=your_mongodb_url
JWT_SECRET=your_secret_key
PORT=4000


Start the server:

npm start

🖥️ Frontend (React)

Navigate to the frontend directory:

cd frontend


Install dependencies:

npm install


Configure environment variables (optional):

Create a .env file in the frontend folder and add backend API URL if required.

Start the development server:

npm run dev

🚀 Getting Started

📧 Register a User Account:

Register a user account to access the food menu, place orders, and track delivery status.

👩‍💼 Register an Admin Account:

Register an admin account to access the admin portal and manage all orders.

⚡ Usage
Admin Interface

🔐 Login: Admins log in using their credentials.

📊 Dashboard: Access the admin dashboard to view order statistics.

📋 Order Management:

View Orders: View all user orders.

✅ Approve Order: Accept user orders.

❌ Reject Order: Reject user orders.

🚚 Delivery Management:

Mark orders as on-the-way.

Mark orders as delivered.

🔍 Search & Filter:

Search orders by user name or email.

Filter orders by status.

👨‍💻 User Interface

🔐 Login: Users log in using their credentials.

📊 Dashboard: Access the user dashboard with theme toggle.

🍽️ Menu Page: Browse food items with images and prices.

➕➖ Cart System: Add or remove items easily.

🏠 Checkout: Enter delivery address and place order.

📜 My Orders: View order history and current order status.

📧 Demo Credentials

Use the following demo credentials to explore the application:

👩‍💼 Admin side

📩 Email: admin@test.com

🔑 Password: 123456

👨‍💻 User side

📩 Email: user@test.com

🔑 Password: 123456
