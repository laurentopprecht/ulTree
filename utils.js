/*jslint browser: true*/

(function ($, window) {
    'use strict';
    window.uli = window.uli || {};
    window.uli.utils = window.uli.utils || {};
    var unit = window.uli.utils;

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


    /**
     * Transform a hypen separated name to camel format.
     *
     * expand-all -> expandAll
     */
    unit.toCamelCase = function (name) {
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

    /**
     * Delayed action. Encapsulate a method call and trigger it after a delay.
     * The construction creates the action but does not trigger the call.
     */
    var DelayedAction = function (method, duration) {
        this.options = {
            duration: duration || this.DEFAULTS.duration,
            method: method,
            self: null,
            args: null
        };

        var self = this;
        this.exec = function () {
            self.options.method.apply(self.options.self, self.options.args);
        };

    };

    /**
     * Defaults
     */
    DelayedAction.prototype.DEFAULTS = {
        duration: 300
    };

    /**
     * Get set the method (function to call)
     */
    DelayedAction.prototype.method = function (value) {
        if (value) {
            this.options.method = value;
            return this;
        } else {
            return this.options.method;
        }
    };

    /**
     * Get set the duration of the delay befor the call
     */
    DelayedAction.prototype.duration = function (value) {
        if (value) {
            this.options.duration = value;
            return this;
        } else {
            return this.options.duration;
        }
    };

    /**
     * Get set the args of the call
     */
    DelayedAction.prototype.args = function (value) {
        if (value) {
            this.options.args = value;
            return this;
        } else {
            return this.options.args;
        }
    };

    /**
     * Get set the "this" argument of the call
     */
    DelayedAction.prototype.self = function (value) {
        if (value) {
            this.options.self = value;
            return this;
        } else {
            return this.options.self;
        }
    };

    /**
     * Schedule a method call after duration has elapsed.
     * Calling this method several times before the call is executed reset the timer.
     * In this case only one call is performed.
     */
    DelayedAction.prototype.schedule = function () {
        this.cancel();
        this.handle = setTimeout(this.exec, this.options.duration);
        return this;
    };

    /**
     * Cancel the scheduled call
     */
    DelayedAction.prototype.cancel = function () {
        if (this.handle) {
            clearTimeout(this.handle);
            this.handle = null;
        }
        return this;
    };

    unit.DelayedAction = DelayedAction;

    /**
     * Returns a wrapper function around fn. This wrapper function execute fn after a delay.
     *
     * Usage:
     *
     * var d = delay(someFunction);
     *
     * d(); //schedule the execution after duration
     *
     * ...
     *
     * d(); //if not yet executed reset the timer, only one call happens
     *
     * d().cancel(); //cancel the current schedule
     *
     * this.d = d;
     * this.d(someArg); //call the method with some args on a specific object
     *
     */
    unit.delay = function (fn, duration) {
        var d = duration || unit.delay.DEFAULTS.duration;
        var action = new DelayedAction(fn, d);
        return function () {
            action.args(arguments);
            action.self(this);
            return action.schedule();
        };
    };

    /**
     * Defaults of the function
     */
    unit.delay.DEFAULTS = {
        duration: 300
    };


}(window.jQuery, window));