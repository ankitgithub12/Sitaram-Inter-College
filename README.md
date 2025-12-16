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
│   ├── models/
│   │   ├── Admission.js
│   │   ├── Contact.js
│   │   └── FeePayment.js
│   ├── routes/
│   └── package.json
│
└── README.md
🚀 Getting Started
Prerequisites
Node.js 18+ installed

MongoDB Atlas account

Cloudinary account

Git installed

Backend Setup
Clone the repository

bash
git clone <repository-url>
cd sric-admissions/server
Install dependencies

bash
npm install
Configure environment variables (create .env file)

env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
Start the server

bash
npm start
# Server runs on http://localhost:5000
Frontend Setup
Navigate to client directory

bash
cd ../client
Install dependencies

bash
npm install
Configure API endpoint (in src/config.js)

javascript
const API_BASE_URL = 'http://localhost:5000'; // For development
// or 'https://sitaram-inter-college.onrender.com' for production
Start the React app

bash
npm start
# App runs on http://localhost:3000
🔐 Admin Credentials
Default admin credentials (auto-created on first server startup):

Username: XXXXX

Password: XXXXXX

Email: sitaramintercollege1205@gmail.com

⚠️ Security Note: Passwords are hashed with bcrypt and stored securely in the database.

📊 API Endpoints
Public Endpoints
GET /api/health - Server health check

POST /api/admission - Submit admission form

POST /api/contact - Submit contact form

POST /api/fee-payments/upload - Submit fee payment with receipt

GET /api/admissions - Get all admissions (filterable)

GET /api/fee-payments - Get all fee payments

GET /api/contacts - Get all contacts

Admin Endpoints (Requires Authentication)
POST /api/admin/login - Admin authentication

GET /api/admin/dashboard - Dashboard statistics

PUT /api/admissions/:id/status - Update admission status

PUT /api/fee-payments/:id/status - Verify/reject payments

PUT /api/contacts/:id/status - Update contact status

GET /api/admin/profile - Get admin profile

🔧 Database Schemas
Admin Schema
username (String, Unique) - Admin login username

password (String) - Hashed password

email (String, Unique) - Contact email

role (String) - Admin role (admin/superadmin/viewer)

lastLogin (Date) - Last login timestamp

loginAttempts (Number) - Failed login attempts

lockUntil (Date) - Account lock timestamp

Admission Schema
Student personal information

Parent/guardian details

Academic information

Application status (pending/approved/rejected)

Auto-generated application number (SRICYYXXXXX)

Fee Payment Schema
Payment details

Receipt information

Cloudinary file metadata

Verification status (pending/verified/rejected)

Contact Schema
Inquiry information

Response tracking

Status management (unread/read/replied/archived)

🌐 Deployment Guide
Deploying to Render
Push code to GitHub repository

Create new Web Service on Render

Connect your GitHub repository

Configure settings:

Root Directory: server/ (for backend)

Build Command: npm install

Start Command: node server.js

Add environment variables (same as local .env)

Deploy

Frontend Deployment
Create Static Site on Render

Connect frontend repository

Build Command: npm run build

Publish Directory: build/

🛡️ Security Features
Password Encryption: Bcrypt hashing with salt rounds

Account Lockout: 5 failed attempts lock account for 15 minutes

CORS Configuration: Whitelisted domains only

File Upload Validation: MIME type and size restrictions

Input Sanitization: Trim and validation on all inputs

Token-based Authentication: Secure admin sessions

📱 Frontend Components
Home Page (Home.jsx)
Responsive navigation with mobile menu

Hero section with call-to-action

Exam schedule display

Academic toppers showcase

Testimonials from alumni

Programs and features overview

Contact information

Admin Login (AdminLogin.jsx)
Secure login form

Password visibility toggle

Connection status indicator

Error handling with toast notifications

Server health check

Admin Dashboard (AdminDashboard.jsx)
Statistics overview cards

Data tables with pagination

Status management controls

Search and filter functionality

Export capabilities

🔄 Workflow
Student applies → Admission form submission

Admin reviews → Application status update

Student pays fees → Receipt upload and verification

Admin verifies → Payment confirmation

Contact inquiries → Communication and response

🐛 Troubleshooting
Common Issues & Solutions
Issue	Solution
404 errors on API calls	Check API_BASE_URL for trailing slashes
MongoDB connection failed	Verify connection string and IP whitelist
File upload errors	Check Cloudinary credentials and file size limits
Admin login fails	Ensure default admin is created in database
CORS errors	Update CORS origin configuration in server.js
Development Commands
bash
# Backend
npm start          # Start server
npm run dev        # Start with nodemon (development)

# Frontend
npm start          # Start React app
npm run build      # Create production build
📞 Support & Contact
For technical support or inquiries:

Email: sitaramintercollege1205@gmail.com

Phone: +91 9756517750

Address: Sabdalpur Sharki, Mathana Road Hasanpur, Amroha 244242

📄 License
This project is developed for Sitaram Inter College. All rights reserved.

🎯 Project Status: Production Ready
🔒 Security Level: Enterprise Grade
📅 Last Updated: December 2025
👨‍💻 Developed By: SRIC IT Team

