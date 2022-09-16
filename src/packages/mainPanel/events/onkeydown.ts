import MainPanel from "..";
import { ComponentBlock } from "../../types/mainPanel";
import * as global from "../global"

export default function (this: MainPanel, e: KeyboardEvent) {
    console.log(e.key);

    /* 持续按压的键 */
    if (e.key === "Meta") {
        this.activeMeta = true
    }
    if (e.key === "Control") {
        this.activeCtrl = true
    }
    if (e.key === "Alt") {
        this.activeAlt = true
    }
    if (e.key === "Shift") {
        this.activeShift = true
    }


    if (this.activeShift) {
        if (e.key === "Enter") {
            // if()
            return
        }
    }


    let sel = document.getSelection()!

    /* 获取并设置 block */
    let block = global.getParentAttribute(this, sel.anchorNode, MainPanel.BLOCK_ATTRIBUTE) as HTMLElement
    global.setFocusBlock(this, block)

    /* 如果选中的是inline，则获取并设置 inline */
    let inline = global.getParentAttribute(this, sel.anchorNode, MainPanel.INLINE_ATTRIBUTE) as HTMLElement;
    if (inline) {
        global.addFocusInline(this, inline)
    }
    // console.log(block, inline);





    let mod = global.getComponent(block)

    if (e.key === "Backspace") {
        mod?.backspace(this, e, block)
    }
    if (e.key === "Enter") {

        mod?.enter(this, e, block)
    }
}