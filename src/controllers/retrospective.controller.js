const Retrospective = require("../models/retrospective.model");
const Team = require("../models/team.model");
const Question = require("../models/question.model");
const Sprint = require("../models/sprint.model");
const moment = require("moment");
moment.locale("es");

const renderRetrospectives = async (req, res, next) => {
  try {
    const retrospectives = await Retrospective.getAll();
    const teams = await Team.getAll();

    for (let retrospective of retrospectives) {
      const sprint = await Sprint.getById(retrospective.id_sprint);
      retrospective.sprint_name = sprint.name;
      const team = teams.filter((team) => {
        return team.id == retrospective.id_team;
      });
      retrospective.team_name = team[0].name;
    }

    res.status(200).render("retrospectives/index", {
      title: "Retrospectivas",
      retrospectives,
      teams,
      moment,
    });
  } catch (err) {
    next(err);
  }
};

const renderInitRetrospective = async (req, res, next) => {
  try {
    if (!req.session.selectedTeam) {
      req.session.errorMessage =
        "Únete o selecciona un equipo para poder iniciar una retrospectiva";
      return res.redirect(".");
    }

    const newSprint = await Sprint.syncJira();

    if (newSprint) {
      req.session.successMessage =
        "Hay un nuevo sprint disponible, se han cerrado las retrospectivas anteriores";
    }
    const team = await Team.getById(req.session.selectedTeam.id);
    let questions = [];
    const retrospective = await team.getLastRetrospective();

    let sprint = await Sprint.getLast();

    if (retrospective && retrospective.id_sprint == sprint.id) {
      req.session.errorMessage =
        "El equipo " +
        team.name +
        " ya tiene una retrospectiva creada para el último sprint.";
      return res.redirect(".");
    }

    questions = await Question.getAllActive();

    const activeSprint = await Sprint.getLastWithRetroByTeamId(
      req.session.selectedTeam.id
    );

    if (!retrospective && !sprint) {
      req.session.errorMessage = `No hay sprints disponibles para el equipo ${team.name}. Por favor selecciona otro equipo`;
      return res.redirect(".");
    }

    if (activeSprint && activeSprint.end_date > sprint.end_date) {
      sprint = null;
    }

    res.render("retrospectives/initRetrospective", {
      title: "Preguntas",
      questions,
      retrospective,
      sprint,
    });
  } catch (err) {
    next(err);
  }
};

const postRetrospectiveAnswers = async (req, res, next) => {
  try {
    const { idRetrospective, questionIds, uid } = req.body;
    const retrospective = await Retrospective.getById(idRetrospective);
    if (retrospective.state !== "IN_PROGRESS") {
      req.session.errorMessage = "La retrospectiva ya ha sido cerrada";
      res.redirect(`/retrospectivas/${idRetrospective}`);
      return;
    }
    const teamUsers = await retrospective.getUsers();
    if (!teamUsers.some((user) => user.uid == uid)) {
      req.session.errorMessage =
        "No estabas unido al equipo cuando se creó la retrospectiva";
      res.redirect(`/retrospectivas/${idRetrospective}`);
      return;
    }
    const answers = [];
    for (let qId of questionIds) {
      if (!req.body[qId]) continue;
      const question = await Question.getById(qId);
      if (question.type !== "SELECTION") {
        answers.push({ id_question: qId, value: req.body[qId] });
      } else {
        optionId = await question.getOptionId(req.body[qId]);
        answers.push({ id_question: qId, value: optionId });
      }
    }
    retrospective.postAnswers(answers, uid);
    req.session.successMessage = "Respuestas enviadas con éxito";
    res.send("Respuestas enviadas con éxito");
  } catch (err) {
    next(err);
  }
};

const post = async (req, res, next) => {
  try {
    let { name, checked, required, anonymous, id_sprint } = req.body;
    if (!checked) {
      req.session.errorMessage =
        "No puedes crear una retrospectiva sin preguntas";
      return res.redirect("/retrospectivas/iniciar");
    }

    const newRetrospective = new Retrospective({
      name,
      id_team: req.session.selectedTeam.id,
      id_sprint: id_sprint,
    });
    const retrospective = await newRetrospective.post();
    newRetrospective.id = retrospective.insertId;

    let questions = [];

    questions.push(checked);

    questions = questions.flat().map((id) => ({ id }));

    questions.forEach(async (question) => {
      if (required) {
        question.required = required.includes(question.id) ? 1 : 0;
      } else {
        question.required = 0;
      }
      if (anonymous) {
        question.anonymous = anonymous.includes(question.id) ? 1 : 0;
      } else {
        question.anonymous = 0;
      }
      await newRetrospective.addQuestion(question);
    });
    req.session.successMessage = "Retrospectiva creada con éxito";
    res.status(201).redirect("/retrospectivas");
  } catch (err) {
    next(err);
  }
};

const patchRetrospectiveState = async (req, res, next) => {
  try {
    const { id } = req.params;
    const retrospective = await Retrospective.getById(id);
    await retrospective.close();
    req.session.successMessage = "Retrospectiva cerrada con éxito";
    res.redirect(`/retrospectivas/${id}`);
  } catch (error) {
    next(error);
  }
};

const renderRetrospectiveQuestions = async (req, res, next) => {
  try {
    const id_retrospective = req.params.id;
    const retrospective = await Retrospective.getById(id_retrospective);
    const questions = await retrospective.getQuestions();
    for (let question of questions) {
      question.answers = await retrospective.getAnswers(question);
    }
    res.render("retrospectives/dashboardQuestions", {
      title: "Dashboard",
      retrospective,
      questions,
    });
  } catch (err) {
    next(err);
  }
};

const renderRetrospectiveMetrics = async (req, res, next) => {
  try {
    const id_retrospective = req.params.id;
    const retrospective = await Retrospective.getById(id_retrospective);
    if (!retrospective) {
      req.session.errorMessage = "No existe la retrospectiva";
      return res.redirect("..");
    }

    const team = await Team.getById(retrospective.id_team);
    retrospective.team_name = team.name;

    const questions = await retrospective.getQuestions();
    for (let question of questions) {
      question.answers = await retrospective.getAnswers(question);
      question.answers = question.answers.filter(
        (answer) => answer.uid === req.session.currentUser.uid
      );
    }
    const answered = questions.some((question) => question.answers.length > 0);
    const teamUsers = await retrospective.getUsers();
    let isMember = teamUsers.some(
      (user) => user.uid === req.session.currentUser.uid
    );
    const labels = await retrospective.getLabels();

    res.render("retrospectives/dashboardMetrics", {
      title: "Dashboard",
      retrospective,
      labels,
      answered,
      isMember,
    });
  } catch (err) {
    next(err);
  }
};

const renderRetrospectiveAnswer = async (req, res, next) => {
  try {
    const retrospectiveId = req.params.id;
    const retrospective = await Retrospective.getById(retrospectiveId);
    if (!retrospective) {
      req.session.errorMessage = "No existe la retrospectiva";
      return res.redirect("..");
    }
    if (retrospective.state !== "IN_PROGRESS") {
      return res.redirect(`/retrospectivas/${retrospectiveId}/preguntas`);
    }
    const teamUsers = await retrospective.getUsers();
    if (!teamUsers.some((user) => user.uid === req.session.currentUser.uid)) {
      req.session.errorMessage =
        "No eras miembro del equipo cuando se creó la retrospectiva";
      return res.redirect(`/retrospectivas/${retrospectiveId}/preguntas`);
    }
    const questions = await retrospective.getQuestions();
    for (let question of questions) {
      question.answers = await retrospective.getAnswers(question);
      question.answers = question.answers.filter(
        (answer) => answer.uid === req.session.currentUser.uid
      );
    }
    const answered = questions.some((question) => question.answers.length > 0);
    if (answered) {
      req.session.errorMessage = "Ya respondiste esta retrospectiva";
      res.redirect(`/retrospectivas/${retrospectiveId}/preguntas`);
    } else {
      res.render("retrospectives/answer", {
        title: "Responder",
        retrospective,
        questions,
      });
    }
  } catch (err) {
    next(err);
  }
};

const renderCompareRetroMetrics = async (req, res, next) => {
  try {
    if (!req.session.selectedTeam) {
      req.session.errorMessage =
        "Únete o selecciona un equipo para poder comparar retrospectivas";
      return res.redirect("..");
    }

    const { n } = req.params;
    const team = await Team.getById(req.session.selectedTeam.id);
    const retrospectives = await team.getNClosedRetrospectives(n);

    if (retrospectives.length < 2) {
      req.session.errorMessage =
        "El equipo" +
        (n > 1 ? " no tiene" : " no tiene suficientes") +
        " retrospectivas cerradas";
      return res.redirect("..");
    }

    if (retrospectives.length < n) {
      res.redirect("./" + retrospectives.length);
    }

    const maxRetros = Math.min(10);

    retrospectives.sort((a, b) => a.end_date - b.end_date);
    let labels = new Set();
    let epics = new Set();
    for (let retrospective of retrospectives) {
      const newLabels = await retrospective.getLabels();
      newLabels.forEach((label) => labels.add(label));

      const newEpics = await retrospective.getEpics();
      newEpics.forEach((epic) => epics.add(epic));
    }
    labels = Array.from(labels);
    epics = Array.from(epics);

    res.render("retrospectives/compareMetrics", {
      title: "Comparativa",
      retrospectives,
      labels,
      epics,
      n,
      maxRetros,
    });
  } catch (err) {
    next(err);
  }
};

const getRetrospectiveAnswers = async (req, res, next) => {
  try {
    const retroId = req.params.id;
    const retrospective = await Retrospective.getById(retroId);
    if (!retrospective) {
      req.session.errorMessage = "No existe la retrospectiva";
      return res.redirect("..");
    }
    const questions = await retrospective.getQuestions();
    for (let question of questions) {
      question.answers = await retrospective.getAnswers(question);
    }
    res.send(questions);
  } catch (err) {
    next(err);
  }
};

const getSprint = async (req, res, next) => {
  const { id } = req.params;
  try {
    const retro = await Retrospective.getById(id);
    const sprint = await Sprint.getById(retro.id_sprint);
    res.json(sprint);
  } catch (err) {
    next(err);
  }
};

const getRetrospectiveIssues = async (req, res, next) => {
  try {
    const id_retrospective = req.params.id;
    const retrospective = await Retrospective.getById(id_retrospective);
    const issues = await retrospective.getIssues();
    res.json(issues);
  } catch (err) {
    next(err);
  }
};

const getRetrospectiveUsers = async (req, res, next) => {
  try {
    const id_retrospective = req.params.id;
    const retrospective = await Retrospective.getById(id_retrospective);
    const users = await retrospective.getUsers();
    res.json(users);
  } catch (err) {
    next(err);
  }
};

module.exports = {
  renderRetrospectives,
  renderInitRetrospective,
  renderRetrospectiveMetrics,
  renderRetrospectiveQuestions,
  renderRetrospectiveAnswer,
  renderCompareRetroMetrics,
  getRetrospectiveIssues,
  getRetrospectiveAnswers,
  getRetrospectiveUsers,
  post,
  postRetrospectiveAnswers,
  patchRetrospectiveState,
  getSprint,
};
