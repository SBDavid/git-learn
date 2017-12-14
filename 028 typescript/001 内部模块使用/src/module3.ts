// 导出一个值
export let testVal: Boolean;

testVal = false;

// 导出接口
export interface testInterface {
    label: string;
}

// 导出函数
export function funa(val: testInterface) {
    console.info('导入接口', val);
}