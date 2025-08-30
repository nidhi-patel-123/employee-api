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
import authMiddleware from "../middleware/authMiddleware.js";
import Leave from "../models/Leave.js";
import Notification from "../models/Notification.js";

const router = express.Router();

// Add new leave request
router.post("/add", authMiddleware, async (req, res) => {
  try {
    const { startDate, endDate, reason } = req.body;
    const userId = req.user.id; // from authMiddleware

    // 1. Save leave request
    const leave = new Leave({ userId, startDate, endDate, reason });
    await leave.save();

    // 2. Create notification for admin
    const notification = new Notification({
      title: "Leave Request",
      message: `${req.user.name} has requested leave from ${startDate} to ${endDate}`,
      userId,
      status: "unread",
      createdAt: new Date(),
    });
    await notification.save();

    // 3. Emit real-time notification to admin dashboard
    req.io.emit("newLeaveRequest", notification);

    res.status(201).json({ leave, notification });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: err.message });
  }
});

// Other leave routes (get, update)
router.get("/", authMiddleware, async (req, res) => {
  const leaves = await Leave.find().populate("userId", "name email");
  res.json(leaves);
});

export default router;

