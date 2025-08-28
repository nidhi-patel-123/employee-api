import express from "express";
import Notification from "../models/Notification.js";

const router = express.Router();

// Create notification
router.post("/add", async (req, res) => {
  try {
    const { message, type, user } = req.body;
    const newNotif = new Notification({ message, type, user });
    await newNotif.save();

    if (req.app.get("io")) {
      req.app.get("io").to(user).emit("newNotification", newNotif);
    }

    res.status(201).json(newNotif);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get notifications for Admin
router.get("/admin/:adminId", async (req, res) => {
  try {
    const notifications = await Notification.find({ user: req.params.adminId }).sort({ createdAt: -1 });
    res.status(200).json(notifications);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
