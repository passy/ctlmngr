// Copied directly from the React master. Should be replaced as soon as this
// lands in react-with-addons.
define(function () {
    'use strict';

    /**
    * Performs equality by iterating through keys on an object and returning
    * false when any key has values which are not strictly equal between
    * objA and objB. Returns true when the values of all keys are strictly equal.
    *
    * @return {boolean}
    */
    function shallowEqual(objA, objB) {
        if (objA === objB) {
            return true;
        }
        var key;
        // Test for A's keys different from B.
        for (key in objA) {
            if (objA.hasOwnProperty(key) &&
                (!objB.hasOwnProperty(key) || objA[key] !== objB[key])) {
                return false;
            }
        }
        // Test for B'a keys missing from A.
        for (key in objB) {
            if (objB.hasOwnProperty(key) && !objA.hasOwnProperty(key)) {
                return false;
            }
        }
        return true;
    }

    /**
     * If your React component's render function is "pure", e.g. it will render the
     * same result given the same props and state, provide this Mixin for a
     * considerable performance boost.
     *
     * Most React components have pure render functions.
     *
     * Example:
     *
     *   var ReactComponentWithPureRender =
     *     require('ReactComponentWithPureRenderMixin');
     *   React.createClass({
     *     mixins: [ReactComponentWithPureRenderMixin],
     *
     *     render: function() {
     *       return <div className={this.props.className}>foo</div>;
     *     }
     *   });
     *
     * Note: This only checks shallow equality for props and state. If these
     * contain complex data structures this mixin may have false-negatives for
     * deeper differences. Only mixin to components which have simple props and
     * state, or use `forceUpdate()` when you know deep data structures have
     * changed.
     */
    var ReactComponentWithPureRenderMixin = {
        shouldComponentUpdate: function(nextProps, nextState) {
            return !shallowEqual(this.props, nextProps) ||
                   !shallowEqual(this.state, nextState);
        }
    };

    return ReactComponentWithPureRenderMixin;
});
