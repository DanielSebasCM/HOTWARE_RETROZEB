const Actionable = require("../models/suggestedTodo.model.js");
const Retrospective = require("../models/retrospective.model.js");
const User = require("../models/user.model.js");
const moment = require("moment");
moment.locale("es");

const renderActionables = async (req, res, next) => {
  try {
    const state = req.params.state;
    if (["pending", "accepted", "rejected"].includes(state)) {
      const actionables = await Actionable.getAllState(state);
      const arrRetros = [];
      const arrUsers = [];

      for (let i = 0; i < actionables.length; i++) {
        arrRetros.push(
          await Retrospective.getById(actionables[i].id_retrospective)
        );
      }
      for (let i = 0; i < actionables.length; i++) {
        arrUsers.push(await User.getById(actionables[i].id_user_author));
      }
      res.status(200).render("actionables", {
        title: "Accionables",
        actionables,
        state,
        arrRetros,
        arrUsers,
        moment,
      });
    } else {
      let url = req.originalUrl.split("/").pop().join("/");
      res.redirect(url);
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

module.exports = {
  renderActionables,
  acceptActionable,
  rejectActionable,
};
