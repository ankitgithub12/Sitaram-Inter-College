const mongoose = require('mongoose');
const { User } = require('../models');

exports.getUsers = async (req, res) => {
  try {
    const { role, creator } = req.query;
    let query = {};

    if (role) query.role = role;
    if (creator) {
      const escapedCreator = creator.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      query.$or = [
        { createdBy: creator },
        { createdBy: new RegExp(`^${escapedCreator}$`, 'i') }
      ];
    }

    const users = await User.find(query).sort({ createdAt: -1 });

    const sanitizedUsers = users.map(u => {
      const userObj = u.toObject();
      const isCreator = creator && u.createdBy && u.createdBy.toLowerCase() === creator.toLowerCase();
      const isMainAdmin = creator === '221205';
      const isRequestedRoleAdmin = role === 'admin';
      const canSeePassword = isCreator || isMainAdmin || isRequestedRoleAdmin;

      if (!canSeePassword) {
        delete userObj.password;
        delete userObj.plainPassword;
      }
      return userObj;
    });

    res.json({ success: true, count: sanitizedUsers.length, data: sanitizedUsers });
  } catch (err) {
    console.error('❌ Error fetching users:', err);
    res.status(500).json({ success: false, message: 'Error fetching users', error: err.message });
  }
};

exports.createUser = async (req, res) => {
  try {
    const { 
      username, password, role, name, email, createdBy, creatorName, subject,
      position, qualification, experience, description, photoUrl, department 
    } = req.body;

    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ success: false, message: 'Username already exists' });
    }

    const newUser = new User({ 
      username, password, plainPassword: password, role, name, email, createdBy, creatorName, subject,
      position, qualification, experience, description, photoUrl, department
    });
    await newUser.save();
    res.status(201).json({ success: true, message: `${role} created successfully`, data: newUser });
  } catch (err) {
    console.error('❌ Error creating user:', err);
    if (err.code === 11000) {
      const field = Object.keys(err.keyPattern)[0];
      return res.status(400).json({ success: false, message: `Account creation failed: ${field} already exists.` });
    }
    res.status(500).json({ success: false, message: 'Error creating user account' });
  }
};

exports.getUserById = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ success: false, message: 'Invalid User ID format' });
    }
    const user = await User.findById(req.params.id).select('-password');
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });
    res.json({ success: true, data: user });
  } catch (err) {
    console.error('❌ Error fetching user:', err);
    res.status(500).json({ success: false, message: 'Error fetching user', error: err.message });
  }
};

exports.updateUser = async (req, res) => {
  try {
    const { 
      name, email, username, password, subject,
      position, qualification, experience, description, photoUrl, department
    } = req.body;
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });

    if (name) user.name = name;
    if (email) user.email = email;
    if (username) user.username = username;
    if (password) {
      user.password = password;
      user.plainPassword = password;
    }
    if (subject) user.subject = subject;
    if (position) user.position = position;
    if (qualification) user.qualification = qualification;
    if (experience) user.experience = experience;
    if (description) user.description = description;
    if (photoUrl) user.photoUrl = photoUrl;
    if (department) user.department = department;

    await user.save();
    res.json({ success: true, message: 'User credentials updated successfully', data: user });
  } catch (err) {
    console.error('❌ Error updating user:', err);
    res.status(500).json({ success: false, message: 'Error updating user credentials' });
  }
};

exports.toggleUserStatus = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });

    user.isDisabled = !user.isDisabled;
    await user.save();

    res.json({
      success: true,
      message: `Account ${user.isDisabled ? 'disabled' : 'enabled'} successfully`,
      isDisabled: user.isDisabled
    });
  } catch (err) {
    console.error('❌ Error toggling user status:', err);
    res.status(500).json({ success: false, message: 'Error updating user status' });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const deletedUser = await User.findByIdAndDelete(req.params.id);
    if (!deletedUser) return res.status(404).json({ success: false, message: 'User not found' });
    res.json({ success: true, message: 'User account deleted successfully' });
  } catch (err) {
    console.error('❌ Error deleting user:', err);
    res.status(500).json({ success: false, message: 'Error deleting user' });
  }
};

exports.getFaculty = async (req, res) => {
  try {
    const teachers = await User.find({ 
      role: 'teacher', 
      isDisabled: { $ne: true } 
    }).select('name position qualification experience description photoUrl department subject');
    
    res.json({ success: true, count: teachers.length, data: teachers });
  } catch (err) {
    console.error('❌ Error fetching faculty:', err);
    res.status(500).json({ success: false, message: 'Error fetching faculty' });
  }
};
