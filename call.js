/*jslint browser: true*/

(function ($) {
    'use strict';

    var NAMESPACE = 'uli';
    var NAME = NAMESPACE + '.call';
    var DATA_CALL = 'data-call';
    var DATA_TARGET = 'data-target';

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