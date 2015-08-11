# o-app-header [![Build Status](https://travis-ci.org/Pearson-Higher-Ed/o-app-header.svg?branch=master)](https://travis-ci.org/Pearson-Higher-Ed/o-app-header)

## Initialization

You can initialize the application header by dispatching the `o.DOMContentLoaded` event or by calling the static `init()` method.

Using `o.DOMContentLoaded`:

```js
document.addEventListener('DOMContentLoaded', function() {
  document.dispatchEvent(new CustomEvent('o.DOMContentLoaded'));
});
```

Using `init()`:

```js
var AppHeader = require('o-app-header');
AppHeader.init();
```

## Configuration

Configuration properties may be passed as an object argument to the `init()` method or defined in a configuration block on the page:

```html
<script data-o-app-header-config type="application/json">
  {
  	"consoleBaseUrl": "https://...",
  	"session": "Session"
  }
</script>
```

Refer to the [options object](#api-methods-init) for a list of properties.

<!-- ## Responsive -->

## API

### Methods

<a name="api-methods-init"></a>
`init([element], [options])`

- `element`: an `HTMLElement` or selector string. The selected element will be replaced with the `header` element unless it is `document.body`, in which case the header will be preprended to the body content.
- `options`: an object with the following properties:

| Property                 | Type                   | Description                       |
|--------------------------|------------------------|-----------------------------------|
| consoleBaseUrl           | `string`               | The Console application base URL (default: https://console.pearson.com) |
| locale                   | `string`               | The user's preferred locale (refer to the [i18n](#i18n) section). |
| session                  | `string` or `Object`   | The session object, or the name of the session object in the global scope. If set to `false`, the session controls will not be rendered. |
| user                     | `Object` or `Function` | An object with a property `givenName` that contains the user's given name as a string; or a function in the form of `function(callback)` that returns the user object via `callback`, which is a function in the form of `function(error, user)`. The value of `givenName` is displayed in the desktop view in the user menu for an authenticated user. The value of this property will be ignored if it is a function when defined in a [global configuration block](#configuration) on the page. |
| menu                     | `Object`               | Takes the same options as the [setMenu](#api-methods-setMenu) method. |

<a name="api-methods-setMenu"></a>
`setMenu(options)`

- `options`: an object with the following properties:

| Property                 | Type                   | Description                       |
|--------------------------|------------------------|-----------------------------------|
| appNav                   | `Object`               | Options for setting page-oriented navigation menu items. |
| appNav.items             | `Object`               | The key defines the menu item text content. The value is a `String` (URL), click handler callback `Function`, or an `Object`.|
| appNav.items.href        | `String`               | URL.                              |

<!--| appNav.items.active      | `Boolean`              | If true, the menu is rendered as active. |-->

Example:

```js
AppHeader.setMenu({
	appNav: {
		items: {
			// Menu item is a link
			'Foo': 'https://example.com/foo',
			// Menu item will execute the callback function on click
			'Bar': function () { alert('You clicked "Bar"'); }
		}
	}
});
```

### Events

| Event Name               | Description                                         |
|--------------------------|-----------------------------------------------------|
| oAppHeader.help.toggle   | Fires when the **Help** nav item is clicked and it is not a link. |

```js
document.addEventListener('oAppHeader.help.toggle', function (e) {
	// Do something
});
```

## z-index

By default, the header's `z-index` property is set to 1000. This value can be changed by setting the `$o-app-header-z-index` SASS variable.

## i18n

Setting the `locale` configuration property will render the header with the translated strings, if the locale is supported.
The following languages are supported:

- `ar` Arabic
- `de` German
- `en` English (default)
- `fr` French
- `it` Italian
- `ja` Japanese
- `ko` Korean
- `nl` Dutch
- `pl` Polish
- `pt` Portuguese
- `ru` Russian
- `tr` Turkish
- `zh-Hans` Chinese (simplified)

## Browser support

Browser versions that do not support [WeakMap](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/WeakMap) must use a polyfill, for example via the [polyfill service](https://cdn.polyfill.io/v1/docs/):

```html
<script src="https://cdn.polyfill.io/v1/polyfill.min.js?features=default,WeakMap"></script>
```

## License

This software is published by Pearson Education under the [MIT license](LICENSE).
