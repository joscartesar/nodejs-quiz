// Define Quiz module
// Load ORM Model
var Sequelize = require('sequelize');

module.exports = function(sequelize, DataTypes) {
	return sequelize.define('quiz',
	{
		pregunta: {type: Sequelize.STRING},
		respuesta: {type: Sequelize.STRING}
	});
}
