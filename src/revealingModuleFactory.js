/**
 * Created by elyde on 3/11/2017.
 */

'use strict';

const _undefined = 'undefined';

/**
 * Sets an enumerable property (with value) on an object.
 * @param onObj {Object}
 * @param propName {String}
 * @param value {*}
 * @returns {Object}
 */
export function defineEnumPropValue (onObj, propName, value) {
    return Object.defineProperty(onObj, propName, {
        value: value,
        enumerable: true
    });
}

/**
 * Sets an un-configurable namespace on an object with optional value at the end of the namespace.
 * @note Copied directly from `sjljs`.
 * @param nsString {String} - Namespace or namespace-string to set on `obj`.
 * @param obj {Object} - Object to add un-configurable namespace on.
 * @param [valueToSet=undefined] {*} - Value to set.  Optional.  Default `undefined`.
 * @returns {*} - Object that was passed in.
 */
export function unConfigurableNamespace (nsString, obj, valueToSet)  {
    const shouldSetValue = typeof valueToSet !== _undefined;

    // Reduce original object to itself with requested modifications
    return nsString.split('.').reduce((agg, key, ind, parts) => {
        const ObjHasOwnProperty = agg.hasOwnProperty(key);
        if (ind === parts.length - 1 &&
            shouldSetValue && !ObjHasOwnProperty) {
            defineEnumPropValue(agg, key, valueToSet);
        }
        else if (typeof agg[key] === _undefined &&
            !ObjHasOwnProperty) {
            defineEnumPropValue(agg, key, {});
        }
        return agg[key];
    }, obj);
}

/**
 * Revealing module function.  Returns itself if being called as a setter or stored
 *  member/namespace if one is found.
 * @function revealingModule
 * @param nsString {String} - Name of module to store/get or namespace string which can also include module name to get/set at end.
 * @param [value=undefined] {*} - Value to set on module (revealing module function).
 * @parm [freeze=false] {Boolean} - Whether to freeze
 * @returns {*} - Self or found namespace/module.
 */

/**
 * Revealing module factory.  Returns a revealing module function which in turn allows you to set
 * modules on it via namespace strings.  Also note module namespaces are set as not `writable` and not `configurable`
 * via `Object.defineProperty` - This makes your namespaces harder to tamper with;  E.g.,
 * ```
 *   var myModule = revealingModuleFactory();

 *   // Some values to work with
 *   function Hello () {}
 *   function SomeMember () {}
 *
 *   myModule('some.namespace.Hello', Hello);
 *   myModule('SomeMember', SomeMember);
 *   myModule.SomeMember === SomeMember;        // `true`
 *   myModule.some.namespace.Hello === Hello;   // `true`
 *
 *   // Error is thrown here as property is not `writable` and
 *   // property is not `configurable` (protected).
 *   myModule.SomeMember = Hello;
 *
 * ```
 *
 * @function revealingModuleFactory
 * @module revealingModuleFactory
 * @returns {revealingModule} - Revealing module function (store members on itself and makes them un-'configurable' (as propert(y|ies))).
 */
export function revealingModuleFactory () {
    return function revealingModule (nsString, value) {
        return typeof nsString === _undefined ?
            revealingModule : unConfigurableNamespace(nsString, revealingModule, value);
    };
}

defineEnumPropValue(revealingModuleFactory, unConfigurableNamespace.name, unConfigurableNamespace);
defineEnumPropValue(revealingModuleFactory, defineEnumPropValue.name, defineEnumPropValue);

export default revealingModuleFactory;
