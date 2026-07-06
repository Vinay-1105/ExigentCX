import express from "express";
import { requireAuth } from "../middlewares/requireAuth.js";
import { 
  getNotifications, 
  markAsRead, 
  markAllAsRead 
} from "../controllers/notificationController.js";

const router = express.Router();

// Securing all notification routes via authentication middleware
router.use(requireAuth);

router.get("/", getNotifications);
router.patch("/:id/read", markAsRead);
router.post("/mark-all-read", markAllAsRead);

export default router;
