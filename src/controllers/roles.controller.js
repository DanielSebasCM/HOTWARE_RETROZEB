const Role = require("../models/role.model");
const Privilege = require("../models/privilege.model");

const renderRoles = async (req, res, next) => {
  try {
    const roles = await Role.getAllActive();
    const allPrivileges = await Privilege.getAll();
    const rolesPrivileges = await Role.getPrivileges();
    res.render("roles", {
      roles,
      allPrivileges,
      rolesPrivileges,
      title: "Roles",
    });
  } catch (err) {
    next(err);
  }
};

const renderNewRole = async (req, res, next) => {
  try {
    const allPrivileges = await Privilege.getAll();
    res.render("roles/new", { allPrivileges, title: "Nuevo rol" });
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

const renderModifyRole = async (req, res, next) => {
  try {
    const role = await Role.getById(req.params.id);
    role.privileges = await role.getPrivilegesIds();

    const allPrivileges = await Privilege.getAll();
    const roles = await Role.getAllActive();

    const privilegesByTag = {};
    for (let privilege of allPrivileges) {
      if (!privilegesByTag[privilege.tag]) {
        privilegesByTag[privilege.tag] = [];
      }
      privilegesByTag[privilege.tag].push(privilege);
    }

    res.render("roles/modify", {
      role,
      privilegesByTag,
      roles,
      title: "Modificar rol",
    });
  } catch (err) {
    next(err);
  }
};

const modifyRole = async (req, res, next) => {
  try {
    const { id } = req.params;
    const privilegesId = [];
    const currentRole = await Role.getById(id);
    for (let id of req.body.privileges) {
      privilegesId.push(await Privilege.getById(id));
    }
    await currentRole.setPrivileges(privilegesId);
    res.redirect("/roles");
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

module.exports = {
  renderRoles,
  deleteRole,
  renderNewRole,
  postRole,
  renderModifyRole,
  modifyRole,
};
