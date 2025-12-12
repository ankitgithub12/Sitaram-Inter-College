
const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const path = require('path');

// Cloudinary Configuration
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

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
feePaymentSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

// Create FeePayment model
const FeePayment = mongoose.models.FeePayment || mongoose.model('FeePayment', feePaymentSchema, 'feePayments');

// Configure Cloudinary storage for file uploads
const cloudinaryStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'sric_admissions/fee_payments',
    format: async (req, file) => {
      // Determine format based on mimetype
      if (file.mimetype === 'application/pdf') return 'pdf';
      if (file.mimetype.startsWith('image/')) {
        // Keep original image format
        const ext = path.extname(file.originalname).toLowerCase();
        if (ext === '.jpg' || ext === '.jpeg') return 'jpg';
        if (ext === '.png') return 'png';
        if (ext === '.webp') return 'webp';
        return 'jpg'; // default
      }
      return 'jpg';
    },
    public_id: (req, file) => {
      // Generate unique public_id with timestamp
      const timestamp = Date.now();
      const random = Math.round(Math.random() * 1E9);
      return `receipt-${timestamp}-${random}`;
    },
    transformation: [
      { width: 1000, height: 1000, crop: 'limit' }, // Resize images
      { quality: 'auto:good' } // Optimize quality
    ]
  }
});

const upload = multer({ 
  storage: cloudinaryStorage,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB limit (Cloudinary supports up to 20MB for free tier)
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

// Custom middleware to handle FormData parsing issues
const handleFormData = (req, res, next) => {
  // If the request is multipart/form-data, let multer handle it
  if (req.headers['content-type'] && req.headers['content-type'].includes('multipart/form-data')) {
    return next();
  }
  
  // Otherwise, parse the body as JSON
  let data = '';
  req.on('data', chunk => {
    data += chunk;
  });
  req.on('end', () => {
    try {
      if (data) {
        const parsed = JSON.parse(data);
        // If it's a FormData-like structure with paymentData
        if (parsed.paymentData) {
          try {
            req.body = {
              paymentData: typeof parsed.paymentData === 'string' 
                ? JSON.parse(parsed.paymentData) 
                : parsed.paymentData
            };
          } catch (e) {
            req.body = parsed;
          }
        } else {
          req.body = parsed;
        }
      }
      next();
    } catch (error) {
      console.error('Error parsing request body:', error);
      req.body = {};
      next();
    }
  });
};

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

// POST create new fee payment with file upload - UPDATED VERSION
router.post('/', handleFormData, upload.single('receipt'), async (req, res) => {
  try {
    console.log('📨 Received fee payment submission');
    console.log('Content-Type:', req.headers['content-type']);
    console.log('Request body:', req.body);
    console.log('Request file:', req.file ? `File received: ${req.file.originalname}` : 'No file');
    
    let paymentData = {};
    
    // Check if payment data exists in body
    if (req.body && req.body.paymentData) {
      console.log('Found paymentData in req.body');
      if (typeof req.body.paymentData === 'string') {
        try {
          paymentData = JSON.parse(req.body.paymentData);
        } catch (parseError) {
          console.error('Error parsing payment data JSON:', parseError);
          return res.status(400).json({
            success: false,
            message: 'Invalid payment data JSON format',
            error: parseError.message
          });
        }
      } else {
        paymentData = req.body.paymentData;
      }
    } 
    // If paymentData is not found, check if individual fields are in the body
    else if (req.body && req.body.studentName) {
      console.log('Found individual fields in req.body');
      // Use individual fields from the body
      paymentData = {
        studentName: req.body.studentName,
        fatherName: req.body.fatherName,
        mobile: req.body.mobile,
        email: req.body.email,
        className: req.body.className,
        classId: req.body.classId,
        amount: parseFloat(req.body.amount),
        paymentMethod: req.body.paymentMethod,
        transactionId: req.body.transactionId,
        receiptNumber: req.body.receiptNumber,
        receiptDate: req.body.receiptDate ? new Date(req.body.receiptDate) : new Date()
      };
    } 
    // If neither is found, return error
    else {
      console.log('No payment data found in request');
      console.log('Full request body:', req.body);
      return res.status(400).json({
        success: false,
        message: 'Payment data is required.',
        receivedBody: req.body
      });
    }
    
    // Basic validation
    const requiredFields = ['studentName', 'fatherName', 'mobile', 'email', 'className', 'amount', 'paymentMethod', 'transactionId', 'receiptNumber'];
    const missingFields = requiredFields.filter(field => {
      const value = paymentData[field];
      return value === undefined || value === null || value === '';
    });
    
    if (missingFields.length > 0) {
      console.log('Missing required fields:', missingFields);
      return res.status(400).json({
        success: false,
        message: `Missing required fields: ${missingFields.join(', ')}`,
        missingFields: missingFields,
        paymentData: paymentData
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
    
    // Check if file was uploaded
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'Receipt file is required'
      });
    }
    
    // Add Cloudinary file information
    paymentData.cloudinaryFile = {
      public_id: req.file.public_id,
      secure_url: req.file.secure_url,
      original_filename: req.file.originalname,
      format: req.file.format,
      resource_type: req.file.resource_type,
      bytes: req.file.size,
      width: req.file.width || null,
      height: req.file.height || null,
      created_at: req.file.created_at || new Date().toISOString()
    };
    
    // Ensure receiptDate is properly formatted
    if (!paymentData.receiptDate || isNaN(new Date(paymentData.receiptDate))) {
      paymentData.receiptDate = new Date();
    } else {
      paymentData.receiptDate = new Date(paymentData.receiptDate);
    }
    
    // Ensure amount is a number
    if (typeof paymentData.amount === 'string') {
      paymentData.amount = parseFloat(paymentData.amount);
    }
    
    // Ensure classId is set if not provided
    if (!paymentData.classId && paymentData.className) {
      paymentData.classId = paymentData.className.toLowerCase().replace(/\s+/g, '-');
    }
    
    console.log('📝 Creating fee payment with data:', JSON.stringify(paymentData, null, 2));
    
    // Create and save payment record
    const newFeePayment = new FeePayment(paymentData);
    const savedFeePayment = await newFeePayment.save();
    
    console.log(`✅ Fee payment saved: ${savedFeePayment.receiptNumber} for ${savedFeePayment.studentName}`);
    console.log(`   Amount: ₹${savedFeePayment.amount}, Class: ${savedFeePayment.className}`);
    console.log(`   Cloudinary URL: ${savedFeePayment.cloudinaryFile?.secure_url}`);
    console.log(`   ID: ${savedFeePayment._id}`);
    
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
        receiptUrl: savedFeePayment.cloudinaryFile?.secure_url,
        cloudinaryId: savedFeePayment.cloudinaryFile?.public_id
      }
    });
    
  } catch (error) {
    console.error('❌ Error saving fee payment:', error);
    console.error('Error stack:', error.stack);
    
    // Handle duplicate key error
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'Duplicate receipt detected. Please refresh and try again.',
        error: error.message
      });
    }
    
    // Handle validation errors
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: messages,
        validationError: error.message
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
    
    // Handle Cloudinary errors
    if (error.message && error.message.includes('Cloudinary')) {
      return res.status(400).json({
        success: false,
        message: 'File upload to cloud storage failed',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Server error while saving payment',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error',
      errorType: error.name
    });
  }
});

// GET all fee payments
router.get('/', authenticateAdmin, async (req, res) => {
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
    console.error('Error fetching fee payments:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching fee payments',
      error: error.message
    });
  }
});

// GET fee payment by ID
router.get('/:id', authenticateAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    
    // Validate ID format
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
    console.error('Error fetching fee payment:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching fee payment',
      error: error.message
    });
  }
});

// GET fee payment by receipt number
router.get('/receipt/:receiptNumber', async (req, res) => {
  try {
    const { receiptNumber } = req.params;
    const payment = await FeePayment.findOne({ receiptNumber });
    
    if (!payment) {
      return res.status(404).json({
        success: false,
        message: 'Receipt not found'
      });
    }
    
    // Don't send sensitive information if not verified
    const responseData = {
      receiptNumber: payment.receiptNumber,
      studentName: payment.studentName,
      className: payment.className,
      amount: payment.amount,
      receiptDate: payment.receiptDate,
      status: payment.status
    };
    
    res.json({
      success: true,
      data: responseData
    });
  } catch (error) {
    console.error('Error fetching receipt:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching receipt',
      error: error.message
    });
  }
});

// GET fee payments by email
router.get('/email/:email', async (req, res) => {
  try {
    const { email } = req.params;
    const payments = await FeePayment.find({ email })
      .sort({ submittedAt: -1 })
      .lean();
    
    // Filter sensitive information for public access
    const filteredPayments = payments.map(payment => ({
      receiptNumber: payment.receiptNumber,
      studentName: payment.studentName,
      className: payment.className,
      amount: payment.amount,
      receiptDate: payment.receiptDate,
      status: payment.status,
      submittedAt: payment.submittedAt
    }));
    
    res.json({
      success: true,
      count: filteredPayments.length,
      data: filteredPayments
    });
  } catch (error) {
    console.error('Error fetching payments by email:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching payments by email',
      error: error.message
    });
  }
});

// PUT update fee payment status (admin only)
router.put('/:id/status', authenticateAdmin, async (req, res) => {
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

// PUT update fee payment (admin only)
router.put('/:id', authenticateAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    
    // Validate ID format
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid fee payment ID format'
      });
    }
    
    // Remove fields that shouldn't be updated directly
    const updateData = { ...req.body };
    delete updateData._id;
    delete updateData.receiptNumber; // Prevent changing receipt number
    delete updateData.cloudinaryFile; // Prevent changing file info directly
    delete updateData.submittedAt;
    
    // Ensure receiptDate is properly formatted if provided
    if (updateData.receiptDate && !isNaN(new Date(updateData.receiptDate))) {
      updateData.receiptDate = new Date(updateData.receiptDate);
    }
    
    const updatedFeePayment = await FeePayment.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    );
    
    if (!updatedFeePayment) {
      return res.status(404).json({
        success: false,
        message: 'Fee payment not found'
      });
    }
    
    res.json({
      success: true,
      message: 'Fee payment updated successfully',
      data: updatedFeePayment
    });
  } catch (error) {
    console.error('Error updating fee payment:', error);
    
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
      message: 'Error updating fee payment',
      error: error.message
    });
  }
});

// DELETE fee payment with Cloudinary file cleanup (admin only)
router.delete('/:id', authenticateAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    
    // Validate ID format
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid fee payment ID format'
      });
    }
    
    // Find the payment first to get Cloudinary public_id
    const payment = await FeePayment.findById(id);
    
    if (!payment) {
      return res.status(404).json({
        success: false,
        message: 'Fee payment not found'
      });
    }
    
    // Delete file from Cloudinary if it exists
    if (payment.cloudinaryFile && payment.cloudinaryFile.public_id) {
      try {
        await cloudinary.uploader.destroy(payment.cloudinaryFile.public_id);
        console.log(`✅ Deleted Cloudinary file: ${payment.cloudinaryFile.public_id}`);
      } catch (cloudinaryError) {
        console.error('Error deleting Cloudinary file:', cloudinaryError);
        // Continue with MongoDB deletion even if Cloudinary deletion fails
      }
    }
    
    // Delete from MongoDB
    await FeePayment.findByIdAndDelete(id);
    
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

// POST upload new receipt for existing payment (admin only)
router.post('/:id/receipt', authenticateAdmin, upload.single('receipt'), async (req, res) => {
  try {
    const { id } = req.params;
    
    // Validate ID format
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid fee payment ID format'
      });
    }
    
    // Find the payment
    const payment = await FeePayment.findById(id);
    
    if (!payment) {
      return res.status(404).json({
        success: false,
        message: 'Fee payment not found'
      });
    }
    
    // Check if file was uploaded
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'Receipt file is required'
      });
    }
    
    // Delete old Cloudinary file if exists
    if (payment.cloudinaryFile && payment.cloudinaryFile.public_id) {
      try {
        await cloudinary.uploader.destroy(payment.cloudinaryFile.public_id);
        console.log(`✅ Deleted old Cloudinary file: ${payment.cloudinaryFile.public_id}`);
      } catch (cloudinaryError) {
        console.error('Error deleting old Cloudinary file:', cloudinaryError);
      }
    }
    
    // Update with new Cloudinary file information
    const updateData = {
      cloudinaryFile: {
        public_id: req.file.public_id,
        secure_url: req.file.secure_url,
        original_filename: req.file.originalname,
        format: req.file.format,
        resource_type: req.file.resource_type,
        bytes: req.file.size,
        width: req.file.width || null,
        height: req.file.height || null,
        created_at: req.file.created_at || new Date().toISOString()
      }
    };
    
    const updatedFeePayment = await FeePayment.findByIdAndUpdate(
      id,
      updateData,
      { new: true }
    );
    
    res.json({
      success: true,
      message: 'Receipt updated successfully',
      data: {
        id: updatedFeePayment._id,
        receiptNumber: updatedFeePayment.receiptNumber,
        receiptUrl: updatedFeePayment.cloudinaryFile?.secure_url,
        cloudinaryId: updatedFeePayment.cloudinaryFile?.public_id
      }
    });
  } catch (error) {
    console.error('Error updating receipt:', error);
    
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
        message: 'File upload error'
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Error updating receipt',
      error: error.message
    });
  }
});

// GET statistics for fee payments
router.get('/stats/summary', authenticateAdmin, async (req, res) => {
  try {
    const [totalPayments, pendingPayments, verifiedPayments, rejectedPayments] = await Promise.all([
      FeePayment.countDocuments(),
      FeePayment.countDocuments({ status: 'pending' }),
      FeePayment.countDocuments({ status: 'verified' }),
      FeePayment.countDocuments({ status: 'rejected' })
    ]);
    
    // Get total amount of verified payments
    const verifiedAmountResult = await FeePayment.aggregate([
      { $match: { status: 'verified' } },
      { $group: { _id: null, totalAmount: { $sum: '$amount' } } }
    ]);
    
    const totalVerifiedAmount = verifiedAmountResult.length > 0 ? verifiedAmountResult[0].totalAmount : 0;
    
    // Get monthly statistics
    const now = new Date();
    const sixMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 5, 1);
    
    const monthlyStats = await FeePayment.aggregate([
      { $match: { submittedAt: { $gte: sixMonthsAgo } } },
      { $group: {
          _id: { 
            year: { $year: '$submittedAt' },
            month: { $month: '$submittedAt' }
          },
          count: { $sum: 1 },
          totalAmount: { $sum: '$amount' }
        }
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } }
    ]);
    
    // Get top classes by payment count
    const topClasses = await FeePayment.aggregate([
      { $group: {
          _id: '$className',
          count: { $sum: 1 },
          totalAmount: { $sum: '$amount' }
        }
      },
      { $sort: { count: -1 } },
      { $limit: 5 }
    ]);
    
    res.json({
      success: true,
      data: {
        counts: {
          total: totalPayments,
          pending: pendingPayments,
          verified: verifiedPayments,
          rejected: rejectedPayments
        },
        amounts: {
          totalVerified: totalVerifiedAmount
        },
        monthlyStats,
        topClasses
      }
    });
  } catch (error) {
    console.error('Error fetching fee payment statistics:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching fee payment statistics',
      error: error.message
    });
  }
});

// GET search fee payments with advanced filters
router.get('/search/advanced', authenticateAdmin, async (req, res) => {
  try {
    const { 
      studentName, 
      className, 
      receiptNumber,
      fromDate, 
      toDate,
      minAmount,
      maxAmount,
      paymentMethod,
      status
    } = req.query;
    
    let query = {};
    
    if (studentName) {
      query.studentName = { $regex: studentName, $options: 'i' };
    }
    
    if (className && className !== 'all') {
      query.className = className;
    }
    
    if (receiptNumber) {
      query.receiptNumber = { $regex: receiptNumber, $options: 'i' };
    }
    
    if (fromDate || toDate) {
      query.submittedAt = {};
      if (fromDate) query.submittedAt.$gte = new Date(fromDate);
      if (toDate) query.submittedAt.$lte = new Date(toDate);
    }
    
    if (minAmount || maxAmount) {
      query.amount = {};
      if (minAmount) query.amount.$gte = parseFloat(minAmount);
      if (maxAmount) query.amount.$lte = parseFloat(maxAmount);
    }
    
    if (paymentMethod && paymentMethod !== 'all') {
      query.paymentMethod = paymentMethod;
    }
    
    if (status && status !== 'all') {
      query.status = status;
    }
    
    const payments = await FeePayment.find(query)
      .sort({ submittedAt: -1 })
      .limit(50)
      .lean();
    
    res.json({
      success: true,
      count: payments.length,
      data: payments
    });
  } catch (error) {
    console.error('Error in advanced search:', error);
    res.status(500).json({
      success: false,
      message: 'Error searching fee payments',
      error: error.message
    });
  }
});

module.exports = router;
