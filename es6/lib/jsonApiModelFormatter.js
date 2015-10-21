import Model from "dovima";
import {Collection} from "dovima";

function convertModel(model) {
	if((model && typeof (model.toJSON) === "function") || model instanceof Model) {
		let attributes = model.toJSON();
		const id = attributes.id;
		delete attributes.id; //so it's just on the root
		return {
			type: model.constructor.name,
			id: id,
			attributes: attributes
		};
	} else {
		throw new Error(`The object provided to be formatted as json is not a dovima Model / Collection.`);
	}
}

export default function JsonApiModelFormatter(models) {
	if(Array.isArray(models) || (models instanceof Collection)) {
		return models.map(convertModel);
	} else {
		return convertModel(models);
	}
}
