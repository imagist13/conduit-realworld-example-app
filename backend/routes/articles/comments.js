const express = require("express");
const router = express.Router();
const verifyToken = require("../../middleware/authentication");
const {
  allComments,
  createComment,
  deleteComment,
  likeComment,
  unlikeComment,
} = require("../../controllers/comments");

//? All Comments for Article
router.get("/:slug/comments", verifyToken, allComments);
//* Create Comment for Article
router.post("/:slug/comments", verifyToken, createComment);
//* Delete Comment for Article
router.delete("/:slug/comments/:commentId", verifyToken, deleteComment);
//* Like Comment (幂等)
router.post("/:slug/comments/:commentId/like", verifyToken, likeComment);
//* Unlike Comment (幂等)
router.delete("/:slug/comments/:commentId/like", verifyToken, unlikeComment);

module.exports = router;
