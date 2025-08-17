# 🛒 MERN E-Commerce Platform

A full-stack e-commerce web application built with the **MERN stack (MongoDB, Express, React, Node.js)**.
It supports **buyer & seller roles**, secure authentication, product management, wishlist, shopping cart, orders, and integrated payments with Razorpay.

---

## 🚀 Features

### 👥 Authentication & Authorization

* JWT-based login & signup
* Role-based access (**Buyer / Seller**)
* Protected routes for dashboard pages
* Forgot / Reset password flow

### 🛍️ Buyer Features

* Browse products with **search, filter, and categories**
* Add products to **cart** and **wishlist**
* Place orders with **Razorpay payment integration**
* View & cancel orders
* Update profile & change password

### 🏪 Seller Features

* Add, edit, and delete products (with **Cloudinary image uploads**)
* Manage orders (track, cancel, update status)
* View **sales reports & analytics**
* Update profile & change password

### 🎨 UI / UX

* Responsive frontend built with **React + TailwindCSS**
* Reusable components (`ProductCard`, `Navbar`, `Footer`, etc.)
* Toast notifications (`react-toastify`)
* Clean dashboards for buyers and sellers

---

## 🛠️ Tech Stack

### Frontend

* React (Vite)
* React Router DOM
* Context API (Global State Management)
* Tailwind CSS
* Axios
* React Toastify


---

## 📂 Project Structure

```
frontend/
│── src/
│   ├── components/       # Reusable UI components
│   ├── context/          # Context Providers
│   ├── pages/            # Screens (Buyer/Seller/User)
│   ├── App.jsx           # Routes
│   └── index.jsx         # Entry point
```

---

## ⚡ Getting Started

### 1️⃣ Clone the repo

### Frontend
```bash
git clone https://github.com/aruntamilarasu123/E-Commerce-Frontend.git
cd mern-ecommerce
```
### Backend
```bash
git clone https://github.com/aruntamilarasu123/E-Commerce-Backend.git
cd ecommerce-backend
```

### 2️⃣ Install dependencies

#### Backend

```bash
cd backend
npm install
```

#### Frontend

```bash
cd frontend
npm install
```

### 3️⃣ Setup environment variables

#### Frontend (`frontend/.env`)

```
VITE_API_URL=http://localhost:5000
```

### 4️⃣ Run the project

#### Frontend

```bash
npm run dev
```

---

## 📸 Screenshots (optional)

* 🔑 Login / Signup
* 🛍️ Buyer Dashboard
* 🏪 Seller Dashboard
* 🛒 Cart & Wishlist
* 📦 Orders & Payments

---

## 📌 Roadmap

* [ ] Admin Panel (manage users & products)
* [ ] Review & Ratings system
* [ ] Advanced filters & sorting
* [ ] Coupon / Discount support

---

## 🤝 Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

---

## 📜 License

This project is licensed under the MIT License.