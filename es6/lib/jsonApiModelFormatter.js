import Model from "dovima";

export default function JsonApiModelFormatter(model) {
	if(model instanceof Model) {
		let attributes = model.attributes;
		delete attributes.id; //so it's just on the root
		return {
			type: model.constructor.name,
			id: model.id,
			attributes: attributes
		};
	} else {
		throw new Error(`The object provided to be formatted as json is not a model.`);
	}
}
