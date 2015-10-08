/*global describe, it, before*/

import expect from 'expect.js';
import AppHeader from '../main';
import { dispatchEvent } from '../src/js/utils/dom';

describe('o.DOMContentLoaded', () => {

	before(() => {
		document.body.innerHTML = '';
	});

	it('should prepend to document.body', (done) => {
		document.addEventListener('o.DOMContentLoaded', () => {
			const appHeaderEl = document.body.firstChild;

			expect(document.body.children.length).to.be(1);
			expect(appHeaderEl).to.not.be(null);
			expect(appHeaderEl.nodeName.toLowerCase()).to.be('header');
			expect(appHeaderEl.classList.contains('o-app-header')).to.be(true);

			done();
		});

		dispatchEvent(document, 'o.DOMContentLoaded');
	});

	it('should not construct a new element if one already exists', (done) => {
		new AppHeader();

		document.addEventListener('o.DOMContentLoaded', () => {
			const appHeaderEl = document.body.firstChild;

			expect(document.body.children.length).to.be(1);
			expect(appHeaderEl).to.not.be(null);
			expect(appHeaderEl.nodeName.toLowerCase()).to.be('header');
			expect(appHeaderEl.classList.contains('o-app-header')).to.be(true);

			done();
		});

		dispatchEvent(document, 'o.DOMContentLoaded');
	});

});

describe('new AppHeader()', () => {

	it('should return the same instance', () => {
		expect(new AppHeader()).to.be(new AppHeader());
	});

});
