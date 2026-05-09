# SRIC Academic & Administrative Management System

A production-grade MERN stack enterprise solution built for **Sitaram Inter College (SRIC)**. This platform streamlines school operations, digitizes administrative workflows, and enhances the academic experience through AI-driven interactions and real-time updates.

---

## 🚀 Project Overview

This project is a comprehensive school management ecosystem that replaces manual record-keeping with a modern, high-performance web architecture. It features a robust **Role-Based Access Control (RBAC)** system, separate database collections for data integrity, and a premium, responsive UI/UX tailored to the institution's branding.

### 🎯 Key Objectives
- **Data Integrity:** Production-level database architecture with decoupled collections.
*   **Administrative Efficiency:** Automated admission processing and fee verification.
*   **User Engagement:** Dynamic faculty profiles and an integrated AI assistant.
*   **Performance:** Real-time dashboards and optimized asset delivery via Cloudinary.

---

## ✨ Technical Highlights

### 🛡️ Advanced Database Architecture
Unlike standard "all-in-one" user tables, this project implements a **Decoupled Collection Model** using MongoDB & Mongoose:
- **`admins`**: Secure system administration.
- **`teachers`**: Comprehensive profiles with qualifications, experience, and department filtering.
- **`students`**: Academic records, roll numbers, and parent contact information.
- **Cross-Collection Authentication:** A custom universal login system that searches across collections while maintaining strict schema validation.

### 🤖 Intelligent Features
- **AI-Powered Chatbot:** Integrated with LLM providers (Moonshot AI via HuggingFace) to provide students with instant answers about fee structures, admissions, and school history.
- **Real-Time Synchronization:** Uses **Socket.IO** for live notification of fee payments and administrative updates.

### 🖼️ Cloud-Native Asset Management
- **Cloudinary Integration:** Seamless image and document handling for faculty photos and admission proofs.
- **Multer Middleware:** Server-side validation for file types and sizes before secure cloud transmission.

---

## 🛠️ Tech Stack

### Frontend
- **React (Vite):** High-speed development and optimized production builds.
- **Tailwind CSS:** Modern utility-first styling with custom animation extensions.
- **Lucide Icons:** Premium, consistent iconography.
- **Framer Motion:** Smooth micro-animations and entrance effects.

### Backend
- **Node.js & Express.js:** Scalable RESTful API architecture.
- **MongoDB & Mongoose:** Schema-based modeling for complex data relationships.
- **Socket.IO:** Bi-directional real-time communication.
- **JWT & bcryptjs:** Industry-standard secure authentication and password hashing.

---

## 📂 Project Structure

```text
├── client/                 # React frontend (Vite)
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── admin/          # Admin-specific modules
│   │   └── assets/         # Static styles and images
├── server/                 # Node.js backend
│   ├── models/             # Mongoose schemas (Decoupled Architecture)
│   ├── controllers/        # Business logic for APIs
│   ├── routes/             # API endpoint definitions
│   └── migrateUsers.js     # Data migration utility
└── README.md
```

---

## 🌟 Key Features

### 1. Administrative Dashboard
- **Admission Management:** Review, approve, or reject student applications with attached documentation.
- **Fee Verification:** Audit digital fee receipts uploaded by students.
- **Content Management:** Full CRUD control over Faculty, Achievements, Announcements, and Gallery.

### 2. Faculty Management
- **Dynamic Faculty Page:** Responsive grid with department-based filtering.
- **Detailed Profiles:** Interactive modals showcasing educator biographies, philosophies, and expertise.

### 3. Student/Teacher Interaction
- **Attendance System:** Teachers can record daily attendance with bulk update capabilities.
- **Academic Grading:** Secure marks entry and tracking for student performance reports.

---

## 🔧 Installation & Setup

### Prerequisites
- Node.js (v18+)
- MongoDB Atlas account
- Cloudinary credentials

### Step-by-Step Setup

1. **Clone & Install:**
   ```bash
   git clone https://github.com/ankitgithub12/Sitaram-Inter-College.git
   npm run install-all
   ```

2. **Environment Configuration:**
   Create a `.env` file in the `/server` directory:
   ```env
   PORT=5000
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret_key
   CLOUDINARY_CLOUD_NAME=your_cloud_name
   CLOUDINARY_API_KEY=your_api_key
   CLOUDINARY_API_SECRET=your_api_secret
   HF_TOKEN=your_huggingface_token
   ```

3. **Run Application:**
   ```bash
   npm run dev
   ```

---

## 🔐 Credentials & Security
For security reasons, default administrative credentials are not stored in this repository. Upon initial setup, the system automatically seeds base administrative accounts into the database. Please refer to the system initialization logs for setup details.

---

## 🤝 Contributing
Built with ❤️ for Sitaram Inter College. For any inquiries or feature requests, please contact the administration office.
