import immediateCompile from "..";
import { getModuleELement, iteratorModule, state, classNameAddFocus } from "../global";
import module_paragraph from "../module_block/paragraph";
export default function (this: immediateCompile, e: Event) {
    let moduleELement = getModuleELement()
    if (!moduleELement) return
    // todo 这里阻止进一步的处理
    // todo 挤出空行
    if (classNameAddFocus(moduleELement)) return

    let basics = { moduleELement, e }
    let mdtype = moduleELement.getAttribute(state.MODULE_ATTRIBUTE_SIGN)

    for (let mod of state.MODULE) {
        if (mdtype === module_paragraph.mdtype) {
            if (mod.upgradeInParagraph?.(moduleELement)) break
        } else if (mdtype === mod.mdtype) {
            iteratorModule(basics, "inputEvent_Unlimited")
            break
        }
    }

    // let event = e as InputEvent
    // console.log(event);


    // if (event.inputType === "insertParagraph") {
    //     let sel = document.getSelection()!
    //     console.log("sel.anchorNode:", sel.anchorNode);
    //     let node = sel.anchorNode! as HTMLElement
    //     node.parentElement!.querySelectorAll("br")?.forEach(item => item.remove())


    // }


}
