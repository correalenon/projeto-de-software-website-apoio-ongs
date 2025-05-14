import { Router } from 'express';
import { getPosts, getPostByID, postPost, postLike, postComment, putPostByID, putCommentByID, deletePostByID, deleteLikeByID, deleteCommentByID } from '../controllers/posts.controller.js';
import { authenticateUser } from "../services/authentication.js";

const router = Router();

router.get("/", authenticateUser, getPosts);
router.get("/:id", authenticateUser, getPostByID);
router.post("/", authenticateUser, postPost);
router.post("/:postId/likes", authenticateUser, postLike);
router.post("/:postId/comments", authenticateUser, postComment);
router.put("/:id", authenticateUser, putPostByID);
router.put("/:postId/comments/:commentId", authenticateUser, putCommentByID);
router.delete("/:id", authenticateUser, deletePostByID);
router.delete("/:postId/likes/:likeId", authenticateUser, deleteLikeByID);
router.delete("/:postId/comments/:commentId", authenticateUser, deleteCommentByID);

export default router;