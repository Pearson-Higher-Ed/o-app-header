/**
 * Gets the value at `path` of `object`.
 * @param {object} object The source object.
 * @param {string} path The path to locate.
 * @return {any} The value at `path` of `object`.
 */
export default function get(object, path) {
	if (typeof object === 'undefined' || object === null) return;

	path = path.split('.');
	let index = 0;
	const length = path.length;

	while (object !== null && typeof object !== 'undefined' && index < length) {
		object = object[path[index++]];
	}

	return (index && index === length) ? object : undefined;
}
