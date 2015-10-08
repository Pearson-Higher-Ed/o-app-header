import AppHeader from './src/js/AppHeader';

export default (element, options) => {
	return getOrCreateInstance(element, options);
};

export const init = AppHeader.init;

let instance;

const getOrCreateInstance = (element, options) => {
	if (!instance) {
		instance = new AppHeader(element, options);
	}

	return instance;
};

const construct = () => {
	getOrCreateInstance();
	document.removeEventListener('o.DOMContentLoaded', construct);
};

document.addEventListener('o.DOMContentLoaded', construct);
