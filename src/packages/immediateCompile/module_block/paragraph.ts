import type { Module } from "../types"
import * as global from "../global"
import blockquote from "./blockquote"
import unorderedList from "./unorderedList"
import orderedList from "./orderedList"
import precode from "./precode"

// import module_PreCode from "./precode"
// import module_Image from "./image"

export default <Module>{
    mdtype: "paragraph",

    enterEvent_Begin(el, event) {
        event.preventDefault()

        /* 兼容blockquote的嵌套 */
        if (el.parentElement?.getAttribute(global.state.MODULE_ATTRIBUTE_SIGN) === blockquote.mdtype
            && blockquote.enterEvent_Begin(el, event)
        ) return


        /* 兼容 unorderedList 的嵌套 */
        if (el.parentElement?.parentElement?.getAttribute(global.state.MODULE_ATTRIBUTE_SIGN) === unorderedList.mdtype
            && unorderedList.enterEvent_Begin(el, event)
        ) return

        /* todo 兼容 orderedList 的嵌套 */
        if (el.parentElement?.parentElement?.getAttribute(global.state.MODULE_ATTRIBUTE_SIGN) === orderedList.mdtype
            && orderedList.enterEvent_Begin(el, event)
        ) return

        let p = global.createElement("p", this.mdtype)
        global.insertBefore(el, p)
    },

    enterEvent_After(el, event) {
        event.preventDefault()

        /* 兼容 unorderedList 的嵌套 */
        if (el.parentElement?.parentElement?.getAttribute(global.state.MODULE_ATTRIBUTE_SIGN) === unorderedList.mdtype
            && unorderedList.enterEvent_After(el, event)
        ) return

        /* 兼容 orderedList 的嵌套 */
        if (el.parentElement?.parentElement?.getAttribute(global.state.MODULE_ATTRIBUTE_SIGN) === orderedList.mdtype
            && orderedList.enterEvent_After(el, event)
        ) return

        let p = global.createElement("p", this.mdtype)
        let fragment = global.getFragementRangeToEnd(el)
        if (fragment) {
            p.append(fragment)
        } else {
            // todo 在末尾的回车处理
            // todo 转移到focus切换时候触发！
            // if (el.parentElement?.parentElement?.getAttribute(global.state.MODULE_ATTRIBUTE_SIGN) === precode.mdtype) {
            //     precode.changeFocus_AtParagraph(el, event)
            //     return
            // }
        }
        global.insertAfter(el, p)
        global.setCursorPosition(p)


        /** todo upgradeInParagraphAfterEnter(el)
         * - image
         * - table
         * - precode
         * - unorderedList
         * - orderedList
         */

        //     // console.log("p标签末尾");
        //     if (/^```.*$/g.test(data)) {
        //         // event.preventDefault()
        //         module_PreCode.changeFocus_AtParagraph(el)
        //         return
        //     }
        //     if (/^!\[(.+)\]\((.+)\)$/g.test(data)) {
        //         // event.preventDefault()
        //         module_Image.changeFocus_AtParagraph(el)
        //         return
        //     }
    },

    deleteEvent_Begin(el, event) {
        /* 兼容blockquote的嵌套 */
        if (el.parentElement?.getAttribute(global.state.MODULE_ATTRIBUTE_SIGN) === blockquote.mdtype
            && blockquote.deleteEvent_Begin(el, event)
        ) return

        /* 兼容 unorderedList 的嵌套 */
        if (el.parentElement?.parentElement?.getAttribute(global.state.MODULE_ATTRIBUTE_SIGN) === unorderedList.mdtype
            && unorderedList.deleteEvent_Begin(el, event)
        ) return

        /* 兼容 orderedList 的嵌套 */
        if (el.parentElement?.parentElement?.getAttribute(global.state.MODULE_ATTRIBUTE_SIGN) === orderedList.mdtype
            && orderedList.deleteEvent_Begin(el, event)
        ) return

        if (el.previousElementSibling?.getAttribute(global.state.MODULE_ATTRIBUTE_SIGN) === this.mdtype
            && el.previousElementSibling.childNodes.length === 0
        ) {
            event.preventDefault()
            el.previousElementSibling.remove()
        }

        // if (el.parentElement?.children.length === 1) {
        //     let br = document.createElement("br")
        //     if (el.childNodes.length === 0) {
        //         event.preventDefault()
        //     } else if (el.children.length === 1 && el.firstElementChild?.isEqualNode(br)) {
        //         event.preventDefault()
        //     }
        // } else if (el.previousElementSibling?.tagName === "PRE") {
        //     event.preventDefault()
        //     global.setCursorPosition(el.previousElementSibling.firstElementChild?.lastElementChild!, -1)
        //     el.remove()
        // } else if (el.previousElementSibling?.className === "hr") {
        //     event.preventDefault()
        //     el.previousElementSibling.remove()
        // }
    },

    // paragraph 的 inputEvent_Unlimited 事件会在 upgradeInParagraph 内执行
    // inputEvent_Unlimited(el) { },

    upgradeInParagraph(el) {
        /* 兼容 unorderedList 的嵌套 */
        if (el.parentElement?.parentElement?.getAttribute(global.state.MODULE_ATTRIBUTE_SIGN) === unorderedList.mdtype) {
            unorderedList.inputEvent_Unlimited(el)
            // return true // 这里不要结束匹配
        }
        return false
    },
}