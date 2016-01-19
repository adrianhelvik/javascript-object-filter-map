var objectFilterMap = require('../objectFilterMap');

describe('objectFilterMap', () => {

    // Happy path
    // ----------
    it('should return an equivalent object if no matches are found', () => {
        var object = {
            a: 1,
            b: [1, 2, 3]
        };

        var options = {
            object: object,
            func: function (param) {
                return null
            },
            condition: function (param) {
                return false;
            }
        };

        expect(objectFilterMap(options)).toEqual(object);
    });

    it('should replace a property if condition is met', () => {
        var object = {
            a: 1,
            b: 10
        };

        expect(objectFilterMap({
            object: object,
            func: function (val) { return 1337 },
            condition: function (val) { return val === 10 }
        })).toEqual({
            a: 1,
            b: 1337
        })

    });

    it('should replace non-nested property if recursive == false', () => {
        expect(objectFilterMap({
            object: { a: 10 },
            func: function(val) { return 42; },
            condition: function(val) { return val === 10; },
            recursive: false
        })).toEqual({
            a: 42
        })
    });

    it('should replace nested property if recursive is not set', () => {
        expect(objectFilterMap({
            object: { a: { b: 10 } },
            func: function(val) { return 42; },
            condition: function(val) { return val === 10; },
        })).toEqual({
            a: {
                b: 42
            }
        })
    });

    it('should not replace nested property if recursive == false', () => {
        expect(objectFilterMap({
            object: { a: { b: 10 } },
            func: function(val) { return 42 },
            condition: function(val) { return val === 10; },
            recursive: false
        })).toEqual({ a: { b: 10 } });
    });

    // Sad path
    // --------
    it('should not work without required params', () => {

        expect( objectFilterMap ).toThrow();

        expect( function () {
            objectFilterMap({})
        }).toThrow();

        expect( function () {
            objectFilterMap({
                object: {}
            })
        }).toThrow();

        expect( function () {
            objectFilterMap({
                object: {},
                func: function () {}
            })
        }).toThrow();

        expect( function () {
            objectFilterMap({
                object: {},
                func: function () {},
                recursive: false
            })
        }).toThrow();

        expect( function () {
            objectFilterMap({
                object: {},
                condition: function () {},
                recursive: false
            })
        }).toThrow();

        expect( function () {
            objectFilterMap({
                object: {},
                func: function () {},
                condition: function () {}
            })
        }).not.toThrow();
    });
})
