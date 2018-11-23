export default class Sender {

    count = 0;

    constructor(interval, emmiter) {
        this.emmiter = emmiter;
        this.interval = interval;
        this.count = 0;
    }

    run(amount) {
        let amountCount = 0;
        const timmer = setInterval(() => {
            if (amountCount >= amount) {
                clearInterval(timmer);
                return;
            }
            amountCount++;
            this.emmiter(this.count++);

        }, this.interval);
        
    }
}