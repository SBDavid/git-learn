/**
 * @author [DavidTang]
 * @email [davidtangjwg@pptv.com]
 * @create date 2017-07-26 03:46:46
 * @modify date 2017-07-26 03:46:46
 * @desc [检查Dom是否在viewport中]
 */

function getElementPosition(element) {
    var rect = element.getBoundingClientRect();

    return {
        top: rect.top + (window.pageYOffset || document.documentElement.scrollTop),
        left: rect.left + (window.pageXOffset || document.documentElement.scrollLeft),
    };
}

function isHidden(element) {
    if (element === undefined) {
        return true;
    }
    element.offsetParent === null;
}

function inViewport(element, container, customOffset) {

    if (customOffset === undefined) {
        customOffset = {
            top: 0,
            right: 0,
            bottom: 0,
            left: 0
        }
    }

    if (isHidden(element)) {
        return false;
    }

    var top;
    var bottom;
    var left;
    var right;

    if (typeof container === 'undefined' || container === window) {
        top = window.pageYOffset || document.documentElement.scrollTop;
        left = window.pageXOffset || document.documentElement.scrollLeft;
        bottom = top + (window.innerHeight || document.documentElement.clientHeight);
        right = left + (window.innerWidth || document.documentElement.clientWidth);
    } else {
        var containerPosition = getElementPosition(container);

        top = containerPosition.top;
        left = containerPosition.left;
        bottom = top + container.offsetHeight;
        right = left + container.offsetWidth;
    }

    var elementPosition = getElementPosition(element);

    return (
        top <= elementPosition.top + element.offsetHeight + customOffset.top &&
        bottom >= elementPosition.top - customOffset.bottom &&
        left <= elementPosition.left + element.offsetWidth + customOffset.left &&
        right >= elementPosition.left - customOffset.right
    );
}

module.exports = {
    inViewport: inViewport
};