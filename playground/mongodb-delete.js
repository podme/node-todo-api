// const MongoClient = require('mongodb').MongoClient;
const {MongoClient, ObjectID} = require('mongodb');//use ES6 deconstructor syntax to pull off whatever properties we need

// see https://stackoverflow.com/a/47662979 for updates
MongoClient.connect('mongodb://localhost:27017', (err, client) => {
	if(err){
		return console.log('unable to connect to mongodb server');
	}
	console.log('connected to mongodb server');

	var db = client.db('TodoApp');

	// deleteMany
	// db.collection('Todos').deleteMany({text: 'eat lunch'}).then((result) => {
	// 	console.log(result);
	// });

	// deleteOne : deletes the first to match criteria then stops
	// db.collection('Todos').deleteOne({text: 'eat lunch'}).then((result) => {
	// 	console.log(result);
	// });

	// findOneAndDelete
	// db.collection('Todos').findOneAndDelete({text: 'eat lunch'}).then((result) => {
	// 	var returnedToDo = result.value;
	// 	console.log('deleted and returnedToDo: ', JSON.stringify(returnedToDo, undefined, 2));
	// 	console.log(result);
	// });


	// delete by id using findOneAndDelete
	db.collection('Users').findOneAndDelete({_id: new ObjectID('5a6f027dd325ca282443704f')}).then((result) => {
		var returnedToDo = result.value;
		console.log('deleted and returnedToDo: ', JSON.stringify(returnedToDo, undefined, 2));
		console.log(result);
	});

	// deleteMany with same age
	db.collection('Users').deleteMany({age: 78}).then((result) => {
		console.log(result);
	});

	// db.collection('Todos').find({age : 26}).toArray().then((docs) => {
	// 	console.log(JSON.stringify(docs, undefined, 2));
	// 	// console.log(JSON.stringify(docs, undefined, 2));
	// },(err) => {
	// 	console.log('unable to fetch Users', err);
	// });

	// client.close();
});