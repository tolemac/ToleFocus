# ToleFocus
> JavaScript Framework agnostic Focus Manager coded in TypeScript

**This library is in alpha state, use it at your own risk. Pull requests are welcome.**  
**There aren't test. I would love it if you could make them.**

ToleFocus is a small library to manage focus on JavaScript web applications. ToleFocus use ES6 methods, like `array.findIndex`, and require some polyfill like [core-js](https://github.com/zloirock/core-js) in order to work in old browsers, like IE.

ToleFocus is highly inspired on [Angular Focus Manager](https://github.com/obogo/angular-focusmanager) coded by [Rob Tylor](https://github.com/roboncode).

## Usage

To enable the focus manager you have to import `focusManager` from `tolefocus` module and call `enable` method.

```` javascript
import {focusManager} from "tolefocus";
focusManager.enable();
````

This load the content of `body` tag searching for ToleFocus attributes.

You can enable the built in DOM observer witch use [MutationObserver](https://developer.mozilla.org/es/docs/Web/API/MutationObserver) in order to detect the DOM changes.


```` javascript
import {focusManager, focusObserver} from "tolefocus";
focusManager.enable();
focusObserver.enable();
````

ToleFocus handles by default the TAB key in the common focusables controls and sends focus to the next or previous control.

You can set the focus order:

```` html
<input /> <!-- first control in focus order -->
<input /> <!-- third control in focus order -->
<input focus-order="2" /> <!-- second control in focus order -->
````

You can create focus groups where each element can to have his own focus-order in the group.

```` html
<div focus-group>
    <input />
    <div focus-group focus-order="1">
        <input /> 
        <input /> 
        <input />
    </div>
    <input />
    <input focus-order="2" />
</div>
<div focus-group focus-order="1">
    <input /> 
    <input /> 
    <input />
</div>
````

You can send focus to other controls like `div` or `spans`, you have to set `focus-order` attribute.

```` html
<div focus-order>
</di>
<input />
<div focus-order="2">
</di>
````
