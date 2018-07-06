function cls() {
    this.i = 0;
}

cls.prototype.add = function() {
    this.i++;
}


window.test = []; 
for(let i = ''; i.length < 10; i+='6'){
    window.test.push(function() {console.info(i)})
} 

for (var y = 0 ; y < window.test.length; y++) {
    window.test[y]();
}

