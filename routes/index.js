var express = require('express');
var router = express.Router();

var quizController = require('../controllers/quiz_controller');
var commentController = require('../controllers/comment_controller');

/* GET home page. */
router.get('/', function(req, res) {
  res.render('index', { title: 'Quiz', errors: [] });
});

// Autoload paths which contains :quizId
router.param('quizId', quizController.load);

// Path definition for /quizes
router.get('/quizes', quizController.index);
router.get('/quizes/:quizId(\\d+)', quizController.show);
router.get('/quizes/:quizId(\\d+)/answer', quizController.answer);

// CRUD
// Create
router.get('/quizes/new', quizController.new);
router.post('/quizes/create', quizController.create);
// Edit
router.get('/quizes/:quizId(\\d+)/edit', quizController.edit);
router.put('/quizes/:quizId(\\d+)', quizController.update);
// Delete
router.delete('/quizes/:quizId(\\d+)', quizController.destroy);

// Topics
router.get('/quizes/topics', quizController.topics);

// GET author page.
router.get('/author', function(req, res) {
	res.render('author', {errors: []});
});

router.get('/quizes/:quizId(\\d+)/comments/new', commentController.new);
router.post('/quizes/:quizId(\\d+)/comments', commentController.create);

module.exports = router;
