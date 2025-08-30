// import express from 'express'
// import authMiddleware from '../middleware/authMiddleware.js'
// import { addLeave,getLeave,getLeaves,getLeaveDetail,updateLeave} from '../controllers/leaveController.js'
// const router = express.Router()

// router.post('/add', authMiddleware,addLeave)
// router.get('/detail/:id', authMiddleware,getLeaveDetail)
// router.get('/:id/:role', authMiddleware,getLeave)
// router.get('/', authMiddleware, getLeaves)
// router.put('/:id', authMiddleware,updateLeave)

// export default router


// ----------------------------------------------------------------------------
import express from 'express';
import authMiddleware from '../middleware/authMiddleware.js';
import { addLeave, getLeave, getLeaves, getLeaveDetail, updateLeave } from '../controllers/leaveController.js';

const router = express.Router();

// ✅ Add new leave request (with Socket.IO)
router.post('/add', authMiddleware, async (req, res) => {
  try {
    // Call your existing controller
    const leave = await addLeave(req, res);

    // Create notification (assuming addLeave returns leave)
    const notification = {
      title: 'Leave Request',
      message: `Employee has requested leave from ${req.body.startDate} to ${req.body.endDate}`,
      userId: req.user.id,
      createdAt: new Date(),
      status: 'unread'
    };

    // Save notification to DB (optional)
    // If you have Notification model:
    // await new Notification(notification).save();

    // Emit real-time notification to all connected clients
    req.io.emit('newLeaveRequest', notification);

    res.status(201).json({ leave, notification });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get leave detail by ID
router.get('/detail/:id', authMiddleware, getLeaveDetail);

// Get leave for a specific user and role
router.get('/:id/:role', authMiddleware, getLeave);

// Get all leaves (admin)
router.get('/', authMiddleware, getLeaves);

// Update leave
router.put('/:id', authMiddleware, updateLeave);

export default router;

