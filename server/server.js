require('./config/config');
const {ObjectID} = require('mongodb');
const express = require('express');
const bodyParser = require('body-parser');
const _ = require('lodash');

var {mongoose} = require('./db/mongoose');
var {Todo} = require('./models/todo');
var {User} = require('./models/user');
var {authenticate} = require('./middleware/authenticate');

var app = express();
const port = process.env.PORT;

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

// update
app.patch('/todos/:id', (req, res) => {
	var id = req.params.id;
	var body = _.pick(req.body, ['text', 'completed']);//just pick off what we want to give user access to, not 'completed at' or 'id'.

	if(!ObjectID.isValid(id)){
		console.log('invalid id');
		return res.status(404).send();
	}

	if(_.isBoolean(body.completed) && body.completed){
		// console.log('was true');
		body.completedAt = new Date().getTime();
	}else{
		// console.log('was false or not a boolean');
		body.completed = false;
		body.completedAt = null;
	}

	Todo.findByIdAndUpdate(id, {$set : body}, {new : true}).then((todo) => {
		if(!todo){
			return res.status(404).send();
		}
		res.send({todo});
	}).catch((e) => {
		res.status(400).send();
	});
});

// POST /users
app.post('/users', (req, res) => {
	// console.log(req.body);
	// var todo = new Todo({
	// 	text : req.body.text
	// });
	var body = _.pick(req.body, ['email', 'password']);
	var user = new User(body);

	user.save()
	.then(() => {
		return user.generateAuthToken();
	})
	.then((token) => {
		res.header('x-auth', token).send(user);//custom header for jwt jsonwebtoken
	})
	.catch((e) => {
		res.status(400).send(e);
	});
});

// use the middleware: authenticate
app.get('/users/me', authenticate, (req, res) => {
	res.send(req.user);
});

// POST /users/login {email, password}
app.post('/users/login', (req, res) => {
	var body = _.pick(req.body, ['email', 'password']);
	// res.send(body);
	User.findByCredentials(body.email, body.password).then((user) => {
		// res.send(user);
		user.generateAuthToken().then((token) => {
			res.header('x-auth', token).send(user);//custom header for jwt jsonwebtoken
		});
	}).catch((e) => {
		res.status(400).send();
	});
});

app.listen(port, () => {
	console.log(`listening on ${port}`);
});

module.exports = {app}; 