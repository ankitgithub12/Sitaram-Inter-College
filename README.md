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
