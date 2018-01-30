const expect = require('expect');
const request = require('supertest');
const {app} = require('./../server');
const {Todo} = require('./../models/todo');

// out tests below assume the database to be empty. So before each test, we need to empty it
beforeEach((done) => {
	Todo.remove({}).then(() => done());//expression syntax
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
				Todo.find().then((todos) => {
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
					expect(todos.length).toBe(0);
					done();
				}).catch((e) => done(e));
			})
	});

});