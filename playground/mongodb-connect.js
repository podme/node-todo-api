// const MongoClient = require('mongodb').MongoClient;
const {MongoClient, ObjectID} = require('mongodb');//use ES6 deconstructor syntax to pull off whatever properties we need

// var obj = new ObjectID();
// console.log(obj);

// see https://stackoverflow.com/a/47662979 for updates
MongoClient.connect('mongodb://localhost:27017', (err, client) => {
	if(err){
		return console.log('unable to connect to mongodb server');
	}
	console.log('connected to mongodb server');

	var db = client.db('TodoApp');

	var user = {
		name: 'Paul',
		age: 35
	};


	// ES6 destructuring of variables
	// var {name} = user;
	// console.log(name); // Paul

	// db.collection('Todos').insertOne({
	// 	text: 'Something to do',
	// 	completed: false
	// }, (err, result) => {
	// 	if(err){
	// 		return console.log('unable to insert todo', err);
	// 	}
	// 	console.log(JSON.stringify(result.ops, undefined, 2));
	// });
	

	// db.collection('Users').insertOne({
	// 	name: 'Ug',
	// 	age: 35,
	// 	location : 'Heidelballs'
	// }, (err, result) => {
	// 	if(err){
	// 		return console.log('unable to insert todo', err);
	// 	}
	// 	console.log(JSON.stringify(result.ops, undefined, 2));
	// 	console.log(result.ops[0]._id);
	// 	console.log(result.ops[0]._id.getTimestamp());
	// });

	client.close();
});