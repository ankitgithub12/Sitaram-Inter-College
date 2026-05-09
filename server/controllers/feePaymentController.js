const express = require('express');
const mongoose = require('mongoose');
const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const path = require('path');

// Load environment variables from server root
const envPath = path.resolve(__dirname, '../.env');

try {
  require('dotenv').config({ path: envPath });
  console.log('✅ .env loaded successfully');
} catch (error) {
  console.error('❌ Error loading .env:', error.message);
}

// Cloudinary Configuration with detailed error reporting
const cloudinaryConfig = {
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || 'your_cloud_name',
  api_key: process.env.CLOUDINARY_API_KEY || 'your_api_key',
  api_secret: process.env.CLOUDINARY_API_SECRET || 'your_api_secret'
};

try {
  cloudinary.config(cloudinaryConfig);
  console.log('✅ Cloudinary configured successfully');
} catch (error) {
  console.error('❌ Cloudinary configuration error:', error.message);
}

// Get the already defined FeePayment model
const FeePayment = mongoose.model('FeePayment');

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

exports.upload = multer({ 
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
exports.handleFormData = (req, res, next) => {
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

// POST create new fee payment with file upload - UPDATED VERSION
exports.createFeePayment = async (req, res) => {
  try {
    let paymentData = {};
    
    // Check if payment data exists in body
    if (req.body && req.body.paymentData) {
      if (typeof req.body.paymentData === 'string') {
        try {
          paymentData = JSON.parse(req.body.paymentData);
        } catch (parseError) {
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
    } else {
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
    const secureUrl = req.file?.secure_url || req.file?.url || req.file?.path || req.file?.filename || null;
    const publicId = req.file?.public_id || req.file?.publicId || req.file?.filename || null;
    paymentData.cloudinaryFile = {
      public_id: publicId,
      secure_url: secureUrl,
      original_filename: req.file?.originalname || req.file?.original_filename || null,
      format: req.file?.format || null,
      resource_type: req.file?.resource_type || (req.file?.mimetype && req.file.mimetype.startsWith('image/') ? 'image' : 'raw'),
      bytes: req.file?.size || req.file?.bytes || null,
      width: req.file?.width || null,
      height: req.file?.height || null,
      created_at: req.file?.created_at || new Date().toISOString()
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
    
    // Create and save payment record
    const newFeePayment = new FeePayment(paymentData);
    const savedFeePayment = await newFeePayment.save();

    // Trigger explicit real-time socket reload to the admin dashboard
    if (req.io) {
      req.io.emit('new_fee_payment', {
        id: savedFeePayment._id,
        amount: savedFeePayment.amount
      });
    }
    
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
        receiptUrl: savedFeePayment.cloudinaryFile?.secure_url || savedFeePayment.receiptFile?.url || null,
        cloudinaryId: savedFeePayment.cloudinaryFile?.public_id
      }
    });
    
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'Duplicate receipt detected. Please refresh and try again.',
        error: error.message
      });
    }
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: messages,
        validationError: error.message
      });
    }
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
};

// GET all fee payments
exports.getFeePayments = async (req, res) => {
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
    res.status(500).json({
      success: false,
      message: 'Error fetching fee payments',
      error: error.message
    });
  }
};

// GET fee payment by ID
exports.getFeePaymentById = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, message: 'Invalid fee payment ID format' });
    }
    
    const payment = await FeePayment.findById(id);
    if (!payment) {
      return res.status(404).json({ success: false, message: 'Fee payment not found' });
    }
    
    const receiptUrl = payment.cloudinaryFile?.secure_url || payment.receiptFile?.url || null;
    res.json({ success: true, data: payment, receiptUrl });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error fetching fee payment', error: error.message });
  }
};

// GET fee payment by receipt number
exports.getFeePaymentByReceipt = async (req, res) => {
  try {
    const { receiptNumber } = req.params;
    const payment = await FeePayment.findOne({ receiptNumber });
    
    if (!payment) {
      return res.status(404).json({ success: false, message: 'Receipt not found' });
    }
    
    const responseData = {
      receiptNumber: payment.receiptNumber,
      studentName: payment.studentName,
      className: payment.className,
      amount: payment.amount,
      receiptDate: payment.receiptDate,
      status: payment.status
    };
    res.json({ success: true, data: responseData });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error fetching receipt', error: error.message });
  }
};

// GET fee payments by email
exports.getFeePaymentsByEmail = async (req, res) => {
  try {
    const email = req.params.email.toLowerCase().trim();
    const payments = await FeePayment.find({ email: new RegExp(`^${email}$`, 'i') })
      .sort({ submittedAt: -1 })
      .lean();
    
    const filteredPayments = payments.map(payment => ({
      receiptNumber: payment.receiptNumber,
      studentName: payment.studentName,
      className: payment.className,
      amount: payment.amount,
      receiptDate: payment.receiptDate,
      status: payment.status,
      submittedAt: payment.submittedAt
    }));
    
    res.json({ success: true, count: filteredPayments.length, data: filteredPayments });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error fetching payments by email', error: error.message });
  }
};

// PUT update fee payment status (admin only)
exports.updateFeePaymentStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, verificationNotes } = req.body;
    
    const validStatuses = ['pending', 'verified', 'rejected'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid status' });
    }
    
    const updateData = { status };
    if (verificationNotes) updateData.verificationNotes = verificationNotes;
    if (status === 'verified' || status === 'rejected') {
      updateData.verifiedAt = new Date();
      updateData.verifiedBy = 'Admin';
    }
    
    const updatedFeePayment = await FeePayment.findByIdAndUpdate(id, updateData, { new: true });
    
    if (!updatedFeePayment) {
      return res.status(404).json({ success: false, message: 'Fee payment not found' });
    }

    // Emit real-time event for the student dashboard
    if (req.io) {
      req.io.emit('fee_status_updated', {
        id: updatedFeePayment._id,
        email: updatedFeePayment.email,
        status: updatedFeePayment.status,
        amount: updatedFeePayment.amount,
        studentName: updatedFeePayment.studentName
      });
    }
    
    res.json({ success: true, message: `Fee payment ${status}`, data: updatedFeePayment });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error updating fee payment status', error: error.message });
  }
};

// PUT update fee payment (admin only)
exports.updateFeePayment = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, message: 'Invalid fee payment ID format' });
    }
    
    const updateData = { ...req.body };
    delete updateData._id;
    delete updateData.receiptNumber;
    delete updateData.cloudinaryFile;
    delete updateData.submittedAt;
    
    if (updateData.receiptDate && !isNaN(new Date(updateData.receiptDate))) {
      updateData.receiptDate = new Date(updateData.receiptDate);
    }
    
    const updatedFeePayment = await FeePayment.findByIdAndUpdate(id, updateData, { new: true, runValidators: true });
    
    if (!updatedFeePayment) {
      return res.status(404).json({ success: false, message: 'Fee payment not found' });
    }
    
    res.json({ success: true, message: 'Fee payment updated successfully', data: updatedFeePayment });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error updating fee payment', error: error.message });
  }
};

// DELETE fee payment with Cloudinary file cleanup (admin only)
exports.deleteFeePayment = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, message: 'Invalid fee payment ID format' });
    }
    
    const payment = await FeePayment.findById(id);
    if (!payment) {
      return res.status(404).json({ success: false, message: 'Fee payment not found' });
    }
    
    if (payment.cloudinaryFile && payment.cloudinaryFile.public_id) {
      try {
        await cloudinary.uploader.destroy(payment.cloudinaryFile.public_id);
      } catch (cloudinaryError) {
        console.error('Error deleting Cloudinary file:', cloudinaryError);
      }
    }
    
    await FeePayment.findByIdAndDelete(id);
    res.json({ success: true, message: 'Fee payment deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error deleting fee payment', error: error.message });
  }
};

// POST upload new receipt for existing payment (admin only)
exports.uploadReceiptForPayment = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, message: 'Invalid fee payment ID format' });
    }
    
    const payment = await FeePayment.findById(id);
    if (!payment) {
      return res.status(404).json({ success: false, message: 'Fee payment not found' });
    }
    
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'Receipt file is required' });
    }
    
    if (payment.cloudinaryFile && payment.cloudinaryFile.public_id) {
      try {
        await cloudinary.uploader.destroy(payment.cloudinaryFile.public_id);
      } catch (cloudinaryError) {
        console.error('Error deleting old Cloudinary file:', cloudinaryError);
      }
    }
    
    const secureUrl = req.file?.secure_url || req.file?.url || req.file?.path || req.file?.filename || null;
    const publicId = req.file?.public_id || req.file?.publicId || req.file?.filename || null;

    const updateData = {
      cloudinaryFile: {
        public_id: publicId,
        secure_url: secureUrl,
        original_filename: req.file?.originalname || req.file?.original_filename || null,
        format: req.file?.format || null,
        resource_type: req.file?.resource_type || (req.file?.mimetype && req.file.mimetype.startsWith('image/') ? 'image' : 'raw'),
        bytes: req.file?.size || req.file?.bytes || null,
        width: req.file?.width || null,
        height: req.file?.height || null,
        created_at: req.file?.created_at || new Date().toISOString()
      },
      updatedAt: new Date()
    };
    
    const updatedFeePayment = await FeePayment.findByIdAndUpdate(id, updateData, { new: true });
    
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
    res.status(500).json({ success: false, message: 'Error updating receipt', error: error.message });
  }
};

// GET advanced analytics for fee payments
exports.getFeePaymentStats = async (req, res) => {
  try {
    const totalPayments = await FeePayment.countDocuments();
    const verifiedPayments = await FeePayment.countDocuments({ status: 'verified' });
    const pendingPayments = await FeePayment.countDocuments({ status: 'pending' });
    
    const result = await FeePayment.aggregate([
      { $match: { status: 'verified' } },
      { $group: { _id: null, totalAmount: { $sum: '$amount' } } }
    ]);
    
    const totalVerifiedAmount = result.length > 0 ? result[0].totalAmount : 0;
    
    res.json({
      success: true,
      data: {
        totalPayments,
        verifiedPayments,
        pendingPayments,
        totalVerifiedAmount
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error fetching stats', error: error.message });
  }
};

// GET advanced search for fee payments
exports.searchFeePaymentsAdvanced = async (req, res) => {
  try {
    const { studentName, receiptNumber, email, status, minAmount, maxAmount } = req.query;
    let query = {};
    
    if (studentName) query.studentName = { $regex: studentName, $options: 'i' };
    if (receiptNumber) query.receiptNumber = { $regex: receiptNumber, $options: 'i' };
    if (email) query.email = { $regex: email, $options: 'i' };
    if (status && status !== 'all') query.status = status;
    if (minAmount || maxAmount) {
      query.amount = {};
      if (minAmount) query.amount.$gte = parseFloat(minAmount);
      if (maxAmount) query.amount.$lte = parseFloat(maxAmount);
    }
    
    const payments = await FeePayment.find(query).sort({ submittedAt: -1 }).lean();
    
    res.json({
      success: true,
      count: payments.length,
      data: payments
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error in advanced search', error: error.message });
  }
};
