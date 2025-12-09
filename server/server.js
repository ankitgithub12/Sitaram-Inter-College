
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');
const http = require('http');
const multer = require('multer');
const fs = require('fs');

const app = express();

// Use environment variable for port or default to 5000
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Serve static files from Public folder
app.use(express.static(path.join(__dirname, 'Public')));

// MongoDB Connection - Use your actual connection string from .env
require('dotenv').config();
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://SRIC:SRIC221205@cluster.fmt0jf7.mongodb.net/sric_admissions?retryWrites=true&w=majority&appName=Cluster';

// Connect to MongoDB
mongoose.connect(MONGODB_URI)
.then(() => console.log('✅ Connected to MongoDB Atlas successfully'))
.catch(err => {
  console.log('❌ MongoDB connection error:', err.message);
  console.log('💡 Please check your MongoDB Atlas connection string in the .env file');
  console.log('💡 Make sure your IP is whitelisted in MongoDB Atlas');
});

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = 'uploads/receipts/';
    // Create directory if it doesn't exist
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    // Create a unique filename with timestamp
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'receipt-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  },
  fileFilter: function (req, file, cb) {
    // Check file type
    if (file.mimetype.startsWith('image/') || file.mimetype === 'application/pdf') {
      cb(null, true);
    } else {
      cb(new Error('Only images and PDF files are allowed'), false);
    }
  }
});

// Define Admission Schema
const admissionSchema = new mongoose.Schema({
  // Student Information
  name: { type: String, required: true },
  dob: { type: Date, required: true },
  motherTongue: { type: String, required: true },
  caste: { type: String, required: true },
  religion: { type: String, required: true },
  previousClass: { type: String, required: true },
  admissionClass: { type: String, required: true },
  previousSchool: { type: String, required: true },
  admissionDate: { type: Date, required: true },
  
  // Parent/Guardian Information
  fatherName: { type: String, required: true },
  motherName: { type: String, required: true },
  fatherContact: { type: String, required: true },
  motherContact: { type: String },
  email: { type: String, required: true },
  occupation: { type: String, required: true },
  motherOccupation: { type: String },
  
  // Address Information
  address: { type: String, required: true },
  
  // Declaration
  declaration: { type: Boolean, required: true },
  
  // Status field
  status: { 
    type: String, 
    enum: ['pending', 'approved', 'rejected'], 
    default: 'pending' 
  },
  
  // Timestamps
  submittedAt: { type: Date, default: Date.now },
  
  // Additional fields for better management
  studentId: { type: String },
  applicationNumber: { 
    type: String,
    unique: true
  }
});

// Generate application number before saving
admissionSchema.pre('save', function(next) {
  if (!this.applicationNumber) {
    const prefix = 'SRIC';
    const year = new Date().getFullYear().toString().slice(-2);
    const random = Math.floor(10000 + Math.random() * 90000);
    this.applicationNumber = `${prefix}${year}${random}`;
  }
  next();
});

const Admission = mongoose.model('Application', admissionSchema, 'applications');

// Define Contact Schema
const contactSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String },
  subject: { type: String },
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

contactSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

const Contact = mongoose.model('Contact', contactSchema, 'contacts');

// Define Fee Payment Schema
const feePaymentSchema = new mongoose.Schema({
  // Student Information
  studentName: { type: String, required: true },
  fatherName: { type: String, required: true },
  mobile: { type: String, required: true },
  email: { type: String, required: true },
  className: { type: String, required: true },
  classId: { type: String },
  
  // Payment Information
  amount: { type: Number, required: true },
  paymentMethod: { type: String, required: true },
  transactionId: { type: String, required: true },
  
  // Receipt Information
  receiptNumber: { 
    type: String, 
    required: true,
    unique: true
  },
  receiptDate: { type: Date, required: true },
  
  // File Information
  receiptFile: {
    originalName: { type: String },
    storageName: { type: String },
    mimeType: { type: String },
    size: { type: Number },
    path: { type: String },
    url: { type: String }
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

feePaymentSchema.pre('save', function(next) {
  if (this.receiptFile && this.receiptFile.path) {
    this.receiptFile.url = `/uploads/receipts/${this.receiptFile.storageName}`;
  }
  this.updatedAt = new Date();
  next();
});

const FeePayment = mongoose.model('FeePayment', feePaymentSchema, 'feePayments');

// API Routes
app.post('/api/admission', async (req, res) => {
  try {
    console.log('Received form data:', req.body);
    
    // Parse dates
    if (req.body.dob) req.body.dob = new Date(req.body.dob);
    if (req.body.admissionDate) req.body.admissionDate = new Date(req.body.admissionDate);
    
    const newAdmission = new Admission(req.body);
    const savedAdmission = await newAdmission.save();
    
    console.log('Data saved to MongoDB:', savedAdmission);
    
    res.status(201).json({
      success: true,
      message: 'Admission form submitted successfully!',
      data: savedAdmission
    });
  } catch (error) {
    console.error('Error saving to MongoDB:', error);
    res.status(400).json({
      success: false,
      message: 'Error submitting form',
      error: error.message
    });
  }
});

// API Route for Contact Form
app.post('/api/contact', async (req, res) => {
  try {
    console.log('Received contact form data:', req.body);
    
    const newContact = new Contact(req.body);
    const savedContact = await newContact.save();
    
    console.log('Contact data saved to MongoDB:', savedContact);
    
    res.status(201).json({
      success: true,
      message: 'Contact form submitted successfully!',
      data: savedContact
    });
  } catch (error) {
    console.error('Error saving contact to MongoDB:', error);
    res.status(400).json({
      success: false,
      message: 'Error submitting contact form',
      error: error.message
    });
  }
});

// API Route for Fee Payment Submission with file upload
app.post('/api/fee-payment', upload.single('receipt'), async (req, res) => {
  try {
    console.log('Received fee payment submission');
    
    // Check if payment data exists
    if (!req.body.paymentData) {
      return res.status(400).json({
        success: false,
        message: 'Payment data is required'
      });
    }
    
    let paymentData;
    try {
      paymentData = JSON.parse(req.body.paymentData);
    } catch (parseError) {
      console.error('Error parsing payment data:', parseError);
      return res.status(400).json({
        success: false,
        message: 'Invalid payment data format'
      });
    }
    
    // Basic validation
    const requiredFields = ['studentName', 'fatherName', 'mobile', 'email', 'className', 'amount', 'paymentMethod', 'transactionId', 'receiptNumber'];
    const missingFields = requiredFields.filter(field => !paymentData[field]);
    
    if (missingFields.length > 0) {
      return res.status(400).json({
        success: false,
        message: `Missing required fields: ${missingFields.join(', ')}`
      });
    }
    
    // Check for duplicate receipt number
    const existingPayment = await FeePayment.findOne({ receiptNumber: paymentData.receiptNumber });
    if (existingPayment) {
      return res.status(400).json({
        success: false,
        message: 'This receipt number already exists. Please try again.'
      });
    }
    
    // Add file information if uploaded
    if (req.file) {
      paymentData.receiptFile = {
        originalName: req.file.originalname,
        storageName: req.file.filename,
        mimeType: req.file.mimetype,
        size: req.file.size,
        path: req.file.path,
        url: `/uploads/receipts/${req.file.filename}`
      };
    }
    
    // Ensure receiptDate is properly formatted
    if (!paymentData.receiptDate || isNaN(new Date(paymentData.receiptDate))) {
      paymentData.receiptDate = new Date();
    } else {
      paymentData.receiptDate = new Date(paymentData.receiptDate);
    }
    
    // Create and save payment record
    const newFeePayment = new FeePayment(paymentData);
    const savedFeePayment = await newFeePayment.save();
    
    console.log(`✅ Fee payment saved: ${savedFeePayment.receiptNumber} for ${savedFeePayment.studentName}`);
    console.log(`   Amount: ₹${savedFeePayment.amount}, Class: ${savedFeePayment.className}`);
    
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
        receiptUrl: savedFeePayment.receiptFile?.url
      }
    });
    
  } catch (error) {
    console.error('❌ Error saving fee payment:', error);
    
    // Handle duplicate key error
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'Duplicate receipt detected. Please refresh and try again.'
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
          message: 'File size exceeds 5MB limit'
        });
      }
      return res.status(400).json({
        success: false,
        message: 'File upload error'
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Server error while saving payment',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// API to update admission status
app.put('/api/admissions/:id/status', async (req, res) => {
  try {
    const { id } = req.params;
    const { status, adminNotes } = req.body;
    
    const validStatuses = ['pending', 'approved', 'rejected'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status'
      });
    }
    
    const updateData = { status };
    if (adminNotes) updateData.adminNotes = adminNotes;
    
    const updatedAdmission = await Admission.findByIdAndUpdate(
      id,
      updateData,
      { new: true }
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
    console.error('Error updating admission status:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating admission status',
      error: error.message
    });
  }
});

// API to update contact status
app.put('/api/contacts/:id/status', async (req, res) => {
  try {
    const { id } = req.params;
    const { status, adminNotes, responseMessage } = req.body;
    
    const validStatuses = ['unread', 'read', 'replied', 'archived'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status'
      });
    }
    
    const updateData = { status };
    if (adminNotes) updateData.adminNotes = adminNotes;
    if (responseMessage) updateData.responseMessage = responseMessage;
    if (status === 'replied') {
      updateData.respondedAt = new Date();
      updateData.respondedBy = 'Admin';
    }
    
    const updatedContact = await Contact.findByIdAndUpdate(
      id,
      updateData,
      { new: true }
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
    console.error('Error updating contact status:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating contact status',
      error: error.message
    });
  }
});

// API to update fee payment status
app.put('/api/fee-payments/:id/status', async (req, res) => {
  try {
    const { id } = req.params;
    const { status, verificationNotes } = req.body;
    
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
      updateData.verifiedBy = 'Admin';
    }
    
    const updatedFeePayment = await FeePayment.findByIdAndUpdate(
      id,
      updateData,
      { new: true }
    );
    
    if (!updatedFeePayment) {
      return res.status(404).json({
        success: false,
        message: 'Fee payment not found'
      });
    }
    
    res.json({
      success: true,
      message: `Fee payment ${status}`,
      data: updatedFeePayment
    });
  } catch (error) {
    console.error('Error updating fee payment status:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating fee payment status',
      error: error.message
    });
  }
});

// API to delete admission
app.delete('/api/admissions/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const deletedAdmission = await Admission.findByIdAndDelete(id);
    
    if (!deletedAdmission) {
      return res.status(404).json({
        success: false,
        message: 'Admission not found'
      });
    }
    
    res.json({
      success: true,
      message: 'Admission deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting admission:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting admission',
      error: error.message
    });
  }
});

// API to delete contact
app.delete('/api/contacts/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const deletedContact = await Contact.findByIdAndDelete(id);
    
    if (!deletedContact) {
      return res.status(404).json({
        success: false,
        message: 'Contact not found'
      });
    }
    
    res.json({
      success: true,
      message: 'Contact deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting contact:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting contact',
      error: error.message
    });
  }
});

// API to delete fee payment
app.delete('/api/fee-payments/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const deletedFeePayment = await FeePayment.findByIdAndDelete(id);
    
    if (!deletedFeePayment) {
      return res.status(404).json({
        success: false,
        message: 'Fee payment not found'
      });
    }
    
    res.json({
      success: true,
      message: 'Fee payment deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting fee payment:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting fee payment',
      error: error.message
    });
  }
});

// API Routes for Admin Dashboard
app.get('/api/admissions', async (req, res) => {
  try {
    const { status, search } = req.query;
    let query = {};
    
    if (status && status !== 'all') {
      query.status = status;
    }
    
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { applicationNumber: { $regex: search, $options: 'i' } },
        { fatherName: { $regex: search, $options: 'i' } }
      ];
    }
    
    const admissions = await Admission.find(query).sort({ submittedAt: -1 });
    res.json({
      success: true,
      count: admissions.length,
      data: admissions
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching admissions',
      error: error.message
    });
  }
});

// API to get admission by ID
app.get('/api/admissions/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    // Validate ID format
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid admission ID format'
      });
    }
    
    const admission = await Admission.findById(id);
    
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
    console.error('Error fetching admission:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching admission',
      error: error.message
    });
  }
});

// API to get dashboard statistics
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
      Admission.countDocuments(),
      Admission.countDocuments({ status: 'pending' }),
      Admission.countDocuments({ status: 'approved' }),
      FeePayment.countDocuments(),
      FeePayment.countDocuments({ status: 'pending' }),
      FeePayment.countDocuments({ status: 'verified' }),
      Contact.countDocuments(),
      Contact.countDocuments({ status: 'unread' })
    ]);

    // Get recent data
    const recentAdmissions = await Admission.find()
      .sort({ submittedAt: -1 })
      .limit(5)
      .select('name email admissionClass status submittedAt');

    const recentFeePayments = await FeePayment.find()
      .sort({ submittedAt: -1 })
      .limit(5)
      .select('studentName className amount status receiptNumber submittedAt');

    const recentContacts = await Contact.find()
      .sort({ submittedAt: -1 })
      .limit(5)
      .select('name email subject status submittedAt');

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
        },
        recent: {
          admissions: recentAdmissions,
          feePayments: recentFeePayments,
          contacts: recentContacts
        }
      }
    });
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching dashboard statistics',
      error: error.message
    });
  }
});

app.get('/api/fee-payments', async (req, res) => {
  try {
    const { status, search } = req.query;
    let query = {};
    
    if (status && status !== 'all') {
      query.status = status;
    }
    
    if (search) {
      query.$or = [
        { studentName: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { receiptNumber: { $regex: search, $options: 'i' } },
        { fatherName: { $regex: search, $options: 'i' } }
      ];
    }
    
    const feePayments = await FeePayment.find(query).sort({ submittedAt: -1 });
    res.json({
      success: true,
      count: feePayments.length,
      data: feePayments
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching fee payments',
      error: error.message
    });
  }
});

// New API to get fee payment by receipt number
app.get('/api/fee-payments/receipt/:receiptNumber', async (req, res) => {
  try {
    const { receiptNumber } = req.params;
    const payment = await FeePayment.findOne({ receiptNumber });
    
    if (!payment) {
      return res.status(404).json({
        success: false,
        message: 'Receipt not found'
      });
    }
    
    res.json({
      success: true,
      data: payment
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching receipt',
      error: error.message
    });
  }
});

// New API to get fee payments by email
app.get('/api/fee-payments/email/:email', async (req, res) => {
  try {
    const { email } = req.params;
    const payments = await FeePayment.find({ email }).sort({ submittedAt: -1 });
    
    res.json({
      success: true,
      count: payments.length,
      data: payments
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching payments by email',
      error: error.message
    });
  }
});

app.get('/api/contacts', async (req, res) => {
  try {
    const { status, search } = req.query;
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
    
    const contacts = await Contact.find(query).sort({ submittedAt: -1 });
    res.json({
      success: true,
      count: contacts.length,
      data: contacts
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching contacts',
      error: error.message
    });
  }
});

// Admin authentication route
app.post('/api/admin/login', (req, res) => {
  const { username, password } = req.body;

  // Simple authentication (use hashed passwords + DB in production)
  if (username === '221205' && password === 'Sitaram@2002') {
    res.json({
      success: true,
      token: 'adminToken123', // static token for now
      message: 'Login successful'
    });
  } else {
    res.status(401).json({
      success: false,
      message: 'Invalid username or password'
    });
  }
});

// Middleware to check admin authentication
const authenticateAdmin = (req, res, next) => {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(' ')[1];
  
  if (!token || token !== 'adminToken123') {
    return res.status(401).json({
      success: false,
      message: 'Unauthorized access'
    });
  }
  
  next();
};

// Protected admin API routes
app.get('/api/admin/dashboard', authenticateAdmin, async (req, res) => {
  try {
    // Get counts
    const admissionsCount = await Admission.countDocuments();
    const feePaymentsCount = await FeePayment.countDocuments();
    const contactsCount = await Contact.countDocuments();
    
    // Get recent data
    const recentAdmissions = await Admission.find()
      .sort({ submittedAt: -1 })
      .limit(10)
      .lean();
    
    const recentFeePayments = await FeePayment.find()
      .sort({ submittedAt: -1 })
      .limit(10)
      .lean();
    
    // Get status counts
    const admissionsByStatus = await Admission.aggregate([
      { $group: { _id: "$status", count: { $sum: 1 } } }
    ]);
    
    const paymentsByStatus = await FeePayment.aggregate([
      { $group: { _id: "$status", count: { $sum: 1 } } }
    ]);
    
    // Get monthly data for charts
    const now = new Date();
    const sixMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 5, 1);
    
    const monthlyAdmissions = await Admission.aggregate([
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
    
    res.json({
      success: true,
      data: {
        counts: {
          admissions: admissionsCount,
          feePayments: feePaymentsCount,
          contacts: contactsCount
        },
        recentAdmissions,
        recentFeePayments,
        admissionsByStatus,
        paymentsByStatus,
        monthlyAdmissions
      }
    });
  } catch (error) {
    console.error('Error fetching dashboard data:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching dashboard data',
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
  });
});

// Route to serve the main page
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'Public', 'index.html'));
});

// Route to serve admin login page
app.get('/admin-login.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'Public', 'admin-login.html'));
});

// FIXED: Route to serve admin dashboard - Only serve the file, no redirect logic
app.get('/admin.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'Public', 'admin.html'));
});

// Serve uploaded files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Function to find available port
const findAvailablePort = (desiredPort) => {
  return new Promise((resolve, reject) => {
    const server = http.createServer();
    server.listen(desiredPort, () => {
      const port = server.address().port;
      server.close(() => resolve(port));
    });
    server.on('error', (err) => {
      if (err.code === 'EADDRINUSE') {
        // Port is in use, try the next one
        findAvailablePort(desiredPort + 1).then(resolve);
      } else {
        reject(err);
      }
    });
  });
};

// Start server on available port
findAvailablePort(PORT).then(actualPort => {
  app.listen(actualPort, () => {
    console.log(`🚀 Server running on http://localhost:${actualPort}`);
    console.log(`📋 API Health Check: http://localhost:${actualPort}/api/health`);
    console.log(`📝 Admission Form: http://localhost:${actualPort}/admission_form.html`);
    console.log(`💰 Fee Payment API: http://localhost:${actualPort}/api/fee-payment`);
    console.log(`🔐 Admin Login: http://localhost:${actualPort}/admin-login.html`);
    console.log(`🏠 Home Page: http://localhost:${actualPort}`);
    
    // Show MongoDB connection status
    if (mongoose.connection.readyState === 1) {
      console.log('✅ MongoDB Atlas is connected and ready');
    } else {
      console.log('❌ MongoDB is not connected');
    }
  });
}).catch(err => {
  console.error('❌ Failed to start server:', err);
});

// Logout route
app.post('/api/admin/logout', (req, res) => {
    // In a real application, you would blacklist the token
    // For this simple implementation, we just acknowledge the logout
    res.json({
        success: true,
        message: 'Logged out successfully'
    });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Endpoint not found'
  });
});
