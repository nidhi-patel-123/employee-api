// controllers/notificationController.js
import Notification from "../models/Notification.js";

/**
 * Admin: notifications list (newest first)
 */
export const getNotifications = async (req, res) => {
  try {
    // only admin should see admin-targeted notifications
    if (req.user?.role !== "admin") {
      return res.status(403).json({ success: false, error: "Forbidden" });
    }

    const { onlyUnread } = req.query; // ?onlyUnread=true
    const filter = { recipientRole: "admin" };
    if (onlyUnread === "true") filter.isRead = false;

    const items = await Notification.find(filter)
      .sort({ createdAt: -1 })
      .limit(100);

    res.json({ success: true, data: items });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

/**
 * Admin: mark single notification as read
 */
export const markNotificationRead = async (req, res) => {
  try {
    if (req.user?.role !== "admin") {
      return res.status(403).json({ success: false, error: "Forbidden" });
    }

    const { id } = req.params;
    const doc = await Notification.findByIdAndUpdate(
      id,
      { isRead: true },
      { new: true }
    );

    if (!doc) return res.status(404).json({ success: false, error: "Not found" });
    res.json({ success: true, data: doc });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

/**
 * Admin: mark ALL notifications as read
 */
export const markAllNotificationsRead = async (_req, res) => {
  try {
    // optional: restrict to admin as well
    await Notification.updateMany(
      { recipientRole: "admin", isRead: false },
      { $set: { isRead: true } }
    );
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};
