##Sticky Stuff

A jQuery plug-in for persistent table header.

Getting Started
---------------
reset table's css and set cloned header to the top
```css
table {
  margin: 0;
  padding: 0;
  border: 0;
}
.stickystuff-cloned {
  margin-top:0;
  position: fixed;
  top:0;
  z-index:999;
}

```

```js
$("table").stickystuff();
````

On / Off / Destroy
------------------
Turn on the persistent header
```js
$("table").stickystuff('enable');
```

Turn off the persistent header
```js
$("table").stickystuff('disable');
```

Destroy the persistent header, unbind event listener & remove the cloned header from DOM
```js
$("table").stickystuff('destroy');
```

Customization
-------------

```js
$("table").stickystuff({ 
  attributes: 'data-foo="bar"',   // add more attributes to cloned header 
	classnames: 'one two three',  // add classnames to the cloned header
	throttle: 10  // throttle window scroll event callback
});
```

cloned header's html based on the previous config
```html
<table class="stickystuff-cloned one two three" data-foo="bar">
  ....
</table>
```


Use it with Tabs:
-----------------
In order for the plug-in to correctly calculate the offset, don't use *display:none" to hide the tab panel. Use *position:absolute* and move the tab panel out of the viewport.

```css
.ui-tabs-hide {
  position:absolute;
	left:-9999px;
}
```
