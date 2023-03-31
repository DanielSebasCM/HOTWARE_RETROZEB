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
    if (!req.app.locals.selectedTeam) {
      req.session.errorMessage =
        "Únete o selecciona un equipo para poder iniciar una retrospectiva";
      return res.redirect(".");
    }

    const newTeam = new Team(req.app.locals.selectedTeam);
    let questions = [];
    let sprint;

    const retrospective = await newTeam.getActiveRetrospective();

    if (retrospective) {
      req.session.errorMessage =
        "Ya existe una retrospectiva para el último sprint del equipo " +
        newTeam.name;
      return res.redirect(".");
    }

    questions = await Question.getAll();
    sprint = await Sprint.getLastWithoutRetroByTeamId(
      req.app.locals.selectedTeam.id
    );
    const activeSprint = await Sprint.getLastWithRetroByTeamId(
      req.app.locals.selectedTeam.id
    );

    if (!retrospective && !sprint) {
      req.session.errorMessage = `No hay sprints disponibles para el equipo ${newTeam.name}. Por favor selecciona otro equipo`;
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
    const retrospective = await Retrospective.getById(idRetrospective);
    retrospective.postAnswers(answers, uid);
    req.session.successMessage = "Respuestas enviadas con éxito";
    res.send("Respuestas enviadas con éxito");
  } catch (err) {
    next(err);
  }
};

const post = async (request, response, next) => {
  try {
    let { name, checked, required, anonymous, id_sprint } = request.body;
    if (!checked) {
      request.session.errorMessage =
        "No puedes crear una retrospectiva sin preguntas";
      return response.redirect("/retrospectivas/iniciar");
    }

    const newRetrospective = new Retrospective({
      name,
      id_team: request.app.locals.selectedTeam.id,
      id_sprint: id_sprint,
    });
    const retrospective = await newRetrospective.post();
    newRetrospective.id = retrospective.insertId;

    let questions = [];

    questions.push(checked);

    questions = questions.flat().map((id) => ({ id }));

    questions.forEach(async (element) => {
      if (required) {
        element.required = required.includes(element.id) ? 1 : 0;
      } else {
        element.required = 0;
      }
      if (anonymous) {
        element.anonymous = anonymous.includes(element.id) ? 1 : 0;
      } else {
        element.anonymous = 0;
      }
      newRetrospective.question = element;
      await newRetrospective.addQuestion();
    });
    request.session.successMessage = "Retrospectiva creada con éxito";
    response.status(201).redirect("/retrospectivas");
  } catch (err) {
    next(err);
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
    const team = await Team.getById(retrospective.id_team);
    retrospective.team_name = team.name;
    const questions = await retrospective.getQuestions();
    let answer = await retrospective.getAnswers(questions[0]);
    answer = answer.filter((a) => a.uid === req.app.locals.currentUser.uid);
    let answered = answer.length ? true : false;
    const labels = await retrospective.getLabels();
    res.render("retrospectives/dashboardMetrics", {
      title: "Dashboard",
      retrospective,
      labels,
      answered,
    });
  } catch (err) {
    next(err);
  }
};

const renderRetrospectiveAnswer = async (req, res, next) => {
  try {
    const retrospectiveId = req.params.id;
    const retrospective = await Retrospective.getById(retrospectiveId);
    const questions = await retrospective.getQuestions();
    let answer = await retrospective.getAnswers(questions[0]);
    answer = answer.filter((a) => a.uid === req.app.locals.currentUser.uid);
    if (answer.length > 0) {
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

const getRetrospectiveAnswers = async (req, res, next) => {
  try {
    const retroId = req.params.id;
    const retrospective = await Retrospective.getById(retroId);
    const questions = await retrospective.getQuestions();
    for (let question of questions) {
      question.answers = await retrospective.getAnswers(question);
    }
    res.send(questions);
  } catch (err) {
    console.log(err);
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
  getRetrospectiveIssues,
  getRetrospectiveAnswers,
  getRetrospectiveUsers,
  post,
  postRetrospectiveAnswers,
};
