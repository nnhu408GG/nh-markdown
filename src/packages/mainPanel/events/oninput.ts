import MainPanel from "..";

import * as global from "../global"

export default function (this: MainPanel, e: InputEvent) {
    console.log("inputType:", e.inputType);

    let sel = document.getSelection()

    let inlineSupport = global.getParentAttribute(this, sel.anchorNode, MainPanel.INLINE_SUPPORT) as HTMLElement

    /** 是否需要重置inline的结构 */
    let isNeedReSetInline = inlineSupport
    if (isNeedReSetInline) {
        global.resetInline(this, inlineSupport)
    }

}