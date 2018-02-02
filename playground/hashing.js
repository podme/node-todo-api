const {SHA256} = require('crypto-js');
const jwt = require('jsonwebtoken');
var secretSalt = 'salty mc salterson';

var data = {
	id : 10
};
var token = jwt.sign(data, secretSalt);
console.log('token:' , token);

var decoded = jwt.verify(token, secretSalt);
console.log('decoded: ' + JSON.stringify(decoded, undefined, 2));
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
