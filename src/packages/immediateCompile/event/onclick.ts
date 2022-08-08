import immediateCompile from "..";
import { state, getModuleELement, classNameAddFocus } from "../global";
import image from "../module_block/image";

export default function (this: immediateCompile, e: Event) {
    let moduleELement = getModuleELement(e.target as Node)
    if (!moduleELement) return
    classNameAddFocus(moduleELement)
    console.log("onClick:", moduleELement);

    if (moduleELement.getAttribute(state.MODULE_ATTRIBUTE_SIGN) === image.mdtype) {
        image.focusEvent(moduleELement)
    }
    // console.log("onClick:", moduleELement.childNodes);
    // console.log("onClick:", e.target, window.getComputedStyle(e.target as Element).display);
    // console.log(`className:'${moduleELement?.className}'`);
    // console.log(moduleELement?.className === "");

    // console.log("bindElement.onclick, moduleELement is ", moduleELement);
}