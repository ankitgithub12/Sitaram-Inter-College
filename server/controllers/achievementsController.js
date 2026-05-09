const mongoose = require('mongoose');
const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const path = require('path');

const Achievement = mongoose.model('Achievement');

// Configure Cloudinary storage for certificates
const certificateStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'sric_site/certificates',
    allowed_formats: ['pdf', 'jpg', 'jpeg', 'png', 'webp'],
    resource_type: 'auto',
    public_id: (req, file) => {
      return `certificate-${Date.now()}-${Math.round(Math.random() * 1E9)}`;
    }
  }
});

exports.uploadCertificate = multer({ 
  storage: certificateStorage,
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB limit
});

// GET achievements (grouped optionally, or all active)
exports.getAchievements = async (req, res) => {
  try {
    const { year, classGroup, limit } = req.query;
    let query = { isActive: true };
    
    if (year && year !== 'all') {
      if (year === 'latest') {
         // handle latest year grouping on client or find max year
         // Just return all and let client group, or find max year here.
         const latestRecord = await Achievement.findOne({isActive: true}).sort({year: -1});
         if (latestRecord) {
             query.year = latestRecord.year;
         }
      } else {
         query.year = year;
      }
    }
    
    if (classGroup && classGroup !== 'all') {
      query.classGroup = classGroup;
    }

    let achievementsQuery = Achievement.find(query).sort({ rank: 1, percentage: -1 });
    if (limit && parseInt(limit) > 0) {
      achievementsQuery = achievementsQuery.limit(parseInt(limit));
    }

    const achievements = await achievementsQuery;
    res.json({ success: true, data: achievements });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch achievements', error: error.message });
  }
};

// POST create achievement
exports.createAchievement = async (req, res) => {
  try {
    const data = { ...req.body };
    
    if (req.file) {
      data.certificateUrl = req.file.path;
      data.certificatePublicId = req.file.filename;
    }

    // Ensure numeric rank
    if (data.rank) data.rank = parseInt(data.rank);

    const newAchievement = new Achievement(data);
    const savedAchievement = await newAchievement.save();
    res.status(201).json({ success: true, data: savedAchievement });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to create achievement', error: error.message });
  }
};

// PUT update achievement
exports.updateAchievement = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = { ...req.body };
    
    if (req.file) {
      // Find old one and maybe delete certificate
      const oldAchievement = await Achievement.findById(id);
      if (oldAchievement && oldAchievement.certificatePublicId) {
        await cloudinary.uploader.destroy(oldAchievement.certificatePublicId).catch(() => {});
      }
      updates.certificateUrl = req.file.path;
      updates.certificatePublicId = req.file.filename;
    }

    const updatedAchievement = await Achievement.findByIdAndUpdate(id, updates, { new: true });
    if (!updatedAchievement) {
      return res.status(404).json({ success: false, message: 'Achievement not found' });
    }

    res.json({ success: true, data: updatedAchievement });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to update achievement', error: error.message });
  }
};

// DELETE achievement
exports.deleteAchievement = async (req, res) => {
  try {
    const { id } = req.params;
    const oldAchievement = await Achievement.findById(id);
    if (!oldAchievement) return res.status(404).json({ success: false, message: 'Achievement not found' });

    if (oldAchievement.certificatePublicId) {
      await cloudinary.uploader.destroy(oldAchievement.certificatePublicId).catch(() => {});
    }

    await Achievement.findByIdAndDelete(id);
    res.json({ success: true, message: 'Achievement deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Delete failed', error: error.message });
  }
};
