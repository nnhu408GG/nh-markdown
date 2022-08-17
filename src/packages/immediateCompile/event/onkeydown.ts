import immediateCompile from "..";
import * as global from "../global"

import hr from "../module_block/hr";
import image from "../module_block/image";
import paragraph from "../module_block/paragraph";
import precode from "../module_block/precode";
import table from "../module_block/table";


// todo 快捷键配置

export default function (this: immediateCompile, e: KeyboardEvent) {
    // console.log("IS_KEYDOWNEVENT");
    
    let sel = document.getSelection()!

    /* 优先处理Meta */
    if (e.key === "Meta") {
        global.state.ACTIVE_META = true
    }

    if (!sel.isCollapsed) {
        /* todo bugfix 需判断 anchorNode 和 focusNode 是否有 mdtype 的断层 */
        if (e.code === "Enter") {
            e.preventDefault()
            sel.getRangeAt(0).deleteContents()
            return
        }
    }

    for (let mod of global.state.MODULE) {
        if (mod.mdtype === global.state.latelyFirstELement?.getAttribute(global.SIGN.MODULE_ATTRIBUTE)) {
            mod.keydownEventUnlimited?.(global.state.latelyFirstELement, e)
            break
        }
    }

    /* ====== 以下为 isCollapsed=true 的处理 ====== */
    let moduleELement = global.getModuleELement(e.target as Node)
    if (!moduleELement) return
    let basics = { moduleELement, e }

    if (moduleELement.hasAttribute("inline")) {
        return
    }


    /* TODO 处理单键 */
    // if (e.key === "Tab") {
    //     e.preventDefault()
    //     let node = document.createTextNode("\u00A0\u00A0")
    //     let sel = cursorInfo.sel
    //     let range = sel.getRangeAt(0)
    //     range.insertNode(node)
    //     cursorInfo.moduleELement.normalize()
    //     range.setStart(sel.anchorNode!, sel.anchorOffset + 2)
    //     sel.removeAllRanges()
    //     sel.addRange(range)
    // }

    // if (global.state.ACTIVE_META) {
    //     /* 优先处理快捷键？ */
    //     // h1、h2、h3、h4、h5、h6
    //     // 加粗
    //     return
    // }

    /* 其次处理换行 */
    if (e.code === "Enter") {
        console.log("enter event anchorOffset:", sel.anchorOffset);
        if (sel.anchorOffset === 0) {
            global.iteratorModule(basics, "enterEventBegin")
        } else {
            global.iteratorModule(basics, "enterEventAfter")
        }
    }

    /* 接着处理删除 */
    // todo hr 的删除
    if (e.key === "Backspace") {
        // console.log("isCollapsed:", sel.isCollapsed);
        if (sel.anchorOffset === 0) {
            global.iteratorModule(basics, "deleteEventBegin")
        } else {
            // 防止<br>的生成
            if (sel.anchorNode?.textContent?.length === 1) {
                e.preventDefault()
                sel.anchorNode.parentElement!.firstChild?.remove()
            }
        }
    }

}
