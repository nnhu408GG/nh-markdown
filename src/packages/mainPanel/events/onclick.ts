import MainPanel from "..";
import { Component } from "../../types/mainPanel";
import image from "../components/image";
import thematicBreak from "../components/thematicBreak";
import * as global from "../global"

export default function (this: MainPanel, e: MouseEvent) {
    let eventTarget = e.target as HTMLElement
    let sel = document.getSelection()!

    /* 获取并设置 block */
    let block = global.getParentAttribute(this, eventTarget, MainPanel.BLOCK_ATTRIBUTE)
        || global.getParentAttribute(this, sel.anchorNode, MainPanel.BLOCK_ATTRIBUTE) as HTMLElement;
    global.setFocusBlock(this, block);

    /* 选中 image、thematicBreak 时，若光标不在此内，则移除光标 */
    let component = global.getComponent(block)
    // console.log(component);
    if ([image.type, thematicBreak.type].includes(component.type)) {
        if (sel.anchorNode) {
            let _block = global.getParentAttribute(this, sel.anchorNode, MainPanel.BLOCK_ATTRIBUTE)
            if (_block !== block) {
                sel.removeAllRanges()
            }
        }
    }

    if (!sel.anchorNode) {
        this.focusInline && global.removeFocusInline(this)
        return
    }

    /* 如果选中的是inline，则获取并设置 inline */
    let inline = global.getParentAttribute(this, sel.anchorNode, MainPanel.INLINE_ATTRIBUTE) as HTMLElement;
    if (inline) {
        let focusToEnd = false
        if (inline !== this.focusInline && sel.anchorOffset === inline.innerText.length) {
            focusToEnd = true
        }
        global.setFocusInline(this, inline)
        if (focusToEnd) {
            let range = new Range()
            range.setStart(inline.lastChild.firstChild, inline.lastChild.textContent.length)
            sel.removeAllRanges()
            sel.addRange(range)
        }
    } else if (
        sel.anchorNode instanceof Text
        && sel.anchorOffset === sel.anchorNode.textContent.length
        && sel.anchorNode.nextSibling instanceof HTMLElement
        && sel.anchorNode.nextSibling.hasAttribute(MainPanel.INLINE_ATTRIBUTE)
    ) {
        global.setFocusInline(this, sel.anchorNode.nextSibling)
    } else {
        global.removeFocusInline(this)
    }







}
