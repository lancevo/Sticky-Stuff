/*!
stickystuff
A jQuery plug-in for floating table header
https://github.com/lvo811/Sticky-Stuff/

Copyright (C) 2012 Lance Vo
Licensed under MIT

*/
/* Important Note:
	If this is being used in tabs, you must:
		1) Set width for ui-tabs-panels, for this plug-in to calculate width/height corrrectly
		2) Set .ui-tabs-hide similar as below:
			position:absolute;
			top:0px;
			left:-9999px;
*/
(function ($) {
    $.fn.stickystuff = function (opts) {
        return this.each(function () {
            var data = $.data(document.body, "stickystuff") || {};
            if ($(this).attr('data-stickystuff')) {
                var existingSticky = data[$(this).attr('data-stickyststuff')];
                if (existingSticky) {
                    return existingSticky;
                }
            }
            var defaultOpts = {
                wrapper: '',
                classnames: '',
                throttle: 100 // in ms					
            };
            $.extend(defaultOpts, opts);
            var sticky = new StickySituation(this, defaultOpts);
            data[sticky.stickyId] = sticky;
            $.data(document.body, "stickystuff", data);

            function StickySituation(base, opts) {
                base = $(base); // the original table
                base.throttle = opts.throttle || 100;
                base.$window = $(window);
                base.stickyId = "stickystuff" + Math.floor(Math.random() * 1000);
                base.attr('data-stickystuff', base.stickyId);
                base.thead = base.find("thead");
                base.theadHeight = base.find("thead").height();
                if (isNaN(base.theadHeight)) {
                    throw 'Unable to calculate thead height - <thead> is required';
                    return;
                }
                // calculate the table's offset.top
                base.recalculateOffset = function () {
                    base.startPoint = base.offset().top + base.theadHeight;
                    if (isNaN(base.startPoint)) {
                        base.startPoint = base.theadHeight + parseFloat(base.css('marginTop'));
                    }
                    base.stopPoint = base.offset().top + base.height();
                }
                var classnames = base.attr('class') || '';
                base.clonedTable = $('<table id="' + base.stickyId + '" ></table>');
                base.clonedTableThead = base.thead.clone();
                base.clonedTable.prepend(base.clonedTableThead);
                base.clonedTable.addClass(classnames + opts.classnames + ' cloned').css('z-index', '99999').css('position', 'fixed').css('top', '0px').hide();
                base.isclonedTableSticking = false;
                base.addClass('stickystuff');
                // set the width and height for THs and cloned THs
                base.remeasureThead = function () {
                    var clonedTableTHs = base.clonedTableThead.find("th");
                    base.thead.find("th").each(function (i) {
                        var w = $(this).width() + 'px',
                            h = $(this).height() + 'px';
                        $(this).css('width', w).css('height', h);
                        $(clonedTableTHs[i]).width(w).height(h);
                    });
                }
                // make sure the header is sticking to top
                base.stickyPosition = function () {
                    var position = base.$window.scrollTop() + base.theadHeight;
                    base.recalculateOffset();
                    if (position > base.startPoint && position < base.stopPoint) {
                        if (!base.isclonedTableSticking) {
                            base.isclonedTableSticking = true;
                            // swap the thead to reserve attached events - such as sorting functionalities  
                            base.clonedTable.prepend(base.thead);
                            base.prepend(base.clonedTableThead);
                            base.clonedTable.show();
                        }
                    } else {
                        if (base.isclonedTableSticking) {
                            base.isclonedTableSticking = false;
                            // no longer sticky, put theads where they're belonged
                            base.clonedTable.prepend(base.clonedTableThead);
                            base.prepend(base.thead);
                            base.clonedTable.hide();
                        }
                    }
                }
                // activate stickystuff
                base.reallySticky = function () {
                    base.$window.bind('scroll', $.throttle(base.throttle, base.stickyPosition));
                }
                // de-activate stickystuff
                base.notReallySticky = function () {
                    base.$window.unbind('scroll', base.stickyPosition);
                    // put it back the way it was
                    base.isclonedTableSticking = false;
                    base.clonedTable.prepend(base.clonedTableThead);
                    base.prepend(base.thead);
                    base.clonedTable.hide();
                }
                base.recalculateOffset();
                base.remeasureThead();
                base.reallySticky();
                // insert cloned table
                base.clonedTable.insertBefore(base);
                // add wrapper element
                if (opts.wrapper) {
                    $(base.clonedTable).wrap(opts.wrapper);
                }
                return base;
            } // function
        }); // return
    }
}(jQuery))