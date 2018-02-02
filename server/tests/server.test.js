const expect = require('expect');
const request = require('supertest');
const {app} = require('./../server');
const {Todo} = require('./../models/todo');
const {User} = require('./../models/user');
const {ObjectID} = require('mongodb');
const {todos, populateTodos, users, populateUsers} = require('./seed/seed');

beforeEach(populateUsers);
// tests below assume the database to be empty. So before each test, we need to empty it, Then we refill with sample todos
beforeEach(populateTodos);

describe('POST /todos', () => {
	it('should create a new todo', (done) => {
		var text = 'Test text';

		request(app)
			.post('/todos')
			.send({text})
			.expect(200)
			.expect((res) => {
				// inspect the response, make an assertion			
				expect(res.body.text).toBe(text);//this expect is not a .method
			})
			.end((err, res) => {
				if(err){
					return done(err);
				}

				// verify that it's in the database
				Todo.find({text}).then((todos) => {
					// make some assertions
					expect(todos.length).toBe(1);
					expect(todos[0].text).toBe(text);
					done();
				}).catch((e) => done(e));

			})
	});

	//it should not create todo with invalid body data
	it('should not create todo with invalid body data', (done) => {
		request(app)
			.post('/todos')
			.send({})
			.expect(400)
			.end((err, res) => {
				if(err){
					return done(err)
				}
				Todo.find().then((todos) => {
					expect(todos.length).toBe(2);
					done();
				}).catch((e) => done(e));
			})
	});

});

describe('GET /todos', () => {
	it('should get all todos', (done) => {
		request(app)
			.get('/todos')
			.expect(200)
			.expect((res) => {
				expect(res.body.todos.length).toBe(2);
			})
			.end(done);
	});
});

describe('GET /todos/:id', () => {
	it('should return todo doc', (done) => {
		request(app)
			.get(`/todos/${todos[0]._id.toHexString()}`)
			.expect(200)
			.expect((res) => {
				expect(res.body.todo.text).toBe(todos[0].text);
			})
			.end(done);
	});

	it('should return 404 if todo not found', (done) => {
		var hexId = new ObjectID().toHexString();
		request(app)
			// pass id that isn't there
			.get(`/todos/${hexId}`)
			// .expect((r) => {
			// 	console.log(r.status);
			// })
			.expect(404)
			.end(done);
	});

	it('should return 404 for non-object ids', (done) => {
		request(app)
			.get('/todos/123abc')
			.expect(404)
			.end(done);
	});
});

describe('DELETE /todos/:id', () => {
	it('should remove a todo', (done) => {
		var hexId = todos[1]._id.toHexString();
		request(app)
			.delete(`/todos/${hexId}`)
			.expect(200)
			.expect((res) => {
				expect(res.body.todo._id).toBe(hexId);
			})
			.end((err, res) => {
				if(err){
					return done(err);
				}

				// query database using findById toNotExist
				Todo.findById(hexId).then((todo) => {
					expect(todo).toBeNull();
					done();
				}).catch((e) => {
					done(e);
				})

			})
	});

	it('should return 404 if todo not found', (done) => {
		var hexId = new ObjectID();
		request(app)
			.delete(`/todos/${hexId}`)
			.expect(404)
			.end(done);
	});

	it('should return 404 if id invalid', (done) => {
		request(app)
			.delete('/todos/123abc')
			.expect(404)
			.end(done);
	});
});

describe('PATCH /todos/:id', () => {
	it('should update the todo', (done) => {
		var hexId = todos[0]._id.toHexString();
		var newTxt = 'new updated text';
		request(app)
			.patch(`/todos/${hexId}`)
			.send({
				text: newTxt,
				completed: true		
			})
			.expect(200)
			.expect((res) => {
				expect(res.body.todo.text).toBe(newTxt);
				expect(res.body.todo.completed).toBe(true);
				expect(typeof res.body.todo.completedAt).toBe('number');
			})
			.end(done);
	});

	it('should clear completedAt when todo is not completed', (done) => {
		var hexId = todos[1]._id.toHexString();
		var text = 'blah blah';
		request(app)
			.patch(`/todos/${hexId}`)
			.send({
				completed : false,
				text
			})
			.expect(200)
			.expect((res) => {
				expect(res.body.todo.text).toBe(text);
				expect(res.body.todo.completed).toBe(false);
				expect(res.body.todo.completedAt).toBeNull();
			})
			.end(done);
	});
});

describe('GET /users/me', () => {
	it('should return user if authenticated', (done) => {
		request(app)
			.get('/users/me')
			.set('x-auth', users[0].tokens[0].token)
			.expect(200)
			.expect((res) => {
				expect(res.body._id).toBe(users[0]._id.toHexString());
				expect(res.body.email).toBe(users[0].email)
			})
			.end(done);
	});
	it('should return 401 if not authenticated', (done) => {
		request(app)
			.get('/users/me')
			.expect(401)
			.expect((res) => {
				expect(res.body).toEqual({});
			})
			.end(done);
	});
});

describe('POST /users', () => {
	it('should create a user', (done) => {
		var email = 'xample@sample.com';
		var password = 'xemploid123!';
		request(app)
			// .post(`/users/${userName}`)
			.post('/users')
			.send({email, password})
			.expect(200)
			.expect((res) => {
				expect(res.headers['x-auth']).toBeTruthy();//we don't care what it is, just that it's there
				expect(res.body._id).toBeTruthy();// toExist() is deprecated, use toBeTruthy instead https://stackoverflow.com/a/46459995/5350539
				expect(res.body.email).toBe(email);
			})
			.end((err) => {
				if(err){
					return done(err);
				}
				User.findOne({email}).then((user) => {
					expect(user).toBeTruthy();
					expect(user.password).not.toBe(password);
					done();
				});				
			});
	});

	it('should return validation errors if request invalid', (done) => {
		var email = '@sample.com';
		var password = '23!';
		request(app)
			.post('/users')
			.send({email, password})
			.expect(400)
			.end(done);
	});

	it('should not create user if email in use', (done) => {
		var email = users[0].email;//already in use from seed
		var password = 'xemploid123hgzujhzhgtzhbgzhfghg!';
		request(app)
			.post('/users')
			.send({email, password})
			.expect(400)
			.end(done);
	});
});