const express = require("express");
const router = express.Router();
const controller = require("../../api/controllers/like");
const { verifyToken } = require("../middlewares/auth")


router.route("").post(verifyToken, controller.create);
router.route("/").get(verifyToken, controller.find);
router.route("/:id").put(verifyToken, controller.findOneAndUpdate);
router.route("/:id").delete(verifyToken, controller.findOneAndDelete);


module.exports = router;