const {SHA256} = require('crypto-js');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');


var secretSalt = 'salty mc salterson';

var password = '123abc!';

bcrypt.genSalt(10, (err, salt) => {
	bcrypt.hash(password, salt, (err, hash) => {
		console.log(hash);
	})
});

var hashedPassword = '$2a$10$/blp6B5J9H3CoXBfZ.Wu1e0Nlrse0/Pxej1U.GPjooR8c69ZxKH96';

bcrypt.compare(password, hashedPassword, (err, res) => {
	if(res){
		console.log(res);
	}
})

// var data = {
// 	id : 10
// };
// var token = jwt.sign(data, secretSalt);
// console.log('token:' , token);

// var decoded = jwt.verify(token, secretSalt);
// console.log('decoded: ' + JSON.stringify(decoded, undefined, 2));


// var message = 'I am uggletron!';
// var hash = SHA256(message).toString();

// console.log('hash: ', hash);

// var data = {
// 	id : 4
// };
// var token = {
// 	data,
// 	hash: SHA256(JSON.stringify(data) + secretSalt).toString()
// };


// // man in the middle
// token.data.id = 5 //pretends to be user 5
// token.hash = SHA256(JSON.stringify(token.data)).toString();


// var resultHash = SHA256(JSON.stringify(token.data) + secretSalt).toString(); 

// if(resultHash === token.hash){
// 	console.log('data was not changed');
// }else{
// 	console.log('data was changed, do not trust!');
// }
