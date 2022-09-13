import immediateCompile from "..";
import * as global from "../global";
import * as globalInline from "../module_inline";
export default function (this: immediateCompile, e: KeyboardEvent) {
    let moduleELement = global.getModuleELement()
    if (!moduleELement) return

    global.classNameAddFocus(moduleELement, e.code)

    if (e.key === "Meta") {
        global.state.ACTIVE_META = false
    }


    if (global.state.tempParagraph) {
        if (global.state.tempParagraph.childNodes.length !== 0) {
            global.state.tempParagraph = undefined
        }
        else if (global.state.tempParagraph !== global.state.latelyFirstELement) {
            global.state.tempParagraph.remove()
            global.state.tempParagraph = undefined
        }
    }

}