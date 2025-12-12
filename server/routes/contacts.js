
const mongoose = require('mongoose');

const contactSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: [true, 'Name is required'],
    trim: true,
    minlength: [2, 'Name must be at least 2 characters long'],
    maxlength: [100, 'Name cannot exceed 100 characters']
  },
  
  email: { 
    type: String, 
    required: [true, 'Email is required'],
    trim: true,
    lowercase: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please provide a valid email address']
  },
  
  phone: { 
    type: String,
    trim: true,
    match: [/^[0-9]{10}$/, 'Please provide a valid 10-digit phone number']
  },
  
  subject: { 
    type: String,
    trim: true,
    default: 'General Inquiry'
  },
  
  message: { 
    type: String, 
    required: [true, 'Message is required'],
    trim: true,
    minlength: [10, 'Message must be at least 10 characters long'],
    maxlength: [2000, 'Message cannot exceed 2000 characters']
  },
  
  status: { 
    type: String, 
    enum: ['unread', 'read', 'replied', 'archived'], 
    default: 'unread' 
  },
  
  adminNotes: {
    type: String,
    trim: true,
    maxlength: [500, 'Notes cannot exceed 500 characters']
  },
  
  responseMessage: {
    type: String,
    trim: true,
    maxlength: [1000, 'Response cannot exceed 1000 characters']
  },
  
  respondedBy: {
    type: String,
    default: 'Admin'
  },
  
  respondedAt: {
    type: Date
  },
  
  submittedAt: { 
    type: Date, 
    default: Date.now
  },
  
  updatedAt: { 
    type: Date, 
    default: Date.now 
  }
});

// Update the updatedAt field on save
contactSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Virtual field for time since submission
contactSchema.virtual('timeSinceSubmission').get(function() {
  const now = new Date();
  const submitted = this.submittedAt;
  const diffInHours = Math.floor((now - submitted) / (1000 * 60 * 60));
  
  if (diffInHours < 1) return 'Just now';
  if (diffInHours < 24) return `${diffInHours} hours ago`;
  
  const diffInDays = Math.floor(diffInHours / 24);
  return `${diffInDays} days ago`;
});

const Contact = mongoose.model('Contact', contactSchema, 'contacts');

module.exports = Contact;
