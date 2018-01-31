const {ObjectID} = require('mongodb');
var express = require('express');
var bodyParser = require('body-parser');
var {mongoose} = require('./db/mongoose');
var {Todo} = require('./models/todo');
var {User} = require('./models/user');

var app = express();
const port = process.env.PORT || 3000;

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
		return res.status(404).send();
	}
	Todo.findById(id).then((todo) => {
		if(todo){
			return res.send({todo});
		}
		res.status(404).send();
	}, (e) => {
		res.status(400).send();
	});
});

app.delete('/todos/:id', (req, res) => {
	var id = req.params.id;

	if(!ObjectID.isValid(id)){
		return res.status(404).send();
	}

	Todo.findByIdAndRemove(id).then((todo) => {
		if(!todo){
			return res.status(404).send();
		}
		res.send({todo});
	}).catch((e) => {
		res.status(400).send();
	});
});

app.listen(port, () => {
	console.log(`listening on ${port}`);
});

module.exports = {app}; 