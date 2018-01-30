var mongoose = require('mongoose');
var User = mongoose.model('User', {
	name : {
		required : true,
		type: String,
		minlength : 1
	},
	email : {
		required : true,
		trim : true,
		type: String,
		minlength : 1
	}
});
module.exports = {User};