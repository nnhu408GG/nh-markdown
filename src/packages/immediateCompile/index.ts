import * as global from "./global"

import onkeydown from "./event/onkeydown"
import onkeyup from "./event/onkeyup"
import oninput from "./event/oninput"
import onclick from "./event/onclick"
import onpaste from "./event/onpaste"

import paragraph from "./components/paragraph"

import buildStruct from "../buildStruct"

const CLASS_NAME = "nh-mrkEdit"
// class 只负责管理对外暴露的接口，以及初始化处理
class immediateCompile {
    constructor(bindElement: HTMLElement, sourceData?: string) {
        global.state.BIND_ELEMENT = bindElement
        bindElement.className = CLASS_NAME
        bindElement.contentEditable = "true"
        bindElement.spellcheck = false

        if (!sourceData) {
            let p = paragraph.createBasics()
            bindElement.append(p)
        }

        const modules = import.meta.glob("./module_block/*.ts")
        for (let i in modules) {
            modules[i]().then(mod => {
                global.state.MODULE.push(mod.default)
            })
        }

        /** @todo
         * 光标的移动需要实时定位focus的行，添加className:md-focus
         * 定位设置md-focus的时机：
         * - 鼠标点击至其他行
         * - 上下方向键成功切换行
         * - 失去焦点
         */
        bindElement.onclick = onclick.bind(this)
        bindElement.onkeydown = onkeydown.bind(this)
        bindElement.onkeyup = onkeyup.bind(this)
        bindElement.oninput = oninput.bind(this)
        bindElement.onpaste = onpaste.bind(this) // 粘贴

        // bindElement. = (e) => {
        //     console.log("onselectionchange:", e);
        // }
    }

    set source(data: string) {
        let res = buildStruct(data)
        res.forEach(item => console.log(item))
        let fragment = global.createByStruct(res)

        // 清空 bindElement 的所有子元素
        let range = new Range()
        range.selectNodeContents(global.state.BIND_ELEMENT)
        range.deleteContents()

        global.state.BIND_ELEMENT.append(fragment)
    }

    get source() {
        let source = global.prefixGetSource({
            fragment: global.state.BIND_ELEMENT.children,
            blankLine: true
        })
        // return "immediateCompile.prototype.getSource is undefined"
        return source
    }
}

export default immediateCompile
