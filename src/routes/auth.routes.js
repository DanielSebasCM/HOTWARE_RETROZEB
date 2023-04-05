const express = require("express");
const router = express.Router();
const authController = require("../controllers/auth.controller");
const { routes } = require("../utils/constants");

// GET
router.get("/", async (req, res) => {
  res.redirect(routes.retrospectives);
});

// LOGIN
router.get(`${routes.login}`, authController.renderLogin);
router.post(`${routes.login}`, authController.loginAPI);

// LOGOUT
router.get("/logout", authController.logoutAPI);

// REFRESH TOKEN
router.post(`/token/refresh`, authController.refreshTokenAPI);

module.exports = router;
