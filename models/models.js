var path = require('path');

// Postgres DATABASE_URL = postgres://user:password@host:port/database
// SQLite DATABASE_URL = sqlite://:@:/
var url = process.env.DATABASE_URL.match(/(.*)\:\/\/(.*?)\:(.*)@(.*)\:(.*)\/(.*)/);
var DB_name = (url[6])||null;
var user = (url[2])||null;
var pwd = (url[3])||null;
var protocol = (url[1])||null;
var dialect = (url[1])||null;
var port = (url[5])||null;
var host = (url[4])||null;
var storage = process.env.DATABASE_STORAGE;

// Load ORM Model
var Sequelize = require('sequelize');

// Use SQLite Database
var sequelize = new Sequelize(
	DB_name,
	user,
	pwd,
	{	dialect: protocol,
		protocol: protocol,
		port: port,
		host: host,
		storage: storage,
		omitNull: true
	}
	);

// Import Quiz table definition into quiz.js
var Quiz = sequelize.import(path.join(__dirname, 'quiz'));

exports.Quiz = Quiz; // export table Quiz definition

// sequelize.sync(): Create and initialize questions table in BD
// sequelize.sync().then(function() {
// then(..): Execute handler once the table is created
Quiz.sync({force: true}).then(function() {
	Quiz.count().then(function(count) {
		if (count === 0) { // Initialize table only if empty
			Quiz.create({pregunta: 'Capital de Italia', respuesta: 'Roma'});
			Quiz.create({pregunta: 'Capital de Portugal', respuesta: 'Lisboa'})
			.then(function(){console.log('Base de datos inicializada: 2 registros')});
		};
	});
});
