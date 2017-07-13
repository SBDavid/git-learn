var d1 = $.Deferred();
var d2 = $.Deferred();
 
$.when( d1, d2 ).done(function ( v1, v2 ) {
    console.log( v1 ); // "Fish"
    console.log( v2 ); // "Pizza"
});
 
d1.resolve( "Fish" );
d2.resolve( "Pizza" );