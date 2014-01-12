/*jslint browser: true*/

(function ($, window) {
    'use strict';

    window.uli = window.uli || {};
    var unit = window.uli;

    var DRAG_NAME = "draganddrop";
    var DRAG_MOUSEMOVE_EVENT = 'mousemove.' + DRAG_NAME;
    var DRAG_MOUSEUP_EVENT = 'mouseup.' + DRAG_NAME;
    var DRAG_MOUSEDOWN_EVENT = 'mousedown.' + DRAG_NAME;
    var CLASS_IN = 'in';
    var CLASS_OVER = 'over';
    var CLASS_DRAGGING = 'dragging';
    var CLASS_HELPER = 'helper';

    var UlDragDrop = function (element, options) {
        this.$element = $(element);
        this.options = $.extend({}, this.DEFAULTS, this.$element.data(), options);

        var data = {
            $container: null,
            $source: null,
            $target: null,
            $dragHelper: null,
            onhover: null
        };

        var self = this;

        this.dragover = function (e) {
            var $this = $(this);

            var $threshold = $this.offset().top + $this.height() / 2;
            if ($threshold > e.pageY) {
                $this.before(data.$dragHelper);
            } else {
                $this.after(data.$dragHelper);
            }
        };

        this.dragenter = function (e) {
            $(this).addClass(CLASS_OVER);
        };

        this.dragleave = function (e) {
            $(this).removeClass(CLASS_OVER);
        };

        this.drop = function (e) {
            data.$dragHelper.replaceWith(data.$source);
            data.$dragHelper = null;
            self.stop();
        };

        this.onhover = function () {
            if (!self.options.dragEnabled) {
                return;
            }
            if (!data.$target) {
                return;
            }

            if (!data.$target.children().length) {
                return;
            }

            data.$target.addClass(CLASS_IN);
        };

        this.onmousedown = function (e) {
            if (!this.options.dragEnabled) {
                return;
            }
            if (!$(e.target).is(this.options.dragHandle)) {
                return;
            }
            if (!this.options.canDrag(e.target)) {
                return;
            }
            this.start(e);
            e.preventDefault();
        };

        this.onmousemove = function (e) {
            var $source = data.$source;
            var $target = data.$target;

            if (!$source) {
                return;
            }

            e.preventDefault();

            var $newTarget;
            $newTarget = $(e.target).closest('.ultree li');

            if (!$newTarget) {
                return;
            }

            if ($newTarget.hasClass(CLASS_HELPER)) {
                return;
            }
            
            data.onhover();

            if ($newTarget.is($source)) {
                return;
            }

            if ($.contains($source.get(0), $newTarget.get(0))) {
                return;
            }

            if (!self.options.canDrop(data.$source.get(0), $newTarget.get(0))) {
                return;
            }

            if ($newTarget.is($target)) {
                self.dragover.call($target.get(0), e);
                return;
            }

            if ($target) {
                self.dragleave.call($target.get(0), e);
            }

            e.target = $newTarget;
            self.dragenter.call($newTarget.get(0), e);
            data.$target = $newTarget;
        };

        this.onmouseup = function (e) {
            var $source = data.$source;
            var $target = data.$target;

            if (!$source) {
                self.stop();
                return;
            }
            if (!$target) {
                self.stop();
                return;
            }
            if (!self.options.canDrop($source.get(0), $target.get(0))) {
                self.stop();
                return;
            }

            e.preventDefault();

            var $newTarget;
            $newTarget = $(e.target).closest('.ultree li');

            if (!$newTarget) {
                self.stop();
                return;
            }

            if ($newTarget.hasClass(CLASS_HELPER)) {
                $newTarget = $target;
            }

            if ($newTarget.is($source)) {
                self.stop();
                return;
            }

            e.target = $newTarget;
            self.drop.call($newTarget.get(0), e);
        };


        this.start = function (e) {
            $(document).on(DRAG_MOUSEMOVE_EVENT, this.onmousemove);
            $(document).on(DRAG_MOUSEUP_EVENT, this.onmouseup);

            data.$source = $(e.target).closest('.ultree li');
            data.$source.addClass(CLASS_DRAGGING);
            data.$container = data.$source.closest('.ultree');
            data.$dragHelper = $(self.options.dragHelper);
            data.onhover = new unit.utils.delay(self.onhover);
        };

        this.stop = function (e) {
            if (data.$dragHelper) {
                data.$dragHelper.remove();
                data.$dragHelper = null;
            }

            if (data.$target) {
                data.$target.removeClass(CLASS_OVER);
                data.$target = null;
            }
            if (data.onhover) {
                data.onhover().cancel();
                data.onhover = null;
            }

            data.$source.removeClass(CLASS_DRAGGING);
            data.$source = null;
            data.$container = null;

            $(document).unbind(DRAG_MOUSEMOVE_EVENT, this.onmousemove);
            $(document).unbind(DRAG_MOUSEUP_EVENT, this.onmouseup);
        };
    };

    UlDragDrop.prototype.DEFAULTS = {
        dragEnabled: true,
        dragHandle: '*',
        dragHelper: '<li class="helper"></li>',
        canDrag: function (source) {
            return true;
        },
        canDrop: function (source, target) {
            return true;
        }

    };

    UlDragDrop.prototype.init = function (options) {
        this.options = $.extend({}, this.DEFAULTS, this.options, options);
    };

    /**
     * Plugin
     */
    $.fn.uldragdrop = function (command, p) {
        return this.each(function () {
            var $this = $(this);

            var data = $this.data(DRAG_NAME);
            if (!data) {
                data = new UlDragDrop(this);
                $this.data(DRAG_NAME, data);
            }

            if (typeof command === 'string') {
                data[command](p);
            }
        });
    };


    $(document).on(DRAG_MOUSEDOWN_EVENT, '.ultree', function (e) {
        $(this).uldragdrop('onmousedown', e);
    });

}(window.jQuery, window));