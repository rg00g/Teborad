const express = require('express');
const Project = require('../models/Project');
const User = require('../models/User');
const router = express.Router();

// الحصول على جميع المشاريع المتاحة
router.get('/all', async (req, res) => {
  try {
    const projects = await Project.find({ isActive: true })
      .select('name description projectImage members');
    
    res.json(projects);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// إنشاء مشروع جديد
router.post('/create', async (req, res) => {
  try {
    const { name, adminUsername, adminPassword, projectCode } = req.body;

    const existingProject = await Project.findOne({ projectCode });
    if (existingProject) {
      return res.status(400).json({ error: 'كود المشروع موجود بالفعل' });
    }

    const project = new Project({
      name,
      adminUsername,
      adminPassword,
      projectCode: projectCode || 'PR'
    });

    await project.save();

    res.status(201).json({
      message: 'تم إنشاء المشروع بنجاح',
      project
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// الحصول على مشروع محدد
router.get('/:projectId', async (req, res) => {
  try {
    const project = await Project.findById(req.params.projectId)
      .populate('members.userId', 'fullName username profileImage');

    if (!project) {
      return res.status(404).json({ error: 'المشروع غير موجود' });
    }

    res.json(project);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// طلب الانضمام إلى مشروع
router.post('/:projectId/join-request', async (req, res) => {
  try {
    const { userId } = req.body;
    const project = await Project.findById(req.params.projectId);

    if (!project) {
      return res.status(404).json({ error: 'المشروع غير موجود' });
    }

    // التحقق من عدم انضمام المستخدم بالفعل
    const isMember = project.members.some(m => m.userId.toString() === userId);
    if (isMember) {
      return res.status(400).json({ error: 'أنت بالفعل عضو في هذا المشروع' });
    }

    // إضافة طلب الانضمام
    project.joinRequests.push({ userId, status: 'pending' });
    await project.save();

    res.json({ message: 'تم إرسال طلب الانضمام' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// موافقة/رفض طلب الانضمام
router.post('/:projectId/approve-join', async (req, res) => {
  try {
    const { userId, approved } = req.body;
    const project = await Project.findById(req.params.projectId);

    if (!project) {
      return res.status(404).json({ error: 'المشروع غير موجود' });
    }

    const requestIndex = project.joinRequests.findIndex(
      r => r.userId.toString() === userId
    );

    if (requestIndex === -1) {
      return res.status(404).json({ error: 'الطلب غير موجود' });
    }

    if (approved) {
      project.members.push({ userId, role: 'member' });
      project.joinRequests[requestIndex].status = 'accepted';
    } else {
      project.joinRequests[requestIndex].status = 'rejected';
    }

    await project.save();

    res.json({ message: approved ? 'تم قبول الطلب' : 'تم رفض الطلب' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// مغادرة المشروع
router.post('/:projectId/leave', async (req, res) => {
  try {
    const { userId } = req.body;
    const project = await Project.findById(req.params.projectId);

    if (!project) {
      return res.status(404).json({ error: 'المشروع غير موجود' });
    }

    project.members = project.members.filter(
      m => m.userId.toString() !== userId
    );

    await project.save();

    res.json({ message: 'تم مغادرة المشروع' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// تحديث إعدادات المشروع
router.put('/:projectId/settings', async (req, res) => {
  try {
    const { name, description, statusMessage, theme, backgroundImage } = req.body;
    const project = await Project.findByIdAndUpdate(
      req.params.projectId,
      { name, description, statusMessage, theme, backgroundImage },
      { new: true }
    );

    res.json(project);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
