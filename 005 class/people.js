function People(name) {
    this.name = name;

    this.showName = function() {
        console.info('name: ', this.name);
    }
}

People.showNameStatic = function() {
    console.info('name: ', this.name);
}

var p = new People('david');

People.showNameStatic.apply(p);