import { Router } from "express";
import demoRoutes from "./demo.routes";
import healthRoutes from "./health.routes";

const router = Router();

router.use("/health", healthRoutes);
router.use("/demo", demoRoutes);

export default router;