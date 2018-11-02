export default class BatchTash {

    constructor(timeout, maxAmount) {
        this.timeout = timeout;
        this.maxAmount = maxAmount;
        this.tasks = [];
        this.timer = null;
        this.timeout = 200;
        this.maxAmount = 20;
        this.paused = false;
    }

    // 执行所有的任务
    flushTasks() {
        this.tasks.forEach((task) => {
            task.callback(...task.args);
        });
        this.tasks.splice(0, this.tasks.length);
    }

    clearTimer() {
        if (this.timer) {
            clearTimeout(this.timer);
            this.timer = null;
        }
    }

    pause() {
        this.paused = true;
    }

    resume() {
        this.paused = false;
    }

    pushTask(callback, ...args) {
        // 载入任务
        this.tasks.push({
            callback,
            args
        });

        if (this.paused) {
            return;
        }
        // 如果任务数量到达上限，则执行所有的任务
        else if (this.tasks.length >= this.maxAmount) {
            this.flushTasks();
            this.clearTimer();
        }
        // 如果目前没有执行任务，则开启一次任务
        else if (this.timer === null) {
            this.timer = setTimeout(() => {
                this.flushTasks();
                this.clearTimer();
            }, this.timeout);
        }
    }
}