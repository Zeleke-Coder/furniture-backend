import express from "express";
import { getDashboardStatsController } from "../controllers/DashboardStatsControllers";

const router = express.Router();

router.get("/stats", getDashboardStatsController);

export default router;
