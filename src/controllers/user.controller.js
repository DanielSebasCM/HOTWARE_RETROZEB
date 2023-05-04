const User = require("../models/user.model");
const Role = require("../models/role.model");
const { routes } = require("../utils/constants");

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
    res.redirect(routes.users);
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
      if (key !== "id_jira" && key !== "active") {
        roles.push(await Role.getById(key));
      } else {
        newJiraId = req.body.id_jira;
      }
    }
    const currentUser = req.session.currentUser;
    const user = await User.getById(uid);
    if (newJiraId) {
      try {
        await user.addJiraId(newJiraId);
      } catch (err) {
        const jiraUser = await User.getByJiraId(newJiraId);
        if (jiraUser) {
          req.session.errorMessage = `Este ID ya está en uso por ${jiraUser.first_name} ${jiraUser.last_name}.`;
          return res.redirect(routes.users + "/" + uid + "/modificar");
        }
      }
      req.session.currentUser.id_jira = newJiraId;
    }
    await user.setRoles(roles);

    if (user.uid !== currentUser.uid) {
      if (req.body?.active === undefined) {
        user.delete();
        user.active = 0;
      } else {
        user.activate();
        user.active = 1;
      }
    }

    req.session.successMessage = "Usuario modificado correctamente";
    res.redirect(routes.users);
  } catch (err) {
    next(err);
  }
};

const addJiraId = async (req, res, next) => {
  try {
    const { id_jira } = req.body;
    const user = new User(req.session.currentUser);
    try {
      await user.addJiraId(id_jira);
    } catch (err) {
      const jiraUser = await User.getByJiraId(id_jira);
      if (jiraUser) {
        req.session.currentUser.id_jira = "no_id";
        req.session.errorMessage = `Este ID ya está en uso por ${jiraUser.first_name} ${jiraUser.last_name}.`;
        return res.redirect(routes.dashboard);
      }
    }

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
  renderInactiveUsers,
  deleteUser,
  modifyUser,
  modifyUserPost,
  addJiraId,
  noJiraIDSession,
};
