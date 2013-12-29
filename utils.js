/*jslint browser: true*/

(function ($) {
    'use strict';

    /**
     * Add a containsIgnoreCase selector if it does not already exists 
     */
    if ($.expr[':'].containsIgnoreCase) {
        return;
    }

    $.expr[":"].containsIgnoreCase = $.expr.createPseudo(function (arg) {
        return function (elem) {
            return $(elem).text().toUpperCase().indexOf(arg.toUpperCase()) >= 0;
        };
    });


}(window.jQuery));