/*jslint browser: true*/

(function ($) {
    'use strict';

    var NAMESPACE = 'uli';
    var NAME = NAMESPACE + '.ultree';
    var TREE_CLASS = 'ultree';
    var LEAF_CLASS = 'leaf';
    var HANDLE_CLASS = 'handle';
    var DELAY_ATTR = 'data-delay';
    //var DELAY_DEFAULT = 400;

    var Ultree = function (element, options) {
        var $element = $(element);
        this.$element = $element;
        this.$options = options;
        
        $element.find('li:not(:has(ul))').addClass(LEAF_CLASS);
        
        //var delay = $tree.attr(DELAY_ATTR);
        //delay = (delay) ? parseInt(delay) : DELAY_DEFAULT;

    };

    Ultree.prototype.expandAll = function () {
        this.$element.find('li').addClass('in');
    };

    Ultree.prototype.collapseAll = function () {
        this.$element.find('li').removeClass('in');
    };

    Ultree.prototype.open = function (target) {
        if (!target) {
            return;
        }
        $(target).addClass('in');
    };
    
    Ultree.prototype.close = function (target) {
        if (!target) {
            return;
        }
        $(target).removeClass('in');
    };
    
    Ultree.prototype.filter = function (text) {
        var $tree = this.$element;
        if (!text) {
            $tree.find('li').show();
            return;
        }
        
        $tree.find('li').hide();
        
        var query = ' li:containsIgnoreCase("' + text + '")';
        $tree.find(query).show();
    };

    Ultree.prototype.toggle = function (target) {
        if (!target) {
            return;
        }

        var $target = $(event.target);
        if ($target.children().length === 0) {
            return;
        }

        if ($target.hasClass(LEAF_CLASS)) {
            return;
        }

        if (!$target.is('ul') && !$target.hasClass(HANDLE_CLASS)) {
            return;
        }
        $target = $target.closest('li');
        $target.toggleClass('in');
        //$target.find('>ul').animate({ height: "toggle" }, delay);
    };


    /**
     * Plugin
     */
    $.fn.ultree = function (command, p) {
        return this.each(function () {
            var $this = $(this);

            var data = $this.data(NAME);
            if (!data) {
                data = new Ultree(this);
                $this.data(NAME, data);
            }

            if (typeof command === 'string') {
                data[command](p);
            }
        });
    };

    $(document).on('click.' + NAME, '.ultree', function (e) {
        $(this).ultree('toggle', e.target);
    });

}(window.jQuery));