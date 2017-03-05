# ToleFocus
[![NPM version](https://badge.fury.io/js/tolefocus.svg)](http://badge.fury.io/js/tolefocus) [![Dependency Status](https://david-dm.org/tolemac/tolefocus.svg)](https://david-dm.org/tolemac/tolefocus) [![devDependency Status](https://david-dm.org/tolemac/tolefocus/dev-status.svg)](https://david-dm.org/tolemac/tolefocus#info=devDependencies)
> JavaScript Framework agnostic Focus Manager coded in TypeScript

ToleFocus is a small library to manage focus on JavaScript web applications. ToleFocus use ES6 methods, like `array.findIndex`, and require some polyfill like [core-js](https://github.com/zloirock/core-js) in order to work in old browsers, like IE.

ToleFocus is highly inspired on [Angular Focus Manager](https://github.com/obogo/angular-focusmanager) coded by [Rob Tylor](https://github.com/roboncode).

## Installation

````
npm install tolefocus --save
````

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

### Setting focus order

You can set the focus order:

```` html
<input /> <!-- first control in focus order -->
<input /> <!-- third control in focus order -->
<input focus-order="1" /> <!-- second control in focus order -->
````

Focus order is zero based, you can set negative focus order to any element, the negative focus order are pushed to the first positions.

```` html
<input id='i1'/> <!-- second order -->
<input id='i2' focus-order='-2' /> <!-- first order -->
<input id='i3' /> <!-- third order -->
<input id='i4' focus-order='2' /> <!-- fourth order -->
<input id='i5' /> <!-- fifth order -->
<input id='i6' /> <!-- seventh order -->
<input id='i7' focus-order='4' /> <!-- sixth order -->
<input id='i8' /> <!-- eighth order -->
````

### Focus groups

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

### Focus loopback control

You can control the group loopback, you can set the head and tail behaivor. When behaivor is "stop" the focus doesn't go to the next element, the foucus stops in the last or first element. When behaivor is "loop" the focus go from last to first element in the group or from the first to the end element.

```` html
<div focus-group="loop"> <!-- head and tail behaivor to "loop". The focus from first to last or reverse. -->
    <input /> 
    <input /> 
    <input />
</div>
<div focus-group="stop"> <!-- head and tail behaivor to "stop". The focus stops in the last or the first element -->
    <input /> 
    <input /> 
    <input />
</div>
<div focus-group="stop loop"> <!-- head behaivor set to stop and tail behaivor is "loop". The focus stops in the first element and will go from the last to the first -->
    <input /> 
    <input /> 
    <input />
</div>
````

### Non-selectable elements

You can send focus to other controls like `div` or `spans`, you have to set `focus-order` attribute.

```` html
<div focus-order>
</di>
<input />
<div focus-order="2">
</di>
````

### Autofocus

You can set an element as autofocus to set focus on it automatically. If you have the `focusObserver` enabled the element will focus when it's added to the DOM.

```` html
<input />
<input />
<input autofocus /> <!-- gets the focus automatically -->
````

If you want to hide a element and get focused when it becomes visible you can set `observe` value to `autofocus` attribute.

```` html
<input />
<input />
<input autofocus="observe" style="display: none" />  <!-- gets the focus automatically when become visible -->
<button onclick="showHiddenInput()">Show</button>
````

## SystemJS config

To use using SystemJS you have to map tolefocus to the distributed bundle:

```` javascript
System.config({
    ...
    ...
    map: {
      tolefocus: './node_modules/tolefocus/dist/bundles/tolefocus.bundle.umd.js'
      ...
      ...
    },
    ...
    ...
})
````

## Build

Pull request are welcome, to build it:

````
git clone https://github.com/tolemac/tolefocus.git
cd tolefocus
npm install
npm run build
````

You can launch test suite using:

````
npm run test
````