// const MongoClient = require('mongodb').MongoClient;
const {MongoClient, ObjectID} = require('mongodb');//use ES6 deconstructor syntax to pull off whatever properties we need

// see https://stackoverflow.com/a/47662979 for updates
MongoClient.connect('mongodb://localhost:27017', (err, client) => {
	if(err){
		return console.log('unable to connect to mongodb server');
	}
	console.log('connected to mongodb server');

	var db = client.db('TodoApp');

	// db.collection('Todos').findOneAndUpdate({
	// 	_id : new ObjectID('5a6f0e8ac0e27ed838e1ded5')
	// },{
	// 	// $set is a mongo operator
	// 	$set : {
	// 		completed : true
	// 	}
	// },{
	// 	returnOriginal : false
	// }).then((result) => {
	// 	console.log(result);
	// });

	db.collection('Users').findOneAndUpdate({
		_id : new ObjectID('5a6f02af6f9710315878d638')
	},{
		// $set is a mongo operator
		$set : {
			name : 'Paul'
		},
		$inc : {
			age : 1//adds one to whatever it was
		}
	},{
		returnOriginal : false
	}).then((result) => {
		console.log(result);
	});

	// client.close();_
});