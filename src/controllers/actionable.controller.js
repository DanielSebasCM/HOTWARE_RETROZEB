const Actionable = require("../models/suggestedTodo.model.js");
const User = require("../models/user.model.js");
const moment = require("moment");
moment.locale("es");

const renderActionables = async (req, res, next) => {
  try {
    const state = req.params.state;
    if (
      ["pending", "accepted", "rejected", "completed", "process"].includes(
        state
      )
    ) {
      const actionables = await Actionable.getAllByState(state);
      const arrUsers = [];

      for (let i = 0; i < actionables.length; i++) {
        arrUsers.push(await User.getById(actionables[i].id_user_author));
      }
      res.status(200).render("actionables", {
        title: "Accionables",
        actionables,
        state,
        arrUsers,
        moment,
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
    res.render("actionables/new", {
      title: "Crear accionable",
      Users,
    });
  } catch (err) {
    next(err);
  }
};

const postActionable = async (req, res, next) => {
  try {
    const { title, description, id_user_author } = req.body;
    const actionable = new Actionable({
      title,
      description,
      id_user_author,
    });
    console.log(actionable);
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
