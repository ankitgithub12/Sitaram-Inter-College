const mongoose = require('mongoose');

exports.getContacts = async (req, res) => {
  try {
    const Contact = mongoose.model('Contact');
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
    res.status(500).json({ success: false, message: 'Error fetching contacts', error: error.message });
  }
};

exports.getContactById = async (req, res) => {
  try {
    const Contact = mongoose.model('Contact');
    const { id } = req.params;
    
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, message: 'Invalid contact ID format' });
    }
    
    const contact = await Contact.findById(id);
    
    if (!contact) {
      return res.status(404).json({ success: false, message: 'Contact not found' });
    }
    
    res.json({ success: true, data: contact });
  } catch (error) {
    console.error('❌ Error fetching contact:', error);
    res.status(500).json({ success: false, message: 'Error fetching contact', error: error.message });
  }
};

exports.updateContactStatus = async (req, res) => {
  try {
    const Contact = mongoose.model('Contact');
    const { id } = req.params;
    const { status, adminNotes, responseMessage } = req.body;
    
    console.log(`📝 Updating contact ${id} to status: ${status}`);
    
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, message: 'Invalid contact ID' });
    }
    
    const validStatuses = ['unread', 'read', 'replied', 'archived'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid status' });
    }
    
    const updateData = { status, updatedAt: new Date() };
    
    if (adminNotes) updateData.adminNotes = adminNotes;
    if (responseMessage) updateData.responseMessage = responseMessage;
    
    if (status === 'replied') {
      updateData.respondedAt = new Date();
      updateData.respondedBy = 'Admin';
    }
    
    const updatedContact = await Contact.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    );
    
    if (!updatedContact) {
      return res.status(404).json({ success: false, message: 'Contact not found' });
    }
    
    res.json({ success: true, message: `Contact marked as ${status}`, data: updatedContact });
  } catch (error) {
    console.error('❌ Error updating contact status:', error);
    res.status(500).json({ success: false, message: 'Error updating contact status', error: error.message });
  }
};

exports.deleteContact = async (req, res) => {
  try {
    const Contact = mongoose.model('Contact');
    const { id } = req.params;
    
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, message: 'Invalid contact ID' });
    }
    
    const deletedContact = await Contact.findByIdAndDelete(id);
    
    if (!deletedContact) {
      return res.status(404).json({ success: false, message: 'Contact not found' });
    }
    
    res.json({ success: true, message: 'Contact deleted successfully', data: { id: deletedContact._id } });
  } catch (error) {
    console.error('❌ Error deleting contact:', error);
    res.status(500).json({ success: false, message: 'Error deleting contact', error: error.message });
  }
};

exports.createContact = async (req, res) => {
  try {
    const Contact = mongoose.model('Contact');
    console.log('📨 Received contact form data');
    
    if (!req.body.name || !req.body.email || !req.body.message) {
      return res.status(400).json({ success: false, message: 'Name, email, and message are required' });
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
    
    res.status(201).json({ success: true, message: 'Contact form submitted successfully!', data: savedContact });
  } catch (error) {
    console.error('❌ Error saving contact:', error);
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({ success: false, message: 'Validation failed', errors: messages });
    }
    res.status(500).json({ success: false, message: 'Error submitting contact form', error: error.message });
  }
};
