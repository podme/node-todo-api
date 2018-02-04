const {ObjectID} = require('mongodb');
const jwt = require('jsonwebtoken');
const {Todo} = require('./../../models/todo');
const {User} = require('./../../models/user');

const userOneId = new ObjectID();
const userTwoId = new ObjectID();

const users = [{
	_id: userOneId,
	email: 'pod@example.poop',
	password: 'poopypoops',
	tokens: [{
		access: 'auth',
		token: jwt.sign({_id: userOneId, access: 'auth'}, process.env.JWT_SECRET).toString()
	}]
},{
	_id: userTwoId,
	email: 'nug@nuggsville.nuggle',
	password: 'nug-nug',
	tokens: [{
		access: 'auth',
		token: jwt.sign({_id: userTwoId, access: 'auth'}, process.env.JWT_SECRET).toString()
	}]
}];

const todos = [{
	_id : new ObjectID(),
	text: 'First test todo',
	_creator: userOneId
},{
	_id : new ObjectID(),
	text: 'Second test todo',
	completed : true,
	completedAt : 333,
	_creator: userTwoId
}];

const populateTodos = (done) => {
	Todo.remove({}).then(() => {
		return Todo.insertMany(todos);
	}).then(() => done());//expression syntax
};

const populateUsers = (done) => {
	User.remove({}).then(() => {
		var userOne = new User(users[0]).save();//is a promise...
		var userTwo = new User(users[1]).save();//is a promise...
		return Promise.all([userOne, userTwo]);
	}).then(() => done());
};

module.exports = {todos, populateTodos, users, populateUsers};