"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports["default"] = JsonApiModelFormatter;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var _dovima = require("dovima");

var _dovima2 = _interopRequireDefault(_dovima);

function JsonApiModelFormatter(model) {
	if (model instanceof _dovima2["default"]) {
		var attributes = model.attributes;
		delete attributes.id; //so it's just on the root
		return {
			type: model.constructor.name,
			id: model.id,
			attributes: attributes
		};
	} else {
		throw new Error("The object provided to be formatted as json is not a model.");
	}
}

module.exports = exports["default"];