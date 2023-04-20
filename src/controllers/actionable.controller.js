const Actionable = require("../models/suggestedTodo.model.js");
const User = require("../models/user.model.js");
const issuePriorities = require("../utils/constants").enums.issuePriorities;
const moment = require("moment");
const { postJiraActionable } = require("../utils/jira");
moment.locale("es");

const renderActionables = async (req, res, next) => {
  try {
    const state = req.params.state;
    const priority = req.params.priority;
    if (
      ["pending", "accepted", "rejected", "completed", "process"].includes(
        state
      )
    ) {
      const actionables = await Actionable.getAllByState(state.toUpperCase());
      const arrUsers = [];
      for (let i = 0; i < actionables.length; i++) {
        arrUsers.push(await User.getById(actionables[i].id_user_author));
      }

      for (let i = 0; i < actionables.length; i++) {
        if (actionables[i].state == "PROCESS") {
          const now = Date.now();
          const creationDate = actionables[i].creation_date;
          const diff = now - creationDate.getTime();
          const days = Math.round(diff / (1000 * 60 * 60 * 24));
          if (days < 14) {
            actionables[i].pillcolor = "green";
          } else if (days < 30) {
            actionables[i].pillcolor = "yellow";
          } else {
            actionables[i].pillcolor = "red";
          }
        }
      }

      res.status(200).render("actionables", {
        title: "Accionables",
        actionables,
        state,
        arrUsers,
        moment,
        priority,
      });
    } else {
      res.redirect("/accionables");
    }
  } catch (err) {
    next(err);
  }
};

//metodo para cambiar el estado del accionable a aceptado

const acceptActionable = async (req, res, next) => {
  try {
    const id = req.params.id;
    //aquí busco la instancia
    const actionable = await Actionable.getById(id);
    //aquí ya está la instancia
    let res2 = await actionable.accept();
    console.log("actionable", actionable);
    await postJiraActionable(actionable);
    actionable.state = "ACCEPTED";
    //req.session.successMessage =
    //messages.actionables.success.statusActionableUpdated;
    res.redirect("/accionables/pending");
  } catch (err) {
    next(err);
  }
};

//metodo para cambiar el estado del accionable a rechazado
//no es metodo de clase, es de instancia, por eso actionable es en minusculas

const rejectActionable = async (req, res, next) => {
  try {
    const id = req.params.id;
    const actionable = await Actionable.getById(id);
    let res2 = await actionable.reject();
    actionable.state = "REJECTED";
    res.redirect("/accionables/pending");
  } catch (err) {
    next(err);
  }
};

const renderNewActionable = async (req, res, next) => {
  try {
    const Users = await User.getAllActive();
    const priority = issuePriorities;
    res.render("actionables/new", {
      title: "Crear accionable",
      Users,
      priority,
    });
  } catch (err) {
    next(err);
  }
};

const postActionable = async (req, res, next) => {
  try {
    const { title, description, priority, id_user_author } = req.body;
    const actionable = new Actionable({
      title,
      description,
      priority,
      id_user_author,
    });
    await actionable.post();
    res.redirect("/accionables/pending");
  } catch (err) {
    next(err);
  }
};

module.exports = {
  renderActionables,
  acceptActionable,
  rejectActionable,
  renderNewActionable,
  postActionable,
};
