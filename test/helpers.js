import { dispatchEvent } from '../src/js/utils/dom';

export function getHeaderEl() {
	return document.querySelector('.o-app-header');
}

export function getLogoEl(headerEl) {
	return headerEl.querySelector('.o-header__logo');
}

export function getHelpNavItemEl(headerEl) {
	return headerEl.querySelector('.o-app-header__nav-item-help');
}

export function getSignInNavItemEl(headerEl) {
	return headerEl.querySelector('.o-app-header__nav-item-sign-in');
}

export function getMenuNavItemEl(headerEl) {
	return headerEl.querySelector('.o-app-header__nav-item-menu');
}

export function getMenuMenuEl(headerEl) {
	return headerEl.querySelector('.o-app-header__menu-menu');
}

export function getAllCoursesMenuItemEl(headerEl) {
	return headerEl.querySelector('.o-app-header__menu-item-all-courses');
}

export function getCourseMenuItemEls(headerEl) {
	return headerEl.querySelectorAll('.o-app-header__menu-item-course');
}

export function getCourseNavMenuItemEls(headerEl) {
	return headerEl.querySelectorAll('.o-app-header__menu-item-course-nav');
}

export function getMenuItemEls(headerEl) {
	return headerEl.querySelectorAll('.o-app-header__menu-item');
}

export function getMyAccountMenuItemEl(headerEl) {
	return headerEl.querySelector('.o-app-header__menu-item-my-account');
}

export function getSignOutMenuItemEl(headerEl) {
	return headerEl.querySelector('.o-app-header__menu-item-sign-out');
}

export function getUsernameEl(headerEl) {
	return headerEl.querySelector('.o-app-header__username');
}

export function clickSignIn(headerEl) {
	const signInNavItemEl = getSignInNavItemEl(headerEl);

	dispatchEvent(signInNavItemEl.querySelector('a'), 'click');
}

export function clickSignOut(headerEl) {
	const signOutMenuItemEl = getSignOutMenuItemEl(headerEl);

	dispatchEvent(signOutMenuItemEl.querySelector('a'), 'click');
}
