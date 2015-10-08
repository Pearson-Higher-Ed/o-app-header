/**
 * Iterates over an Array-like object, invoking `callback` for each item in the collection.
 * @param {Array} array The Array or Array-like object to iterate.
 * @param {Function} callback The callback function that will be called for each item
 * in the collection.
 * @return {undefined} undefined
 */
export default function forEach(array, callback) {
	for (let i = 0, l = array.length; i < l; i++) {
		callback(i, array[i]);
	}
}
