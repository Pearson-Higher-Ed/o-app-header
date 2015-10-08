/*global sinon, describe, it, before, beforeEach*/

import expect from 'expect.js';
import AppHeader from '../src/js/AppHeader';
import forEach from '../src/js/utils/forEach';
import { dispatchEvent } from '../src/js/utils/dom';
import {
 	getHeaderEl,
 	getLogoEl,
 	getHelpNavItemEl,
 	getSignInNavItemEl,
 	getMenuNavItemEl,
 	getMenuMenuEl,
 	getAllCoursesMenuItemEl,
 	getCourseMenuItemEls,
 	getCourseNavMenuItemEls,
 	getMenuItemEls,
 	getMyAccountMenuItemEl,
 	getSignOutMenuItemEl,
 	getUsernameEl,
 	clickSignIn,
 	clickSignOut
 } from './helpers';

describe('AppHeader:', () => {

	let sandbox;

	before(() => {
		sandbox = sinon.sandbox.create();

		const config = {
			user: { givenName: 'FooBar' }
		};

		const configEl = document.createElement('script');

		configEl.setAttribute('data-o-app-header-config', '');
		configEl.type = 'application/json';
		configEl.innerHTML = JSON.stringify(config);
		document.head.appendChild(configEl);
	});

	beforeEach(() => {
		document.body.innerHTML = '';
		window.handleLogin = undefined;
		window.handleLogout = undefined;
		sandbox.restore();
	});

	describe('new AppHeader(element, options):', () => {

		it('should prepend to document.body when element is undefined', () => {
			new AppHeader();

			const appHeaderEl = document.body.firstChild;

			expect(document.body.children.length).to.be(1);
			expect(appHeaderEl).to.not.be(null);
			expect(appHeaderEl.nodeName.toLowerCase()).to.be('header');
		});

		it('should replace element when element is an instance of HTMLElement', () => {
			document.body.appendChild(document.createElement('div'));

			const el = document.createElement('div');
			document.body.appendChild(el);

			new AppHeader(el);

			const appHeaderEl = document.body.childNodes[1];

			expect(document.body.children.length).to.be(2);
			expect(appHeaderEl).to.not.be(null);
			expect(appHeaderEl.nodeName.toLowerCase()).to.be('header');
		});

		it('should replace element when element is an instance of string', () => {
			document.body.appendChild(document.createElement('div'));

			const el = document.createElement('div');
			el.id = 'app-header';
			document.body.appendChild(el);

			new AppHeader('#app-header');

			const appHeaderEl = document.body.childNodes[1];

			expect(document.body.children.length).to.be(2);
			expect(appHeaderEl).to.not.be(null);
			expect(appHeaderEl.nodeName.toLowerCase()).to.be('header');
		});

		it('should set role="banner"', () => {
			new AppHeader();

			const appHeaderEl = getHeaderEl();

			expect(appHeaderEl.getAttribute('role')).to.be('banner');
		});

		it('should default to \'Signed Out\' mode', () => {
			const appHeader = new AppHeader();

			expect(appHeader.getMode()).to.be('Signed Out');
		});

		it('should set the mode', () => {
			const appHeader = new AppHeader({ mode: 'Signed Out' });

			expect(appHeader.getMode()).to.be('Signed Out');
		});

		it('should set the light theme when options.mode is \'Course\' and options.theme is \'light\'', () => {
			const options = {
				mode: 'Course',
				theme: 'light'
			};

			new AppHeader(options);

			const appHeaderEl = getHeaderEl();

			expect(appHeaderEl.classList.contains('o-header--theme-light')).to.be(true);
		});

		describe('Help nav item:', () => {

			it('should emit oAppHeader.help.toggle when the Help nav item is clicked', (done) => {
				new AppHeader();

				const appHeaderEl = getHeaderEl();
				const helpNavEl = getHelpNavItemEl(appHeaderEl);

				appHeaderEl.addEventListener('oAppHeader.help.toggle', done.bind(null, null));

				dispatchEvent(helpNavEl.querySelector('a'), 'click');
			});

			it('should render as a dropdown menu when options.help is an object', () => {
				const options = {
					help: {
						'Foo': 'https://example.org/foo',
						'Bar': 'https://example.org/bar'
					}
				};

				new AppHeader(options);

				const appHeaderEl = getHeaderEl();
				const helpNavItemEl = getHelpNavItemEl(appHeaderEl);

				expect(helpNavItemEl.firstChild.classList.contains('o-dropdown-menu')).to.be(true);
			});

			it('should render the Help menu menu item as a link when options.help[key] is an object', () => {
				const href = 'https://example.org/foo';
				const target = '_blank';
				const options = {
					help: {
						'Foo': { href: href, target: target }
					}
				};

				new AppHeader(options);

				const appHeaderEl = getHeaderEl();
				const helpNavItemEl = getHelpNavItemEl(appHeaderEl);
				const menuItemLinkEl = helpNavItemEl.querySelector('.o-dropdown-menu__menu-item a');

				expect(menuItemLinkEl.href).to.be(href);
				expect(menuItemLinkEl.getAttribute('target')).to.be(target);
			});

			it('should register a click event listener for the Help menu menu item when options.help[key].onClick is a function', (done) => {
				const options = {
					help: {
						'Foo': { onClick: done.bind(null, null) }
					}
				};

				new AppHeader(options);

				const appHeaderEl = getHeaderEl();
				const helpNavItemEl = getHelpNavItemEl(appHeaderEl);
				const menuItemLinkEl = helpNavItemEl.querySelector('.o-dropdown-menu__menu-item a');

				expect(menuItemLinkEl.getAttribute('href')).to.be('#');

				dispatchEvent(menuItemLinkEl, 'click');
			});

			it('should close the account menu when clicked', () => {
				new AppHeader({ mode: 'Basic' });

				const appHeaderEl = getHeaderEl();
				const menuMenuEl = getMenuMenuEl(appHeaderEl);

				dispatchEvent(menuMenuEl, 'click');

				expect(menuMenuEl.classList.contains('o-dropdown-menu--expanded')).to.be(true);

				const helpNavItemEl = getHelpNavItemEl(appHeaderEl);

				dispatchEvent(helpNavItemEl.querySelector('a'), 'click');

				const menuIconEls = menuMenuEl.querySelectorAll('.o-app-header__icon');

				expect(menuMenuEl.classList.contains('o-dropdown-menu--expanded')).to.be(false);

				forEach(menuIconEls, function (idx, el) {
					expect(el.classList.contains('o-app-header__icon-chevron-up')).to.be(false);
					expect(el.classList.contains('o-app-header__icon-chevron-down')).to.be(true);
				});
			});

		});

	});

	describe('appHeader.setMode(mode, [options])', () => {

		it('should set the mode', () => {
			const appHeader = new AppHeader();

			appHeader.setMode('Signed Out');

			expect(appHeader.getMode()).to.be('Signed Out');
		});

		it('should throw an error when the mode is not recognized', () => {
			const appHeader = new AppHeader();

			expect(() => { appHeader.setMode('Invalid'); }).to.throwException(/Unrecognized mode, 'Invalid'/);
		});

		it('should show the Sign In nav item when the mode is \'Signed Out\' and options.showLoginControls is true', () => {
			const appHeader = new AppHeader();
			const appHeaderEl = getHeaderEl();

			appHeader.setMode('Signed Out', { showLoginControls: true });

			expect(getSignInNavItemEl(appHeaderEl)).to.not.be(null);
		});

		it('should hide the Sign In nav item when the mode is \'Signed Out\' and options.showLoginControls is false', () => {
			const appHeader = new AppHeader();
			const appHeaderEl = getHeaderEl();

			appHeader.setMode('Signed Out', { showLoginControls: false });

			expect(getSignInNavItemEl(appHeaderEl)).to.be(null);
		});

		it('should render the logo without a link when the mode is \'Signed Out\'', () => {
			const appHeader = new AppHeader();
			const appHeaderEl = getHeaderEl();

			appHeader.setMode('Signed Out');

			const logoEl = getLogoEl(appHeaderEl);

			expect(logoEl.parentElement.tagName.toLowerCase()).to.not.be('a');
		});

		it('should emit oAppHeader.login when the mode is \'Signed Out\' and the sign in nav item is clicked', (done) => {
			const appHeader = new AppHeader();
			const appHeaderEl = getHeaderEl();

			appHeader.setMode('Signed Out');

			document.addEventListener('oAppHeader.login', done.bind(null, null));

			clickSignIn(appHeaderEl);
		});

		it('should call the onLogin callback function when the mode is \'Signed Out\' and the sign in nav item is clicked', () => {
			const appHeader = new AppHeader();
			const appHeaderEl = getHeaderEl();
			const handler = sinon.spy();

			appHeader.setMode('Signed Out', { onLogin: handler });

			clickSignIn(appHeaderEl);

			expect(handler.calledOnce).to.be(true);
		});

		it('should locate and call the onLogin callback function when the mode is \'Signed Out\' and options.onLogin is a string and the sign in nav item is clicked', () => {
			const appHeader = new AppHeader();
			const appHeaderEl = getHeaderEl();

			window.handleLogin = sinon.spy();

			appHeader.setMode('Signed Out', { onLogin: 'handleLogin' });

			clickSignIn(appHeaderEl);

			expect(window.handleLogin.calledOnce).to.be(true);
		});

		it('should throw an error when the mode is \'Signed Out\' and options.onLogin is a string and the callback function cannot be found in the global scope', () => {
			const appHeader = new AppHeader();

			expect(() => { appHeader.setMode('Signed Out', { onLogin: 'invalid' }); })
				.to.throwException(/Expected \'onLogin\' to be a function/);
		});

		it('should render the logo as a link when the mode is \'Basic\'', () => {
			const appHeader = new AppHeader();
			const appHeaderEl = getHeaderEl();

			appHeader.setMode('Basic');

			const logoEl = getLogoEl(appHeaderEl);

			expect(logoEl.parentElement.tagName.toLowerCase()).to.be('a');
		});

		it('should render the menu nav item as a dropdown menu when the mode is \'Basic\'', () => {
			const appHeader = new AppHeader();
			const appHeaderEl = getHeaderEl();

			appHeader.setMode('Basic');

			const menuNavItemEl = getMenuNavItemEl(appHeaderEl);
			const menuMenuEl = getMenuMenuEl(appHeaderEl);

			expect(menuNavItemEl).to.not.be(null);
			expect(menuMenuEl.classList.contains('o-dropdown-menu')).to.be(true);
		});

		it('should render user.givenName when the mode is \'Basic\' and options.user.givenName is defined', () => {
			const appHeader = new AppHeader();
			const appHeaderEl = getHeaderEl();
			const user = { givenName: 'Foo' };

			appHeader.setMode('Basic', { user: user });

			const usernameEl = getUsernameEl(appHeaderEl);

			expect(usernameEl.textContent.trim()).to.be(user.givenName);
		});

		it('should render a default string when the mode is \'Basic\' and options.user.givenName is undefined', () => {
			const appHeader = new AppHeader();
			const appHeaderEl = getHeaderEl();
			const user = { givenName: undefined };

			appHeader.setMode('Basic', { user: user });

			const usernameEl = getUsernameEl(appHeaderEl);

			expect(usernameEl.textContent.trim()).to.be('Menu');
		});

		it('should render the My Account menu item when the mode is \'Basic\'', () => {
			const appHeader = new AppHeader();
			const appHeaderEl = getHeaderEl();

			appHeader.setMode('Basic');

			expect(getMyAccountMenuItemEl(appHeaderEl)).to.not.be(null);
		});

		it('should render the Sign Out menu item when the mode is \'Basic\'', () => {
			const appHeader = new AppHeader();
			const appHeaderEl = getHeaderEl();

			appHeader.setMode('Basic');

			expect(getSignOutMenuItemEl(appHeaderEl)).to.not.be(null);
		});

		it('should render a menu item for each course when the mode is \'Basic\' and options.courseItems is defined', () => {
			const appHeader = new AppHeader();
			const appHeaderEl = getHeaderEl();

			const courseItems = [
				{ text: 'Foo', href: 'https://example.com/foo' },
				{ text: 'Bar', href: 'https://example.com/bar' }
			];

			appHeader.setMode('Basic', { courseItems: courseItems });

			const courseMenuItemEls = getCourseMenuItemEls(appHeaderEl);

			expect(courseMenuItemEls.length).to.be(2);
			expect(courseMenuItemEls[0].querySelector('a').textContent).to.be('Foo');
			expect(courseMenuItemEls[0].querySelector('a').href).to.be(courseItems[0].href);
			expect(courseMenuItemEls[1].querySelector('a').textContent).to.be('Bar');
			expect(courseMenuItemEls[1].querySelector('a').href).to.be(courseItems[1].href);
		});

		it('should render MAX menu items and a menu item that links to all courses when the mode is \'Basic\' and options.courseItems has more than MAX items', () => {
			const appHeader = new AppHeader();
			const appHeaderEl = getHeaderEl();

			const courseItems = [];

			for (let i = 0; i < 6; i++) {
				courseItems.push({
					text: 'Item ' + (i + 1),
					href: 'https://example.com/' + (i + 1)
				});
			}

			appHeader.setMode('Basic', { courseItems: courseItems });

			// Course menu items
			const courseMenuItemEls = getCourseMenuItemEls(appHeaderEl);

			expect(courseMenuItemEls.length).to.be(5);

			for (let i = 0; i < 5; i++) {
				expect(courseMenuItemEls[i].querySelector('a').textContent).to.be('Item ' + (i + 1));
			}

			// All courses menu item
			const allCoursesMenuItemEl = getAllCoursesMenuItemEl(appHeaderEl);

			expect(allCoursesMenuItemEl).to.not.be(null);
		});

		it('should call the handler when the mode is \'Basic\' and courseItems[n].onClick is a function', () => {
			const appHeader = new AppHeader();
			const appHeaderEl = getHeaderEl();

			const handler = sinon.spy();
			const courseItems = [{ text: 'Foo', onClick: handler }];

			appHeader.setMode('Basic', { courseItems: courseItems });

			const courseMenuItemEls = getCourseMenuItemEls(appHeaderEl);

			dispatchEvent(courseMenuItemEls[0].querySelector('a'), 'click');

			expect(handler.calledOnce).to.be(true);
		});

		it('should emit oAppHeader.logout when the mode is \'Basic\' and the sign out menu item is clicked', (done) => {
			const appHeader = new AppHeader();
			const appHeaderEl = getHeaderEl();

			appHeader.setMode('Basic');

			document.addEventListener('oAppHeader.logout', done.bind(null, null));

			clickSignOut(appHeaderEl);
		});

		it('should call the onLogout callback function when the mode is \'Basic\' and the sign out menu item is clicked', () => {
			const appHeader = new AppHeader();
			const appHeaderEl = getHeaderEl();
			const handler = sinon.spy();

			appHeader.setMode('Basic', { onLogout: handler });

			clickSignOut(appHeaderEl);

			expect(handler.calledOnce).to.be(true);
		});

		it('should locate and call the onLogout callback function when the mode is \'Basic\' and options.onLogout is a string and the sign out menu item is clicked', () => {
			const appHeader = new AppHeader();
			const appHeaderEl = getHeaderEl();

			window.handleLogout = sinon.spy();

			appHeader.setMode('Basic', { onLogout: 'handleLogout' });

			clickSignOut(appHeaderEl);

			expect(window.handleLogout.calledOnce).to.be(true);
		});

		it('should throw an error when the mode is \'Basic\' and options.onLogout is a string and the callback function cannot be found in the global scope', () => {
			const appHeader = new AppHeader();

			expect(() => { appHeader.setMode('Basic', { onLogout: 'invalid' }); })
				.to.throwException(/Expected \'onLogout\' to be a function/);
		});

		it('should render the logo as a link when the mode is \'Course\'', () => {
			const appHeader = new AppHeader();
			const appHeaderEl = getHeaderEl();

			appHeader.setMode('Course');

			const logoEl = getLogoEl(appHeaderEl);

			expect(logoEl.parentElement.tagName.toLowerCase()).to.be('a');
		});

		it('should render user.givenName when the mode is \'Course\' and options.user.givenName is defined', () => {
			const appHeader = new AppHeader();
			const appHeaderEl = getHeaderEl();
			const user = { givenName: 'Foo' };

			appHeader.setMode('Course', { user: user });

			const usernameEl = getUsernameEl(appHeaderEl);

			expect(usernameEl.textContent.trim()).to.be(user.givenName);
		});

		it('should render a default string when the mode is \'Course\' and options.user.givenName is undefined', () => {
			const appHeader = new AppHeader();
			const appHeaderEl = getHeaderEl();
			const user = { givenName: undefined };

			appHeader.setMode('Course', { user: user });

			const usernameEl = getUsernameEl(appHeaderEl);

			expect(usernameEl.textContent.trim()).to.be('Menu');
		});

		it('should render the \'All courses\' menu item when the mode is \'Course\'', () => {
			const appHeader = new AppHeader();
			const appHeaderEl = getHeaderEl();

			appHeader.setMode('Course');

			const allCoursesMenuItemEl = getAllCoursesMenuItemEl(appHeaderEl);

			expect(allCoursesMenuItemEl).to.not.be(null);
			expect(allCoursesMenuItemEl.querySelector('a').textContent).to.match(/All courses$/);
		});

		it('should render the course nav section when the mode is \'Course\' and options.courseNav is defined', () => {
			const appHeader = new AppHeader();
			const appHeaderEl = getHeaderEl();

			const heading = { text: 'Foo', href: 'https://example.com/foo' };
			const courseNav = { heading: heading, items: [] };

			for (let i = 0; i < 5; i++) {
				courseNav.items.push({
					text: 'Item ' + (i + 1),
					href: 'https://example.com/' + (i + 1)
				});
			}

			appHeader.setMode('Course', { courseNav: courseNav });

			const courseNavMenuItemEls = getCourseNavMenuItemEls(appHeaderEl);

			// One menu item for the heading and one for each course nav item
			expect(courseNavMenuItemEls.length).to.be(6);

			expect(courseNavMenuItemEls[0].querySelector('a').textContent).to.be(courseNav.heading.text);
			expect(courseNavMenuItemEls[0].querySelector('a').href).to.be(courseNav.heading.href);

			for (let i = 0; i < courseNav.items.length; i++) {
				expect(courseNavMenuItemEls[i + 1].querySelector('a').textContent).to.be(courseNav.items[i].text);
				expect(courseNavMenuItemEls[i + 1].querySelector('a').href).to.be(courseNav.items[i].href);
			}
		});

		it('should render the menu item as disabled when the mode is \'Course\' and options.courseNav[n].active is true', () => {
			const appHeader = new AppHeader();
			const appHeaderEl = getHeaderEl();

			const courseNav = { items: [{ text: 'Foo', href: 'https://example.com/foo', active: true }] };

			appHeader.setMode('Course', { courseNav: courseNav });

			const courseNavMenuItemEls = getCourseNavMenuItemEls(appHeaderEl);

			expect(courseNavMenuItemEls[0].classList.contains('o-dropdown-menu__menu-item--disabled')).to.be(true);
		});

		it('should call the handler when the mode is \'Course\' and options.courseNav[n].onClick is a function', () => {
			const appHeader = new AppHeader();
			const appHeaderEl = getHeaderEl();
			const handler = sinon.spy();
			const courseNav = { items: [{ text: 'Foo', onClick: handler }] };

			appHeader.setMode('Course', { courseNav: courseNav });

			const courseNavMenuItemEls = getCourseNavMenuItemEls(appHeaderEl);

			dispatchEvent(courseNavMenuItemEls[0].querySelector('a'), 'click');

			expect(handler.calledOnce).to.be(true);
		});

		it('should render the light theme when the mode is \'Course\' and options.theme is \'light\'', () => {
			const appHeader = new AppHeader();
			const appHeaderEl = getHeaderEl();

			appHeader.setMode('Course', { theme: 'light' });

			expect(appHeaderEl.classList.contains('o-header--theme-light')).to.be(true);
		});

		it('should not render the light theme when the mode is not \'Course\' and options.theme is \'light\'', () => {
			const appHeader = new AppHeader();
			const appHeaderEl = getHeaderEl();

			appHeader.setMode('Basic', { theme: 'light' });

			expect(appHeaderEl.classList.contains('o-header--theme-light')).to.be(false);
		});

		it('should emit oAppHeader.logout when the mode is \'Course\' and the sign out menu item is clicked', (done) => {
			const appHeader = new AppHeader();
			const appHeaderEl = getHeaderEl();

			appHeader.setMode('Course');

			document.addEventListener('oAppHeader.logout', done.bind(null, null));

			clickSignOut(appHeaderEl);
		});

		it('should call the onLogout callback function when the mode is \'Course\' and the sign out menu item is clicked', () => {
			const appHeader = new AppHeader();
			const appHeaderEl = getHeaderEl();
			const handler = sinon.spy();

			appHeader.setMode('Course', { onLogout: handler });

			clickSignOut(appHeaderEl);

			expect(handler.calledOnce).to.be(true);
		});

		it('should locate and call the onLogout callback function when the mode is \'Course\' and options.onLogout is a string and the sign out menu item is clicked', () => {
			const appHeader = new AppHeader();
			const appHeaderEl = getHeaderEl();

			window.handleLogout = sinon.spy();

			appHeader.setMode('Course', { onLogout: 'handleLogout' });

			clickSignOut(appHeaderEl);

			expect(window.handleLogout.calledOnce).to.be(true);
		});

		it('should throw an error when the mode is \'Course\' and options.onLogout is a string and the callback function cannot be found in the global scope', () => {
			const appHeader = new AppHeader();

			expect(() => { appHeader.setMode('Course', { onLogout: 'invalid' }); })
				.to.throwException(/Expected \'onLogout\' to be a function/);
		});

		it('should render the logo without a link when the mode is \'Integration\'', () => {
			const appHeader = new AppHeader();
			const appHeaderEl = getHeaderEl();

			appHeader.setMode('Integration');

			const logoEl = getLogoEl(appHeaderEl);

			expect(logoEl.parentElement.tagName.toLowerCase()).to.not.be('a');
		});

		it('should hide the menu nav item when the mode is \'Integration\'', () => {
			const appHeader = new AppHeader();
			const appHeaderEl = getHeaderEl();

			appHeader.setMode('Integration');

			expect(getMenuNavItemEl(appHeaderEl)).to.be(null);
		});

		it('should render user.givenName when the mode is \'Legacy Course\' and options.user.givenName is defined', () => {
			const appHeader = new AppHeader();
			const appHeaderEl = getHeaderEl();
			const user = { givenName: 'Foo' };

			appHeader.setMode('Legacy Course', { user: user });

			const usernameEl = getUsernameEl(appHeaderEl);

			expect(usernameEl.textContent.trim()).to.be(user.givenName);
		});

		it('should render a default string when the mode is \'Legacy Course\' and options.user.givenName is undefined', () => {
			const appHeader = new AppHeader();
			const appHeaderEl = getHeaderEl();
			const user = { givenName: undefined };

			appHeader.setMode('Legacy Course', { user: user });

			const usernameEl = getUsernameEl(appHeaderEl);

			expect(usernameEl.textContent.trim()).to.be('Menu');
		});

		it('should render additional menu items when the mode is \'Legacy Course\' and options.menuItems is defined', () => {
			const appHeader = new AppHeader();
			const appHeaderEl = getHeaderEl();

			const menuItems = [
				{ text: 'Foo', href: 'https://example.com/foo' },
				{ text: 'Bar', href: 'https://example.com/bar' }
			];

			appHeader.setMode('Legacy Course', { menuItems: menuItems });

			const menuItemEls = getMenuItemEls(appHeaderEl);

			expect(menuItemEls[0].querySelector('a').textContent).to.be(menuItems[0].text);
			expect(menuItemEls[0].querySelector('a').href).to.be(menuItems[0].href);
			expect(menuItemEls[1].querySelector('a').textContent).to.be(menuItems[1].text);
			expect(menuItemEls[1].querySelector('a').href).to.be(menuItems[1].href);
		});

		it('should emit oAppHeader.logout when the mode is \'Legacy Course\' and the sign out menu item is clicked', (done) => {
			const appHeader = new AppHeader();
			const appHeaderEl = getHeaderEl();

			appHeader.setMode('Legacy Course');

			document.addEventListener('oAppHeader.logout', done.bind(null, null));

			clickSignOut(appHeaderEl);
		});

		it('should call the onLogout callback function when the mode is \'Legacy Course\' and the sign out menu item is clicked', () => {
			const appHeader = new AppHeader();
			const appHeaderEl = getHeaderEl();
			const handler = sinon.spy();

			appHeader.setMode('Legacy Course', { onLogout: handler });

			clickSignOut(appHeaderEl);

			expect(handler.calledOnce).to.be(true);
		});

		it('should locate and call the onLogout callback function when the mode is \'Legacy Course\' and options.onLogout is a string and the sign out menu item is clicked', () => {
			const appHeader = new AppHeader();
			const appHeaderEl = getHeaderEl();

			window.handleLogout = sinon.spy();

			appHeader.setMode('Legacy Course', { onLogout: 'handleLogout' });

			clickSignOut(appHeaderEl);

			expect(window.handleLogout.calledOnce).to.be(true);
		});

		it('should throw an error when the mode is \'Legacy Course\' and options.onLogout is a string and the callback function cannot be found in the global scope', () => {
			const appHeader = new AppHeader();

			expect(() => { appHeader.setMode('Legacy Course', { onLogout: 'invalid' }); })
				.to.throwException(/Expected \'onLogout\' to be a function/);
		});

	});

});
