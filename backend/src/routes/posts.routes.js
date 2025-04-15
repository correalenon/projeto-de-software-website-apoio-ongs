import { Router } from 'express';
import { getPosts, getPostByID, postPost, deletePostByID, putPostByID } from '../controllers/posts.controller.js';
import { authenticateUser } from "../services/authentication.js";

const router = Router();

router.get("/", authenticateUser, getPosts);
router.get("/:id", authenticateUser, getPostByID);
router.post("/", authenticateUser, postPost);
router.put(":/id", authenticateUser, );
router.delete("/:id", authenticateUser, deletePostByID);

export default router;