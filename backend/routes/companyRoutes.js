import express from "express";
import { requireAuth } from "../middlewares/requireAuth.js";
import { 
  getCompanyProfile, 
  getRegisteredExperts, 
  getRegisteredExpertById, 
  getTeamMembers,
  getCompanyRequirements,
  sendInvitation,
  getCompanyInvitations
} from "../controllers/companyController.js";

const router = express.Router();

router.get("/profile", requireAuth, getCompanyProfile);
router.get("/team", requireAuth, getTeamMembers);
router.get("/experts", requireAuth, getRegisteredExperts);
router.get("/experts/:expertId", requireAuth, getRegisteredExpertById);
router.get("/requirements", requireAuth, getCompanyRequirements);
router.get("/invitations", requireAuth, getCompanyInvitations);
router.post("/invite", requireAuth, sendInvitation);

export default router;
