const express = require("express");
const router = express.Router();
const {
  registerUser,
  loginUser,
  getAllUsers,
} = require("../controller/userController");

const auth = require("../middleware/auth");

router.post("/login", loginUser);
router.route("/").post(registerUser);
router.get("/",auth, getAllUsers);
module.exports = router;
