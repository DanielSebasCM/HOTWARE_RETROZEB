const Retrospective = require("../models/retrospective.model");
const Question = require("../models/question.model");
const Sprint = require("../models/sprint.model");
const Team = require("../models/team.model")
const moment = require("moment");
moment.locale("es");

const renderRetrospectives = async (req, res, next) => {
  try {

    const retrospectives = await Retrospective.getAll();
    const teams = await Team.getAll();
    
    for (let retrospective of retrospectives) {
      const sprint = await Sprint.getById(retrospective.id_sprint);
      retrospective.sprint_name = sprint.name;
      const team = teams.filter((team)=>{
        return team.id == retrospective.id_team;
      });
      console.log(team);
      retrospective.team_name = team[0].name;
    }
    
    
    res.status(200).render("retrospectives/index", {
      title: "Retrospectivas",
      retrospectives,
      teams,
      moment
    });
  } catch (err) {
    next(err);
  }
};

const renderInitRetrospective = async (req, res, next) => {
  try {
    const questions = await Question.getAll();
    res.render("retrospectives/initRetrospective", {
      title: "Preguntas",
      questions,
    });
  } catch (err) {
    next(err);
  }
};
/*
const post_nuevo = (request, response, next) => {
  const retro = new NewRetro({
    const { name, questions } = request.body;
  });
  retro.save()
  .then(([rows, fieldData]) => {
      response.status(300).redirect("retrospectives/index");
  })
  .catch(error => console.log(error));
};*/
  
const post_nuevo = (request, response, next) => {
  const { name, questions } = request.body;
  
  const retrospective = new Retrospective({
    name,
    state: 'PENDING',
    id_team: 1, // o el id del equipo correspondiente
    id_sprint: 1 // o el id del sprint correspondiente
  });
  
  retrospective.save()
    .then((retro) => {
      const questionsPromises = questions.map((question) => {
        const retrospectiveQuestion = new RetrospectiveQuestion({
          id_retrospective: retro.id,
          id_question: question.id,
          required: question.required || 1,
          anonymous: question.anonymous || 0,
        });
        return retrospectiveQuestion.save();
      });
      return Promise.all(questionsPromises);
    })
    .then(() => {
      response.status(300).redirect("retrospectives/index");
    })
    .catch(error => console.log(error));
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
    const labels = await retrospective.getLabels();
    res.render("retrospectives/dashboardMetrics", {
      title: "Dashboard",
      retrospective,
      labels,
    });
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

module.exports = {
  renderRetrospectives,
  renderInitRetrospective,
  renderRetrospectiveMetrics,
  renderRetrospectiveQuestions,
  getRetrospectiveIssues,
  getRetrospectiveAnswers,
  post_nuevo,
};
