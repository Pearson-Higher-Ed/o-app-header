/*global describe, it, before*/

import expect from 'expect.js';
import I18n from '../src/js/utils/I18n';

describe('I18n', () => {

	before(() => {
		I18n.strings.test = {
			'Foo': 'Le Foo'
		};
	});

	it('should default to en locale', () => {
		expect((new I18n()).keys).to.eql(I18n.strings.en);
	});

	it('should set the keys based on the locale', () => {
		expect((new I18n({ locale: 'test' })).keys).to.eql(I18n.strings.test);
	});

	it('should set the keys to en if the locale is unrecognized', () => {
		expect((new I18n({ locale: 'nullisland' })).keys).to.eql(I18n.strings.en);
	});

	describe('translate(key)', () => {

		it('should translate the key', () => {
			expect((new I18n({ locale: 'test' })).translate('Foo')).to.be('Le Foo');
		});

		it('should return the key when there is no translation', () => {
			expect((new I18n({ locale: 'test' })).translate('Bar')).to.be('Bar');
		});

	});

});
