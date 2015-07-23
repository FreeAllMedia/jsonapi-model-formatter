import jsonApiModelFormatter from "../lib/jsonApiModelFormatter.js";
import Model from "dovima";

describe("jsonApiModelFormatter", () => {
	class User extends Model {}

	let user,
		userAttributes;

	beforeEach(() => {
		userAttributes = {id: 2, name: "Bender Rodriguez"};
		user = new User(userAttributes);
	});

	it("should add the model type to the root", () => {
		jsonApiModelFormatter(user).type.should.equal("User");
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
});
