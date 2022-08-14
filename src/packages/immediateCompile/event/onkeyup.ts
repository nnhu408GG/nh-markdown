import immediateCompile from "..";
import * as global from "../global";
import * as globalInline from "../module_inline";
export default function (this: immediateCompile, e: KeyboardEvent) {
    let moduleELement = global.getModuleELement()
    if (!moduleELement) return
    // let latelyFirstELement = global.state.latelyFirstELement?
    // console.log("latelyFirstELement:", latelyFirstELement);

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

    // console.log("latelyFirstELement:", latelyFirstELement);

    // if (moduleELement.hasAttribute("inline")
    //     && (e.code === "ArrowLeft" || e.code === "ArrowRight")) {
    //     console.log("latelyFirstELement:", global.state.latelyFirstELement);
    //     globalInline.arrowHorizontal(moduleELement, e.code)
    // }

    // let mat = false
    // for (let mod in this.modules) {
    //     let _t = this.modules[mod].matchHTMLElement?.(moduleELement)
    //     if (_t && _t.focus) {
    //         this.classNameAddFocus(moduleELement)
    //         mat = true
    //         break
    //     }
    // }
    // if (!mat) {
    //     this.classNameRemoveFocus()
    // }
}