const Role = require("../models/role.model");
const Privilege = require("../models/privilege.model");

const renderRoles = async (req, res, next) => {
  try {
    const roles = await Role.getAllActive();
    const privileges_db = await Privilege.getAll();
    const role_privileges = await Role.getPrivileges();
    res.render("roles", {
      roles,
      privileges_db,
      role_privileges,
      title: "Roles",
    });
  } catch (err) {
    next(err);
  }
};

const deleteRole = async (req, res, next) => {
  try {
    const { id } = req.body;
    const role = await Role.getById(id);
    try {
      await role.delete();
    } catch (err) {
      req.session.errorMessage =
        "No se puede eliminar un rol que tiene usuarios asociados";
      res.redirect("/roles");
      return;
    }
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
    const { name, privileges } = req.body;
    const role = new Role({ name });
    await role.post();

    for (const privilege of privileges) {
      await role.addPrivilege({ id: privilege });
    }
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
