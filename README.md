# Sitaram Inter College (SRIC) Web Application

A comprehensive MERN stack web application built for Sitaram Inter College to manage school operations, admissions, academics, and student/teacher interactions.

## 🚀 Tech Stack

**Frontend:**
- React (Vite)
- Tailwind CSS
- React Router DOM
- Axios

**Backend:**
- Node.js & Express.js
- MongoDB & Mongoose (Database)
- Socket.IO (Real-time features like Chatbot)
- Cloudinary & Multer (File uploads)
- Express Rate Limit (Security)
- JSON Web Token (Authentication)
- bcryptjs (Password Hashing)

## ✨ Key Features

- **Responsive Landing Page:** Beautiful, modern, and SEO-optimized website showcasing the school's history, curriculum, faculty, and achievements.
- **Role-Based Access Control (RBAC):** Dedicated portals for Admins, Teachers, and Students.
- **Admin Dashboard:** Centralized control panel to manage admissions, fee payments, users, announcements, and school gallery.
- **Student Dashboard:** Access to attendance, academic marks, fee status, and assignments.
- **Teacher Dashboard:** Interface for marking attendance, grading students, and uploading assignments.
- **Online Admission System:** Fully digital admission forms with Cloudinary integration for document uploads.
- **Security:** Protected routes, rate limiting for DDoS/brute-force protection, and secure password hashing.

## 🛠️ Installation & Setup

### Prerequisites
- Node.js (v18 or higher)
- MongoDB Atlas Account (or local MongoDB)
- Cloudinary Account (for image/document storage)

### 1. Clone the repository
```bash
git clone https://github.com/ankitgithub12/Sitaram-Inter-College.git
cd Sitaram-Inter-College
```

### 2. Backend Setup
```bash
cd server
npm install
```
Create a `.env` file in the `server` directory and configure the following variables:
```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key

# Cloudinary Setup
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```
Run the backend:
```bash
npm run dev
```

### 3. Frontend Setup
```bash
cd client
npm install
```
Create a `.env` file in the `client` directory:
```env
VITE_API_URL=http://localhost:5000
```
Run the frontend:
```bash
npm run dev
```

## 🔒 Default Credentials

When the server first runs, it automatically seeds default users into the database. You can log in via `/admin-login` (Admin) or the standard login portals for students/teachers.

- **Admin:** `username`: `221205` / `password`: `Sitaram@2002`
- **Teacher:** `username`: `teacher1` / `password`: `Teacher@2024`
- **Student:** `username`: `student1` / `password`: `Student@2024`

*(Make sure to change these in production)*

## 🌐 Deployment

### AWS / VPS Deployment
1. Provision an EC2 instance (Ubuntu).
2. Install Node.js, Nginx, and PM2.
3. Configure PM2 to run the backend server (`pm2 start server.js`).
4. Build the frontend (`npm run build`) and serve the `dist` folder using Nginx.
5. Secure your Nginx server using Let's Encrypt SSL.

## 🤝 Contributing
Contributions, issues, and feature requests are welcome!

## 📝 License
This project is proprietary and built specifically for Sitaram Inter College. All rights reserved.
