const express = require("express")
const { registerAccount, login, protect, updatePassword, logout, updateMe, deactiveUser} = require("../Controllers/authController")
const { getMe} = require("../Controllers/userController")



const router = express.Router()



router.route("/signup").post(registerAccount)
router.route("/login").post(login)
router.route("/update-pass").patch(protect, updatePassword)
router.route("/update-Me").patch(protect, updateMe)
router.route("/logout").post(protect, logout)
router.route("/get-me").post(protect, getMe)
router.route("/deactive-me").patch(protect, deactiveUser)

module.exports = router