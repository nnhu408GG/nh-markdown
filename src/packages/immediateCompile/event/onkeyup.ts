import immediateCompile from "..";
import * as global from "../global";
export default function (this: immediateCompile, e: KeyboardEvent) {
    let moduleELement = global.getModuleELement()
    if (!moduleELement) return
    global.classNameAddFocus(moduleELement)

    if (e.key === "Meta") {
        global.state.ACTIVE_META = false
    }

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