import { Router } from "express";
import { getUsers, getUsersId, getUsersKeyword, putUsers, postUsers, delUsers } from "../controllers/userControllers.js";

const router = Router();

router.get("/", getUsers);
router.get("/:id", getUsersId);
router.get("/name/:keyword", getUsersKeyword);
router.post("/", postUsers);
router.put("/:id", putUsers);
router.delete("/:id", delUsers);

export default router;