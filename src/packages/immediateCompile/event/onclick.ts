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
    // console.log("onClick:", moduleELement.childNodes);
    // console.log("onClick:", e.target, window.getComputedStyle(e.target as Element).display);
    // console.log(`className:'${moduleELement?.className}'`);
    // console.log(moduleELement?.className === "");

    // console.log("bindElement.onclick, moduleELement is ", moduleELement);
}