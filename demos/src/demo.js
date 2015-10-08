/*global alert, console*/

import 'o-dropdown-menu';
import AppHeader from '../../main';
import forEach from '../../src/js/utils/forEach';

document.addEventListener('DOMContentLoaded', () => {

	function getModeOptions() {
		const options = {};

		forEach(document.querySelectorAll('[name="mode-options"]'), (idx, el) => {
			if (el.checked) {
				if (el.hasAttribute('data-option-value')) {
					options[el.value] = JSON.parse(el.getAttribute('data-option-value'));
				} else {
					options[el.value] = true;
				}
			} else {
				options[el.value] = undefined;
			}
		});

		return options;
	}

	const mode = document.querySelector('.demo-container').getAttribute('data-header-mode');
	const modeOptions = getModeOptions();

	const config = Object.assign({
		session: 'session',
		user: { givenName: 'XXXXXXXXXXXXXXXX' },
		mode: mode,
		onLogin: () => {
			alert('You signed in');
		},
		onLogout: () => {
			alert('You signed out');
		}
	}, modeOptions);

	const appHeader = new AppHeader(config);

	// Help menu
	document.addEventListener('oAppHeader.help.toggle', () => {
		alert('You toggled help');
		console.log('oAppHeader.help.toggle');
	});

	// Login/logout events
	document.addEventListener('oAppHeader.login', () => {
		console.log('oAppHeader.login');
	});

	document.addEventListener('oAppHeader.logout', () => {
		console.log('oAppHeader.logout');
	});

	// Select mode option
	document.getElementById('mode-options').addEventListener('change', () => {
		appHeader.setMode(mode, getModeOptions());
	});
});
