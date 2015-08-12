// GET /login (login form)
exports.new = function(req, res) {
	var errors = req.session.errors || {};
	req.session.errors = {};

	res.render('session/new', {errors: errors});
};

// POST /login (create session)
exports.create = function(req, res) {
	var login = req.body.login;
	var password = req.body.password;

	var userController = require('./user_controller');
	userController.authenticate(login, password, function(error, user) {
		// Handle errors
		if (error) {
			req.session.errors = [{"message": 'Se ha producido un error: ' + erorr}];
			res.redirect("/login");
			return;
		}
		// Create de session
		req.session.user = {id:user.id, username:user.username};
		// Redirect to previous path
		res.redirect(req.session.redir.toString());
	});
};

// DELETE /logout (destroy session)
exports.destroy = function(req, res) {
	delete req.session.user;
	res.redirect(req.session.redir.toString());
};