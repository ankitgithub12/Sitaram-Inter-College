require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const http = require('http');
const { Server } = require('socket.io');
const rateLimit = require('express-rate-limit');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: ['http://localhost:3000', 'http://localhost:5173', 'http://localhost:5174'],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    credentials: true
  }
});

// Attach socket.io to the request object so controllers can access it
app.use((req, res, next) => {
  req.io = io;
  next();
});

// Setup Socket.IO connection event
io.on('connection', (socket) => {
  console.log(`🔌 Client connected: ${socket.id}`);

  socket.on('disconnect', () => {
    console.log(`🔌 Client disconnected: ${socket.id}`);
  });
});

const PORT = process.env.PORT || 5000;

// ==================== CORS ====================
app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:5173', 'http://localhost:5174'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Accept']
}));

app.use((req, res, next) => {
  if (req.method === 'OPTIONS') {
    res.header('Access-Control-Allow-Origin', req.headers.origin || '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Accept');
    res.header('Access-Control-Allow-Credentials', 'true');
    res.status(200).end();
    return;
  }
  next();
});

// ==================== MIDDLEWARE ====================
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Global Rate Limiting
const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: 'Too many requests from this IP, please try again after 15 minutes' }
});

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // Limit each IP to 10 login requests per windowMs
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: 'Too many login attempts from this IP, please try again after 15 minutes' }
});

// Apply global limiter to all routes
app.use(globalLimiter);

if (fs.existsSync(path.join(__dirname, 'Public'))) {
  app.use(express.static(path.join(__dirname, 'Public')));
}

// ==================== CLOUDINARY ====================
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || 'your_cloud_name',
  api_key: process.env.CLOUDINARY_API_KEY || 'your_api_key',
  api_secret: process.env.CLOUDINARY_API_SECRET || 'your_api_secret'
});

// ==================== MONGODB ====================
const MONGODB_URI = process.env.MONGODB_URI || 'MongoDB_Connection_String';

mongoose.connect(MONGODB_URI)
  .then(() => console.log('✅ Connected to MongoDB Atlas successfully'))
  .catch(err => {
    console.log('❌ MongoDB connection error:', err.message);
    console.log('💡 Check your MongoDB Atlas connection string in .env');
  });

// ==================== MODELS & SEEDING ====================
// Import models (triggers schema registration)
const { Admin, Teacher, Student, Application, FeePayment, Contact, Attendance, Mark, Assignment } = require('./models');

// Sync indexes
Admin.syncIndexes().catch(err => console.error('❌ Error syncing Admin indexes:', err));
Teacher.syncIndexes().catch(err => console.error('❌ Error syncing Teacher indexes:', err));
Student.syncIndexes().catch(err => console.error('❌ Error syncing Student indexes:', err));
Attendance.syncIndexes().catch(err => console.error('❌ Error syncing Attendance indexes:', err));
Mark.syncIndexes().catch(err => console.error('❌ Error syncing Mark indexes:', err));
Assignment.syncIndexes().catch(err => console.error('❌ Error syncing Assignment indexes:', err));

// Seed default users
const seedUsers = async () => {
  try {
    const defaultAdmins = [
      { username: process.env.DEFAULT_ADMIN_USERNAME || 'admin_user', password: process.env.DEFAULT_ADMIN_PASSWORD || 'ChangeMe@123', role: 'admin', name: 'Administrator', email: 'admin@sric.edu.in' }
    ];
    
    const defaultTeachers = [
      { username: 'teacher1', password: process.env.DEFAULT_TEACHER_PASSWORD || 'ChangeMe@123', role: 'teacher', name: 'John Doe', email: 'teacher1@sric.edu.in' }
    ];
    
    const defaultStudents = [
      { username: 'student1', password: process.env.DEFAULT_STUDENT_PASSWORD || 'ChangeMe@123', role: 'student', name: 'Jane Smith', email: 'student1@sric.edu.in' }
    ];

    // Seed Admins
    for (const data of defaultAdmins) {
      const exists = await Admin.findOne({ username: data.username });
      if (!exists) await Admin.create(data);
    }
    
    // Seed Teachers
    for (const data of defaultTeachers) {
      const exists = await Teacher.findOne({ username: data.username });
      if (!exists) await Teacher.create(data);
    }
    
    // Seed Students
    for (const data of defaultStudents) {
      const exists = await Student.findOne({ username: data.username });
      if (!exists) await Student.create(data);
    }
    
    console.log('✅ Base users seeded successfully');
  } catch (err) {
    console.error('❌ Error seeding users:', err);
  }
};
seedUsers();

// ==================== CLOUDINARY UPLOAD MIDDLEWARE ====================
const cloudinaryStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'sric_admissions/fee_payments',
    allowed_formats: ['jpg', 'jpeg', 'png', 'gif', 'pdf', 'webp'],
    resource_type: 'auto',
    transformation: [{ width: 1000, height: 1000, crop: 'limit' }]
  }
});

const upload = multer({
  storage: cloudinaryStorage,
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowedMimes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif', 'application/pdf'];
    if (allowedMimes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Only images (JPEG, PNG, WebP, GIF) and PDF files are allowed'), false);
    }
  }
});

// ==================== ROUTE IMPORTS ====================
const admissionRouter = require('./routes/admission');
const contactsRouter = require('./routes/contacts');
const feePaymentsRouter = require('./routes/feePayments');
const chatbotRouter = require('./routes/chatbot');
const authRouter = require('./routes/auth');
const usersRouter = require('./routes/users');
const adminDashboardRouter = require('./routes/adminDashboard');
const marksRouter = require('./routes/marks');
const attendanceRouter = require('./routes/attendance');
const assignmentsRouter = require('./routes/assignments');
const galleryRouter = require('./routes/gallery');
const achievementsRouter = require('./routes/achievements');
const announcementsRouter = require('./routes/announcements');
const examSchedulesRouter = require('./routes/examSchedules');
const testimonialsRouter = require('./routes/testimonials');

// ==================== MOUNT ROUTES ====================

// Auth with strict rate limit for login
app.use('/api/login', loginLimiter);
app.use('/api', authRouter);

// Existing route files & their public fallback paths
app.use('/api/admissions', admissionRouter);
app.use('/api/admission', admissionRouter); // Mount for POST /api/admission
app.use('/api/contacts', contactsRouter);
app.use('/api/contact', contactsRouter); // Mount for POST /api/contact
app.use('/api/fee-payments', feePaymentsRouter);
app.use('/api/chatbot', chatbotRouter);

// New route files
app.use('/api/users', usersRouter);
app.use('/api/marks', marksRouter);
app.use('/api/attendance', attendanceRouter);
app.use('/api/assignments', assignmentsRouter);
app.use('/api/gallery', galleryRouter);
app.use('/api/achievements', achievementsRouter);
app.use('/api/announcements', announcementsRouter);
app.use('/api/examschedules', examSchedulesRouter);
app.use('/api/testimonials', testimonialsRouter);
app.use('/api', adminDashboardRouter);

// Test endpoint
app.get('/api/admission/test', (req, res) => {
  res.json({ success: true, message: 'Admission endpoint is working', endpoint: 'POST /api/admission' });
});

// ==================== ERROR HANDLERS ====================

app.use((req, res) => {
  res.status(404).json({ success: false, message: 'Endpoint not found', requested_url: req.originalUrl });
});

app.use((err, req, res, next) => {
  console.error('❌ Server error:', err);
  res.status(500).json({
    success: false,
    message: 'Internal server error',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// ==================== START SERVER ====================

server.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`📋 Health Check: http://localhost:${PORT}/api/health`);
  console.log(`📝 Admission API: http://localhost:${PORT}/api/admission`);
  console.log(`💰 Fee Payment API: http://localhost:${PORT}/api/fee-payments`);
  console.log(`📞 Contact API: http://localhost:${PORT}/api/contact`);
});

process.on('SIGTERM', () => {
  console.log('SIGTERM received: closing server');
  server.close(() => {
    mongoose.connection.close(false, () => {
      console.log('MongoDB connection closed');
      process.exit(0);
    });
  });
});
