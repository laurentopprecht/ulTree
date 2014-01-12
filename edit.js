/*jslint browser: true*/

(function ($) {
    'use strict';

    var NAME = 'inline-edit';
    var EVENT_CHANGED = 'changed.inline.uli';


    var Edit = function (element, options) {
        var $element = $(element);
        this.$element = $element;
        this.options = $.extend({}, Edit.defaults, options);
    };

    /**
     * defaults of the component
     */
    Edit.defaults = {
        /**
         * whether the system accept a value (by default empty values are rejected)
         */
        accept: function (value) {
            if (!value) {
                return false;
            }
            if (value.trim()) {
                return true;
            } else {
                return false;
            }
        },
        /**
         * format a value, by default values are trimmed
         */
        format: function (value) {
            if (!value) {
                return value;
            }
            return value.trim();
        },
        editor: '<input class="inline-editor" type="text"/>'
    };

    Edit.prototype.init = function (options) {
        this.options = $.extend({}, Edit.defaults, this.options, options);
    };

    Edit.prototype.start = function () {
        if (this.$editor) {
            return;
        }

        var self = this;
        var $element = this.$element;
        var $old = $element.text();

        var $editor;
        if (typeof this.options.editor === 'function') {
            $editor = $(this.options.editor(this));
        } else {
            $editor = $(this.options.editor);
        }
        $editor.val($old);

        var onstop = function () {
            self.stop();
        };
        $editor.focusout(onstop);


        var onkeydown = function (e) {
            if (e.which === 27) {
                self.cancel();
                return;
            }
            if (e.which === 13) {
                self.stop();
                return;
            }
        };
        $editor.keydown(onkeydown);

        $element.text('');
        $element.prepend($editor);


        this.old = $old;
        this.$editor = $editor;

        $editor.focus();

    };

    Edit.prototype.stop = function () {
        if (!this.$editor) {
            return;
        }

        var accept = this.options.accept;
        var format = this.options.format;
        var value = format(this.$editor.val());
        value = accept(value) ? value : this.old;


        this.$element.text(value);
        this.$editor.remove();
        this.$editor = null;

        if (value === this.old) {
            return;
        }
        var data = {
            old: this.old,
            new: value
        };
        this.$element.trigger(EVENT_CHANGED, [data]);

    };

    Edit.prototype.cancel = function () {
        if (!this.$editor) {
            return;
        }

        this.$element.text(this.old);
        this.$editor.remove();
        this.$editor = null;
    };

    /**
     * Plugin
     */
    $.fn.edit = function (command, p) {
        return this.each(function () {
            var $this = $(this);

            var data = $this.data(NAME);
            if (!data) {
                data = new Edit(this);
                $this.data(NAME, data);
            }

            if (typeof command === 'object') {
                var options = command;
                data.init(options);
                return;
            }

            if (typeof command === 'string') {
                data[command](p);
            }
        });
    };


    $(document).on('click.' + NAME, '.inline-edit', function (e) {
        $(this).edit('start');
    });

}(window.jQuery));