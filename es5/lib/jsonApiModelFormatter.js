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
			var relationships = {};

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
								relationships[associationName] = { data: { type: associationType, id: associationId } };
							} else if (associationValue) {
								relationships[associationName] = { data: { type: associationType, id: associationValue.id } };
							}
						} else if (association.type === "hasMany") {
							var associationValues = model[associationName];
							if (associationValues.length > 0) {
								(function () {
									var currentRelationship = [];
									associationValues.forEach(function (associationValue) {
										if (associationValue.id) {
											currentRelationship.push({ type: associationType, id: associationValue.id });
										}
									});
									relationships[associationName] = { data: currentRelationship };
								})();
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

			if (Object.keys(relationships).length > 0) {
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

function parseObject(object, ModelClass) {
	var newModel = new ModelClass(object.attributes);
	if (object.relationships) {
		Object.keys(object.relationships).forEach(function (relationshipKey) {
			var relationship = object.relationships[relationshipKey];
			if (relationship && relationship.data && relationship.data.id) {
				var id = relationship.data.id;
				newModel[relationshipKey + "Id"] = id;
			}
		});
	}
	return newModel;
}

function parse(object, ModelClass) {
	if (Array.isArray(object)) {
		return object.map(function (currentObject) {
			return parseObject(currentObject, ModelClass);
		});
	} else {
		return parseObject(object, ModelClass);
	}
}

function JsonApiModelFormatter() {
	if (arguments.length === 1) {
		var models = arguments[0];
		if (Array.isArray(models) || models && models.length >= 0
		//HACK: this is a temporal hack to work around version issues with dovima
		 || models.constructor.name === "Collection") {
			return models.map(convertModel);
		} else {
			return convertModel(models);
		}
	} else if (arguments.length === 2) {
		var object = arguments[0];
		var modelClass = arguments[1];
		return parse(object, modelClass);
	}
}

module.exports = exports["default"];