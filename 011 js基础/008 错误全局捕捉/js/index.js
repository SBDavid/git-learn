window.onError  = function(messageOrEvent, source, lineno, colno, error) { 
    console.info('messageOrEvent', messageOrEvent);
    console.info('source', source);
    console.info('lineno', lineno);
    console.info('colno', colno);
    console.info('error', error);
 }

var tang = test;

setTimeout(function(){throw new Error}, 1000)