/*!
stickystuff
A jQuery plug-in for persistent table header
https://github.com/lancevo/Sticky-Stuff/

Copyright (C) 2012 Lance Vo
Licensed under MIT

*/

(function ($) {
    // By Remy Sharp http://remysharp.com/2010/07/21/throttling-function-calls/
    function throttle(fn, delay) {
      var timer = null;
      return function () {
        var context = this, args = arguments;
        clearTimeout(timer);
        timer = setTimeout(function () {
          fn.apply(context, args);
        }, delay);
      };
    }

    $.fn.stickystuff = function (opts) {
        return this.each(function () {
            
            // get existing stickytableheader instance
            var _instance = $.data(this, "stickystuff") || undefined;

            if (!_instance) {
                console.log('new');
               _instance = new stickyheader(this);
               $.data(this, "stickystuff", _instance);
                //return this;
            }

            if (typeof opts === "string") {
                switch(opts) {
                    case 'enable' : _instance.enable(); break;
                    case 'disable' : _instance.disable(); break;
                    case 'destroy' : _instance.destroy(); break;
                    default: throw 'stickystuff: invalid parameter';
                }
            }
            
            return  this;


        });


        function stickyheader(el) {

            // default parameters
            var o = {
                    // add classnames to cloned header
                    classnames : '',
                    // add attributes cloned header
                    attributes: '',
                    // throttle browser scrolling execution
                    throttle: 50 
                },
                self = this,
                // original table
                table = $(el),
                cloneId = "stickystuff" + Math.floor(Math.random() * 1000),
                // cloned table
                clone,
                isStarted = false,
                $window = $(window)
                ;

            if (!table.find("thead").length) {
                throw 'stickystuff: <thead> is required';
                return;
            }

            if (typeof opts === "object") {
                $.extend(o, opts);    
            }            

            clone = $('<table id="' + cloneId + '" class="stickystuff-cloned ' + o.classnames + '"' + o.attributes + ' ></table>')
            
            table.thead = table.find("thead");
            clone.thead = table.thead.clone();
            //  insert header into clone table
            clone.prepend(clone.thead);

            table.headerHeight = table.thead.height();
            
            calculateOffset();
            measureHeader();

            // fix issue with columns don't align
            clone.width( table.outerWidth());

            table.attr('data-stickystuff', cloneId);

            // insert clone table into DOM before the original table
            clone.hide().insertBefore(table);

            enable();

            // measure the column widths and apply it to the cloned header 
            function measureHeader() {
                var clonedThs = clone.thead.find("th");
                table.thead.find("th").each(function(i){
                    //set width to clone header columns
                    $(clonedThs[i]).width($(this).width());
                    $(clonedThs[i]).outerWidth($(this).outerWidth());

                    console.log('c vs o : ' + $(clonedThs[i]).width() + ' ' +  $(this).width());
                    console.log('outer c vs o : ' + $(clonedThs[i]).outerWidth() + ' ' +  $(this).outerWidth());
                    $(clonedThs[i]).height($(this).height());
                });
                clone.width(table.width());
            }

            // calculate offset of table on the page
            // to determine when to show the sticky header
            function calculateOffset() {
                table.startPos = table.offset().top + table.headerHeight;

                // sometimes weird thing happen, unable to calculate the offset
                if (isNaN(table.startPos)) {
                    table.startPos = parseFloat(table.css("marginTop")) + table.headerHeight;
                }

                table.stopPos = table.offset().top + table.height();
            }


            // clone table show/hide manager 
            function toggle() {
                var currentPos = $window.scrollTop() + table.headerHeight;
                if (currentPos > table.startPos && currentPos < table.stopPos) {
                    // desktop
                    if (!isStarted) {
                        isStarted = true;
                        table.thead.css('visibility','hidden');
                        clone.show();
                    }
                } else {
                    if (isStarted) {
                        isStarted = false;
                        clone.hide();
                        table.thead.css('visibility','');
                    }
                }
            }

            // enable and bind event listener to window scroll
            function enable() {
                // no need for throttle with modern browser like Chrome
                $window.bind("scroll", throttle(toggle, o.throttle));
                // re-trigger the toggle if it hasn't, ie: page is preloaded in the middle of the table, and it hasn't been activated
                $window.scroll();
            }


            // disable sticky header
            function disable(){
                $window.unbind("scroll", toggle);
                table.thead.css('visibility','');
                isStarted = false;
                clone.hide();
            }

            // stop and remove sticky header
            function destroy() {
                disable();
                $.data(self, "stickystuff", undefined);
                clone.remove();
            }

           
            return {
                enable: enable,
                disable: disable,
                destroy : destroy
            };
        } // stickyheader

    } // fn
}(jQuery));
