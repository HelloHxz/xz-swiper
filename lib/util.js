var translateKeys;

var Re = {
	getTransitionKeys () {
        if (translateKeys) {
            return translateKeys;
        }
        var testStyle = document.createElement("DIV").style;
        var me = {};
        if ("-webkit-transform" in testStyle) {
            me.transitionend = "webkitTransitionEnd";
            me.transform = "WebkitTransform";
            me.cssTransform = "-webkit-transform";
            me.transition = "WebkitTransition";
        }
        else {
            me.transitionend = "transitionend";
            me.transform = "transform";
            me.cssTransform = "transform";
            me.transition = "transition";
        }
        translateKeys = me;
        return me;
    },
};

export default Re;