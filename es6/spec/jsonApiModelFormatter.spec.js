import JsonApiModelFormatter from "../lib/jsonApiModelFormatter.js";
import Model from "dovima";

describe("JsonApiModelFormatter", () => {
	class User extends Model {}

	let user,
		userAttributes;

	beforeEach(() => {
		userAttributes = {id: 2, name: "Bender Rodriguez"};
		user = new User(userAttributes);
	});

	it("should add the model type to the root", () => {
		JsonApiModelFormatter(user).type.should.equal("User");
	});

	it("should add the model id to the root", () => {
		JsonApiModelFormatter(user).id.should.equal(user.id);
	});

	it("should add the model's attributes on the attributes element", () => {
		let jsonApiUserAttributes = userAttributes;
		delete jsonApiUserAttributes.id;
		JsonApiModelFormatter(user).attributes.should.eql(jsonApiUserAttributes);
	});

	it("should throw an exception if the provided object is not an instance of Model", () => {
		() => {
			JsonApiModelFormatter(userAttributes);
		}.should.throw("The object provided to be formatted as json is not a model.");
	});
});
