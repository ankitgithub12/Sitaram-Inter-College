const { User } = require('../models');

// Universal login (all roles)
exports.login = async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });

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
      token: `token_${user.role}_${user.username}`,
      userId: user._id,
      role: user.role,
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
