import express from "express";
import { requireAuth } from "../middlewares/requireAuth.js";
import { getContracts, signContract } from "../controllers/contractController.js";

const router = express.Router();

// Fetch contracts for the logged-in user
router.get("/", requireAuth, getContracts);

// Digitally sign a specific contract
router.post("/:id/sign", requireAuth, signContract);

export default router;
