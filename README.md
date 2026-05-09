# SRIC Learning Management System

A full-stack MERN-based LMS platform designed for **Sitaram Inter College (SRIC)**. This platform streamlines academic workflows, allowing students to enroll in courses, teachers to manage content, and admins to monitor the entire ecosystem with AI-driven insights.

Built using **React, Node.js, Express, MongoDB, JWT Authentication, and Cloudinary**.

---

## 🔗 Live Demo & Links

Recruiters love clickable links. Update these with your actual deployment URLs!

*   **Frontend:** [https://sric-lms.vercel.app](https://sric-lms.vercel.app)
*   **Backend API:** [https://sric-backend.render.com](https://sric-backend.render.com)
*   **GitHub Repo:** [https://github.com/ankitgithub12/Sitaram-Inter-College](https://github.com/ankitgithub12/Sitaram-Inter-College)

---

## 📸 Screenshots / UI Preview

| Home Page | Admin Dashboard |
| :--- | :--- |
| ![Home Page](https://via.placeholder.com/600x400?text=Home+Page+Preview) | ![Admin Dashboard](https://via.placeholder.com/600x400?text=Admin+Dashboard+Preview) |

| Authentication | Mobile View |
| :--- | :--- |
| ![Auth Page](https://via.placeholder.com/600x400?text=Authentication+Page) | ![Mobile View](https://via.placeholder.com/300x600?text=Mobile+Responsive+View) |

> [!TIP]
> Add your actual screenshots in the `client/public/screenshots` folder and update the links above!

---

## 🚀 Features

-   **JWT Authentication & Authorization:** Secure role-based access for Students, Teachers, and Admins.
-   **Separate Modules:** Dedicated interfaces and functionalities for different user roles.
-   **AI-Powered Chatbot:** Integrated AI assistant (via Hugging Face) for instant student support.
-   **Course Enrollment & Management:** Streamlined system for course handling and academic tracking.
-   **Assignment System:** Easy uploading and management of student assignments.
-   **Admin Dashboard:** Centralized control for admissions, fee verification, and site content.
-   **Cloudinary Integration:** Robust image and document handling for profiles and proofs.
-   **Real-Time Updates:** Live notifications using Socket.IO for administrative actions.
-   **Responsive Design:** Fully optimized for mobile, tablet, and desktop using Tailwind CSS.

---

## 🛠 Tech Stack

### Frontend
-   **React.js (Vite):** Core framework for a fast, modern UI.
-   **Tailwind CSS:** For sleek, utility-first styling.
-   **Framer Motion:** For smooth micro-animations and transitions.
-   **Lucide React:** Premium iconography.

### Backend
-   **Node.js & Express.js:** Scalable server-side architecture.
-   **Socket.IO:** Bi-directional real-time communication.

### Database
-   **MongoDB & Mongoose:** Flexible NoSQL database with schema validation.

### Authentication
-   **JWT (JSON Web Tokens):** Secure token-based authentication.
-   **bcryptjs:** Password hashing for data security.

### Deployment
-   **Render:** For backend hosting.
-   **Vercel:** For frontend hosting.

---

## 🏗 System Design / Architecture

-   **Decoupled Collection Model:** Separate MongoDB collections for Admins, Teachers, and Students to ensure data integrity and security.
-   **MVC Pattern:** Organized backend structure (Models, Views, Controllers) for maintainability.
-   **RESTful APIs:** Standardized communication between frontend and backend.
-   **Modular Components:** Reusable and scalable React components.

---

## ⚙️ Installation & Setup

### 1. Clone the Repository
```bash
git clone https://github.com/ankitgithub12/Sitaram-Inter-College.git
```

### 2. Install Dependencies
**For the Frontend:**
```bash
cd client
npm install
```

**For the Backend:**
```bash
cd ../server
npm install
```

### 3. Run the Project
**Start Backend:**
```bash
# Inside server folder
npm run dev
```

**Start Frontend:**
```bash
# Inside client folder
npm run dev
```

---

## 🔑 Environment Variables

Create a `.env` file in the `server` folder and add the following:

```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
HF_TOKEN=your_huggingface_token
```

---

## 🧠 Challenges Faced & Solutions

-   **Cross-Collection Auth:** Solved by implementing a custom authentication logic that validates users across multiple collections without compromising performance.
-   **Real-Time Data Flow:** Integrated Socket.IO to provide instant UI updates for administrative approvals and fee payments.
-   **Asset Optimization:** Utilized Cloudinary's dynamic transformation features to optimize images for different screen sizes.

---

## 🔮 Future Enhancements

-   [ ] **Real-time Chat:** Direct messaging between faculty and students.
-   [ ] **Video Lectures:** Integrated platform for hosting and viewing educational videos.
-   [ ] **Payment Gateway:** Integration with Razorpay or Stripe for automated fee collection.
-   [ ] **AI Recommendations:** personalized course suggestions based on student performance.

---

Built with ❤️ by **Ankit** for **Sitaram Inter College**.
