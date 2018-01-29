// const MongoClient = require('mongodb').MongoClient;
const {MongoClient, ObjectID} = require('mongodb');//use ES6 deconstructor syntax to pull off whatever properties we need

// see https://stackoverflow.com/a/47662979 for updates
MongoClient.connect('mongodb://localhost:27017', (err, client) => {
	if(err){
		return console.log('unable to connect to mongodb server');
	}
	console.log('connected to mongodb server');

	var db = client.db('TodoApp');


	// db.collection('Todos').find({completed: false}).toArray().then((docs) => {
	// db.collection('Todos').find({_id : new ObjectID("5a6eff7d4a575443001dd86a")}).toArray().then((docs) => {
	// 	console.log('Todos');
	// 	console.log(JSON.stringify(docs, undefined, 2));
	// },(err) => {
	// 	console.log('unable to fetch todos', err);
	// });


	// db.collection('Users').find({age : 26}).count().then((count) => {
	// 	console.log(`Users count: ${count}`);
	// 	// console.log(JSON.stringify(docs, undefined, 2));
	// },(err) => {
	// 	console.log('unable to fetch todos', err);
	// });

	db.collection('Users').find({age : 26}).toArray().then((docs) => {
		console.log(JSON.stringify(docs, undefined, 2));
		// console.log(JSON.stringify(docs, undefined, 2));
	},(err) => {
		console.log('unable to fetch Users', err);
	});

	// client.close();
});