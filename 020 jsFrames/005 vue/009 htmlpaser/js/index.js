HTMLParser('<html><br/></html>', {
    start: function(tagName, attrs, unary) {
        console.info('start', tagName, attrs, unary);
    },
    end: function(tagName) {
        console.info('end', tagName);
    },
    chars: function( text ) {
        console.info('chars', text);
    },
    comment: function( text ) {
        console.info('comment', text);
    }

})