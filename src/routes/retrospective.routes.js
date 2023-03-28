const express = require("express");
const router = express.Router();
const controller = require("../controllers/retrospective.controller");

router.get("/", controller.getRetrospective);
router.get('/iniciar', controller.get_nuevo);

router.post('/iniciar', function(req, res){
    controller.InitRetrospective
  });


module.exports = router;