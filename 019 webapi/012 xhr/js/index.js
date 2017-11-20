var xmlhttp=new XMLHttpRequest();

xmlhttp.onreadystatechange = function() {
    console.info('state', xmlhttp.readyState)
}



xmlhttp.open("GET",'https://api.github.com/user',true);
xmlhttp.onprogress = function(event) {
    console.info('process', event)
    console.info('test', xmlhttp.responseText)
}


xmlhttp.send();