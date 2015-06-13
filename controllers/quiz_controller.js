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
			res.render('quizes/index', {quizes: quizes, errors: []});
		});
	}
	else {
		var like_query =  "%" + req.query.search.toLowerCase().replace(" ", "%") + "%";
		models.Quiz.findAll({ where: ["lower(pregunta) like ?", like_query], order: "pregunta ASC"}).then(function(quizes) {
			res.render('quizes/index', {quizes: quizes, errors: []});
		});
	}
};

// GET /quizes/:quizId
exports.show = function(req, res) {
	models.Quiz.find(req.params.quizId).then(function(quiz) {
		res.render('quizes/show', {quiz: req.quiz, errors: []});
	});
};

// GET /quizes/:quizId/answer
exports.answer = function(req, res) {
	var resultado = 'Incorrecto',
		mensaje = 'Inténtelo otra vez';
	if (req.query.respuesta === req.quiz.respuesta) {
		resultado = 'Correcto';
		mensaje = 'Lista de preguntas';
	}
	res.render('quizes/answer', {quiz: req.quiz, respuesta: resultado, mensaje: mensaje, errors: []});
};

// GET /quizes/new
exports.new = function(req, res) {
	var quiz = models.Quiz.build({pregunta: "Pregunta", respuesta: "Respuesta"});
	res.render('quizes/new', {quiz: quiz, errors: []});
};

// POST /quizes/create
exports.create = function(req, res) {
	var quiz = models.Quiz.build(req.body.quiz);
	// Persist question and answer fields to DB
	quiz
	.validate()
	.then(
		function(err) {
			if (err) {
				res.render('quizes/new', {quiz: quiz, errors: err.errors});
			}
			else {
				quiz
				.save({fields: ["pregunta", "respuesta"]})
				.then(function() {
					res.redirect('/quizes'); // HTTP redirect to questions list
				});
			}
		});
};

// GET /quizes/:quizId/edit
exports.edit = function(req, res) {
	var quiz = req.quiz; // autoload quiz instance

	res.render('quizes/edit', {quiz: quiz, errors: []});
};

// PUT /quizes/:quizId
exports.update = function(req, res) {
	req.quiz.pregunta = req.body.quiz.pregunta;
	req.quiz.respuesta = req.body.quiz.respuesta;

	req.quiz
	.validate()
	.then(
		function(err) {
			if (err) {
				res.render('quizes/edit', {quiz: quiz, errors: err.errors});
			}
			else {
				req.quiz
				.save({fields: ["pregunta", "respuesta"]})
				.then(function() {
					res.redirect('/quizes'); // HTTP redirect to questions list
				});
			}
		});	
}