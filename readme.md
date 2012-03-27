##Sticky Stuff

A jQuery plug-in for floating header. It clones and copies class names from the original table. All cloned table references are stored in $(document.body,"stickystuff"). It's very flexible, and customizable.

Requires: jQuery, [throttle](http://benalman.com/projects/jquery-throttle-debounce-plugin/) from [Ben Alman](http://benalman.com/)

Works on: IE 7+, and most modern browsers


Usage:
-------------
```js
$("table").stickystuff();
````

If you need to override the cloned table, you can pass in a config object:

```js
$("table").stickystuff({ 
	wrapper: '',
	classnames: '',
	throttle: 100  
});
```

*wrapper* : the wrapper element to wrap the cloned table

*classnames* : class names to be added to cloned table

*throttle* (in ms) : throttle the stickystuff function when scroll bar is scrolling, for performance purpose.

Example:
--------
```js
$("table").stickystuff({ 
  wrapper: '<div id="clonedWrapper" />',
	classnames: 'one two three',
	throttle: 100  
});
```

generates:

```html
<div id="clonedWrapper">
  <!-- 
  cloned table:
    id is generated randomly and prefix is stickystuff 
  -->
  <table id="stickystuffXXX" class="one two three cloned"> 
   ....
  </table>
  
  <!-- 
  original table:
    added class name stickystuff
    added attribute data-stickystuff, and it stores the id of the cloned table
  -->
  <table class="stickystuff" data-stickystuff="stickystuffXXX">
  ...
  </table>  
  
</div>
```

Use it with Tabs:
-----------------
To calculate the width and height of the table header correctly, please set the width of the tab panels, and don't use *display:none* for hidden panels.  

If you use jQuery tabs, and let say the tab panels width is 950px, you can use the css below:

```css
.ui-tabs-panel {
  width:950px;
  position:relative;
}

.ui-tabs-hide {
  position:absolute;
  top:0px;
	left:-9999px;
}
```

[Document is not completed - will finish it later] 
