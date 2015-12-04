"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports["default"] = JsonApiModelFormatter;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var _dovima = require("dovima");

var _dovima2 = _interopRequireDefault(_dovima);

var _jargon = require("jargon");

var _jargon2 = _interopRequireDefault(_jargon);

function convertModel(model) {
	if (model && typeof model.toJSON === "function" || model instanceof _dovima2["default"]) {
		var _ret = (function () {

			var attributes = model.toJSON();
			var id = attributes.id;
			delete attributes.id; //so it's just on the root
			var relationships = [];

			if (model.associations) {
				var associationNames = Object.keys(model.associations);
				associationNames.forEach(function (associationName) {
					var association = model.associations[associationName];
					var associationType = undefined;
					if (association) {
						associationType = (0, _jargon2["default"])(association.constructor.name).camel.toString();
						if (association.type === "hasOne") {
							var associationId = model[associationName + "Id"];
							var associationValue = model[associationName];
							delete attributes[associationName + "Id"];
							if (associationId) {
								relationships.push({ type: associationType, id: associationId });
							} else if (associationValue) {
								relationships.push({ type: associationType, id: associationValue.id });
							}
						} else if (association.type === "hasMany") {
							var associationValues = model[associationName];
							if (associationValues.length > 0) {
								associationValues.forEach(function (associationValue) {
									if (associationValue.id) {
										relationships.push({ type: associationType, id: associationValue.id });
									}
								});
							}
						}
					}
				});
			}

			var result = {
				type: (0, _jargon2["default"])(model.constructor.name).camel.toString(),
				id: id,
				attributes: attributes
			};

			if (relationships.length > 0) {
				result.relationships = relationships;
			}

			return {
				v: result
			};
		})();

		if (typeof _ret === "object") return _ret.v;
	} else {
		throw new Error("The object provided to be formatted as json is not a dovima Model / Collection.");
	}
}

function JsonApiModelFormatter(models) {
	if (Array.isArray(models) || models && models.length >= 0
	//HACK: this is a temporal hack to work around version issues with dovima
	 || models.constructor.name === "Collection") {
		return models.map(convertModel);
	} else {
		return convertModel(models);
	}
}

module.exports = exports["default"];