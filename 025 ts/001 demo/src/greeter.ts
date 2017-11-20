class Greeter {
    greeting: string;
    constructor(message: string) {
        this.greeting = message;
    }
    private greet() {
        return "Hello, " + this.greeting;
    }
}

let greeter = new Greeter("world");

greeter.greeting = '';
greeter.greet();