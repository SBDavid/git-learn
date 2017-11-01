window.onload = function() {
    var test = {};
    Sizzle('div#test', document, test);
    console.info('Sizzle', test);

    console.info('matchesSelector', Sizzle.matchesSelector(test[0], 'div'));

    console.info('matches', Sizzle.matches('div', test));
}