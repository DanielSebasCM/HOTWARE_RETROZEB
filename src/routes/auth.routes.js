const express = require("express");
const router = express.Router();
const authController = require("../controllers/auth.controller");
const authMiddleware = require("../middlewares/auth");
const { routes } = require("../utils/constants");

// LOGIN
router.get(`${routes.login}`, authController.renderLogin);
router.post(`${routes.login}`, authController.loginAPI);

// JIRA USER ID
router.post(
  `${routes.jiraUserID}`,
  authMiddleware.validateTokenActive,
  authController.addJiraId
);

// LOGOUT
router.get(`${routes.logout}`, authController.logoutAPI);

// REFRESH TOKEN
router.post(`${routes.refreshToken}`, authController.refreshTokenAPI);

module.exports = router;
