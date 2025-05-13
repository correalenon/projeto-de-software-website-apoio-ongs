import { Router } from 'express';
import { getMe, getUsers, getUserByID, postUser, deleteUserByID, putUser, PostEmailUser, PutPasswordUser } from '../controllers/users.controller.js';
import { authenticateUserOrOng } from "../services/authentication.js";

const router = Router();

router.get("/me", authenticateUserOrOng, getMe);
router.get("/", authenticateUserOrOng, getUsers);
router.get("/:id", authenticateUserOrOng, getUserByID);
router.post("/email", PostEmailUser);
router.post("/", postUser);
router.put("/editpassword", PutPasswordUser);
router.put("/", authenticateUserOrOng, putUser);
router.delete("/:id", authenticateUserOrOng, deleteUserByID);

export default router;