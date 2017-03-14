/**
 * Created by elyde on 3/11/2017.
 */

'use strict';

describe ('revealingModuleFactory', function () {

    var expectInstanceOf = function (value, Constructor) { return expect(value).to.be.instanceOf(Constructor); },
        expectFunction = function (value) { return expectInstanceOf(value, Function); },
        expectObject = function (value) { return expectInstanceOf(value, Object); },
        expectEqual = function (x, y) { return expect(x).to.equal(y); };

    it ('should be a function', function () {
        expectFunction(revealingModuleFactory);
    });

    it ('should return a function', function () {
        expectFunction(revealingModuleFactory());
    });

    describe ('#revealingModule', function () {
        var allYourBasePath = 'all.your.base.are.belong.to.us';

        it ('should set properties on itself when a name and a value is passed in', function () {
            var ns = revealingModuleFactory(),
                Hello = function Hello () {};
            ns('Hello', Hello);
            expectFunction(ns.Hello);
            expectEqual(ns.Hello, Hello);
        });

        it ('should set namespaces on itself when namespace(s) don\'t exist on it and return tail of namespace when doing so', function () {
            var ns = revealingModuleFactory(),
                result = ns(allYourBasePath);

            allYourBasePath.split('.').reduce(function (agg, name) {
                //console.debug(agg);
                expectObject(ns(agg));
                expectEqual(Object.keys(ns(agg)).length, 1);
                return agg + '.' + name;
            });

            expectObject(result);
            expectEqual(ns.all.your.base.are.belong.to.us, result);
        });

        it ('should not overwrite existing namespace when setting namespaces or values on itself', function () {
            var ns = revealingModuleFactory(),
                Hello = function Hello () {},
                HelloWorldGreeting = 'Hello World!',
                originalTail;

            // Set a namespace
            ns(allYourBasePath);

            // Fetch tail of said namespace
            originalTail = ns.all.your.base.are.belong.to.us;

            // Add more stuff to initial namespace
            ns('HelloWorldGreeting', HelloWorldGreeting)
              // ""
              (Hello.name, Hello)
              (allYourBasePath + '.' + Hello.name, Hello);

            // Test set members
            expectEqual(ns.Hello, Hello);
            expectEqual(ns.HelloWorldGreeting, HelloWorldGreeting);
            expectEqual(ns.all.your.base.are.belong.to.us.Hello, Hello);

            // Ensure original namespace is still intact
            expectEqual(ns.all.your.base.are.belong.to.us, originalTail);
        });

    });


});
