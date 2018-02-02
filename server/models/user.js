const mongoose = require('mongoose');
const validator = require('validator');
const jwt = require('jsonwebtoken');
const _ = require('lodash');

var UserSchema = new mongoose.Schema({
	name : {
		required : false,
		type: String,
		minlength : 1
	},
	email : {
		required : true,
		trim : true,
		type: String,
		minlength : 1,
		unique: true,
		validate : {
			validator: validator.isEmail, //pass in the mongoose validator as the method to use
			message: '{VALUE} is not a valid email'
		}
	},
	password : {
		type: String,
		require: true,
		minlength: 6
	},
	tokens: [{
		access: {
			type: String,
			require: true
		},
		token: {
			type: String,
			require: true
		}
	}]
});

// pick off only the properties we want to share with the user
UserSchema.methods.toJSON = function () {
	var user = this;
	var userObject = user.toObject();
	return _.pick(userObject, ['_id', 'email']);
}
UserSchema.methods.generateAuthToken = function () {
	var user = this;
	var access = 'auth';
	var token =  jwt.sign({_id : user._id.toHexString(), access}, 'abc123--*secret').toString();
	user.tokens.push({access, token});
	return user.save().then(() => {
		return token
	});
}

UserSchema.statics.findByToken = function (token) {
	var User = this;
	var decoded;
	try {
		decoded = jwt.verify(token, 'abc123--*secret');
	}catch(e){
		return Promise.reject();
	}
	return User.findOne({
		_id : decoded._id,
		'tokens.token' : token,//access nested props by using quotes
		'tokens.access' : 'auth'
	})
}

var User = mongoose.model('User', UserSchema);
module.exports = {User};