const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const bcrypt = require('bcryptjs');

const app = express();

// Use environment variable for port or default to 5000
const PORT = process.env.PORT || 5000;

// CORS Configuration - Allow React frontend
app.use(cors({
  origin: [
    'http://localhost:3000',
    'http://localhost:5173',
    'http://localhost:5174',
    'https://sric-fdq2.onrender.com'
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Accept']
}));

app.options('*', cors());

// Custom OPTIONS handler for preflight requests
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

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Serve static files from Public folder if exists
if (fs.existsSync(path.join(__dirname, 'Public'))) {
  app.use(express.static(path.join(__dirname, 'Public')));
}

// Cloudinary Configuration
require('dotenv').config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || 'your_cloud_name',
  api_key: process.env.CLOUDINARY_API_KEY || 'your_api_key',
  api_secret: process.env.CLOUDINARY_API_SECRET || 'your_api_secret'
});

const MONGODB_URI = process.env.MONGODB_URI || 'MongoDB_Connection_String';

// Connect to MongoDB
mongoose.connect(MONGODB_URI)
.then(() => {
  console.log('✅ Connected to MongoDB Atlas successfully');
  // Initialize default admin after successful connection
  initializeDefaultAdmin();
})
.catch(err => {
  console.log('❌ MongoDB connection error:', err.message);
  console.log('💡 Please check your MongoDB Atlas connection string in the .env file');
  console.log('💡 Make sure your IP is whitelisted in MongoDB Atlas');
});

// ==================== SCHEMA DEFINITIONS ====================

// Define Admin Schema
const adminSchema = new mongoose.Schema({
  username: { 
    type: String, 
    required: true, 
    unique: true,
    trim: true,
    lowercase: true
  },
  password: { 
    type: String, 
    required: true 
  },
  email: { 
    type: String, 
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  name: { 
    type: String, 
    required: true,
    trim: true
  },
  role: { 
    type: String, 
    enum: ['admin', 'superadmin', 'viewer'],
    default: 'admin'
  },
  isActive: { 
    type: Boolean, 
    default: true 
  },
  lastLogin: { 
    type: Date 
  },
  loginAttempts: { 
    type: Number, 
    default: 0 
  },
  lockUntil: { 
    type: Date 
  },
  createdAt: { 
    type: Date, 
    default: Date.now 
  },
  updatedAt: { 
    type: Date, 
    default: Date.now 
  }
});

// Update timestamp on save
adminSchema.pre('save', function (next) {
  this.updatedAt = new Date();
  next();
});

// Hash password before saving
adminSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Compare password method
adminSchema.methods.comparePassword = async function (candidatePassword) {
  try {
    return await bcrypt.compare(candidatePassword, this.password);
  } catch (error) {
    throw error;
  }
};

// Method to check if account is locked
adminSchema.methods.isLocked = function () {
  return this.lockUntil && this.lockUntil > Date.now();
};

// Define Admission Schema
const admissionSchema = new mongoose.Schema({
  // Student Information
  name: { type: String, required: [true, 'Name is required'] },
  dob: { type: Date, required: [true, 'Date of birth is required'] },
  motherTongue: { type: String, required: [true, 'Mother tongue is required'] },
  caste: { type: String, required: [true, 'Caste is required'] },
  religion: { type: String, required: [true, 'Religion is required'] },
  previousClass: { type: String, required: [true, 'Previous class is required'] },
  admissionClass: { type: String, required: [true, 'Admission class is required'] },
  previousSchool: { type: String, required: [true, 'Previous school is required'] },
  admissionDate: { type: Date, required: [true, 'Admission date is required'] },
  
  // Parent/Guardian Information
  fatherName: { type: String, required: [true, "Father's name is required"] },
  motherName: { type: String, required: [true, "Mother's name is required"] },
  fatherContact: { 
    type: String, 
    required: [true, "Father's contact is required"],
    validate: {
      validator: function(v) {
        return /^[0-9]{10}$/.test(v);
      },
      message: props => `${props.value} is not a valid phone number!`
    }
  },
  motherContact: { 
    type: String,
    validate: {
      validator: function(v) {
        if (!v) return true;
        return /^[0-9]{10}$/.test(v);
      },
      message: props => `${props.value} is not a valid phone number!`
    }
  },
  email: { 
    type: String, 
    required: [true, 'Email is required'],
    lowercase: true,
    trim: true
  },
  occupation: { type: String, required: [true, "Father's occupation is required"] },
  motherOccupation: { type: String },
  
  // Address Information
  address: { type: String, required: [true, 'Address is required'] },
  
  // Declaration
  declaration: { 
    type: Boolean, 
    required: [true, 'Declaration acceptance is required'],
    default: false 
  },
  
  // Status field
  status: { 
    type: String, 
    enum: ['pending', 'approved', 'rejected'], 
    default: 'pending' 
  },
  
  // Timestamps
  submittedAt: { type: Date, default: Date.now },
  
  // Additional fields
  studentId: { type: String },
  applicationNumber: { 
    type: String,
    unique: true,
    sparse: true
  },
  
  // Admin notes
  adminNotes: { type: String }
});

admissionSchema.pre('save', function () {
  if (!this.applicationNumber) {
    const prefix = 'SRIC';
    const year = new Date().getFullYear().toString().slice(-2);
    const random = Math.floor(10000 + Math.random() * 90000);
    this.applicationNumber = `${prefix}${year}${random}`;
  }
});

// Define Contact Schema
const contactSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { 
    type: String, 
    required: true,
    lowercase: true,
    trim: true
  },
  phone: { 
    type: String,
    validate: {
      validator: function(v) {
        if (!v) return true;
        return /^[0-9]{10}$/.test(v);
      },
      message: props => `${props.value} is not a valid phone number!`
    }
  },
  subject: { type: String, default: 'General Inquiry' },
  message: { type: String, required: true },
  
  // Status field
  status: { 
    type: String, 
    enum: ['unread', 'read', 'replied', 'archived'], 
    default: 'unread' 
  },
  
  // Admin fields
  adminNotes: { type: String },
  respondedBy: { type: String },
  responseMessage: { type: String },
  respondedAt: { type: Date },
  
  submittedAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Update timestamp on save
contactSchema.pre('save', function () {
  this.updatedAt = new Date();
});

// Define Fee Payment Schema
const feePaymentSchema = new mongoose.Schema({
  // Student Information
  studentName: { type: String, required: true },
  fatherName: { type: String, required: true },
  mobile: { 
    type: String, 
    required: true,
    validate: {
      validator: function(v) {
        return /^[0-9]{10}$/.test(v);
      },
      message: props => `${props.value} is not a valid phone number!`
    }
  },
  email: { 
    type: String, 
    required: true,
    lowercase: true,
    trim: true
  },
  className: { type: String, required: true },
  classId: { type: String },
  
  // Payment Information
  amount: { 
    type: Number, 
    required: true,
    min: [0, 'Amount cannot be negative']
  },
  paymentMethod: { type: String, required: true },
  transactionId: { type: String, required: true },
  
  // Receipt Information
  receiptNumber: { 
    type: String, 
    required: true,
    unique: true
  },
  receiptDate: { type: Date, required: true },
  
  // Cloudinary File Information
  cloudinaryFile: {
    public_id: { type: String },
    secure_url: { type: String },
    original_filename: { type: String },
    format: { type: String },
    resource_type: { type: String },
    bytes: { type: Number },
    width: { type: Number },
    height: { type: Number },
    created_at: { type: String }
  },
  
  // Old file format for backward compatibility
  receiptFile: {
    url: { type: String },
    originalName: { type: String },
    size: { type: Number }
  },
  
  // Status field
  status: { 
    type: String, 
    enum: ['pending', 'verified', 'rejected'], 
    default: 'pending' 
  },
  
  // Admin fields
  verifiedBy: { type: String },
  verificationNotes: { type: String },
  verifiedAt: { type: Date },
  
  // Timestamps
  submittedAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Update timestamp on save
feePaymentSchema.pre('save', function () {
  this.updatedAt = new Date();
});

// ==================== MODEL DEFINITIONS ====================

// Check if models already exist, if not create them
let Admin, Application, Contact, FeePayment;

if (mongoose.models.Admin) {
  Admin = mongoose.models.Admin;
} else {
  Admin = mongoose.model('Admin', adminSchema, 'admins');
}

if (mongoose.models.Application) {
  Application = mongoose.models.Application;
} else {
  Application = mongoose.model('Application', admissionSchema, 'applications');
}

if (mongoose.models.Contact) {
  Contact = mongoose.models.Contact;
} else {
  Contact = mongoose.model('Contact', contactSchema, 'contacts');
}

if (mongoose.models.FeePayment) {
  FeePayment = mongoose.models.FeePayment;
} else {
  FeePayment = mongoose.model('FeePayment', feePaymentSchema, 'feePayments');
}

const admissionRoutes = require('./routes/admission');
const contactRoutes = require('./routes/contacts');
const feePaymentRoutes = require('./routes/feePayments');

app.use('/api/admissions', admissionRoutes);
app.use('/api/contacts', contactRoutes);
app.use('/api/fee-payments', feePaymentRoutes);

// ==================== HELPER FUNCTIONS ====================

// Function to initialize default admin
async function initializeDefaultAdmin() {
  try {
    // Check if default admin exists
    const existingAdmin = await Admin.findOne({ username: '221205' });
    
    if (!existingAdmin) {
      // Create default admin with fixed credentials
      const defaultAdmin = new Admin({
        username: '221205',
        password: 'Sitaram@2002', // Will be hashed by the pre-save hook
        email: 'sitaramintercollege1205@gmail.com',
        name: 'SRIC Admin',
        role: 'superadmin',
        isActive: true
      });
      
      await defaultAdmin.save();
      console.log('✅ Default admin created successfully');
      console.log('🔑 Username: 221205');
      console.log('🔑 Password: Sitaram@2002');
      console.log('📧 Email: sitaramintercollege1205@gmail.com');
    } else {
      console.log('✅ Default admin already exists');
    }
  } catch (error) {
    console.error('❌ Error initializing default admin:', error.message);
  }
}

// ==================== CLOUDINARY CONFIGURATION ====================

// Configure Cloudinary storage for file uploads
const cloudinaryStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'sric_admissions/fee_payments',
    allowed_formats: ['jpg', 'jpeg', 'png', 'gif', 'pdf', 'webp'],
    resource_type: 'auto',
    transformation: [{ width: 1000, height: 1000, crop: 'limit' }]
  }
});

const upload = multer({ 
  storage: cloudinaryStorage,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB limit
  },
  fileFilter: function (req, file, cb) {
    // Check file type
    const allowedMimes = [
      'image/jpeg',
      'image/jpg',
      'image/png',
      'image/webp',
      'image/gif',
      'application/pdf'
    ];
    
    if (allowedMimes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Only images (JPEG, PNG, WebP, GIF) and PDF files are allowed'), false);
    }
  }
});

// ==================== API ROUTES ====================

// POST admission form
app.post('/api/admission', async (req, res) => {
  try {
    console.log('📨 Received admission form data');
    
    // Validate required fields
    const requiredFields = [
      'name', 'dob', 'motherTongue', 'caste', 'religion', 
      'previousClass', 'admissionClass', 'previousSchool', 'admissionDate',
      'fatherName', 'motherName', 'fatherContact', 'email', 
      'occupation', 'address', 'declaration'
    ];
    
    const missingFields = requiredFields.filter(field => !req.body[field]);
    
    if (missingFields.length > 0) {
      return res.status(400).json({
        success: false,
        message: `Missing required fields: ${missingFields.join(', ')}`
      });
    }
    
    // Parse dates and prepare data
    const admissionData = {
      name: req.body.name.trim(),
      dob: new Date(req.body.dob),
      motherTongue: req.body.motherTongue,
      caste: req.body.caste.trim(),
      religion: req.body.religion,
      previousClass: req.body.previousClass,
      admissionClass: req.body.admissionClass,
      previousSchool: req.body.previousSchool.trim(),
      admissionDate: new Date(req.body.admissionDate),
      fatherName: req.body.fatherName.trim(),
      motherName: req.body.motherName.trim(),
      fatherContact: req.body.fatherContact.replace(/\D/g, ''),
      motherContact: req.body.motherContact ? req.body.motherContact.replace(/\D/g, '') : '',
      email: req.body.email.toLowerCase().trim(),
      occupation: req.body.occupation.trim(),
      motherOccupation: req.body.motherOccupation ? req.body.motherOccupation.trim() : '',
      address: req.body.address.trim(),
      declaration: req.body.declaration === 'true' || req.body.declaration === true,
      submittedAt: new Date()
    };
    
    // Validate dates
    if (isNaN(admissionData.dob.getTime())) {
      return res.status(400).json({
        success: false,
        message: 'Invalid date of birth'
      });
    }
    
    if (isNaN(admissionData.admissionDate.getTime())) {
      return res.status(400).json({
        success: false,
        message: 'Invalid admission date'
      });
    }
    
    // Check if student is too young (less than 3 years)
    const age = new Date().getFullYear() - admissionData.dob.getFullYear();
    if (age < 3) {
      return res.status(400).json({
        success: false,
        message: 'Student must be at least 3 years old for admission'
      });
    }
    
    const newAdmission = new Application(admissionData);
    const savedAdmission = await newAdmission.save();
    
    console.log('✅ Data saved to MongoDB:', savedAdmission.applicationNumber);
    
    res.status(201).json({
      success: true,
      message: 'Admission form submitted successfully!',
      data: savedAdmission,
      applicationNumber: savedAdmission.applicationNumber
    });
  } catch (error) {
    console.error('❌ Error saving to MongoDB:', error);
    
    // Handle duplicate key error
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'Duplicate application detected. Please try again.',
        error: 'Duplicate entry'
      });
    }
    
    // Handle validation errors
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: messages
      });
    }
    
    // Handle cast errors
    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        message: 'Invalid data format',
        error: error.message
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Error submitting form',
      error: error.message
    });
  }
});

// POST contact form
app.post('/api/contact', async (req, res) => {
  try {
    console.log('📨 Received contact form data');
    
    // Validate required fields
    if (!req.body.name || !req.body.email || !req.body.message) {
      return res.status(400).json({
        success: false,
        message: 'Name, email, and message are required'
      });
    }
    
    const contactData = {
      name: req.body.name.trim(),
      email: req.body.email.toLowerCase().trim(),
      phone: req.body.phone ? req.body.phone.replace(/\D/g, '') : '',
      subject: req.body.subject || 'General Inquiry',
      message: req.body.message.trim(),
      submittedAt: new Date(),
      updatedAt: new Date()
    };
    
    const newContact = new Contact(contactData);
    const savedContact = await newContact.save();
    
    console.log('✅ Contact data saved to MongoDB:', savedContact._id);
    
    res.status(201).json({
      success: true,
      message: 'Contact form submitted successfully!',
      data: savedContact
    });
  } catch (error) {
    console.error('❌ Error saving contact to MongoDB:', error);
    
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: messages
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Error submitting contact form',
      error: error.message
    });
  }
});

// NOTE: Deprecated non-upload endpoint. Reject requests to prevent creating
// fee payments without an attached receipt. Use `/api/fee-payments/upload`.
app.post('/api/fee-payments', (req, res) => {
  console.warn('⚠️ Rejected call to deprecated POST /api/fee-payments — receipts are required');
  return res.status(410).json({
    success: false,
    message: 'This endpoint is deprecated. Use POST /api/fee-payments/upload with a receipt file (field name: receiptFile) to create fee payments.'
  });
});

app.post('/api/fee-payments/upload', upload.single('receiptFile'), async (req, res) => {
  try {
    console.log('📨 Received fee payment data with file upload')
    const paymentData = req.body;
      
    // Validate required fields
    const requiredFields = ['studentName', 'fatherName', 'mobile', 'email', 'className', 'amount', 'paymentMethod', 'transactionId', 'receiptNumber'];
    const missingFields = requiredFields.filter(field => !paymentData[field]);
    
    if (missingFields.length > 0) {
      return res.status(400).json({
        success: false,
        message: `Missing required fields: ${missingFields.join(', ')}`
      });
    }
    
    // Check if file was uploaded
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'Receipt file is required (form field: receiptFile)'
      });
    }
    
    // Check for duplicate receipt number
    const existingPayment = await FeePayment.findOne({ receiptNumber: paymentData.receiptNumber });
    if (existingPayment) {
      return res.status(400).json({
        success: false,
        message: 'This receipt number already exists. Please use a different receipt number.'
      });
    }
    
    // Normalize Cloudinary fields from multer-storage-cloudinary (be tolerant)
    const secureUrl = req.file?.secure_url || req.file?.url || req.file?.path || req.file?.filename || null;
    const publicId = req.file?.public_id || req.file?.publicId || req.file?.filename || null;

    // Prepare payment data
    const feePaymentData = {
      studentName: paymentData.studentName.trim(),
      fatherName: paymentData.fatherName.trim(),
      mobile: paymentData.mobile.replace(/\D/g, ''),
      email: paymentData.email.toLowerCase().trim(),
      className: paymentData.className,
      classId: paymentData.classId || '',
      amount: parseFloat(paymentData.amount),
      paymentMethod: paymentData.paymentMethod,
      transactionId: paymentData.transactionId.trim(),
      receiptNumber: paymentData.receiptNumber.trim(),
      receiptDate: new Date(paymentData.receiptDate || Date.now()),
      cloudinaryFile: {
        public_id: publicId,
        secure_url: secureUrl,
        original_filename: req.file.originalname || req.file?.original_filename || null,
        format: req.file.format || null,
        resource_type: req.file.resource_type || (req.file?.mimetype && req.file.mimetype.startsWith('image/') ? 'image' : 'raw'),
        bytes: req.file.size || req.file?.bytes || null,
        width: req.file.width || null,
        height: req.file.height || null,
        created_at: req.file.created_at || new Date().toISOString()
      },
      submittedAt: new Date(),
      updatedAt: new Date()
    };
    
    // Validate amount
    if (feePaymentData.amount <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Amount must be greater than 0'
      });
    }
    
    // Save to database
    const newFeePayment = new FeePayment(feePaymentData);
    const savedFeePayment = await newFeePayment.save();
    
    console.log('✅ Fee payment saved:', savedFeePayment.receiptNumber);
    
    res.status(201).json({
      success: true,
      message: 'Fee payment submitted successfully!',
      data: {
        id: savedFeePayment._id,
        receiptNumber: savedFeePayment.receiptNumber,
        studentName: savedFeePayment.studentName,
        className: savedFeePayment.className,
        amount: savedFeePayment.amount,
        date: savedFeePayment.receiptDate,
        status: savedFeePayment.status,
        receiptUrl: savedFeePayment.cloudinaryFile?.secure_url || null
      }
    });
    
  } catch (error) {
    console.error('❌ Error saving fee payment:', error);
    
    // Handle duplicate key error
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'Duplicate receipt number detected. Please try again with a different receipt number.'
      });
    }
    
    // Handle validation errors
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: messages
      });
    }
    
    // Handle file upload errors
    if (error instanceof multer.MulterError) {
      if (error.code === 'LIMIT_FILE_SIZE') {
        return res.status(400).json({
          success: false,
          message: 'File size exceeds 10MB limit'
        });
      }
      return res.status(400).json({
        success: false,
        message: 'File upload error: ' + error.message
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Server error while saving payment',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
});

// GET all admissions with pagination and filtering
app.get('/api/admissions', async (req, res) => {
  try {
    const { status, search, page = 1, limit = 20, sort = '-submittedAt' } = req.query;
    let query = {};
    
    if (status && status !== 'all') {
      query.status = status;
    }
    
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { applicationNumber: { $regex: search, $options: 'i' } },
        { fatherName: { $regex: search, $options: 'i' } },
        { fatherContact: { $regex: search, $options: 'i' } }
      ];
    }
    
    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;
    
    const [admissions, total] = await Promise.all([
      Application.find(query)
        .sort(sort)
        .skip(skip)
        .limit(limitNum)
        .lean(),
      Application.countDocuments(query)
    ]);
    
    res.json({
      success: true,
      count: admissions.length,
      total,
      pages: Math.ceil(total / limitNum),
      currentPage: pageNum,
      data: admissions
    });
  } catch (error) {
    console.error('❌ Error fetching admissions:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching admissions',
      error: error.message
    });
  }
});

// GET all fee payments
app.get('/api/fee-payments', async (req, res) => {
  try {
    const { status, search, page = 1, limit = 20 } = req.query;
    let query = {};
    
    if (status && status !== 'all') {
      query.status = status;
    }
    
    if (search) {
      query.$or = [
        { studentName: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { receiptNumber: { $regex: search, $options: 'i' } },
        { fatherName: { $regex: search, $options: 'i' } },
        { mobile: { $regex: search, $options: 'i' } }
      ];
    }
    
    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;
    
    const [feePayments, total] = await Promise.all([
      FeePayment.find(query)
        .sort({ submittedAt: -1 })
        .skip(skip)
        .limit(limitNum)
        .lean(),
      FeePayment.countDocuments(query)
    ]);
    
    res.json({
      success: true,
      count: feePayments.length,
      total,
      pages: Math.ceil(total / limitNum),
      currentPage: pageNum,
      data: feePayments
    });
  } catch (error) {
    console.error('❌ Error fetching fee payments:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching fee payments',
      error: error.message
    });
  }
});

// GET all contacts
app.get('/api/contacts', async (req, res) => {
  try {
    const { status, search, page = 1, limit = 20 } = req.query;
    let query = {};
    
    if (status && status !== 'all') {
      query.status = status;
    }
    
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { subject: { $regex: search, $options: 'i' } },
        { message: { $regex: search, $options: 'i' } }
      ];
    }
    
    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;
    
    const [contacts, total] = await Promise.all([
      Contact.find(query)
        .sort({ submittedAt: -1 })
        .skip(skip)
        .limit(limitNum)
        .lean(),
      Contact.countDocuments(query)
    ]);
    
    res.json({
      success: true,
      count: contacts.length,
      total,
      pages: Math.ceil(total / limitNum),
      currentPage: pageNum,
      data: contacts
    });
  } catch (error) {
    console.error('❌ Error fetching contacts:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching contacts',
      error: error.message
    });
  }
});

// UPDATE admission status
app.put('/api/admissions/:id/status', async (req, res) => {
  try {
    const { id } = req.params;
    const { status, adminNotes } = req.body;
    
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid admission ID'
      });
    }
    
    const validStatuses = ['pending', 'approved', 'rejected'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status'
      });
    }
    
    const updateData = { status };
    if (adminNotes) updateData.adminNotes = adminNotes;
    
    const updatedAdmission = await Application.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    );
    
    if (!updatedAdmission) {
      return res.status(404).json({
        success: false,
        message: 'Admission not found'
      });
    }
    
    res.json({
      success: true,
      message: `Admission ${status} successfully`,
      data: updatedAdmission
    });
  } catch (error) {
    console.error('❌ Error updating admission status:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating admission status',
      error: error.message
    });
  }
});

// UPDATE fee payment status
app.put('/api/fee-payments/:id/status', async (req, res) => {
  try {
    const { id } = req.params;
    const { status, verificationNotes } = req.body;
    
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid fee payment ID'
      });
    }
    
    const validStatuses = ['pending', 'verified', 'rejected'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status'
      });
    }
    
    const updateData = { status };
    if (verificationNotes) updateData.verificationNotes = verificationNotes;
    if (status === 'verified' || status === 'rejected') {
      updateData.verifiedAt = new Date();
      updateData.verifiedBy = req.user?.username || 'Admin';
    }
    
    const updatedPayment = await FeePayment.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    );
    
    if (!updatedPayment) {
      return res.status(404).json({
        success: false,
        message: 'Fee payment not found'
      });
    }
    
    res.json({
      success: true,
      message: `Fee payment ${status}`,
      data: updatedPayment
    });
  } catch (error) {
    console.error('❌ Error updating fee payment status:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating fee payment status',
      error: error.message
    });
  }
});

// UPDATE contact status
app.put('/api/contacts/:id/status', async (req, res) => {
  try {
    const { id } = req.params;
    const { status, adminNotes, responseMessage } = req.body;
    
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid contact ID'
      });
    }
    
    const validStatuses = ['unread', 'read', 'replied', 'archived'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status'
      });
    }
    
    const updateData = { 
      status,
      updatedAt: new Date()
    };
    if (adminNotes) updateData.adminNotes = adminNotes;
    if (responseMessage) updateData.responseMessage = responseMessage;
    if (status === 'replied') {
      updateData.respondedAt = new Date();
      updateData.respondedBy = req.user?.username || 'Admin';
    }
    
    const updatedContact = await Contact.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    );
    
    if (!updatedContact) {
      return res.status(404).json({
        success: false,
        message: 'Contact not found'
      });
    }
    
    res.json({
      success: true,
      message: `Contact marked as ${status}`,
      data: updatedContact
    });
  } catch (error) {
    console.error('❌ Error updating contact status:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating contact status',
      error: error.message
    });
  }
});

// DELETE admission
app.delete('/api/admissions/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid admission ID'
      });
    }
    
    const deletedAdmission = await Application.findByIdAndDelete(id);
    
    if (!deletedAdmission) {
      return res.status(404).json({
        success: false,
        message: 'Admission not found'
      });
    }
    
    res.json({
      success: true,
      message: 'Admission deleted successfully',
      data: { id: deletedAdmission._id }
    });
  } catch (error) {
    console.error('❌ Error deleting admission:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting admission',
      error: error.message
    });
  }
});

// DELETE fee payment
app.delete('/api/fee-payments/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid fee payment ID'
      });
    }
    
    // Find payment to get Cloudinary public_id
    const payment = await FeePayment.findById(id);
    
    if (!payment) {
      return res.status(404).json({
        success: false,
        message: 'Fee payment not found'
      });
    }
    
    // Delete from Cloudinary if exists
    if (payment.cloudinaryFile && payment.cloudinaryFile.public_id) {
      try {
        await cloudinary.uploader.destroy(payment.cloudinaryFile.public_id);
        console.log(`✅ Deleted Cloudinary file: ${payment.cloudinaryFile.public_id}`);
      } catch (cloudinaryError) {
        console.error('❌ Error deleting Cloudinary file:', cloudinaryError);
        // Continue with MongoDB deletion
      }
    }
    
    // Delete from MongoDB
    await FeePayment.findByIdAndDelete(id);
    
    res.json({
      success: true,
      message: 'Fee payment deleted successfully',
      data: { id: payment._id }
    });
  } catch (error) {
    console.error('❌ Error deleting fee payment:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting fee payment',
      error: error.message
    });
  }
});

// DELETE contact
app.delete('/api/contacts/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid contact ID'
      });
    }
    
    const deletedContact = await Contact.findByIdAndDelete(id);
    
    if (!deletedContact) {
      return res.status(404).json({
        success: false,
        message: 'Contact not found'
      });
    }
    
    res.json({
      success: true,
      message: 'Contact deleted successfully',
      data: { id: deletedContact._id }
    });
  } catch (error) {
    console.error('❌ Error deleting contact:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting contact',
      error: error.message
    });
  }
});

// GET admission by ID
app.get('/api/admissions/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid admission ID format'
      });
    }
    
    const admission = await Application.findById(id);
    
    if (!admission) {
      return res.status(404).json({
        success: false,
        message: 'Admission not found'
      });
    }
    
    res.json({
      success: true,
      data: admission
    });
  } catch (error) {
    console.error('❌ Error fetching admission:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching admission',
      error: error.message
    });
  }
});

// GET fee payment by ID
app.get('/api/fee-payments/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid fee payment ID format'
      });
    }
    
    const payment = await FeePayment.findById(id);
    
    if (!payment) {
      return res.status(404).json({
        success: false,
        message: 'Fee payment not found'
      });
    }
    
    res.json({
      success: true,
      data: payment
    });
  } catch (error) {
    console.error('❌ Error fetching fee payment:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching fee payment',
      error: error.message
    });
  }
});

// GET contact by ID
app.get('/api/contacts/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid contact ID format'
      });
    }
    
    const contact = await Contact.findById(id);
    
    if (!contact) {
      return res.status(404).json({
        success: false,
        message: 'Contact not found'
      });
    }
    
    res.json({
      success: true,
      data: contact
    });
  } catch (error) {
    console.error('❌ Error fetching contact:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching contact',
      error: error.message
    });
  }
});

// ==================== ADMIN AUTHENTICATION ROUTES ====================

// Admin login route
app.post('/api/admin/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    // Validate input
    if (!username || !password) {
      return res.status(400).json({
        success: false,
        message: 'Username and password are required'
      });
    }

    // Find admin by username
    const admin = await Admin.findOne({ 
      username: username.toLowerCase().trim(),
      isActive: true 
    });

    if (!admin) {
      console.warn(`⚠️ Failed login attempt for username: ${username}`);
      return res.status(401).json({
        success: false,
        message: 'Invalid username or password'
      });
    }

    // Check if account is locked
    if (admin.isLocked()) {
      return res.status(423).json({
        success: false,
        message: 'Account is locked. Please try again later.',
        lockedUntil: admin.lockUntil
      });
    }

    // Compare password
    const isPasswordValid = await admin.comparePassword(password);
    
    if (!isPasswordValid) {
      // Increment login attempts
      admin.loginAttempts += 1;
      
      // Lock account after 5 failed attempts for 15 minutes
      if (admin.loginAttempts >= 5) {
        admin.lockUntil = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes
      }
      
      await admin.save();
      
      console.warn(`⚠️ Failed password attempt for admin: ${username}`);
      return res.status(401).json({
        success: false,
        message: 'Invalid username or password',
        attemptsRemaining: 5 - admin.loginAttempts
      });
    }

    // Reset login attempts on successful login
    admin.loginAttempts = 0;
    admin.lockUntil = undefined;
    admin.lastLogin = new Date();
    await admin.save();

    // Generate token (for now, use simple token)
    const token = `admin_${admin._id}_${Date.now()}`;

    console.log(`✅ Admin logged in: ${username}`);

    res.json({
      success: true,
      token: token,
      message: 'Login successful',
      admin: {
        id: admin._id,
        username: admin.username,
        name: admin.name,
        email: admin.email,
        role: admin.role,
        lastLogin: admin.lastLogin
      }
    });
  } catch (error) {
    console.error('❌ Admin login error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during authentication'
    });
  }
});

// Middleware to check admin authentication
const authenticateAdmin = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Access token required'
      });
    }

    // Simple token validation (you can enhance this with JWT later)
    const tokenParts = token.split('_');
    if (tokenParts.length !== 3 || tokenParts[0] !== 'admin') {
      return res.status(401).json({
        success: false,
        message: 'Invalid token format'
      });
    }

    const adminId = tokenParts[1];
    
    // Find admin by ID
    const admin = await Admin.findById(adminId);
    
    if (!admin || !admin.isActive) {
      return res.status(401).json({
        success: false,
        message: 'Admin not found or inactive'
      });
    }

    // Attach admin info to request
    req.admin = {
      id: admin._id,
      username: admin.username,
      name: admin.name,
      email: admin.email,
      role: admin.role
    };
    
    next();
  } catch (error) {
    console.error('❌ Admin authentication error:', error);
    res.status(500).json({
      success: false,
      message: 'Authentication error'
    });
  }
};

// GET dashboard statistics
app.get('/api/admin/dashboard', authenticateAdmin, async (req, res) => {
  try {
    // Get counts
    const [
      totalAdmissions,
      pendingAdmissions,
      approvedAdmissions,
      rejectedAdmissions,
      totalFeePayments,
      pendingFeePayments,
      verifiedFeePayments,
      rejectedFeePayments,
      totalContacts,
      unreadContacts
    ] = await Promise.all([
      Application.countDocuments(),
      Application.countDocuments({ status: 'pending' }),
      Application.countDocuments({ status: 'approved' }),
      Application.countDocuments({ status: 'rejected' }),
      FeePayment.countDocuments(),
      FeePayment.countDocuments({ status: 'pending' }),
      FeePayment.countDocuments({ status: 'verified' }),
      FeePayment.countDocuments({ status: 'rejected' }),
      Contact.countDocuments(),
      Contact.countDocuments({ status: 'unread' })
    ]);

    // Get recent data
    const recentAdmissions = await Application.find()
      .sort({ submittedAt: -1 })
      .limit(5)
      .select('name email admissionClass status submittedAt applicationNumber')
      .lean();

    const recentFeePayments = await FeePayment.find()
      .sort({ submittedAt: -1 })
      .limit(5)
      .select('studentName className amount status receiptNumber submittedAt cloudinaryFile')
      .lean();

    const recentContacts = await Contact.find()
      .sort({ submittedAt: -1 })
      .limit(5)
      .select('name email subject status submittedAt')
      .lean();

    // Get status distributions
    const admissionsByStatus = await Application.aggregate([
      { $group: { _id: "$status", count: { $sum: 1 } } }
    ]);
    
    const paymentsByStatus = await FeePayment.aggregate([
      { $group: { _id: "$status", count: { $sum: 1 } } }
    ]);

    // Get monthly data for charts
    const now = new Date();
    const sixMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 5, 1);
    
    const monthlyAdmissions = await Application.aggregate([
      { $match: { submittedAt: { $gte: sixMonthsAgo } } },
      { $group: {
          _id: { 
            year: { $year: "$submittedAt" },
            month: { $month: "$submittedAt" }
          },
          count: { $sum: 1 }
        }
      },
      { $sort: { "_id.year": 1, "_id.month": 1 } }
    ]);

    // Calculate total verified amount
    const totalVerifiedAmount = await FeePayment.aggregate([
      { $match: { status: 'verified' } },
      { $group: { _id: null, total: { $sum: '$amount' } } }
    ]);

    res.json({
      success: true,
      data: {
        counts: {
          admissions: totalAdmissions,
          pendingAdmissions,
          approvedAdmissions,
          rejectedAdmissions,
          feePayments: totalFeePayments,
          pendingFeePayments,
          verifiedFeePayments,
          rejectedFeePayments,
          contacts: totalContacts,
          unreadContacts
        },
        amounts: {
          totalVerified: totalVerifiedAmount[0]?.total || 0
        },
        recentAdmissions,
        recentFeePayments,
        recentContacts,
        admissionsByStatus,
        paymentsByStatus,
        monthlyAdmissions
      }
    });
  } catch (error) {
    console.error('❌ Error fetching dashboard stats:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching dashboard statistics',
      error: error.message
    });
  }
});

// GET dashboard overview
app.get('/api/dashboard/stats', async (req, res) => {
  try {
    const [
      totalAdmissions,
      pendingAdmissions,
      approvedAdmissions,
      totalFeePayments,
      pendingFeePayments,
      verifiedFeePayments,
      totalContacts,
      unreadContacts
    ] = await Promise.all([
      Application.countDocuments(),
      Application.countDocuments({ status: 'pending' }),
      Application.countDocuments({ status: 'approved' }),
      FeePayment.countDocuments(),
      FeePayment.countDocuments({ status: 'pending' }),
      FeePayment.countDocuments({ status: 'verified' }),
      Contact.countDocuments(),
      Contact.countDocuments({ status: 'unread' })
    ]);

    res.json({
      success: true,
      data: {
        counts: {
          admissions: totalAdmissions,
          pendingAdmissions,
          approvedAdmissions,
          feePayments: totalFeePayments,
          pendingFeePayments,
          verifiedFeePayments,
          contacts: totalContacts,
          unreadContacts
        }
      }
    });
  } catch (error) {
    console.error('❌ Error fetching dashboard overview:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching dashboard overview',
      error: error.message
    });
  }
});

// Admin logout route
app.post('/api/admin/logout', (req, res) => {
  res.json({
    success: true,
    message: 'Logged out successfully'
  });
});

// Get admin profile
app.get('/api/admin/profile', authenticateAdmin, async (req, res) => {
  try {
    const admin = await Admin.findById(req.admin.id).select('-password -loginAttempts -lockUntil');
    
    if (!admin) {
      return res.status(404).json({
        success: false,
        message: 'Admin not found'
      });
    }

    res.json({
      success: true,
      data: admin
    });
  } catch (error) {
    console.error('❌ Error fetching admin profile:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching profile'
    });
  }
});

// ==================== ADDITIONAL ROUTES ====================

// Cloudinary test endpoint
app.get('/api/cloudinary/test', async (req, res) => {
  try {
    const result = await cloudinary.api.resources({
      type: 'upload',
      max_results: 1
    });
    
    res.json({
      success: true,
      message: 'Cloudinary connected successfully',
      cloud_name: cloudinary.config().cloud_name,
      resource_count: result.total_count
    });
  } catch (error) {
    console.error('❌ Cloudinary test error:', error);
    res.status(500).json({
      success: false,
      message: 'Cloudinary connection failed',
      error: error.message
    });
  }
});

// Route to check if server is running
app.get('/api/health', (req, res) => {
  const dbStatus = mongoose.connection.readyState === 1 ? 'connected' : 'disconnected';
  
  res.json({ 
    success: true, 
    message: 'Server is running!',
    database: dbStatus,
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// Test admission endpoint
app.get('/api/admission/test', (req, res) => {
  res.json({
    success: true,
    message: 'Admission endpoint is working',
    endpoint: 'POST /api/admission',
    required_fields: [
      'name', 'dob', 'motherTongue', 'caste', 'religion',
      'previousClass', 'admissionClass', 'previousSchool', 'admissionDate',
      'fatherName', 'motherName', 'fatherContact', 'email',
      'occupation', 'address', 'declaration'
    ]
  });
});

// Basic routes for React app compatibility
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'SRIC Admissions API Server',
    endpoints: {
      admission: '/api/admission',
      contact: '/api/contact',
      feePayments: '/api/fee-payments',
      admissions: '/api/admissions',
      contacts: '/api/contacts',
      adminLogin: '/api/admin/login',
      adminDashboard: '/api/admin/dashboard',
      health: '/api/health'
    }
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Endpoint not found',
    requested_url: req.originalUrl
  });
});

// Error handler
app.use((err, req, res, next) => {
  console.error('❌ Server error:', err);
  res.status(500).json({
    success: false,
    message: 'Internal server error',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// Start server
const server = app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`📋 API Health Check: http://localhost:${PORT}/api/health`);
  console.log(`📝 Admission Form API: http://localhost:${PORT}/api/admission`);
  console.log(`💰 Fee Payment API: http://localhost:${PORT}/api/fee-payments`);
  console.log(`📞 Contact API: http://localhost:${PORT}/api/contact`);
  console.log(`👑 Admin Login: http://localhost:${PORT}/api/admin/login`);
  console.log(`✅ MongoDB: ${mongoose.connection.readyState === 1 ? 'Connected' : 'Disconnected'}`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM signal received: closing HTTP server');
  server.close(() => {
    console.log('HTTP server closed');
    mongoose.connection.close(false, () => {
      console.log('MongoDB connection closed');
      process.exit(0);
    });
  });
});
