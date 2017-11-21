

var r = phantom.addCookie({
    'name': 'Added-Cookie-Name',
    'value': 'Added-Cookie-Value',
    'domain': '.google.com',
    'path' : '/',
  });

console.info('r', r);

console.info('cookie', phantom.cookies[0].name);

for (var item in phantom.cookies) {
    console.info(item)
}

phantom.exit(0);