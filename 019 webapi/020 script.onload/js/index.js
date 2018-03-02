window.onload = function() {
    var _script = document.createElement('script');
  	_script.type = 'text/javascript';
  	_script.async = true;
  	_script.src = "./js/m.js";
    _script.onload = function() {
        alert('index.js');
        console.info(1)
    };

    
    _script.onreadystatechange = function() {
        alert('index.js');
        console.info(1, this)
    };
    var _s = document.getElementsByTagName('script')[0];
    _s.parentNode.insertBefore(_script, _s);
}