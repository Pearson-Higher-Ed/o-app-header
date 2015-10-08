/**
 * Dispatches a DOM event.
 * @param  {EventTarget} element Source element.
 * @param  {String} name Name of the event.
 * @return {undefined} undefined
 */
export function dispatchEvent(element, name) {
	if (document.createEvent && element.dispatchEvent) {
		const event = document.createEvent('Event');

		event.initEvent(name, true, true);
		element.dispatchEvent(event);
	}
};
