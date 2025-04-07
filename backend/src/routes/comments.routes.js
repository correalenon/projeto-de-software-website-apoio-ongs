import { Router } from 'express';
import { authenticateUser } from '../services/authentication.js';
import { getComments, getCommentByID, postComment, deleteCommentByID, putCommentByID } from '../controllers/comments.controller.js';

const router = Router();

router.get("/", authenticateUser, getComments);
router.get("/:id", authenticateUser, getCommentByID);
router.post("/", authenticateUser, postComment);
router.delete("/:id", authenticateUser, deleteCommentByID);
router.put("/:id", authenticateUser, putCommentByID);

export default router;