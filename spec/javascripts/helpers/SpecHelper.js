/**
 * This exists to help jasmine-headless-webkit on its way.
 *
 * If we don't override the jsonp function, then it'll attempt
 * to make a web request, which will cause the gem to throw an
 * exception in the form of a Syntax Error.
 */
$.jsonp = function dummy() {};
