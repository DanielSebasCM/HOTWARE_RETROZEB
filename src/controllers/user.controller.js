const User = require("../models/user.model");
const Role = require("../models/role.model");

const renderUsers = async (req, res, next) => {
  try {
    const users = await User.getAllActive();
    res.render("user/index", { title: "Usuarios", users });
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
    let newJiraId;
    for (let key in req.body) {
      if (key !== "id_jira") {
        roles.push(await Role.getById(key));
      } else {
        newJiraId = req.body.id_jira;
      }
    }
    const user = await User.getById(uid);
    if (newJiraId) {
      await user.addJiraId(newJiraId);
      req.session.currentUser.id_jira = newJiraId;
    }
    await user.setRoles(roles);
    req.session.successMessage = "Usuario modificado correctamente";
    res.redirect("/usuarios");
  } catch (err) {
    next(err);
  }
};

const addJiraId = async (req, res, next) => {
  try {
    const { id_jira } = req.body;
    const user = new User(req.session.currentUser);

    await user.addJiraId(id_jira);

    req.session.currentUser.id_jira = id_jira;

    res.status(200).redirect("/");
  } catch (err) {
    next(err);
  }
};

const noJiraIDSession = async (req, res, next) => {
  try {
    req.session.currentUser.id_jira = "no_id";
    res.redirect("/");
  } catch (err) {
    next(err);
  }
};

module.exports = {
  renderUsers,
  deleteUser,
  modifyUser,
  modifyUserPost,
  addJiraId,
  noJiraIDSession,
};
