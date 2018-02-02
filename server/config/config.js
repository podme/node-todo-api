var env = process.env.NODE_ENV || 'development';
// console.log('env: ', JSON.stringify(env));
if(env==='development'){
	process.env.PORT = 3000;
	process.env.MONGODB_URI = 'mongodb://localhost:27017/TodoApp';

}else if(env==='test'){
	console.log("env==='test'");
	process.env.PORT = 3000;
	// use a different database for testing so tests don't wipe database
	process.env.MONGODB_URI = 'mongodb://localhost:27017/TodoAppTest';
}
// console.log('process.env.PORT: ', process.env.PORT);
