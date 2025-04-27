import { Router } from 'express';
import { getMe, getUsers, getUserByID, postUser, deleteUserByID, putUserByID, PostEmailUser, PutPasswordUser } from '../controllers/users.controller.js';
import { authenticateUser } from "../services/authentication.js";

const router = Router();

router.get("/me", authenticateUser, getMe);
router.get("/", authenticateUser, getUsers);
router.get("/:id", authenticateUser, getUserByID);
router.post("/email", PostEmailUser);
router.post("/", postUser);
router.put("/editpassword", PutPasswordUser);
router.put("/:id", authenticateUser, putUserByID);
router.delete("/:id", authenticateUser, deleteUserByID);

export default router;