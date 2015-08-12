var models = require('../models/models.js');

// GET /quizes/:quizId/comments/new
exports.new = function(req, res) {
	res.render('comments/new', {quizid: req.params.quizId, errors: []});
};

// POST /quizes/:quizId/comments
exports.create = function(req, res) {
	var comment = models.Comment.build(
		{ text: req.body.comment.text,
		  quizId: req.params.quizId
		});
	// Persist question and answer fields to DB
	comment
	.validate()
	.then(
		function(err) {
			if (err) {
				res.render('comments/new',
					{comment: comment, quizid: req.params.quizId, errors: err.errors});
			}
			else {
				comment
				.save({fields: ["text", "quizId"]})
				.then(function() {
					res.redirect('/quizes/' + req.params.quizId); // HTTP redirect to questions list
				});
			}
		}).catch(function(error){next(error)});
};