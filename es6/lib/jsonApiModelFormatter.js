import Model from "dovima";
import inflect from "jargon";

function convertModel(model) {
	if((model && typeof (model.toJSON) === "function")
		|| model instanceof Model) {

		let attributes = model.toJSON();
		const id = attributes.id;
		delete attributes.id; //so it's just on the root
		let relationships = [];

		if(model.associations) {
			const associationNames = Object.keys(model.associations);
			associationNames.forEach((associationName) => {
				const association = model.associations[associationName];
				let associationType;
				if(association) {
					associationType = inflect(association.constructor.name).camel.toString();
					if(association.type === "hasOne") {
						const associationId = model[`${associationName}Id`];
						const associationValue = model[associationName];
						delete attributes[`${associationName}Id`];
						if(associationId) {
							relationships.push({type: associationType, id: associationId});
						} else if (associationValue) {
							relationships.push({type: associationType, id: associationValue.id});
						}
					} else if (association.type === "hasMany") {
						const associationValues = model[associationName];
						if(associationValues.length > 0) {
							associationValues.forEach((associationValue) => {
								if(associationValue.id) {
									relationships.push({type: associationType, id: associationValue.id});
								}
							});
						}
					}
				}
			});
		}

		let result = {
			type: inflect(model.constructor.name).camel.toString(),
			id: id,
			attributes: attributes
		};

		if(relationships.length > 0) {
			result.relationships = relationships;
		}

		return result;
	} else {
		throw new Error(`The object provided to be formatted as json is not a dovima Model / Collection.`);
	}
}

export default function JsonApiModelFormatter(models) {
	if(Array.isArray(models)
		|| (models && models.length >= 0)
		//HACK: this is a temporal hack to work around version issues with dovima
		|| (models.constructor.name === "Collection")) {
		return models.map(convertModel);
	} else {
		return convertModel(models);
	}
}
