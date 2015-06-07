var models = require('../models/models.js');

// GET /quizes/question
exports.question = function(req, res) {
	models.Quiz.findAll().then(function(quizes) {
		res.render('quizes/question', {pregunta: quizes[0].pregunta});
	});
};

// GET /quizes/answer
exports.answer = function(req, res) {
	models.Quiz.findAll().then(function(quizes) {
		if (req.query.respuesta === quizes[0].respuesta) {
			res.render('quizes/answer', {respuesta: 'Correcto'});
		}
		else {
			res.render('quizes/answer', {respuesta: 'Incorrecto'});
		}
	});
};
