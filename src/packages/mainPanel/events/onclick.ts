import MainPanel from "..";
import { Component } from "../../types/mainPanel";
import image from "../components/image";
import thematicBreak from "../components/thematicBreak";
import * as global from "../global"

export default function (this: MainPanel, e: MouseEvent) {
    let eventTarget = e.target as HTMLElement
    // console.log(eventTarget);

    let sel = document.getSelection()!

    let block = global.getParentAttribute.bind(this, eventTarget, MainPanel.BLOCK_ATTRIBUTE)();
    if (!block) {
        block = global.getParentAttribute.bind(this, sel.anchorNode, MainPanel.BLOCK_ATTRIBUTE)()
    }

    // console.log("block:", block);
    global.setFocusBlock.bind(this, block)()

    let inline = global.getParentAttribute.bind(this, eventTarget, MainPanel.INLINE_ATTRIBUTE)();
    // console.log("inline:", inline);

    if (inline) {
        global.setFocusInline.bind(this, inline)()
    } else {
        global.removeFocusInline.bind(this)()
    }



    let component = global.getComponent.bind(this, block)() as Component
    // console.log(component);
    if ([image.type, thematicBreak.type].includes(component.type)) {
        let _block = global.getParentAttribute.bind(this, sel.anchorNode, MainPanel.BLOCK_ATTRIBUTE)()
        if (_block !== block) {
            sel.removeAllRanges()
        }
    }




}
