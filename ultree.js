/*jslint browser: true*/

(function ($) {
    "use strict";

    /**
     * Define a leaf operator for jquery.
     * A node is a leaf if it does not contains any ul.
     */
    var defineLeafOperator = function () {
        if ($.expr[':'].ulleaf !== undefined) {
            return;
        }

        $.expr[':'].ulleaf = function (obj, index, meta, stack) {
            var $this = $(obj);
            return $this.find("ul").length === 0;
        };
    };

    defineLeafOperator();


    var TREE_CLASS = 'ultree';
    var LEAF_CLASS = 'ultree-leaf';
    var DELAY_ATTR = 'data-delay';
    var DELAY_DEFAULT = 400;

    var ultree = function (element, options) {

        var $tree = $(element);

        var delay = $tree.attr(DELAY_ATTR);
        delay = (delay) ? parseInt(delay) : DELAY_DEFAULT;

        /**
         * Forces the display of visible items to block.
         * This ensures that the collapse animation for 
         * expended items is smooth. We still set up the display to 
         * block in the css to ensure that intial display is correct 
         * before javascript started up.
         */
        $tree.find('li.in>ul').css('display', 'block');

        var onclick = function (event) {
            var $target = $(event.target);
            if ($target.children().length === 0) {
                return;
            }
            if ($target.hasClass(LEAF_CLASS)) {
                return;
            }
            if (!$target.is('li')) {
                return;
            }
            $target.find('>ul').slideToggle(delay);
            $target.toggleClass('in');
        };

        $(element).click(onclick);

        $tree.find('li:ulleaf').addClass(LEAF_CLASS);

    };


    ultree('.' + TREE_CLASS);

}(window.jQuery));