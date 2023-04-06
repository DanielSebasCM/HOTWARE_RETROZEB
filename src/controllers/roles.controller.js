const Role = require("../models/role.model");

const renderRoles = async (req, res, next) => {
  try {
    const roles = await Role.getAllActive();
    res.render("roles", { roles, title: "Roles" });
  } catch (err) {
    next(err);
  }
};

module.exports = {
    renderRoles,
};