const express = require("express");
const router = express.Router();
const {
  registerUser,
  loginUser,
  getUsers,
  getAllUsers
} = require("../controller/userController");

const auth = require("../middleware/auth");

router.post("/login", loginUser);
router.route("/").post(registerUser);
router.get("/",auth, getUsers);
router.get("/all",auth, getAllUsers);
module.exports = router;
