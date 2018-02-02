var {User} = require('./../models/user');
// a middleware func we use on routes to make them private
var authenticate = (req, res, next) => {
	var token = req.header('x-auth');
	User.findByToken(token).then((user) => {
		if(!user){
			return Promise.reject();//goes to catch
		}
		req.user = user;
		req.token = token;
		next();
	}).catch((e) => {
		res.status(401).send();
	}); 
}
module.exports = {authenticate};