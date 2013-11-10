/*jslint browser: true*/

(function ($) {
    "use strict";

    var TREE_CLASS = 'ultree';
    var LEAF_CLASS = 'ultree-leaf';
    var DELAY_ATTR = 'data-delay';
    //var DELAY_DEFAULT = 400;

    var ultree = function (element, options) {

        var $tree = $(element);

        //var delay = $tree.attr(DELAY_ATTR);
        //delay = (delay) ? parseInt(delay) : DELAY_DEFAULT;

        var onclick = function (event) {
            var $target = $(event.target);
            if ($target.children().length === 0) {
                return;
            }
            if ($target.hasClass(LEAF_CLASS)) {
                return;
            }
            if (!$target.is('ul')) {
                return;
            }
            $target = $target.parent();
            if (!$target.is('li')) {
                return;
            }
            $target.toggleClass('in');
            //$target.find('>ul').animate({ height: "toggle" }, delay);
        };

        $(element).click(onclick);

    };


    ultree('.' + TREE_CLASS);

}(window.jQuery));