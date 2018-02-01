const expect = require('expect');
const request = require('supertest');
const {app} = require('./../server');
const {Todo} = require('./../models/todo');
const {ObjectID} = require('mongodb');

const todos = [{
	_id : new ObjectID(),
	text: 'First test todo'
},{
	_id : new ObjectID(),
	text: 'Second test todo'
}];

// out tests below assume the database to be empty. So before each test, we need to empty it, Then we refill with sample todos
beforeEach((done) => {
	Todo.remove({}).then(() => {
		return Todo.insertMany(todos);
	}).then(() => done());//expression syntax
});

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