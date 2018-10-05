研究react16是否缓解了用户交互的卡顿

实验一：render函数进行长耗时运算是否会阻塞input的交互

- 当setState发生主线程卡顿是，UI交互被阻塞
- 当render函数发生主线程占用时，UI交互被阻塞