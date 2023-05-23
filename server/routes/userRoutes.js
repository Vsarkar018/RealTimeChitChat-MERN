const express = require("express")
const router = express.Router();
const {registerUser , loginUser} = require("../controller/userController")


router.post('/login',loginUser)
router.route('/').post(registerUser)

module.exports = router;