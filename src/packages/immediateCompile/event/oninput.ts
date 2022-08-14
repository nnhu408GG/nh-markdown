import immediateCompile from "..";
import * as global from "../global";
import * as globalInline from "../module_inline";

import module_paragraph from "../module_block/paragraph";
export default function (this: immediateCompile, e: Event) {
    // console.log("INPUT_EVENT");

    let moduleELement = global.getModuleELement()
    if (!moduleELement) return
    // todo 这里阻止进一步的处理
    // todo 挤出空行

    // 防止重复执行？？？
    // if (global.classNameAddFocus(moduleELement)) return
    global.classNameAddFocus(moduleELement)

    let basics = { moduleELement, e }
    let mdtype = moduleELement.getAttribute(global.state.MODULE_ATTRIBUTE_SIGN)

    for (let mod of global.state.MODULE) {
        if (mdtype === module_paragraph.mdtype) {
            if (mod.upgradeInParagraph?.(moduleELement)) break
        } else if (mdtype === mod.mdtype) {
            global.iteratorModule(basics, "inputEvent_Unlimited")
            break
        }
    }

    globalInline.getInlineStruct_textContent(moduleELement)

    // let event = e as InputEvent
    // console.log(event);


    // if (event.inputType === "insertParagraph") {
    //     let sel = document.getSelection()!
    //     console.log("sel.anchorNode:", sel.anchorNode);
    //     let node = sel.anchorNode! as HTMLElement
    //     node.parentElement!.querySelectorAll("br")?.forEach(item => item.remove())


    // }


}
