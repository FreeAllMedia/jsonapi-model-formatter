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
				jsonApiModelFormatter(user).relationships[0].should.have.property("type");
			});

			it("it should include the right type on the relationships object", () => {
				jsonApiModelFormatter(user).relationships[0].type.should.equal("post");
			});

			it("it should include the id on the relationships object", () => {
				jsonApiModelFormatter(user).relationships[0].should.have.property("id");
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
				jsonApiModelFormatter(user).relationships[0].should.have.property("type");
			});

			it("it should include the right type on the relationships object", () => {
				jsonApiModelFormatter(user).relationships[0].type.should.equal("address");
			});

			it("it should include the id on the relationships object", () => {
				jsonApiModelFormatter(user).relationships[0].should.have.property("id");
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
});
