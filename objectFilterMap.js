'use strict';

if ( typeof module !== 'undefined' && module.exports ) {
    module.exports = objectFilterMap;
} else if ( typeof angular !== 'undefined' ) {
    angular.module( 'objectFilterMap', [] )
        .factory( 'objectFilterMap', function () { return objectFilterMap } );
} else {
    throw new Error( 'Neither angular or CommonJS modules available' );
}

/**
 * @param {function} opts.condition
 * @param {function} opts.func
 * @param {object} opts.object Optional (considering that a undefined is a valid value)
 */
function objectFilterMap(opts) {

    // Param checking
    // --------------

    if ( ! opts || ! opts.func || ! opts.condition || opts.object === undefined ) {
        throw Error('Illegal arguments. parameter {object, condition, func} required');
    }

    // Default params
    // --------------

    if ( opts.recursive === undefined ) opts.recursive = true;

    // Type check object
    // -----------------

    if ( notObjectLiteral(opts.object) ) {
        return opts.condition( opts.object ) ? opts.func( opts.object ) : opts.object;
    }

    // Algorithm
    // ---------

    var result = {};

    for (var prop in opts.object) {
        if ( ! opts.object.hasOwnProperty(prop) ) continue;

        var newObject;

        if ( opts.condition(opts.object[prop]) ) {
            newObject = opts.func(opts.object[prop])
        } else newObject = opts.object[prop];

        if ( opts.recursive && newObject !== undefined ) {
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

function notObjectLiteral( object ) {
    return object === null
        || object === undefined
        || Object.getPrototypeOf( object ) !== Object.prototype;
}
