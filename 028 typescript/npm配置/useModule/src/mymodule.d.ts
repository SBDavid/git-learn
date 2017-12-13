/* declare module "mymodule" {
    import index from "mymodule";

    export {index};
} */

declare class Greeter {
    constructor(greeting: string);

    greeting: string;
    greet(): void;
}