"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports["default"] = JsonApiModelFormatter;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var _dovima = require("dovima");

var _dovima2 = _interopRequireDefault(_dovima);

function convertModel(model) {
	//HACK: this is a temporal hack to work around version issues with dovima
	if (model && typeof model.toJSON === "function" && model.constructor.name === "Model" || model instanceof _dovima2["default"]) {
		var attributes = model.toJSON();
		var id = attributes.id;
		delete attributes.id; //so it's just on the root
		return {
			type: model.constructor.name,
			id: id,
			attributes: attributes
		};
	} else {
		throw new Error("The object provided to be formatted as json is not a dovima Model / Collection.");
	}
}

function JsonApiModelFormatter(models) {
	if (Array.isArray(models) || models.constructor.name === "Array"
	//HACK: this is a temporal hack to work around version issues with dovima
	 || models.constructor.name === "Collection") {
		return models.map(convertModel);
	} else {
		return convertModel(models);
	}
}

module.exports = exports["default"];