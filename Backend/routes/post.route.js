import express from "express";
import upload from "../middlewares/multer.js";
import { addComment, addNewPost, bookmarkPost, deletePost, dislikePost, getCommentOfPost, getUserPosts, likePost } from "../Controllers/postController.js";
import { getAllPost } from "../Controllers/postController.js";
import isAuthenticated from "../middlewares/isAuthentication.js";
const router=express.Router();
router.route("/addPost").post(isAuthenticated,upload.single('image'),addNewPost)
router.route("/all").get(isAuthenticated,getAllPost);
router.route("/userPost/all").get(isAuthenticated,getUserPosts)
router.route("/:id/like").get(isAuthenticated,likePost)
router.route("/:id/disLike").get(isAuthenticated,dislikePost)
router.route("/:id/comment").post(isAuthenticated,addComment)
router.route("/:id/comment/all").post(isAuthenticated,getCommentOfPost)
router.route("/delete/:id").post(isAuthenticated,deletePost)
router.route("/:id/bookmark").post(isAuthenticated,bookmarkPost)

export default router;






