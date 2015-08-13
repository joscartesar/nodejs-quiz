// Define Comment model
// Load ORM Model
var Sequelize = require('sequelize');

module.exports = function(sequelize, DataTypes) {
	return sequelize.define('comment',
	{
		text: {
			type: Sequelize.STRING,
			validate: {notEmpty: {msg: "-> Falta Comentario"}}
		},
		published: {
			type: DataTypes.BOOLEAN,
			defaultValue: false
		}
	});
};