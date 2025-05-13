import { Router } from 'express';
import { getPosts, getPostByID, postPost, deletePostByID, putPostByID } from '../controllers/posts.controller.js';
import { authenticateUserOrOng } from "../services/authentication.js";

const router = Router();

router.get("/", authenticateUserOrOng, getPosts);
router.get("/:id", authenticateUserOrOng, getPostByID);
router.post("/", authenticateUserOrOng, postPost);
router.put(":/id", authenticateUserOrOng, );
router.delete("/:id", authenticateUserOrOng, deletePostByID);

export default router;