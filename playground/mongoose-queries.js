const {ObjectID} = require('mongodb');
const {mongoose} = require('./../server/db/mongoose');
const {Todo} = require('./../server/models/todo');
const {User} = require('./../server/models/user');

// var id = '5a707689925edc40f43e78bc11';

var id = '5a6f4de9be4b463dc089a2ed';//user id

// if(!ObjectID.isValid(id)){
// 	console.log('Id not valid');
// }

// Todo.find({
// 	_id: id //mongoose converts it into an OnbjecID() in the background
// }).then((todos) => {
// 	if(!todos[0]){
// 		return console.log('Id not found');
// 	}
// 	console.log('Todos', todos);
// });

// Todo.findOne({
// 	_id: id //mongoose converts it into an OnbjecID() in the background
// }).then((todo) => {
// 	if(!todo){
// 		return console.log('Id not found');
// 	}
// 	console.log('Todo', todo);
// });

// Todo.findById(id).then((todo) => {
// 	if(!todo){
// 		return console.log('Id not found');
// 	}
// 	console.log('Todo By Id', todo);
// }).catch((e) => {
// 	console.log(e);
// });

User.findById(id).then((user) => {
	if(!user){
		return console.log('user not found');
	}
	console.log('User By Id', user);
}).catch((e) => {
	console.log(e);
});