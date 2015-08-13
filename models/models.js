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
var Comment = sequelize.import(path.join(__dirname, 'comment'));

// One-to-one association between Quiz and Topic
Comment.belongsTo(Quiz);
Quiz.hasMany(Comment);
Quiz.belongsTo(Topic);

exports.Quiz = Quiz; // export table Quiz definition
exports.Topic = Topic; // export table Topic definition
exports.Comment = Comment; // export table Comment definition

// sequelize.sync(): Create and initialize questions table in BD
// sequelize.sync().then(function() {
// then(..): Execute handler once the table is created
sequelize.sync().then(function() {
	//then(..) ejecuta el manejador una vez creada la tabla
  	Topic.count().then(function(count) {
  		if (count === 0) { // Initialize table only if empty
			Topic.bulkCreate([
				{id: 1, name: 'Humanidades'},
				{id: 2, name: 'Ocio'},
				{id: 3, name: 'Ciencia'},
				{id: 4, name: 'Tecnología'}
  			]).then(function(){
                console.log('Base de datos inicializada: 4 temáticas');
                Quiz.count().then(function(count) {
					if (count === 0) {
						Quiz.bulkCreate([
							{pregunta: 'Capital de Italia', respuesta: 'Roma', topicId: 1},
							{pregunta: 'Capital de Portugal', respuesta: 'Lisboa', topicId: 1}
						]).then(function(){console.log('Base de datos inicializada: 2 preguntas')});
                	};
            	});
        	});
    	};
  	});
});