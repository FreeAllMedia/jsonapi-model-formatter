"use strict";

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; desc = parent = getter = undefined; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; continue _function; } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; }

var _libJsonApiModelFormatterJs = require("../lib/jsonApiModelFormatter.js");

var _libJsonApiModelFormatterJs2 = _interopRequireDefault(_libJsonApiModelFormatterJs);

var _dovima = require("dovima");

var _dovima2 = _interopRequireDefault(_dovima);

describe("jsonApiModelFormatter", function () {
	var User = (function (_Model) {
		function User() {
			_classCallCheck(this, User);

			_get(Object.getPrototypeOf(User.prototype), "constructor", this).apply(this, arguments);
		}

		_inherits(User, _Model);

		return User;
	})(_dovima2["default"]);

	var user = undefined,
	    userAttributes = undefined;

	beforeEach(function () {
		userAttributes = { id: 2, name: "Bender Rodriguez" };
		user = new User(userAttributes);
	});

	it("should add the model type to the root", function () {
		(0, _libJsonApiModelFormatterJs2["default"])(user).type.should.equal("User");
	});

	it("should add the model id to the root", function () {
		(0, _libJsonApiModelFormatterJs2["default"])(user).id.should.equal(user.id);
	});

	it("should add the model's attributes on the attributes element", function () {
		var jsonApiUserAttributes = userAttributes;
		delete jsonApiUserAttributes.id;
		(0, _libJsonApiModelFormatterJs2["default"])(user).attributes.should.eql(jsonApiUserAttributes);
	});

	it("should support a model array", function () {
		var jsonApiUserAttributes = userAttributes;
		delete jsonApiUserAttributes.id;
		(0, _libJsonApiModelFormatterJs2["default"])([user])[0].attributes.should.eql(jsonApiUserAttributes);
	});

	it("should throw an exception if the provided object is not an instance of Model", function () {
		(function () {
			(0, _libJsonApiModelFormatterJs2["default"])(userAttributes);
		}).should["throw"]("The object provided to be formatted as json is not a dovima Model / Collection.");
	});
});