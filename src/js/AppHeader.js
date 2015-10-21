import { dispatchEvent } from './utils/dom';
import get from './utils/get';
import forEach from './utils/forEach';
import { patch } from '../../lib/incremental-dom';
import template from './template';
import I18n from './utils/I18n';
import DropdownMenu from 'o-dropdown-menu';

const CSS_CLASSES = ['o-app-header', 'o-header', 'o-header--fixed'];
const MODES = ['Signed Out', 'Basic', 'Course', 'Integration', 'Legacy Course'];
const MAX_COURSE_ITEMS = 5;
const LOGIN_EVENT = 'oAppHeader.login';
const LOGOUT_EVENT = 'oAppHeader.logout';

export default class AppHeader {

	/**
	 * Represents the header for Pearson Higher Ed web applications.
	 * @param {HTMLElement} element The root DOM element.
	 * @param {Object} options Configuration options.
	 * @return {undefined} undefined
	 */
	constructor(element, options) {
		this.init(element, options);
	}

	/**
	 * Initializes the current AppHeader instance.
	 * @param {HTMLElement} [element] The DOM element to initialize.
	 * Defaults to document.body, in which case the header element is
	 * prepended to the contents of the body element.
	 * @param {Object} options Configuration options.
	 * @return {undefined} undefined
	 */
	init(element, options) {
		if (typeof element === 'object' && !(element instanceof HTMLElement)) {
			options = element;
			element = null;
		}
		if (!element) element = document.body;
		if (!(element instanceof HTMLElement)) element = document.querySelector(element);

		const settings = this.getSettings_(options);
		const rootEl = this.element = this.constructRootEl_();

		this.i18n_ = new I18n({ locale: settings.locale });
		this.state_ = Object.assign({}, settings);

		if (element === document.body) {
			element.insertBefore(rootEl, element.firstChild);
		} else {
			// Replace the passed in element with the header element
			element.parentElement.insertBefore(rootEl, element);
			element.parentNode.removeChild(element);
		}

		this.render_();
	}

	/**
	 * Returns the current header mode.
	 * @return {string} The header mode.
	 */
	getMode() {
		return this.state_.mode;
	}

	/**
	 * Sets the header mode.
	 * @param {string} mode The mode.
	 * @param {Object} [options] An object with the options for the specified mode.
	 * @return {undefined} undefined.
	 */
	setMode(mode, options) {
		const newState = Object.assign({}, this.state_, { mode: mode }, options || {});

		this.validateSettings_(newState);
		this.setState_(newState, true);
	}

	/**
	 * Updates the internal state by replacing the existing object with a new
	 * object containing the new state.
	 * @param {Object} newState An object containing the new state.
	 * @param {Boolean} [update] If true, update the component's view.
	 * @return {undefined} undefined.
	 */
	setState_(newState, update) {
		this.state_ = Object.assign({}, this.state_, newState);
		if (update) this.render_();
	}

	validateSettings_(settings) {
		if (MODES.indexOf(settings.mode) === -1) {
			throw new TypeError('Unrecognized mode, \'' + settings.mode + '\'');
		}
	}

	getSettings_(options = {}) {
		// Merge links object
		const globalSettings = this.getGlobalSettings_();
		const links = Object.assign({}, AppHeader.defaultSettings.links, globalSettings.links, options.links);

		const settings = Object.assign({}, AppHeader.defaultSettings, globalSettings, options, { links: links });

		this.validateSettings_(settings);

		return settings;
	}

	getGlobalSettings_() {
		const configEl = document.querySelector('[data-o-app-header-config]');
		let config = {};

		if (!configEl) return config;
		try { config = JSON.parse(configEl.textContent); } catch (e) { throw new Error('Unable to parse configuration object: invalid JSON'); }
		return config;
	}

	resolveLink_(key) {
		if (!this.state_.links[key] || typeof this.state_.links[key] !== 'string') return;

		return this.state_.links[key].replace('{consoleBaseUrl}', this.state_.consoleBaseUrl);
	}


	constructRootEl_() {
		const element = document.createElement('header');

		element.setAttribute('role', 'banner');
		CSS_CLASSES.forEach(cssClass => element.classList.add(cssClass));

		element.addEventListener('oDropdownMenu.expand', function (e) {
			forEach(e.target.querySelectorAll('.o-app-header__icon'), function (idx, item) {
				item.classList.remove('o-app-header__icon-chevron-down');
				item.classList.add('o-app-header__icon-chevron-up');
			});
		});

		element.addEventListener('oDropdownMenu.collapse', function (e) {
			forEach(e.target.querySelectorAll('.o-app-header__icon'), function (idx, item) {
				item.classList.remove('o-app-header__icon-chevron-up');
				item.classList.add('o-app-header__icon-chevron-down');
			});
		});

		return element;
	}

	setThemeForMode_() {
		if ((this.state_.mode === 'Course' || this.state_.mode === 'Legacy Course') &&
			this.state_.theme === 'light') {
			this.element.classList.add('o-header--theme-light');
		} else {
			this.element.classList.remove('o-header--theme-light');
		}
	}

	getDataForRender_() {
		const mode = this.state_.mode;
		let data = {};
		const menuItems = [];

		let menuItemCounter = 0;

		function createMenuItemDef(source, options) {
			options = options || {};
			options.classes = options.classes || [];

			let defaultClasses = [];

			if (options.classes.indexOf('o-dropdown-menu__divider') === -1) {
				defaultClasses = ['o-dropdown-menu__menu-item'];
			}

			const menuItem = Object.assign({}, source);

			menuItem.key = menuItemCounter++;
			menuItem.classes = defaultClasses.concat(options.classes).join(' ');

			return menuItem;
		}

		let menuNavItemClasses = ['o-header__nav-item'];

		if (mode === 'Signed Out' && this.state_.showLoginControls) {
			menuNavItemClasses.push('o-app-header__nav-item-sign-in');
		}

		if (mode === 'Basic' ||
			mode === 'Course' ||
			mode === 'Legacy Course') {
			menuNavItemClasses.push('o-app-header__nav-item-menu');
		}

		menuNavItemClasses = menuNavItemClasses.join(' ');

		if (mode === 'Basic') {
			let courseItems = get(this.state_, 'courseItems') || [];
			let courseItemsExceedsMax = false;

			if (courseItems.length > MAX_COURSE_ITEMS) {
				courseItemsExceedsMax = true;
				courseItems = courseItems.slice(0, MAX_COURSE_ITEMS);
			}

			if (courseItems.length) {
				for (let i = 0, l = courseItems.length; i < l; i++) {
					menuItems.push(createMenuItemDef(courseItems[i], {
						classes: [
							'o-app-header__menu-item-course',
							'o-header__viewport-tablet--hidden',
							'o-header__viewport-desktop--hidden'
						]
					}));
				}

				if (courseItemsExceedsMax) {
					menuItems.push(createMenuItemDef({
						text: this.i18n_.translate('All courses'),
						href: this.resolveLink_('home')
					}, {
						classes: [
							'o-app-header__menu-item-all-courses',
							'o-header__viewport-tablet--hidden',
							'o-header__viewport-desktop--hidden'
						]
					}));
				}

				menuItems.push(createMenuItemDef({}, {
					classes: [
						'o-dropdown-menu__divider',
						'o-header__viewport-tablet--hidden',
						'o-header__viewport-desktop--hidden'
					]
				}));
			}
		}

		if (mode === 'Course' || mode === 'Legacy Course') {
			menuItems.push(createMenuItemDef({
				text: this.i18n_.translate('All courses'),
				href: this.resolveLink_('home')
			}, {
				classes: [
					'o-app-header__menu-item-all-courses',
					'o-header__viewport-tablet--hidden',
					'o-header__viewport-desktop--hidden'
				]
			}));

			menuItems.push(createMenuItemDef({}, {
				classes: [
					'o-dropdown-menu__divider',
					'o-header__viewport-tablet--hidden',
					'o-header__viewport-desktop--hidden'
				]
			}));

			const courseNav = Object.assign({ items: [] }, get(this.state_, 'courseNav'));

			if (courseNav.heading || courseNav.items.length) {
				const courseNavRoot = {
					isCourseNav: true,
					courseNavMenuItems: []
				};

				if (courseNav.heading) {
					courseNavRoot.courseNavMenuItems.push(createMenuItemDef(courseNav.heading, {
						classes: [
							'o-app-header__menu-item-course-nav',
							'o-dropdown-menu__heading'
						]
					}));
				}

				courseNav.items.forEach(function (item) {
					const classes = ['o-app-header__menu-item-course-nav'];

					if (item.active) classes.push('o-dropdown-menu__menu-item--disabled');

					courseNavRoot.courseNavMenuItems.push(createMenuItemDef(item, {
						classes: classes
					}));
				});

				menuItems.push(courseNavRoot);
			}
		}

		if (mode === 'Legacy Course' && this.state_.menuItems.length) {
			this.state_.menuItems.forEach(function (menuItem) {
				menuItems.push(createMenuItemDef(menuItem, {
					classes: ['o-app-header__menu-item']
				}));
			});

			menuItems.push(createMenuItemDef({}, { classes: ['o-dropdown-menu__divider'] }));
		}

		if (mode === 'Basic' || mode === 'Course' || mode === 'Legacy Course') {
			// My Account
			menuItems.push(createMenuItemDef({
				text: this.i18n_.translate('My Account'),
				href: this.resolveLink_('myAccount')
			}, {
				classes: ['o-app-header__menu-item-my-account']
			}));

			// Sign Out
			menuItems.push(createMenuItemDef({
				text: this.i18n_.translate('Sign Out'),
				onClick: this.getHandler_('onLogout', LOGOUT_EVENT)
			}, {
				classes: ['o-app-header__menu-item-sign-out']
			}));
		}

		data = Object.assign({}, this.state_, {
			mode: mode,
			links: {
				home: this.resolveLink_('home')
			},
			menuItems: menuItems,
			menuNavItemClasses: menuNavItemClasses
		});

		return data;
	}

	getHandler_(prop, eventName) {
		const element = this.element;
		const handler = this.state_[prop];

		function wrapHandler(handler) {
			return function (e) {
				e.preventDefault();
				if (eventName) dispatchEvent(element, eventName);
				handler.call();
			};
		}

		if (typeof handler === 'function') return wrapHandler(handler);
		else if (typeof window[handler] === 'function') return wrapHandler(window[handler]);
		else throw new TypeError('Expected \'' + prop + '\' to be a function');
	}

	render_() {
		const element = this.element;
		const i18n = this.i18n_;

		const data = this.getDataForRender_();

		const handlers = {
			handleLogin: this.getHandler_('onLogin', LOGIN_EVENT),
			handleHelpNavItemClick: this.handleHelpNavItemClick_.bind(this)
		};

		this.setThemeForMode_();

		patch(element, function () {
			template(data, handlers, i18n.translate.bind(i18n));
			DropdownMenu.init(element);
			dispatchEvent(element, 'oAppHeader.didUpdate');
		});
	}

	handleHelpNavItemClick_(e) {
		e.preventDefault();

		// Since we prevent the default action, the dropdown menu nav items
		// will not collapse automatically.
		const accountMenuEl = this.element.querySelector('.o-app-header__menu-menu');

		if (accountMenuEl) {
			accountMenuEl.classList.remove('o-dropdown-menu--expanded');

			const accountMenuIconEls = accountMenuEl.querySelectorAll('.o-app-header__icon');

			forEach(accountMenuIconEls, function (idx, el) {
				el.classList.remove('o-app-header__icon-chevron-up');
				el.classList.add('o-app-header__icon-chevron-down');
			});
		}

		dispatchEvent(this.element, 'oAppHeader.help.toggle');
	}

}


/**
 * Default settings for all AppHeader instances.
 * @type {Object}
 */
AppHeader.defaultSettings = {
	consoleBaseUrl: 'https://console.pearson.com',
	links: {
		home: '{consoleBaseUrl}/console/home',
		myAccount: '{consoleBaseUrl}/account/manage/account'
	},
	menu: {
		// showAllCoursesMenuItem: false
	},
	mode: 'Signed Out',
	// Mode options
	showLoginControls: true,
	menuItems: [],
	onLogin: noop,
	onLogout: noop
};


/**
 * Initializes an AppHeader instance.
 * @param  {HTMLElement} element The root DOM element.
 * @param  {Object} options Configuration options.
 * @return {AppHeader} New AppHeader instance.
 */
AppHeader.init = function (element, options) {
	return new AppHeader(element, options);
};


function noop() {}
