/* 导出一个单独class */
export class Greeter {
    greeting: string;
    constructor(message: string) {
        this.greeting = message;
    }
    greet() {
        return "module Hello, " + this.greeting;
    }
}