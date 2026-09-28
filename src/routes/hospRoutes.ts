import { Router } from "express";
import {
  getHosp,
  getHospById,
  getHospByKeyword,
  postHosp,
  putHosp,
  delHosp,
} from "../controllers/hospControllers.js";

const router = Router();

router.get("/", getHosp);
router.get("/:id", getHospById);
router.get("/cidade/:keyword", getHospByKeyword);
router.post("/", postHosp);
router.put("/:id", putHosp);
router.delete("/:id", delHosp);

export default router;
