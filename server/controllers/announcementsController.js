const mongoose = require('mongoose');
const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');

const Announcement = mongoose.model('Announcement');

// Configure Cloudinary storage for attachments
const attachmentsStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'sric_site/announcements',
    allowed_formats: ['pdf', 'jpg', 'jpeg', 'png', 'docx', 'doc'],
    resource_type: 'auto',
    public_id: (req, file) => {
      return `annex-${Date.now()}-${Math.round(Math.random() * 1E9)}`;
    }
  }
});

exports.uploadAttachments = multer({ 
  storage: attachmentsStorage,
  limits: { fileSize: 10 * 1024 * 1024 } // 10MB limit per file
});

// GET active announcements
exports.getAnnouncements = async (req, res) => {
  try {
    const { includeExpired, limit } = req.query;
    let query = { isActive: true };
    
    // Automatically filter out expired unless requested
    if (includeExpired !== 'true') {
      query.$or = [
        { expiresAt: { $exists: false } },
        { expiresAt: null },
        { expiresAt: { $gt: new Date() } }
      ];
    }

    let ancQuery = Announcement.find(query).sort({ isUrgent: -1, publishedAt: -1 });
    if (limit && parseInt(limit) > 0) {
      ancQuery = ancQuery.limit(parseInt(limit));
    }

    const announcements = await ancQuery;
    res.json({ success: true, data: announcements });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch announcements', error: error.message });
  }
};

// POST create 
exports.createAnnouncement = async (req, res) => {
  try {
    const data = { ...req.body };
    
    // Convert string booleans if sent via FormData
    if (data.isUrgent === 'true') data.isUrgent = true;
    if (data.isUrgent === 'false') data.isUrgent = false;
    if (data.isNew === 'true') data.isNew = true;
    if (data.isNew === 'false') data.isNew = false;
    
    if (req.files && req.files.length > 0) {
      data.attachments = req.files.map(file => ({
        name: file.originalname,
        url: file.path,
        publicId: file.filename
      }));
    }

    const newAnc = new Announcement(data);
    const savedAnc = await newAnc.save();
    res.status(201).json({ success: true, data: savedAnc });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Creation failed', error: error.message });
  }
};

// PUT update
exports.updateAnnouncement = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = { ...req.body };

    // Boolean string parsing
    if (updates.isUrgent === 'true') updates.isUrgent = true;
    if (updates.isUrgent === 'false') updates.isUrgent = false;
    if (updates.isNew === 'true') updates.isNew = true;
    if (updates.isNew === 'false') updates.isNew = false;
    
    // Handle new attachments
    let newAttachments = [];
    if (req.files && req.files.length > 0) {
      newAttachments = req.files.map(file => ({
        name: file.originalname,
        url: file.path,
        publicId: file.filename
      }));
    }

    // Keep old attachments if sent as stringified array or similar, normally handled by frontend logic
    // For simplicity, we just append new files unless instructed otherwise.
    if (newAttachments.length > 0) {
      // It's usually easier to replace all or merge. Merging here.
      const oldAnc = await Announcement.findById(id);
      if (oldAnc && oldAnc.attachments) {
         updates.attachments = [...oldAnc.attachments, ...newAttachments];
      } else {
         updates.attachments = newAttachments;
      }
    }

    const updatedAnc = await Announcement.findByIdAndUpdate(id, updates, { new: true });
    if (!updatedAnc) return res.status(404).json({ success: false, message: 'Not found' });

    res.json({ success: true, data: updatedAnc });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Update failed', error: error.message });
  }
};

// DELETE announcement
exports.deleteAnnouncement = async (req, res) => {
  try {
    const { id } = req.params;
    const oldAnc = await Announcement.findById(id);
    if (!oldAnc) return res.status(404).json({ success: false, message: 'Not found' });

    if (oldAnc.attachments && oldAnc.attachments.length > 0) {
      for (const att of oldAnc.attachments) {
        if (att.publicId) {
          await cloudinary.uploader.destroy(att.publicId).catch(() => {});
        }
      }
    }

    await Announcement.findByIdAndDelete(id);
    res.json({ success: true, message: 'Deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Delete failed', error: error.message });
  }
};
