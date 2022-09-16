import MainPanel from "..";
import _processInline from "../../mdast/processInline";

import * as global from "../global"

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

    global.autoSetInlineFocus(this)
}