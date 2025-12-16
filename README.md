# 🎓 SRIC Senior Secondary School  
## 🌐 Admissions & Administration Portal

![Build](https://img.shields.io/badge/build-passing-brightgreen)
![Version](https://img.shields.io/badge/version-1.0.0-blue)
![Node](https://img.shields.io/badge/node-18+-green)
![React](https://img.shields.io/badge/react-18+-61DAFB)
![MongoDB](https://img.shields.io/badge/database-MongoDB-green)
![License](https://img.shields.io/badge/license-Proprietary-red)

> **A secure, scalable, and fully digital school management system** built for **Sitaram Inter College** to streamline admissions, fee payments, communication, and administrative workflows.

---

## 🚀 Project Overview

The **SRIC Admissions & Admin Portal** is a **full-stack web application** designed to digitize and automate critical school operations:

- Online student admissions  
- Fee payment and receipt verification  
- Contact and inquiry management  
- Exam schedule publishing  
- Academic toppers showcase  
- Secure admin dashboard with analytics  

This system ensures **efficiency, transparency, and enterprise-grade security**.

---

## 🌐 Live Deployment

🔗 **Backend API**  
👉 https://sitaram-inter-college.onrender.com  

🔗 **Frontend Website**  
👉 https://sric-fdq2.onrender.com  

---

## ✨ Key Features

### 🎯 For Students & Parents

- 📝 **Online Admission Form** – Digital application submission  
- 💰 **Fee Payment Portal** – Receipt upload & tracking  
- 📞 **Contact System** – Direct communication with administration  
- 📅 **Exam Schedule Viewer** – Quarterly & half-yearly exams  
- 🏆 **Toppers Display** – Academic achievers with certificates  

---

### 🔐 For Administrators

- 🛡️ **Secure Admin Login** – JWT + bcrypt authentication  
- 📊 **Dashboard Analytics** – Real-time insights  
- 📋 **Admissions Management** – Approve / reject applications  
- 💰 **Fee Verification** – Validate payment receipts  
- 📩 **Contact Management** – Respond & archive messages  
- 📈 **Reports & Statistics** – Status distributions  

---

## 🛠️ Technology Stack

### Backend
- Node.js 18+
- Express.js
- MongoDB Atlas
- JWT Authentication
- Bcrypt.js
- Multer & Cloudinary
- CORS & Body-Parser

### Frontend
- React 18+
- React Router DOM
- Axios
- Tailwind CSS
- Font Awesome

### DevOps
- Render.com
- Environment Variables
- Git & GitHub

---

## 📁 Project Structure

```text
SRIC-ADMISSIONS/
├── client/                    # React Frontend
│   ├── src/
│   │   ├── components/
│   │   │   ├── Home.jsx
│   │   │   ├── AdminLogin.jsx
│   │   │   └── AdminDashboard.jsx
│   │   ├── App.jsx
│   │   ├── config.js
│   │   └── index.js
│   └── package.json
│
├── server/                    # Node.js Backend
│   ├── server.js
│   ├── routes/
│   │   ├── Admission.js
│   │   ├── Contact.js
│   │   └── FeePayment.js
│   ├── routes/
│   └── package.json
│
└── README.md
📸 Screenshots

Add screenshots by uploading images to a /screenshots folder and updating paths below.

🏠 Home Page

📝 Admission Form

🔐 Admin Login

📊 Admin Dashboard

💰 Fee Verification Panel

🚀 Getting Started
Prerequisites

Node.js 18+

MongoDB Atlas

Cloudinary Account

Git

Backend Setup
git clone <repository-url>
cd sric-admissions/server
npm install

Create .env file:
PORT=5000
MONGODB_URI=your_mongodb_connection_string
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
JWT_SECRET=your_secret_key

Start server:
npm start

Frontend Setup
cd ../client
npm install

Run app:
npm run dev
🔐 Admin Credentials

Default admin is auto-created on first server start.

Username: XXXXXX

Password: XXXXXX

Email: sitaramintercollege1205@gmail.com

⚠️ Change credentials after deployment

📊 API Endpoints
Public

GET /api/health

POST /api/admission

POST /api/contact

POST /api/fee-payments/upload

Admin

POST /api/admin/login

GET /api/admin/dashboard

GET /api/admin/profile

PUT /api/admissions/:id/status

PUT /api/fee-payments/:id/status

PUT /api/contacts/:id/status

🛡️ Security Features

Password hashing with bcrypt

JWT-based authentication

Account lock after 5 failed attempts

Secure CORS configuration

File upload validation

Input sanitization

Role-based access control

📞 Support & Contact

📧 Email: sitaramintercollege1205@gmail.com

📱 Phone: +91 9756517750
📍 Address:
Sabdalpur Sharki, Mathana Road, Hasanpur,
Amroha – 244242 (U.P.)

📄 License

© 2025 Sitaram Inter College
All Rights Reserved.

🎯 Project Status

✅ Production Ready

🔒 Enterprise-Grade Security

📅 Last Updated: December 2025

👨‍💻 Developed By: Ankit Kumar

