import thematicBreak from "./components/thematicBreak"
import blockquote from "./components/blockquote"
import heading from "./components/heading"
import paragraph from "./components/paragraph"
import orderList from "./components/orderList"
import unorderList from "./components/unorderList"
import code from "./components/code"
import table from "./components/table"
import image from "./components/image"
import checkbox from "./components/checkbox"

import oninput from "./events/oninput"

import * as global from "./generator"

import { Component } from "../types/mainPanel"
import { FlowContent, Paragraph } from "../types/mdast"
import { complier } from "./compiler"
import onkeydown from "./events/onkeydown"
import onclick from "./events/onclick"

export default class MainPanel {
    /** 主要面板的className */
    static CLASS_NAME = "nh-mrkEdit"

    /** block类型的标记 */
    static BLOCK_ATTRIBUTE = "block"
    /** inline的标志 */
    static INLINE_ATTRIBUTE = "inline"

    /** 区分component类型 */
    static COMPONENT_TYPE = "mdtype"

    /** block区块支持inline的标志 */
    static INLINE_SUPPORT = "inline-support"

    /** sign标记，因兼容多种语法生成同种ast，需要加以区分 */
    static SIGN = "sign"
    /** 聚焦block类型的标记 */
    static BLOCK_FOCUS = "block-focus"
    /** 聚焦inline类型的标记 */
    static INLINE_FOCUS = "inline-focus"
    /** FlowContent模块 */
    static COMPONENTS_FLOWCONTENT: Component[] = [
        thematicBreak,
        blockquote,
        heading,
        paragraph,
        orderList,
        unorderList,
        code,
        table,
        image,
        checkbox,
    ]

    /** 基于该dom来创建markdown的编辑功能 */
    bindElement: HTMLElement

    /** command键的触发     
     * todo 加入ctrl键的兼容 */
    activeMeta: boolean

    /** 最近一次聚焦的block */
    focusBlock: HTMLElement
    focusInline: HTMLElement

    /** 特殊 moduleBlock 生成的临时空行 */
    tempParagraph: HTMLElement

    /** inline的数据结构对象 */
    inlineStruct: []


    constructor(el: HTMLElement) {
        el.classList.add(MainPanel.CLASS_NAME)
        el.contentEditable = "true"
        el.spellcheck = false
        this.bindElement = el

        let p = paragraph.generator(<Paragraph>{ type: "paragraph" })
        el.append(p)

        // /** @todo
        //  * 光标的移动需要实时定位focus的行，添加className:md-focus
        //  * 定位设置md-focus的时机：
        //  * - 鼠标点击至其他行
        //  * - 上下方向键成功切换行
        //  * - 失去焦点
        //  */

        el.onclick = onclick.bind(this)
        el.onkeydown = onkeydown.bind(this)
        // el.onkeyup = onkeyup.bind(this)
        el.oninput = oninput.bind(this)
        // el.onpaste = onpaste.bind(this) // 粘贴

    }

    /** 将dom文档树编译成生成ast */
    public compiler() {
        return complier(this.bindElement)
    }

    /** 根据ast生成dom文档树 */
    public generator(ast: FlowContent[]) {
        this.bindElement.innerHTML = ""
        global.generatorFlowContent(this.bindElement, ast)
    }
}