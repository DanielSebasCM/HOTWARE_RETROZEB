const Actionable = require("../models/suggestedTodo.model.js");
const Retrospective = require("../models/retrospective.model.js");
const User = require("../models/user.model.js");

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
    console.log(arrretros, arrUsers);
    res.status(200).render("actionables/index", {
      title: "Accionables",
      actionables,
      state,
      arrretros,
      arrUsers,
    });
  } else {
    res.redirect("/accionables/pending");
  }
};

const getDefault = async (req, res) => {
  res.redirect("/accionables/pending");
};

module.exports = { getActionables, getDefault };
