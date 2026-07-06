import { Router } from "express";
import { publicRoute,protectedRoute,slowRoute,burstRoute} from "../controllers/demo.controller";
import {rateLimiter} from "../middleware/rateLimiter";

const router = Router();

router.route('/public').get(publicRoute)
router.route("/protected").get(rateLimiter, protectedRoute);
router.route("/slow").get(rateLimiter, slowRoute);
router.route("/burst").get(rateLimiter, burstRoute);

export default router;