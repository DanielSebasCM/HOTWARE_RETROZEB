const Actionable = require("../models/suggestedTodo.model.js");
const Retrospective = require("../models/retrospective.model.js");
const User = require("../models/user.model.js");
const messages = require("../utils/messages");
const moment = require("moment");
moment.locale("es");

const getActionables = async (req, res) => {
  const state = req.params.state;
  if (["pending", "accepted", "rejected"].indexOf(state) !== -1) {
    const actionables = await Actionable.getAllState(state);
    const arrretros = [];
    const arrUsers = [];

    for (let i = 0; i < actionables.length; i++) {
      arrretros.push(
        await Retrospective.getById(actionables[i].id_retrospective)
      );
    }
    for (let i = 0; i < actionables.length; i++) {
      arrUsers.push(await User.getById(actionables[i].id_user_author));
    }
    res.status(200).render("actionables/index", {
      title: "Accionables",
      actionables,
      state,
      arrretros,
      arrUsers,
      moment,
    });
  } else {
    res.redirect("/accionables/pending");
  }
};

//metodo para cambiar el estado del accionable a aceptado

const accept = async (req, res) => {
  const id = req.params.id;
  //aquí busco la instancia
  const actionable = await Actionable.getById(id);
  //aquí ya está la instancia
  let res2 = await actionable.accept();
  actionable.state = "accepted";
  //req.session.successMessage =
  //messages.actionables.success.statusActionableUpdated;
  res.redirect("/accionables/pending");
};

//metodo para cambiar el estado del accionable a rechazado
//no es metodo de clase, es de instancia, por eso actionable es en minusculas

const reject = async (req, res) => {
  const id = req.params.id;
  const actionable = await Actionable.getById(id);
  let res2 = await actionable.reject();
  actionable.state = "rejected";
  res.redirect("/accionables/pending");
};

const getDefault = async (req, res) => {
  res.redirect("/accionables/pending");
};

module.exports = { getActionables, getDefault, accept, reject };
