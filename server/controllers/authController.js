const { Admin, Teacher, Student } = require('../models');

// Universal login (checks separate collections)
exports.login = async (req, res) => {
  try {
    const { username, password, role } = req.body;
    let user = null;
    let userRole = role;

    // If role is provided, search in that specific collection
    if (role === 'admin') {
      user = await Admin.findOne({ username });
    } else if (role === 'teacher') {
      user = await Teacher.findOne({ username });
    } else if (role === 'student') {
      user = await Student.findOne({ username });
    } else {
      // If no role provided, search sequentially (production should ideally have role)
      user = await Admin.findOne({ username });
      if (user) userRole = 'admin';
      
      if (!user) {
        user = await Teacher.findOne({ username });
        if (user) userRole = 'teacher';
      }
      
      if (!user) {
        user = await Student.findOne({ username });
        if (user) userRole = 'student';
      }
    }

    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid username or password' });
    }

    if (user.isDisabled) {
      return res.status(403).json({
        success: false,
        message: 'This account has been disabled. Please contact your administrator.'
      });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid username or password' });
    }

    res.json({
      success: true,
      token: `token_${userRole}_${user.username}`,
      userId: user._id,
      role: userRole,
      name: user.name,
      username: user.username,
      message: 'Login successful'
    });
  } catch (error) {
    console.error('❌ Login error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// Backward-compat admin login (hardcoded check)
exports.adminLogin = (req, res) => {
  const { username, password } = req.body;
  if (username === '221205' && password === 'Sitaram@2002') {
    res.json({ success: true, token: 'adminToken123', role: 'admin', message: 'Login successful' });
  } else {
    res.status(401).json({ success: false, message: 'Invalid username or password' });
  }
};

// Logout
exports.adminLogout = (req, res) => {
  res.json({ success: true, message: 'Logged out successfully' });
};
