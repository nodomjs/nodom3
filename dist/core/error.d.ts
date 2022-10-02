/**
 * 异常处理类
 * @since       1.0.0
 */
export declare class NError extends Error {
    constructor(errorName: string, p1?: string, p2?: string, p3?: string, p4?: string);
    /**
     * 编译字符串，把{n}替换成带入值
     * @param src   待编译的字符串
     * @returns     转换后的消息
     */
    private compile;
}
