const expresss = require("express");
const router = expresss.Router();

const {
  accessChats,
  fetchChats,
  createGroupChat,
  renameGroup,
  addToGroup,
  removeFromGroup
} = require("../controller/chatController");

router.route("/").post(accessChats).get(fetchChats);
router.post("/group", createGroupChat);
router.put("/rename", renameGroup);
router.put("groupadd", addToGroup);
router.put("groupremove", removeFromGroup);

module.exports = router;
