var mongoose = require('mongoose');
mongoose.Promise = global.Promise;//set it up to use native Promises
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/TodoApp');

module.exports = {mongoose};