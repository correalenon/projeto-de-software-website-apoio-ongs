import { Router } from 'express';
import { authenticateUserOrOng } from '../services/authentication.js';
import { getComments, getCommentByID, postComment, deleteCommentByID, putCommentByID, getCommentsByPostID } from '../controllers/comments.controller.js';

const router = Router();

router.get("/", authenticateUserOrOng, getComments);
router.get("/:id", authenticateUserOrOng, getCommentByID);
router.get("/post/:postId", authenticateUserOrOng, getCommentsByPostID);
router.post("/", authenticateUserOrOng, postComment);
router.delete("/:id", authenticateUserOrOng, deleteCommentByID);
router.put("/:id", authenticateUserOrOng, putCommentByID);

export default router;