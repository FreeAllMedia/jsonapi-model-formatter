import jsonApiModelFormatter from "../lib/jsonApiModelFormatter.js";
import Model from "dovima";

describe("jsonApiModelFormatter", () => {
	class User extends Model {
		associate() {
			this.hasMany("posts", Post);
			this.hasOne("address", Address);
		}
	}

	class Address extends Model {}

	class Post extends Model {
		associate() {
			this.belongsTo("user", User);
		}
	}

	let user,
		userAttributes;

	beforeEach(() => {
		userAttributes = {id: 2, name: "Bender Rodriguez"};
		user = new User(userAttributes);
	});

	it("should add the model type to the root", () => {
		jsonApiModelFormatter(user).type.should.equal("user");
	});

	it("should add the model id to the root", () => {
		jsonApiModelFormatter(user).id.should.equal(user.id);
	});

	it("should add the model's attributes on the attributes element", () => {
		let jsonApiUserAttributes = userAttributes;
		delete jsonApiUserAttributes.id;
		jsonApiModelFormatter(user).attributes.should.eql(jsonApiUserAttributes);
	});

	it("should support a model array", () => {
		let jsonApiUserAttributes = userAttributes;
		delete jsonApiUserAttributes.id;
		jsonApiModelFormatter([user])[0].attributes.should.eql(jsonApiUserAttributes);
	});

	it("should throw an exception if the provided object is not an instance of Model", () => {
		() => {
			jsonApiModelFormatter(userAttributes);
		}.should.throw("The object provided to be formatted as json is not a dovima Model / Collection.");
	});

	describe("(relationships)", () => {
		let post;

		describe("(hasMany)", () => {
			beforeEach(() => {
				post = new Post({"id": 23});
				user.posts.push(post);
			});

			it("it should include a relationships object", () => {
				jsonApiModelFormatter(user).should.have.property("relationships");
			});

			it("it should include the type on the relationships object", () => {
				jsonApiModelFormatter(user).relationships.posts.data[0].should.have.property("type");
			});

			it("it should include the right type on the relationships object", () => {
				jsonApiModelFormatter(user).relationships.posts.data[0].type.should.equal("post");
			});

			it("it should include the id on the relationships object", () => {
				jsonApiModelFormatter(user).relationships.posts.data[0].should.have.property("id");
			});
		});

		describe("(hasOne)", () => {
			let address;

			beforeEach(() => {
				address = new Address();
				user.address = address;
			});

			it("it should include a relationships object", () => {
				jsonApiModelFormatter(user).should.have.property("relationships");
			});

			it("it should include the type on the relationships object", () => {
				jsonApiModelFormatter(user).relationships.address.data.should.have.property("type");
			});

			it("it should include the right type on the relationships object", () => {
				jsonApiModelFormatter(user).relationships.address.data.type.should.equal("address");
			});

			it("it should include the id on the relationships object", () => {
				jsonApiModelFormatter(user).relationships.address.data.should.have.property("id");
			});
		});

		describe("(belongsTo)", () => {
			beforeEach(() => {
				post = new Post({"id": 23});
				post.user = user;
			});

			it("it should not have a relationships object", () => {
				jsonApiModelFormatter(post).should.not.have.property("relationships");
			});
		});
	});

	describe("function object conflicts", () => {
		it("should work correctly if the object has a toJSON function", () => {
			const result = "some result";
			class Apple {
				toJSON() {
					return result;
				}
			}

			const apple = new Apple();
			jsonApiModelFormatter(apple).attributes.should.equal(result);
		});

		it("should work correctly with a unknown collection that extends the array", () => {
			class Apples extends Array {}

			const apples = new Apples();
			jsonApiModelFormatter(apples).should.eql([]);
		});
	});

	describe("(parsing)", () => {
		class Apple extends Model {}

		describe("(one object)", () => {
			it("should return a dovima model from a json api input", () => {
				const input = { type: "apples", attributes: { name: "some" } };
				jsonApiModelFormatter(input, Apple).should.be.instanceOf(Apple);
			});

			it("should return a model with the correct attributes", () => {
				const attributes = { name: "some" };
				const input = { type: "apples", attributes };
				jsonApiModelFormatter(input, Apple).should.be.instanceOf(Apple);
			});
		});

		describe("(an array)", () => {
			let input;
			let output;
			let expectedOutput;

			beforeEach(() => {
				input = [{ type: "apples", attributes: { name: "some" } }, { type: "apples", attributes: { name: "second" } }];
				output = jsonApiModelFormatter(input, Apple);
				expectedOutput = [new Apple({name: "some"}), new Apple({name: "second"})];
			});

			it("should return an array", () => {
				Array.isArray(output).should.be.true;
			});

			it("should return dovima models from a json api input", () => {
				output[0].should.be.instanceOf(Apple);
			});

			it("should return the correct attributes", () => {
				output.should.eql(expectedOutput);
			});
		});

		describe("(relationships)", () => {
			it("should assign the id for a relationship", () => {
				const input = { type: "apples", attributes: { name: "some" }, relationships: { "tree": { data: { type: "trees", id: "4" } } } };
				jsonApiModelFormatter(input, Apple).treeId.should.equal("4");
			});

			it("should ignore an array relationship", () => {
				// support for array relationships is complex and not needed yet
				// because it needs to dig into the association related in the model to find the class to instantiate
				const input = { type: "apples", attributes: { name: "some" }, relationships: { "tree": { data: [{ type: "trees", id: "4" }, { type: "trees", id: "5" }] } } };
				(() => {
					jsonApiModelFormatter(input, Apple);
				}).should.not.throw;
			});
		});

	});
});
