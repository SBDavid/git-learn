window.onload = function () {
    scroller = new jsScroller(document.getElementById("Scroller-1"), 400, 200);
    scrollbar = new jsScrollbar(document.getElementById("Scrollbar-Container"), scroller, false);
}