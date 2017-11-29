var page = require('webpage').create();
page.open('http://a.com/026%20phantomjs/002%20onPageCreated/index.html', function (status) {
    console.log("Status: " + status);
    if (status === "success") {
        page.render('a.png');
    }

    page.evaluate(function () {
        var link = document.getElementById('test');

        var event = document.createEvent('Event');
        event.initEvent('click', true, false);
        link.dispatchEvent(event)
    });

    
});

page.onPageCreated = function (newPage) {
    console.log('A new child page was created! Its requested URL is not yet available, though.');
    // Decorate
   
    try {
        console.log(newPage);
        newPage.onLoadFinished = function(status) {
            console.log("Status acom: " + status);
            newPage.render('acom.png');
            phantom.exit();
        }
    } catch(err) {
        console.log(err)
    }
    
};