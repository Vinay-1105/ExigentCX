import express from "express";
import { requireAuth } from "../middlewares/requireAuth.js";
import { 
  getExpertProfile, 
  updateExpertProfile, 
  getOpportunities,
  acceptInvitation,
  declineInvitation
} from "../controllers/expertController.js";

const router = express.Router();

router.get("/profile", requireAuth, getExpertProfile);
router.put("/profile", requireAuth, updateExpertProfile);
router.get("/opportunities", requireAuth, getOpportunities);

router.post("/invitations/:id/accept", requireAuth, acceptInvitation);
router.post("/invitations/:id/decline", requireAuth, declineInvitation);

export default router;
