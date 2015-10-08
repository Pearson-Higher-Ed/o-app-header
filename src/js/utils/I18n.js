export default class I18n{

	constructor(options) {
		options = Object.assign({}, I18n.defaultSettings, options);
		this.keys = I18n.strings[options.locale] || I18n.strings.en;
	}

	translate(key) {
		return this.keys[key] || key;
	}

}

I18n.defaultSettings = {
	locale: 'en'
};

I18n.strings = {
	en: {
		'All courses': 'All courses',
		'Help': 'Help',
		'Menu': 'Menu',
		'User account menu': 'User account menu',
		'My Account': 'My Account',
		'Sign In': 'Sign In',
		'Sign Out': 'Sign Out'
	}
};
