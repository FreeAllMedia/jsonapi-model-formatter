import Model from "dovima";
import jargon from "jargon";

function convertModel(model) {
	if((model && typeof (model.toJSON) === "function")
		|| model instanceof Model) {

		let attributes = model.toJSON();
		const id = attributes.id;
		delete attributes.id; //so it's just on the root
		let relationships = {};

		if(model.associations) {
			const associationNames = Object.keys(model.associations);
			associationNames.forEach((associationName) => {
				const association = model.associations[associationName];
				let associationType;
				if(association) {
					associationType = jargon(association.constructor.name).camel.toString();
					if(association.type === "hasOne") {
						const associationId = model[`${associationName}Id`];
						const associationValue = model[associationName];
						delete attributes[`${associationName}Id`];
						if(associationId) {
							relationships[associationName] = { data: { type: associationType, id: associationId } };
						} else if (associationValue) {
							relationships[associationName] = { data: { type: associationType, id: associationValue.id } };
						}
					} else if (association.type === "hasMany") {
						const associationValues = model[associationName];
						if(associationValues.length > 0) {
							const currentRelationship = [];
							associationValues.forEach((associationValue) => {
								if(associationValue.id) {
									currentRelationship.push({ type: associationType, id: associationValue.id });
								}
							});
							relationships[associationName] = { data: currentRelationship };
						}
					}
				}
			});
		}

		let result = {
			type: jargon(model.constructor.name).camel.toString(),
			id: id,
			attributes: attributes
		};

		if(Object.keys(relationships).length > 0) {
			result.relationships = relationships;
		}

		return result;
	} else {
		throw new Error(`The object provided to be formatted as json is not a dovima Model / Collection.`);
	}
}

function parseObject(object, ModelClass) {
	const newModel = new ModelClass(object.attributes);
	if(object.relationships) {
		Object.keys(object.relationships).forEach(
			(relationshipKey) => {
				const relationship = object.relationships[relationshipKey];
				if(relationship && relationship.data && relationship.data.id) {
					const id = relationship.data.id;
					newModel[`${relationshipKey}Id`] = id;
				}
			}
		);
	}
	return newModel;
}

function parse(object, ModelClass) {
	if(Array.isArray(object)) {
		return object.map((currentObject) => {
			return parseObject(currentObject, ModelClass);
		});
	} else {
		return parseObject(object, ModelClass);
	}
}

export default function JsonApiModelFormatter() {
	if(arguments.length === 1) {
		let models = arguments[0];
		if(Array.isArray(models)
			|| (models && models.length >= 0)
			//HACK: this is a temporal hack to work around version issues with dovima
			|| (models.constructor.name === "Collection")) {
			return models.map(convertModel);
		} else {
			return convertModel(models);
		}
	} else if(arguments.length === 2) {
		const object = arguments[0];
		const modelClass = arguments[1];
		return parse(object, modelClass);
	}

}
