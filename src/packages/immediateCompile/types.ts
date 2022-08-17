export interface BeforeMatch {
    mdtype: string,
    /** Paragraph 升级转换，这样写便于嵌入快捷键 */
    upgradeInParagraph(el: HTMLElement): boolean
}

/** todo 快捷键，兼容p元素和对应元素的转换
 * 不要放在 AfterHandle 里面
 */
// shortcutKey(el: HTMLElement, event: MouseEvent): void

export interface AfterHandle {
    /** 删除键事件，光标位于首位 */
    deleteEventBegin(el: HTMLElement, event: KeyboardEvent): boolean
    /** 回车键事件，光标位于首位 */
    enterEventBegin(el: HTMLElement, event: KeyboardEvent): boolean
    /** 回车键事件，光标位于中间及末尾 */
    enterEventAfter(el: HTMLElement, event: KeyboardEvent): boolean
    /** 匹配dom之后的任意 keydown 事件 */
    keydownEventUnlimited(el: HTMLElement, event: KeyboardEvent): void


    /** 匹配了dom之后的任意 input 事件 */
    inputEventUnlimited(el: HTMLElement): void

    // matchSource(el: HTMLElement): void

    // focus: boolean
    /** focus设置了之后的操作 */
    // focusThen(el: HTMLElement): void

    /** 聚焦事件 */
    focusEvent(el: HTMLElement, from?: "ArrowUp" | "ArrowDown"): void

    /** 【独立配置】paragraph的焦点转移时执行 */
    changeFocusAtParagraph(el: HTMLElement): boolean

    /** moduleELement -> source */
    getSource(el: HTMLElement): string

    /** todo
     * 焦点元素：
     * 目的：提供更为友好的ui
     * - image 的详情源码
     * - 所有内联样式的详情源码
     * - 表格的工具栏及删除
     * - precode的语法类型，并提供修改
     * 
     * 细节：
     * - h1-h6 的级别提示（ps: 转至 css:hover 在 contentEditable=true 的条件属性下处理）
     * - 光标聚焦该行，该行标记为 md-focus 展示源码形态
     * - 光标离开该行，复位并删除掉 md-focus
     * > blockquote 是绑在secondELement上，若内嵌ul，则绑在li上
     * 
     * 历史记录管理触发条件：
     * 同一行内的 range 当主动左右光标且输入时候触发，尽可能与 vscode 一致
     * md-focus 的触发
     * 失去焦点
     * 粘贴
     * 删除
     * 剪切
     * p 标签变化：block 变化
     * 
     * 
     */
}


// 事件模块
export type Module = BeforeMatch & AfterHandle
