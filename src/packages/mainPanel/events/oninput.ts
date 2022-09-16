import MainPanel from "..";

import * as global from "../global"

export default function (this: MainPanel, e: InputEvent) {
    // console.log(e, e.inputType);

    let sel = document.getSelection()
    let block = global.getParentAttribute(this, sel.anchorNode, MainPanel.BLOCK_ATTRIBUTE) as HTMLElement
    if (e.inputType !== "insertCompositionText") {
        global.resetInline(this, block)
    }

}