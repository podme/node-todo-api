var express = require('express');
var bodyParser = require('body-parser');

var {mongoose} = require('./db/mongoose');
var {Todo} = require('./models/todo');
var {User} = require('./models/user');

var app = express();

app.use(bodyParser.json());//use use to use middleware
app.post('/todos', (req, res) => {
	// console.log(req.body);
	var todo = new Todo({
		text : req.body.text
	});
	todo.save().then((doc) => {
		res.send(doc);
	}, (e) => {

		res.status(400).send(e);
	});
});

app.get('/todos', (req, res) => {
	Todo.find().then((todos) => {
		// we'll send back the array as an object key val pair, to keep communications flexible
		res.send({todos})
	}, (e) => {
		res.status(400).send(e);
	});
})

app.listen(3000, () => {
	console.log('listening on 3000');
});

module.exports = {app};