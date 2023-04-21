const express = require("express");
const router = express.Router();
const controller = require("../controllers/user.controller");
const authorize = require("../middlewares/privilege");
const privileges = require("../utils/constants").privileges.users;

// RENDERING ROUTES
router.get("/", authorize([privileges.getUsers]), controller.renderUsers);

router.get(
  "/:uid/modificar",
  authorize([privileges.canModifyUsers]),
  controller.modifyUser
);

router.post(
  "/:uid/modificar",
  authorize([privileges.canModifyUsers]),
  controller.modifyUserPost
);

router.delete(
  "/:uid/borrar",
  authorize([privileges.deleteUsers]),
  controller.deleteUser
);

module.exports = router;
