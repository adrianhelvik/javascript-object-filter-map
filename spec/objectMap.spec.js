var objectMap = require('../objectMap');

describe('objectMap', () => {

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

        expect(objectMap(options)).toEqual(object);
    });

    it('should replace a property if condition is met', () => {
        var object = {
            a: 1,
            b: 10
        };

        expect(objectMap({
            object: object,
            func: function (val) { return 1337 },
            condition: function (val) { return val === 10 }
        })).toEqual({
            a: 1,
            b: 1337
        })

    });

    it('should replace non-nested property if recursive == false', () => {
        expect(objectMap({
            object: { a: 10 },
            func: function(val) { return 42; },
            condition: function(val) { return val === 10; },
            recursive: false
        })).toEqual({
            a: 42
        })
    });

    it('should replace nested property if recursive is not set', () => {
        expect(objectMap({
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
        expect(objectMap({
            object: { a: { b: 10 } },
            func: function(val) { return 42 },
            condition: function(val) { return val === 10; },
            recursive: false
        })).toEqual({ a: { b: 10 } });
    });

    // Sad path
    // --------
    it('should not work without required params', () => {

        expect( objectMap ).toThrow();

        expect( function () {
            objectMap({})
        }).toThrow();

        expect( function () {
            objectMap({
                object: {}
            })
        }).toThrow();

        expect( function () {
            objectMap({
                object: {},
                func: function () {}
            })
        }).toThrow();

        expect( function () {
            objectMap({
                object: {},
                func: function () {},
                recursive: false
            })
        }).toThrow();

        expect( function () {
            objectMap({
                object: {},
                condition: function () {},
                recursive: false
            })
        }).toThrow();

        expect( function () {
            objectMap({
                object: {},
                func: function () {},
                condition: function () {}
            })
        }).not.toThrow();
    });
})
