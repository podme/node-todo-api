const {ObjectID} = require('mongodb');
const {mongoose} = require('./../server/db/mongoose');
const {Todo} = require('./../server/models/todo');
const {User} = require('./../server/models/user');

// Todo.remove({}).then((result) => {
// 	console.log(result);
// });

// Todo.findOneAndRemove();
// Todo.findByIdAndRemove();

// Todo.findOneAndRemove({_id : '5a72373eb616f88bfa33f327'}).then((todo) => {
// 	console.log(todo)
// });

// Todo.findByIdAndRemove('5a72368eb616f88bfa33f2c8').then((todo) => {
// 	console.log(todo);
// });