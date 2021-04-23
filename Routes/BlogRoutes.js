
const express = require("express")
const {createBlog, getallspost, deleteblogs, updateBlogs} = require("../Controllers/blogController") 
const {protect} = require("../Controllers/authController") 
const {doCommenting} = require("../Controllers/CommentController")

const router = express.Router()

router.route("/create").post(protect, createBlog)
router.route("/getblogs").get(protect, getallspost)
router.route("/post/:id/comment").post(protect, doCommenting)
router.route("/post/:id/delete").delete(protect, deleteblogs)
router.route("/post/:id/update").patch(protect, updateBlogs)


module.exports = router