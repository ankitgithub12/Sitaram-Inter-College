const mongoose = require('mongoose');
const { Admin, Teacher, Student } = require('../models');

const getModelByRole = (role) => {
  switch (role) {
    case 'admin': return Admin;
    case 'teacher': return Teacher;
    case 'student': return Student;
    default: return null;
  }
};

exports.getUsers = async (req, res) => {
  try {
    const { role, creator } = req.query;
    
    // If specific role requested
    if (role) {
      const Model = getModelByRole(role);
      if (!Model) return res.status(400).json({ success: false, message: 'Invalid role' });
      
      let query = {};
      if (creator) {
        const escapedCreator = creator.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        query.$or = [
          { createdBy: creator },
          { createdBy: new RegExp(`^${escapedCreator}$`, 'i') }
        ];
      }
      
      const users = await Model.find(query).sort({ createdAt: -1 });
      return res.json({ 
        success: true, 
        count: users.length, 
        data: sanitizeUsers(users, role, creator) 
      });
    }

    // If no role, we might want to fetch from all (e.g. for global user list)
    // For now, let's just fetch from all three and combine
    const [admins, teachers, students] = await Promise.all([
      Admin.find({}),
      Teacher.find({}),
      Student.find({})
    ]);

    const allUsers = [
      ...sanitizeUsers(admins, 'admin', creator),
      ...sanitizeUsers(teachers, 'teacher', creator),
      ...sanitizeUsers(students, 'student', creator)
    ];

    res.json({ success: true, count: allUsers.length, data: allUsers });
  } catch (err) {
    console.error('❌ Error fetching users:', err);
    res.status(500).json({ success: false, message: 'Error fetching users', error: err.message });
  }
};

// Helper to sanitize sensitive data based on permissions
const sanitizeUsers = (users, role, creator) => {
  return users.map(u => {
    const userObj = u.toObject();
    const isCreator = creator && u.createdBy && u.createdBy.toLowerCase() === creator.toLowerCase();
    const isMainAdmin = creator === process.env.DEFAULT_ADMIN_USERNAME;
    const isRequestedRoleAdmin = role === 'admin';
    const canSeePassword = isCreator || isMainAdmin || isRequestedRoleAdmin;

    if (!canSeePassword) {
      delete userObj.password;
      delete userObj.plainPassword;
    }
    return userObj;
  });
};

exports.createUser = async (req, res) => {
  try {
    const { 
      username, password, role, name, email, createdBy, creatorName, subject,
      position, qualification, experience, description, photoUrl, department 
    } = req.body;

    const Model = getModelByRole(role);
    if (!Model) return res.status(400).json({ success: false, message: 'Invalid role' });

    // Check across all collections to ensure unique username globally
    const [existingAdmin, existingTeacher, existingStudent] = await Promise.all([
      Admin.findOne({ username }),
      Teacher.findOne({ username }),
      Student.findOne({ username })
    ]);

    if (existingAdmin || existingTeacher || existingStudent) {
      return res.status(400).json({ success: false, message: 'Username already exists' });
    }

    const userData = { 
      username, password, plainPassword: password, role, name, email, createdBy, creatorName 
    };

    if (role === 'teacher') {
      Object.assign(userData, { subject, position, qualification, experience, description, photoUrl, department });
    }

    const newUser = new Model(userData);
    await newUser.save();
    res.status(201).json({ success: true, message: `${role} created successfully`, data: newUser });
  } catch (err) {
    console.error('❌ Error creating user:', err);
    if (err.code === 11000) {
      const field = Object.keys(err.keyPattern)[0];
      return res.status(400).json({ success: false, message: `Account creation failed: ${field} already exists.` });
    }
    res.status(500).json({ success: false, message: 'Error creating account' });
  }
};

exports.getUserById = async (req, res) => {
  try {
    const { id } = req.params;
    const { role } = req.query; // Role helps target the right collection

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, message: 'Invalid User ID format' });
    }

    let user = null;
    if (role) {
      const Model = getModelByRole(role);
      if (Model) user = await Model.findById(id).select('-password');
    } else {
      // Search all if role not provided
      user = await Admin.findById(id).select('-password') || 
             await Teacher.findById(id).select('-password') || 
             await Student.findById(id).select('-password');
    }

    if (!user) return res.status(404).json({ success: false, message: 'User not found' });
    res.json({ success: true, data: user });
  } catch (err) {
    console.error('❌ Error fetching user:', err);
    res.status(500).json({ success: false, message: 'Error fetching user' });
  }
};

exports.updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { 
      role, name, email, username, password, subject,
      position, qualification, experience, description, photoUrl, department
    } = req.body;

    const Model = getModelByRole(role);
    // If role not provided in body, we must find the user first to know their collection
    let user = null;
    if (Model) {
      user = await Model.findById(id);
    } else {
      user = await Admin.findById(id) || await Teacher.findById(id) || await Student.findById(id);
    }

    if (!user) return res.status(404).json({ success: false, message: 'User not found' });

    if (name) user.name = name;
    if (email) user.email = email;
    if (username) user.username = username;
    if (password) {
      user.password = password;
      user.plainPassword = password;
    }

    // Role-specific fields
    if (user.role === 'teacher') {
      if (subject) user.subject = subject;
      if (position) user.position = position;
      if (qualification) user.qualification = qualification;
      if (experience) user.experience = experience;
      if (description) user.description = description;
      if (photoUrl) user.photoUrl = photoUrl;
      if (department) user.department = department;
    }

    await user.save();
    res.json({ success: true, message: 'Account updated successfully', data: user });
  } catch (err) {
    console.error('❌ Error updating user:', err);
    res.status(500).json({ success: false, message: 'Error updating credentials' });
  }
};

exports.toggleUserStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { role } = req.query;

    let user = null;
    const Model = getModelByRole(role);
    if (Model) {
      user = await Model.findById(id);
    } else {
      user = await Admin.findById(id) || await Teacher.findById(id) || await Student.findById(id);
    }

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
    res.status(500).json({ success: false, message: 'Error updating status' });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { role } = req.query;

    let deletedUser = null;
    const Model = getModelByRole(role);
    if (Model) {
      deletedUser = await Model.findByIdAndDelete(id);
    } else {
      deletedUser = await Admin.findByIdAndDelete(id) || 
                    await Teacher.findByIdAndDelete(id) || 
                    await Student.findByIdAndDelete(id);
    }

    if (!deletedUser) return res.status(404).json({ success: false, message: 'User not found' });
    res.json({ success: true, message: 'Account deleted successfully' });
  } catch (err) {
    console.error('❌ Error deleting user:', err);
    res.status(500).json({ success: false, message: 'Error deleting account' });
  }
};

exports.getFaculty = async (req, res) => {
  try {
    const teachers = await Teacher.find({ 
      isDisabled: { $ne: true } 
    }).select('name position qualification experience description photoUrl department subject');
    
    res.json({ success: true, count: teachers.length, data: teachers });
  } catch (err) {
    console.error('❌ Error fetching faculty:', err);
    res.status(500).json({ success: false, message: 'Error fetching faculty' });
  }
};
