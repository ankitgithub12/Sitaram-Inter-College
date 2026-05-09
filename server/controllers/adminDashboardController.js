const mongoose = require('mongoose');
const cloudinary = require('cloudinary').v2;
const { Application, Contact, FeePayment } = require('../models');

// Full admin dashboard (protected)
exports.getFullAdminDashboardStats = async (req, res) => {
  try {
    const [
      totalAdmissions, pendingAdmissions, approvedAdmissions, rejectedAdmissions,
      totalFeePayments, pendingFeePayments, verifiedFeePayments, rejectedFeePayments,
      totalContacts, unreadContacts
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

    const recentAdmissions = await Application.find()
      .sort({ submittedAt: -1 }).limit(5)
      .select('name email admissionClass status submittedAt applicationNumber').lean();

    const recentFeePayments = await FeePayment.find()
      .sort({ submittedAt: -1 }).limit(5)
      .select('studentName className amount status receiptNumber submittedAt cloudinaryFile').lean();

    const recentContacts = await Contact.find()
      .sort({ submittedAt: -1 }).limit(5)
      .select('name email subject status submittedAt').lean();

    const admissionsByStatus = await Application.aggregate([{ $group: { _id: '$status', count: { $sum: 1 } } }]);
    const paymentsByStatus = await FeePayment.aggregate([{ $group: { _id: '$status', count: { $sum: 1 } } }]);

    const now = new Date();
    const sixMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 5, 1);
    const monthlyAdmissions = await Application.aggregate([
      { $match: { submittedAt: { $gte: sixMonthsAgo } } },
      { $group: { _id: { year: { $year: '$submittedAt' }, month: { $month: '$submittedAt' } }, count: { $sum: 1 } } },
      { $sort: { '_id.year': 1, '_id.month': 1 } }
    ]);

    const totalVerifiedAmount = await FeePayment.aggregate([
      { $match: { status: 'verified' } },
      { $group: { _id: null, total: { $sum: '$amount' } } }
    ]);

    res.json({
      success: true,
      data: {
        totalAdmissions, pendingAdmissions, approvedAdmissions, rejectedAdmissions,
        totalFeePayments, pendingFeePayments, verifiedFeePayments, rejectedFeePayments,
        totalContacts, unreadContacts,
        totalVerifiedAmount: totalVerifiedAmount[0]?.total || 0,
        recentAdmissions, recentFeePayments, recentContacts,
        admissionsByStatus, paymentsByStatus, monthlyAdmissions
      }
    });
  } catch (error) {
    console.error('❌ Error fetching dashboard stats:', error);
    res.status(500).json({ success: false, message: 'Error fetching dashboard statistics', error: error.message });
  }
};

// Lightweight stats
exports.getDashboardStats = async (req, res) => {
  try {
    const [
      totalAdmissions, pendingAdmissions, approvedAdmissions,
      totalFeePayments, pendingFeePayments, verifiedFeePayments,
      totalContacts, unreadContacts
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
          admissions: totalAdmissions, pendingAdmissions, approvedAdmissions,
          feePayments: totalFeePayments, pendingFeePayments, verifiedFeePayments,
          contacts: totalContacts, unreadContacts
        }
      }
    });
  } catch (error) {
    console.error('❌ Error fetching stats overview:', error);
    res.status(500).json({ success: false, message: 'Error fetching dashboard overview', error: error.message });
  }
};

// Aggregated dashboard stats
exports.getAggregatedDashboardStats = async (req, res) => {
  try {
    const [
      totalAdmissions, totalFeePayments, totalContacts,
      pendingAdmissions, pendingFees, unreadContacts,
      approvedAdmissions, verifiedFees, paymentsByStatus,
      recentAdmissions, recentFeePayments
    ] = await Promise.all([
      Application.countDocuments(),
      FeePayment.countDocuments(),
      Contact.countDocuments(),
      Application.countDocuments({ status: 'pending' }),
      FeePayment.countDocuments({ status: 'pending' }),
      Contact.countDocuments({ status: 'unread' }),
      Application.countDocuments({ status: 'approved' }),
      FeePayment.countDocuments({ status: 'verified' }),
      FeePayment.aggregate([{ $group: { _id: '$status', count: { $sum: 1 } } }]),
      Application.find().sort({ submittedAt: -1 }).limit(5).lean(),
      FeePayment.find().sort({ submittedAt: -1 }).limit(5).lean()
    ]);

    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
    const monthlyAdmissions = await Application.aggregate([
      { $match: { submittedAt: { $gte: sixMonthsAgo } } },
      { $group: { _id: { year: { $year: '$submittedAt' }, month: { $month: '$submittedAt' } }, count: { $sum: 1 } } },
      { $sort: { '_id.year': 1, '_id.month': 1 } }
    ]);

    const totalVerifiedAmountResult = await FeePayment.aggregate([
      { $match: { status: 'verified' } },
      { $group: { _id: null, total: { $sum: '$amount' } } }
    ]);

    res.json({
      success: true,
      data: {
        totalAdmissions, totalFeePayments, totalContacts,
        pendingAdmissions, pendingFees, unreadContacts,
        approvedAdmissions, verifiedFees, paymentsByStatus,
        recentAdmissions, recentFeePayments, monthlyAdmissions,
        totalVerifiedAmount: totalVerifiedAmountResult[0]?.total || 0
      }
    });
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch dashboard stats', error: error.message });
  }
};

// Cloudinary connectivity test
exports.testCloudinary = async (req, res) => {
  try {
    const result = await cloudinary.api.resources({ type: 'upload', max_results: 1 });
    res.json({
      success: true,
      message: 'Cloudinary connected successfully',
      cloud_name: cloudinary.config().cloud_name,
      resource_count: result.total_count
    });
  } catch (error) {
    console.error('❌ Cloudinary test error:', error);
    res.status(500).json({ success: false, message: 'Cloudinary connection failed', error: error.message });
  }
};

// Health check
exports.healthCheck = (req, res) => {
  const dbStatus = mongoose.connection.readyState === 1 ? 'connected' : 'disconnected';
  res.json({
    success: true,
    message: 'Server is running!',
    database: dbStatus,
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
};

// API root info
exports.getRootInfo = (req, res) => {
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
};
