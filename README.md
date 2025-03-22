# 🛒 PNF Papers E-Commerce Backend API

## 🚀 Overview  
The **PNF Papers Backend API** is the core service powering the PNF Papers e-commerce platform. Built with **Node.js, Express.js, and MongoDB**, it provides a robust and scalable backend to handle authentication, orders, products, and user management.

## 🛠️ Tech Stack  

| Technology | Description |
|------------|-------------|
| ![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=node.js&logoColor=white) | [Runtime environment for JavaScript](https://nodejs.org/) |
| ![Express.js](https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white) | [Minimal and fast Node.js web framework](https://expressjs.com/) |
| ![MongoDB](https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white) | [Flexible and scalable NoSQL database](https://www.mongodb.com/) |
| ![Mongoose](https://img.shields.io/badge/Mongoose-880000?style=for-the-badge&logo=mongoose&logoColor=white) | [Elegant MongoDB object modeling for Node.js](https://mongoosejs.com/) |

---

## 🔥 Key Features  
✅ **🔑 User Authentication** – Secure login and registration with JWT  
✅ **🛍️ Product Management** – CRUD operations for products  
✅ **📦 Order Processing** – Manage orders and payment integration  
✅ **📊 Admin Dashboard APIs** – Access analytics and reports  
✅ **🔒 Role-Based Access Control (RBAC)** – Secure API endpoints  
✅ **⚡ Optimized Performance** – Efficient request handling with Express.js  

---

## ⚙️ Installation & Setup  

### 📥 1. Clone the Repository  
```sh
git clone https://github.com/your-repo-url.git
cd pnf-papers-backend
```

### 📦 2. Install Dependencies  
```sh
npm install
```

### 🚀 3. Start the Development Server  
```sh
npm run dev
```
> The API will be available at **http://localhost:5000/**  

### 🏗️ 4. Build for Production  
```sh
npm start
```

---

## 🔍 API Endpoints  
| Method | Endpoint | Description |
|--------|---------|-------------|
| **POST** | `/api/user/register` | Register a new user |
| **POST** | `/api/user/login` | Authenticate user |
| **GET** | `/api/product` | Fetch all products |
| **POST** | `/api/product` | Add a new product (Admin) |
| **PUT** | `/api/product/:id` | Update a product (Admin) |
| **DELETE** | `/api/product/:id` | Delete a product (Admin) |
| **GET** | `/api/blog` | Fetch all blog posts |
| **POST** | `/api/blog` | Add a new blog post (Admin) |
| **GET** | `/api/category` | Fetch all product categories |
| **POST** | `/api/category` | Add a new product category (Admin) |
| **GET** | `/api/blog-category` | Fetch all blog categories |
| **POST** | `/api/blog-category` | Add a new blog category (Admin) |
| **GET** | `/api/brand` | Fetch all brands |
| **POST** | `/api/brand` | Add a new brand (Admin) |
| **GET** | `/api/coupon` | Fetch all coupons |
| **POST** | `/api/coupon` | Add a new coupon (Admin) |
| **GET** | `/api/color` | Fetch all available colors |
| **POST** | `/api/color` | Add a new color (Admin) |
| **GET** | `/api/enquiry` | Fetch all enquiries |
| **POST** | `/api/enquiry` | Submit a new enquiry |
| **GET** | `/api/country` | Fetch all countries |
| **GET** | `/api/city` | Fetch all cities |
| **POST** | `/api/upload` | Upload a file |

---

## 🤝 Contributing  
1. **Fork** the repository  
2. **Create a new branch** (`feature/new-feature`)  
3. **Commit your changes** (`git commit -m 'Add new feature'`)  
4. **Push to the branch** (`git push origin feature/new-feature`)  
5. **Open a Pull Request**  

---

## 📜 License  
This project is licensed under the **MIT License**.  

---

## 📞 Contact  
📧 Email: [farukhsajjad110@gmail.com](mailto:farukhsajjad110@gmail.com)  
<!-- 🌐 Website: [www.pnfpapers.com](https://www.pnfpapers.com)  -->
📱 Phone: [+923414285511](tel:+923414285511)