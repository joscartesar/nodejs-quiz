// Define Topic module
// Load ORM Model
var Sequelize = require('sequelize');

module.exports = function(sequelize, DataTypes) {
	return sequelize.define('topic',
	{
		name: {
			type: Sequelize.STRING
		}
	});
};