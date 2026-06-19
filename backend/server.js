const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const http = require('http');
const socketIO = require('socket.io');

dotenv.config();

const app = express();
const server = http.createServer(app);
const io = socketIO(server, {
  cors: {
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    methods: ['GET', 'POST']
  }
});

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ limit: '50mb', extended: true }));
app.use('/uploads', express.static('uploads'));

// Database Connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/teborad')
  .then(() => console.log('✅ متصل بقاعدة البيانات'))
  .catch(err => console.error('❌ خطأ في الاتصال:', err));

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/projects', require('./routes/projects'));

// Health Check
app.get('/health', (req, res) => {
  res.json({ status: 'OK', message: 'السيرفر يعمل بشكل صحيح' });
});

// Socket.IO Events
io.on('connection', (socket) => {
  console.log(`👤 مستخدم جديد متصل: ${socket.id}`);

  // الانضمام إلى غرفة المشروع
  socket.on('join-project', (projectId) => {
    socket.join(`project-${projectId}`);
    console.log(`📌 المستخدم ${socket.id} انضم إلى المشروع ${projectId}`);
  });

  // إرسال رسالة
  socket.on('send-message', (data) => {
    io.to(`project-${data.projectId}`).emit('new-message', data);
  });

  // تحديث المهمات
  socket.on('task-updated', (data) => {
    io.to(`project-${data.projectId}`).emit('task-changed', data);
  });

  // قطع الاتصال
  socket.on('disconnect', () => {
    console.log(`👋 مستخدم قطع الاتصال: ${socket.id}`);
  });
});

// Error Handling
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: 'حدث خطأ في السيرفر' });
});

// Start Server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`🚀 السيرفر يعمل على المنفذ ${PORT}`);
  console.log(`🌐 الرابط: http://localhost:${PORT}`);
});
