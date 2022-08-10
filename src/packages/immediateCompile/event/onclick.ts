import immediateCompile from "..";
import * as global from "../global";
import image from "../module_block/image";

export default function (this: immediateCompile, e: Event) {
    let moduleELement = global.getModuleELement(e.target as Node)
    if (!moduleELement) return
    global.classNameAddFocus(moduleELement)
    console.log("onClick:", moduleELement);

    if (moduleELement.getAttribute(global.state.MODULE_ATTRIBUTE_SIGN) === image.mdtype) {
        if (!(e.target as HTMLElement).classList.contains("label")) {
            image.focusEvent(moduleELement)
        }
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