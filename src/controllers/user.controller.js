const User = require("../models/user.model");
const Role = require("../models/role.model");

const renderUsers = async (req, res, next) => {
  try {
    const users = await User.getAllActive();
    const roles = await Role.getAll();

    for (let user of users) {
      user.roles = await user.getRoles(user.uid);
    }

    for (let user of users) {
      if (user.active == 1) user.active = "Activo";
      else user.active = "Inactivo";
    }

    res.render("user/index", {
      title: "Usuarios",
      users,
      roles,
    });
  } catch (err) {
    next(err);
  }
};

const renderInactiveUsers = async (req, res, next) => {
  try {
    const users = await User.getAllInactive();
    const active = 0;
    for (let user of users) {
      user.roles = await user.getRoles(user.uid);
    }
    const roles = await Role.getAll();
    res.render("user/inactivos", {
      title: "Usuarios Inactivos",
      users,
      roles,
      active,
    });
  } catch (err) {
    next(err);
  }
};
const deleteUser = async (req, res, next) => {
  try {
    const { uid } = req.params;
    const user = await User.getById(uid);
    user.delete();
    req.session.successMessage = "Usuario eliminado correctamente";
    res.redirect("/usuarios");
  } catch (err) {
    next(err);
  }
};

const modifyUser = async (req, res, next) => {
  try {
    const { uid } = req.params;
    const user = await User.getById(uid); //primero saco el usuario
    const roles = await user.getRoles(uid);
    const allroles = await Role.getAllActive();
    res.render("user/modificar", {
      title: "Modificar usuario",
      user,
      roles,
      allroles,
    });
  } catch (err) {
    next(err);
  }
};

const modifyUserPost = async (req, res, next) => {
  try {
    const { uid } = req.params;
    const roles = [];
    for (let key in req.body) {
      if (key !== "active") roles.push(await Role.getById(key));
    }

    const user = await User.getById(uid);
    await user.setRoles(roles);
    if (req.body?.active == undefined) {
      user.delete();
      user.active = 0;
    } else {
      user.activate();
      user.active = 1;
    }
    req.session.successMessage = "Usuario modificado correctamente";
    res.redirect("/usuarios");
  } catch (err) {
    next(err);
  }
};

module.exports = {
  renderUsers,
  deleteUser,
  modifyUser,
  modifyUserPost,
  renderInactiveUsers,
};
