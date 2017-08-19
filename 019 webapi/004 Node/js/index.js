window.onload = function () {
    
    // baseURI
    console.info('baseURI: ', document.getElementById('test').baseURI);

    // childNodes
    console.info('childNodes: ', document.getElementById('test').childNodes);

    // firstChild
    console.info('firstChild: ', document.getElementById('test').firstChild);

    // appendChild
    document.getElementById('test').appendChild(document.getElementById('toBeAppend').cloneNode(true));

    // insertBefore
    document.getElementById('test').insertBefore(document.createElement('a'), document.getElementById('c1'));

    // lookupPrefix
    console.info('lookupPrefix', document.getElementById('toBeAppend').lookupPrefix(document.getElementById('c1')));
}
    