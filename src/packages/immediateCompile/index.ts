import * as global from "./global"

import onkeydown from "./event/onkeydown"
import onkeyup from "./event/onkeyup"
import oninput from "./event/oninput"
import onclick from "./event/onclick"

import module_paragraph from "./module_block/paragraph"
import onpaste from "./event/onpaste"
import paragraph from "./module_block/paragraph"

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
        // bindElement.onpaste = onpaste.bind(this) // 粘贴

        // bindElement. = (e) => {
        //     console.log("onselectionchange:", e);
        // }
    }

    getSource() {
        let source = ""
        let children = global.state.BIND_ELEMENT.children
        for (let i = 0; i < children.length; i++) {
            let el = children[i] as HTMLElement
            for (let modIndex = 0; modIndex < global.state.MODULE.length; modIndex++) {
                let mod = global.state.MODULE[modIndex]
                if (global.getAttribute(el) === mod.mdtype) {
                    mod.getSource?.(el).forEach(str => {
                        source += `${str}\n\n`
                    })
                    break
                }
            }
        }
        // return "immediateCompile.prototype.getSource is undefined"
        return source
    }
}

export default immediateCompile
