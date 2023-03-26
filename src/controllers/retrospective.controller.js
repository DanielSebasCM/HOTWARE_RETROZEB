const Retrospective = require("../models/retrospective.model");

const getRetrospective = async (req, res, next) => {
    try{
        const retrospectives = await Retrospective.getAll();
        res.status(200).render("retrospectives/index",{title: "Retrospectivas", retrospectives});
    }
    catch(err){
        next(err);
    }
};

module.exports = {
    getRetrospective
  };