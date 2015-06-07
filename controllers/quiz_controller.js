var models = require('../models/models.js');

// Autoload - factorizes the code if the path includes :quizId
exports.load = function(req, res, next, quizId) {
	models.Quiz.find(quizId).then(
		function(quiz) {
			if (quiz) {
				req.quiz = quiz;
				next();
			}
			else {
				next(new Error('No existe quizId=' + quizId));
			}
		});
};

// GET /quizes
exports.index = function(req, res) {
	if (req.query.search == null || req.query.search == "") {
		models.Quiz.findAll().then(function(quizes) {
			res.render('quizes/index', {quizes: quizes});
		});
	}
	else {
		var like_query =  "%" + req.query.search.replace(" ", "%") + "%";
		models.Quiz.findAll({where: {pregunta: {$like: like_query}}, order: "pregunta ASC"}).then(function(quizes) {
			res.render('quizes/index', {quizes: quizes});
		});
	}
};

// GET /quizes/:quizId
exports.show = function(req, res) {
	models.Quiz.find(req.params.quizId).then(function(quiz) {
		res.render('quizes/show', {quiz: req.quiz});
	});
};

// GET /quizes/:quizId/answer
exports.answer = function(req, res) {
	var resultado = 'Incorrecto';
	if (req.query.respuesta === req.quiz.respuesta) {
		resultado = 'Correcto';
	}
	res.render('quizes/answer', {quiz: req.quiz, respuesta: resultado});
};
