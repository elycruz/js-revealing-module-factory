# revealing-module-factory-js
A revealing module factory method for easily creating and using the revealing module pattern for
projects that don't require an amd, umd, or commonjs architecture (for small projects though
also useful for large projects that have revealing module patterns that folks
have started adding direct properties to).

### Features:
- Sets modules on itself (for easy access).
- Sets modules using `Object.defineProperty` (sets them as not `writable` and not `configurable`).
- Allows you to access your modules as properties; E.g. `myModule.all.your.base` etc.;
- Allows you to fetch/set your modules using namespace strings when calling your `revealingModule` ('all.your.base' etc.) when calling your `revealingModule` as a function.
- Less overhead when requesting your modules since they are just properties descending from your `revealingModule` (`myModule.all.your.base`...).
- Returned `revealingModule` can be called as a setter-getter (when called with one parameter - sets un-existing namespaces and returns final path in namespace),
a getter (when called with one parameter - Returns existing namespaces) or as a setter (when called with 2 parameters - returns itself)

### Usage:
Include `'./dist/revealingModuleFactory.js'` as part-of/in your project.

#### In your code:
```
const myModule = revealingModulePattern();

myModule instanceof Function === true; // true

// Now you can set namespaces on your module
const things = {},
    thing = {};
    
// ""
myModule('thing', thing);
myModule.thing === thing; // true

// ""
myModule('all.the.things', things);
myModule.all.the.things === things; // true

// Once your namespaces are written they become unsettable (not `writable` or `configurable`)
myModule.all.the.things = function OtherThings() {};

// ""
myModule.all.the.things === things; // true

// Also calls to your module as a setter (called with namespace string and value) return itself
const multiple = {},
      all = {},
      once = {};
      
// ""
myModule('setting', multiple)
        ('things', all)
        ('at', once)
        
// Using myModule call as a getter
myModule('all.the.things') === things; // true

```

### Pre-requisites:
Es5+ Browsers

### Tests:
1.  `$ npm install phantomjs -g`
2.  `$ npm install`
3.  `$ npm run tests`

## License:
[GPL v2+](http://www.gnu.org/licenses/gpl-2.0.html "http://www.gnu.org/licenses/gpl-2.0.html") AND
