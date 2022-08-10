import immediateCompile from "..";
import * as global from "../global"

import hr from "../module_block/hr";
import image from "../module_block/image";
import paragraph from "../module_block/paragraph";
import precode from "../module_block/precode";


// todo 快捷键配置

export default function (this: immediateCompile, e: KeyboardEvent) {
    let sel = document.getSelection()!
    console.log("keydown");

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



    /* hr 的特殊嵌入 */
    if (global.state.latelyFirstELement?.getAttribute(global.state.MODULE_ATTRIBUTE_SIGN) === hr.mdtype) {
        hr.keydownEvent_Unlimited(global.state.latelyFirstELement, e)
        return
    }

    /* ====== 以下为 isCollapsed=true 的处理 ====== */
    let moduleELement = global.getModuleELement(e.target as Node)
    if (!moduleELement) return
    let basics = { moduleELement, e }


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
            global.iteratorModule(basics, "enterEvent_Begin")
        } else {
            global.iteratorModule(basics, "enterEvent_After")
        }
    }

    /* 接着处理删除 */
    // todo hr 的删除
    if (e.key === "Backspace") {
        // console.log("isCollapsed:", sel.isCollapsed);
        if (sel.anchorOffset === 0) {
            global.iteratorModule(basics, "deleteEvent_Begin")
        } else {
            // 防止<br>的生成
            if (sel.anchorNode?.textContent?.length === 1) {
                e.preventDefault()
                sel.anchorNode.parentElement!.firstChild?.remove()
            }
        }
    }

    // todo 挤出空行放到 oninput 中处理
    // todo "ArrowLeft", "ArrowRight" 的处理设计
    /* 上下光标移动的元素预判 */
    // console.log(e.key);

    if (["ArrowUp", "ArrowDown"].includes(e.key)) {
        // if (global.getAttribute(moduleELement) === precode.mdtype) {
        //     precode.keydownEvent_Unlimited(moduleELement, e)
        //     return
        // }

        /* 
            todo 创建一个 global 函数处理预判 previousElementSibling 和 nextElementSibling
            返回null表示到顶了
         */

        // 判断当前是否处在对应的预判元素中？hr?
        /* hr 的光标移动思路，先移到反方向的元素上再执行 */

        // 需要预测的 module
        // let predictModule = [image]

        // let nextModuleElement
        // if (e.key === "ArrowUp") {
        //     nextModuleElement = moduleELement.previousElementSibling as HTMLElement
        // } else if (e.key === "ArrowDown") {
        //     nextModuleElement = moduleELement.nextElementSibling as HTMLElement
        // }

        // if (nextModuleElement) {
        //     for (let i = 0; i < predictModule.length; i++) {
        //         if (nextModuleElement.getAttribute(global.state.MODULE_ATTRIBUTE_SIGN) === predictModule[i].mdtype) {
        //             // e.preventDefault()
        //             // console.log("nextModuleElement:", nextModuleElement);
        //             global.classNameAddFocus(nextModuleElement)
        //             predictModule[i].focusEvent(nextModuleElement)
        //             break
        //         }
        //     }
        // }

    }
}

// // todo 不一定存在，可能到頂部或底部
// function getPreviousElement(): HTMLElement | null {
//     let sel = document.getSelection()!
//     let node = sel.anchorNode!

//     function iteratorElement(node: Node): HTMLElement {
//         if (node instanceof HTMLElement) {
//             return node
//         } else {
//             return iteratorElement(node.parentElement!)
//         }
//     }
//     let sub = iteratorElement(node)

//     function iteratorPreviousElement(el: HTMLElement): Element | null {
//         let _parent = el.parentElement
//         if (el?.className === "nh-mrkEdit") {
//             return null
//         } else if (_parent?.firstElementChild === el) {
//             return iteratorPreviousElement(_parent)
//         } else {
//             return el.previousElementSibling
//         }
//     }


//     return iteratorPreviousElement(sub) as HTMLElement
// }
