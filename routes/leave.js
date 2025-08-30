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
// backend/routes/leave.js
import express from "express";
import Leave from "../models/Leave.js";
import Notification from "../models/Notification.js";

const router = express.Router();

// ✅ Add new leave request
router.post("/add", async (req, res) => {
  try {
    const { userId, startDate, endDate, reason } = req.body;

    // Save leave request
    const leave = new Leave({ userId, startDate, endDate, reason });
    await leave.save();

    // Create notification
    const notification = new Notification({
      title: "Leave Request",
      message: `Employee has requested leave from ${startDate} to ${endDate}`,
      userId,
    });
    await notification.save();

    // Emit real-time event via Socket.IO
    req.io.emit("newLeaveRequest", notification);

    res.status(201).json({ leave, notification });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
