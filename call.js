/*jslint browser: true*/

(function ($) {
    'use strict';

    var NAMESPACE = 'uli';
    var NAME = NAMESPACE + '.call';
    var DATA_CALL = 'data-call';
    var DATA_TARGET = 'data-target';

    /**
     * Transform a hypen separated name to camel format.
     *
     * expand-all -> expandAll
     */
    var toCamelCase = function (name) {
        var result = '';
        var words = name.split('-');
        var ucfirst = function (name) {
            return name.substr(0, 1).toUpperCase() + name.substr(1);
        };
        var i;
        for (i = 0; i < words.length; i += 1) {
            var word = words[i];
            if (i > 0) {
                word = ucfirst(word);
            }
            result += word;
        }
        return result;
    };

    var squareQuote = function (name) {
        return '[' + name + ']';
    };

    var onclick = function (e) {
        var $this = $(this);

        var call = $this.attr(DATA_CALL);
        var words = call.split('.');
        var plugin = words[0];
        var method = words[1];

        var target = $this.attr(DATA_TARGET);
        if (!target) {
            target = $this.attr('href');
            e.preventDefault();
        }
        var $target = $(target);

        $target[plugin](method);
    };

    var event = 'click.' + NAME;
    var selector = squareQuote(DATA_CALL);
    $(document).on(event, selector, onclick);


}(window.jQuery));