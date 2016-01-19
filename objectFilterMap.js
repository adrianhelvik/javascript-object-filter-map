'use strict';

if ( module && module.exports ) {
    module.exports = objectFilterMap;
} else if ( angular ) {
    angular.module( 'objectFilterMap', [] )
        .factory( 'objectFilterMap', function () { return objectFilterMap } );
} else {
    throw new Error( 'Neither angular or CommonJS modules available' );
}

/**
 * @param {function} opts.condition
 * @param {function} opts.func
 * @param {object} opts.object
 */
function objectFilterMap(opts) {

    // Param checking / defaults
    // -------------------------

    if ( ! opts || ! opts.object || ! opts.func || ! opts.condition ) {
        throw Error('Illegal arguments. parameter {object, condition, func} required');
    }

    if ( opts.recursive === undefined ) opts.recursive = true;

    // Type check object
    // -----------------

    if ( Array.isArray(opts.object) || Object.getPrototypeOf( opts.object ) !== Object.prototype || typeof opts.object !== 'object' ) {
        return opts.condition( opts.object ) ? opts.func( opts.object ) : opts.object;
    }

    // Algorithm
    // ---------

    var result = {};

    for (var prop in opts.object) {
        if ( ! opts.object.hasOwnProperty(prop) ) continue;

        var newObject = opts.condition(opts.object[prop]) ? opts.func(opts.object[prop]) : opts.object[prop];

        if ( opts.recursive ) {
            result[prop] = objectFilterMap({
                object: newObject,
                func: opts.func,
                condition: opts.condition,
                recursive: opts.recursive
            });
        } else {
            result[prop] = newObject
        }

    }

    return result;
}
