const {ObjectID} = require('mongodb');
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
});

app.get('/todos/:id', (req, res) => {
	// res.send(req.params);
	var id = req.params.id;

	if(!ObjectID.isValid(id)){
		return res.status(400).send();
	}
	Todo.findById(id).then((todo) => {
		if(todo){
			return res.send({todo});
		}
		res.status(400).send();
	}, (e) => {
		res.status(400).send();
	});


});

app.listen(3000, () => {
	console.log('listening on 3000');
});

module.exports = {app};