import MainPanel from "..";
import _processInline from "../../mdast/processInline";

import * as global from "../global"
import * as generator from "../generator"
import { complierInline } from "../compiler";

export default function (this: MainPanel, e: KeyboardEvent) {
    // console.log(e.key);

    /* 持续按压的键 */
    if (e.key === "Meta") {
        this.activeMeta = false
    }
    if (e.key === "Control") {
        this.activeCtrl = false
    }
    if (e.key === "Alt") {
        this.activeAlt = false
    }
    if (e.key === "Shift") {
        this.activeShift = false
    }



    let sel = document.getSelection()
    if (!sel) return

    /* 如果选中的是inline，则获取并设置 inline */
    let inline = global.getParentAttribute(this, sel.anchorNode, MainPanel.INLINE_ATTRIBUTE) as HTMLElement;
    if (inline) {
        let focusToEnd = false
        if (inline !== this.focusInline && sel.anchorOffset === inline.innerText.length) {
            focusToEnd = true
        }
        global.setFocusInline.bind(this, inline)()
        if (focusToEnd) {
            let range = new Range()
            range.setStart(inline.lastChild.firstChild, inline.lastChild.textContent.length)
            sel.removeAllRanges()
            sel.addRange(range)
        }
    } else if (
        // 相邻显示处理
        // todo inline相邻时候会出现多个inline-focus
        sel.anchorNode instanceof Text
        && sel.anchorOffset === sel.anchorNode.textContent.length
        && sel.anchorNode.nextSibling instanceof HTMLElement
        && sel.anchorNode.nextSibling.hasAttribute(MainPanel.INLINE_ATTRIBUTE)
    ) {
        global.setFocusInline.bind(this, sel.anchorNode.nextSibling)()
    } else {
        global.removeFocusInline.bind(this)()
    }
}