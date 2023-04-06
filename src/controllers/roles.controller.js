const Role = require("../models/role.model");
const Privilege = require("../models/privilege.model");

const renderRoles = async (req, res, next) => {
  try {
    const roles = await Role.getAllActive();
    const privileges = await Privilege.getAll();
    res.render("roles", { roles, privileges, title: "Roles" });
  } catch (err) {
    next(err);
  }
};

const deleteRole = async (req, res, next) => {
  try {
    const { id } = req.body;
    const role = await Role.getById(id);
    await role.delete();
    req.session.successMessage = "Rol eliminado con éxito";
    res.redirect("/roles");
  } catch (err) {
    next(err);
  }
};

const renderNewRole = async (req, res, next) => {
  try {
    const privileges = await Privilege.getAll();
    res.render("roles/new", { privileges, title: "Nuevo rol" });
  } catch (err) {
    next(err);
  }
};

const postRole = async (req, res, next) => {
  try {
    const { name, privilege } = req.body;
    const newRole = new Role({ name, privileges: privilege });
    await newRole.post();
    req.session.successMessage = "Rol creado con éxito";
    res.redirect("/roles");
  } catch (err) {
    next(err);
  }
};

module.exports = {
  renderRoles,
  deleteRole,
  renderNewRole,
  postRole,
};
