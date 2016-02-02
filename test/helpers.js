'use strict';

var dispatchEvent = require('../src/js/utils/dom').dispatchEvent;

exports.getHeaderEl = function () {
	return document.querySelector('.o-app-header');
};

exports.getLogoEl = function (headerEl) {
	return headerEl.querySelector('.o-header__logo');
};

exports.getHelpNavItemEl = function (headerEl) {
	return headerEl.querySelector('.o-app-header__nav-item-help');
};

exports.getSignInNavItemEl = function (headerEl) {
	return headerEl.querySelector('.o-app-header__nav-item-sign-in');
};

exports.getMenuNavItemEl = function (headerEl) {
	return headerEl.querySelector('.o-app-header__nav-item-menu');
};

exports.getMenuMenuEl = function (headerEl) {
	return headerEl.querySelector('.o-app-header__menu-menu');
};

exports.getAllCoursesMenuItemEl = function (headerEl) {
	return headerEl.querySelector('.o-app-header__menu-item-all-courses');
};

exports.getCourseMenuItemEls = function (headerEl) {
	return headerEl.querySelectorAll('.o-app-header__menu-item-course');
};

exports.getCourseNavMenuItemEls = function (headerEl) {
	return headerEl.querySelectorAll('.o-app-header__menu-item-course-nav');
};

exports.getMenuItemEls = function (headerEl) {
	return headerEl.querySelectorAll('.o-app-header__menu-item');
};

exports.getMyAccountMenuItemEl = function (headerEl) {
	return headerEl.querySelector('.o-app-header__menu-item-my-account');
};

exports.getSignOutMenuItemEl = function (headerEl) {
	return headerEl.querySelector('.o-app-header__menu-item-sign-out');
};

exports.getUsernameEl = function (headerEl) {
	return headerEl.querySelector('.o-app-header__username');
};

exports.clickSignIn = function (headerEl) {
	var signInNavItemEl = exports.getSignInNavItemEl(headerEl);

	dispatchEvent(signInNavItemEl.querySelector('a'), 'click');
};

exports.clickSignOut = function (headerEl) {
	var signOutMenuItemEl = exports.getSignOutMenuItemEl(headerEl);

	dispatchEvent(signOutMenuItemEl.querySelector('a'), 'click');
};

exports.getNotificationEl = function(headerEl) {
	return headerEl.querySelector('.o-app-header__nav-item-notification');
}
