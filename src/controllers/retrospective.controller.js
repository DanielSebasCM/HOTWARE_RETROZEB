const Retrospective = require("../models/retrospective.model");
const Question = require("../models/question.model");
const Sprint = require("../models/sprint.model");
const moment = require("moment");
moment.locale("es");

const getRetrospective = async (req, res, next) => {
    try{
        const retrospectives = await Retrospective.getAll();
        for (let retrospective of retrospectives) {
            const sprint = await Sprint.getById(retrospective.id_sprint);
            retrospective.sprint_name = sprint.name;

        }
            console.log(retrospectives);
        res.status(200).render("retrospectives/index",{
            title: "Retrospectivas", 
            retrospectives, 
            moment,
        });
    }
    catch(err){
        next(err);
    }
};

const get_nuevo = async (request, response, next) => {
    const questions = await Question.getAll();
    response.render('retrospectives/initRetrospective', {
        title: "Preguntas", questions
    });
};

const InitRetrospective = (request, response, next) => {
    const retrospective = new Retrospective({
        name: request.body.name,
        start_date: request.body.start_date,
        end_date: request.body.end_date,
        state: request.body.state,
        id_team: request.body.id_team,
        id_sprint: request.body.id_sprint,
    });

    retrospective.save()
    .then(([rows, fieldData]) => {
        request.session.last_retrospective = retrospective.name;

        response.status(300).redirect('/retrospectivas');
    })
    .catch(error => console.log(error));

};


module.exports = {
    getRetrospective,
    InitRetrospective, 
    get_nuevo
  };