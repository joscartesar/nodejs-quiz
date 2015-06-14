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

// Import Quiz and Topic table definitions into quiz.js
var Quiz = sequelize.import(path.join(__dirname, 'quiz'));
var Topic = sequelize.import(path.join(__dirname, 'topic'));

// One-to-one association between Quiz and Topic
Quiz.belongsTo(Topic);

exports.Quiz = Quiz; // export table Quiz definition
exports.Topic = Topic; // export table Topic definition

// sequelize.sync(): Create and initialize questions table in BD
// sequelize.sync().then(function() {
// then(..): Execute handler once the table is created
Quiz.sync({force: true}).then(function() {
	Quiz.count().then(function(count) {
		if (count === 0) { // Initialize table only if empty
			Quiz.create({pregunta: 'Capital de Italia', respuesta: 'Roma', topicId: 1});
			Quiz.create({pregunta: 'Capital de Portugal', respuesta: 'Lisboa', topicId: 1})
			.then(function() {console.log('Base de datos inicializada: 2 preguntas')});
		};
	});
});

Topic.sync({force: true}).then(function() {
	Topic.count().then(function(count) {
		if (count === 0) {
			Topic.create({id: 1, name: 'Humanidades'});
			Topic.create({id: 2, name: 'Ocio'});
			Topic.create({id: 3, name: 'Ciencia'});
			Topic.create({id: 4, name: 'Tecnología'})
			.then(function() {console.log('Base de datos inicializada: 4 temáticas')});
		}
	});
});