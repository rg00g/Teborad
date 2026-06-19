const express = require('express');
const jwt = require('jwt-simple');
const User = require('../models/User');
const router = express.Router();

const SECRET = process.env.JWT_SECRET || 'your_secret_key';

// تسجيل مستخدم جديد
router.post('/register', async (req, res) => {
  try {
    const { fullName, username, email, password } = req.body;

    // التحقق من وجود المستخدم
    const existingUser = await User.findOne({ 
      $or: [{ username }, { email }] 
    });
    
    if (existingUser) {
      return res.status(400).json({ 
        error: 'المستخدم موجود بالفعل' 
      });
    }

    // إنشاء مستخدم جديد
    const user = new User({
      fullName,
      username,
      email,
      password
    });

    await user.save();

    const token = jwt.encode({ 
      userId: user._id, 
      username: user.username 
    }, SECRET);

    res.status(201).json({
      message: 'تم إنشاء الحساب بنجاح',
      token,
      user: {
        id: user._id,
        fullName: user.fullName,
        username: user.username,
        email: user.email
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// تسجيل دخول
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    const user = await User.findOne({ username });
    if (!user) {
      return res.status(401).json({ error: 'اسم المستخدم أو كلمة المرور غير صحيحة' });
    }

    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: 'اسم المستخدم أو كلمة المرور غير صحيحة' });
    }

    const token = jwt.encode({ 
      userId: user._id, 
      username: user.username 
    }, SECRET);

    res.json({
      message: 'تم تسجيل الدخول بنجاح',
      token,
      user: {
        id: user._id,
        fullName: user.fullName,
        username: user.username,
        email: user.email,
        profileImage: user.profileImage
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// التحقق من التوكن
router.get('/verify', (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ error: 'لا يوجد توكن' });
    }

    const decoded = jwt.decode(token, SECRET);
    res.json({ valid: true, decoded });
  } catch (error) {
    res.status(401).json({ error: 'توكن غير صحيح' });
  }
});

module.exports = router;
