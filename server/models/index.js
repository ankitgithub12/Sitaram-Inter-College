/**
 * Shared MongoDB Models - SRIC
 * Import from here in route files to avoid model re-registration errors
 */
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// ==================== EXISTING SCHEMAS ====================

const admissionSchema = new mongoose.Schema({
  name: { type: String, required: [true, 'Name is required'] },
  dob: { type: Date, required: [true, 'Date of birth is required'] },
  motherTongue: { type: String, required: [true, 'Mother tongue is required'] },
  caste: { type: String, required: [true, 'Caste is required'] },
  religion: { type: String, required: [true, 'Religion is required'] },
  previousClass: { type: String, required: [true, 'Previous class is required'] },
  admissionClass: { type: String, required: [true, 'Admission class is required'] },
  previousSchool: { type: String, required: [true, 'Previous school is required'] },
  admissionDate: { type: Date, required: [true, 'Admission date is required'] },
  fatherName: { type: String, required: [true, "Father's name is required"] },
  motherName: { type: String, required: [true, "Mother's name is required"] },
  fatherContact: {
    type: String,
    required: [true, "Father's contact is required"],
    validate: {
      validator: function(v) { return /^[0-9]{10}$/.test(v); },
      message: props => `${props.value} is not a valid phone number!`
    }
  },
  motherContact: {
    type: String,
    validate: {
      validator: function(v) { if (!v) return true; return /^[0-9]{10}$/.test(v); },
      message: props => `${props.value} is not a valid phone number!`
    }
  },
  email: { type: String, required: [true, 'Email is required'], lowercase: true, trim: true },
  occupation: { type: String, required: [true, "Father's occupation is required"] },
  motherOccupation: { type: String },
  address: { type: String, required: [true, 'Address is required'] },
  declaration: { type: Boolean, required: [true, 'Declaration acceptance is required'], default: false },
  status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
  submittedAt: { type: Date, default: Date.now },
  studentId: { type: String },
  applicationNumber: { type: String, unique: true, sparse: true },
  adminNotes: { type: String }
});

admissionSchema.pre('save', function() {
  if (!this.applicationNumber) {
    const prefix = 'SRIC';
    const year = new Date().getFullYear().toString().slice(-2);
    const random = Math.floor(10000 + Math.random() * 90000);
    this.applicationNumber = `${prefix}${year}${random}`;
  }
});

const contactSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, lowercase: true, trim: true },
  phone: {
    type: String,
    validate: {
      validator: function(v) { if (!v) return true; return /^[0-9]{10}$/.test(v); },
      message: props => `${props.value} is not a valid phone number!`
    }
  },
  subject: { type: String, default: 'General Inquiry' },
  message: { type: String, required: true },
  status: { type: String, enum: ['unread', 'read', 'replied', 'archived'], default: 'unread' },
  adminNotes: { type: String },
  respondedBy: { type: String },
  responseMessage: { type: String },
  respondedAt: { type: Date },
  submittedAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

contactSchema.pre('save', function() { this.updatedAt = new Date(); });

const feePaymentSchema = new mongoose.Schema({
  studentName: { type: String, required: true },
  fatherName: { type: String, required: true },
  mobile: {
    type: String,
    required: true,
    validate: {
      validator: function(v) { return /^[0-9]{10}$/.test(v); },
      message: props => `${props.value} is not a valid phone number!`
    }
  },
  email: { type: String, required: true, lowercase: true, trim: true },
  className: { type: String, required: true },
  classId: { type: String },
  amount: { type: Number, required: true, min: [0, 'Amount cannot be negative'] },
  paymentMethod: { type: String, required: true },
  transactionId: { type: String, required: true },
  receiptNumber: { type: String, required: true, unique: true },
  receiptDate: { type: Date, required: true },
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
  receiptFile: {
    url: { type: String },
    originalName: { type: String },
    size: { type: Number }
  },
  status: { type: String, enum: ['pending', 'verified', 'rejected'], default: 'pending' },
  verifiedBy: { type: String },
  verificationNotes: { type: String },
  verifiedAt: { type: Date },
  submittedAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

feePaymentSchema.pre('save', function() { this.updatedAt = new Date(); });

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  plainPassword: { type: String },
  role: { type: String, enum: ['admin', 'teacher', 'student'], default: 'student' },
  name: { type: String },
  email: { type: String, unique: true, sparse: true },
  isDisabled: { type: Boolean, default: false },
  createdBy: { type: String },
  creatorName: { type: String },
  subject: { type: String },
  createdAt: { type: Date, default: Date.now }
});

userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  try {
    if (!this.plainPassword && !this.password.startsWith('$2')) {
      this.plainPassword = this.password;
    }
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (err) {
    next(err);
  }
});

userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

const attendanceSchema = new mongoose.Schema({
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  teacherId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  date: { type: Date, required: true },
  status: { type: String, enum: ['present', 'absent', 'late'], default: 'present' },
  class: { type: String },
  submittedAt: { type: Date, default: Date.now }
});

attendanceSchema.index({ studentId: 1, date: 1 }, { unique: true });

const marksSchema = new mongoose.Schema({
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  studentName: { type: String, required: true },
  studentUsername: { type: String, required: true },
  subject: { type: String, required: true },
  marksObtained: { type: Number, required: true },
  maxMarks: { type: Number, required: true },
  examType: { type: String, required: true },
  addedBy: { type: String, required: true },
  addedByName: { type: String },
  date: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

marksSchema.index({ studentId: 1, subject: 1, examType: 1 }, { unique: true });

marksSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

const assignmentSchema = new mongoose.Schema({
  title: { type: String, required: true },
  dueDate: { type: Date, required: true },
  className: { type: String, required: true },
  description: { type: String },
  teacherId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  teacherName: { type: String, required: true },
  status: { type: String, enum: ['Published', 'Draft', 'In Review'], default: 'Published' },
  createdAt: { type: Date, default: Date.now }
});

// ==================== NEW SCHEMAS ====================

// Gallery Photo Schema - for admin-uploaded photos shown in Photos & Videos page
const galleryPhotoSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, default: '' },
  category: {
    type: String,
    enum: ['events', 'achievements', 'cultural', 'competitions', 'general'],
    default: 'general'
  },
  cloudinaryPublicId: { type: String },
  secureUrl: { type: String, required: true },
  format: { type: String },
  bytes: { type: Number },
  width: { type: Number },
  height: { type: Number },
  isActive: { type: Boolean, default: true },
  uploadedBy: { type: String, default: 'Admin' },
  uploadedAt: { type: Date, default: Date.now }
});

// Achievement Schema - for toppers managed from admin panel
const achievementSchema = new mongoose.Schema({
  name: { type: String, required: true },
  percentage: { type: String, required: true },
  stream: { type: String, default: '' },
  highlights: { type: String, default: '' },
  rank: { type: Number, required: true },
  classGroup: { type: String, enum: ['10', '12'], required: true },
  year: { type: String, required: true }, // e.g. '2025'
  isTop1Percent: { type: Boolean, default: false },
  certificateUrl: { type: String, default: '' }, // Cloudinary URL for certificate PDF
  certificatePublicId: { type: String, default: '' },
  isActive: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

achievementSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

// Testimonial Schema - for admin-managed student/alumni testimonials
const testimonialSchema = new mongoose.Schema({
  name: { type: String, required: true },
  designation: { type: String, default: '' }, // e.g. "Class of 2018 | Engineer at TCS"
  batch: { type: String, default: '' }, // e.g. "Class of 2018"
  content: { type: String, required: true },
  rating: { type: Number, min: 1, max: 5, default: 5 },
  photoUrl: { type: String, default: '' },
  photoPublicId: { type: String, default: '' },
  isActive: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

testimonialSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

// Announcement Schema - for admin-created notices shown in Announcements page
const announcementSchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  category: {
    type: String,
    enum: ['academic', 'events', 'holiday', 'urgent', 'general'],
    default: 'general'
  },
  isUrgent: { type: Boolean, default: false },
  isNew: { type: Boolean, default: true },
  author: { type: String, default: "Principal's Office" },
  attachments: [{
    name: { type: String },
    url: { type: String },
    publicId: { type: String }
  }],
  publishedAt: { type: Date, default: Date.now },
  expiresAt: { type: Date },
  isActive: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

announcementSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

// ==================== MODEL DEFINITIONS (safe re-registration) ====================

const Application = mongoose.models.Application || mongoose.model('Application', admissionSchema, 'applications');
const Contact = mongoose.models.Contact || mongoose.model('Contact', contactSchema, 'contacts');
const FeePayment = mongoose.models.FeePayment || mongoose.model('FeePayment', feePaymentSchema, 'feePayments');
const User = mongoose.models.User || mongoose.model('User', userSchema, 'users');
const Attendance = mongoose.models.Attendance || mongoose.model('Attendance', attendanceSchema, 'attendance');
const Mark = mongoose.models.Mark || mongoose.model('Mark', marksSchema, 'marks');
const Assignment = mongoose.models.Assignment || mongoose.model('Assignment', assignmentSchema, 'assignments');
const GalleryPhoto = mongoose.models.GalleryPhoto || mongoose.model('GalleryPhoto', galleryPhotoSchema, 'galleryPhotos');
const Achievement = mongoose.models.Achievement || mongoose.model('Achievement', achievementSchema, 'achievements');
const Announcement = mongoose.models.Announcement || mongoose.model('Announcement', announcementSchema, 'announcements');
const Testimonial = mongoose.models.Testimonial || mongoose.model('Testimonial', testimonialSchema, 'testimonials');

module.exports = {
  Application, Contact, FeePayment, User, Attendance, Mark, Assignment,
  GalleryPhoto, Achievement, Announcement, Testimonial
};
