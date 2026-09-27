import { Router } from "express";
import {
  getUsers,
  getUsersKeyword,
  getUsersId,
  postUser,
  putUser,
  delUser,
} from "../controllers/userControllers.js";

const router = Router();

router.get("/", getUsers);
router.get("/:id", getUsersId);
router.get("/name/:keyword", getUsersKeyword);
router.post("/", postUser);
router.put("/:id", putUser);
router.delete("/:id", delUser);

export default router;
