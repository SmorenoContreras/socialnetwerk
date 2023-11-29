const express = require("express");
const router = express.Router();
const controller = require("../../api/controllers/user");
const { verifyToken } = require("../middlewares/auth")

router.route("").post(controller.createUser);
router.route("/login").post(controller.login);
router.route("/addRemoveFriend").post(verifyToken, controller.addRemoveFriend);

router.route('/list').get(controller.userList);

module.exports = router;


