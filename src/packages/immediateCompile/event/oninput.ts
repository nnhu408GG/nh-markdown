import immediateCompile from "..";
import * as global from "../global";
import * as globalInline from "../module_inline";

import module_paragraph from "../components/paragraph";
import table from "../components/table";
import paragraph from "../components/paragraph";
import title from "../components/title";
export default function (this: immediateCompile, e: Event) {

    let moduleELement = global.getModuleELement()
    if (!moduleELement) return
    // todo 这里阻止进一步的处理
    // todo 挤出空行

    // 防止重复执行？？？
    // if (global.classNameAddFocus(moduleELement)) return
    global.classNameAddFocus(moduleELement)

    let basics = { moduleELement, e }
    let mdtype = moduleELement.getAttribute(global.SIGN.MODULE_ATTRIBUTE)!

    for (let mod of global.state.MODULE) {
        if (mdtype === module_paragraph.mdtype) {
            if (mod.upgradeInParagraph?.(moduleELement)) return
        } else if (mdtype === mod.mdtype) {

            global.iteratorModule(basics, "inputEventUnlimited")
            break
        }
    }

    // if ([table.mdtype, paragraph.mdtype, title.mdtype].includes(mdtype) || moduleELement.hasAttribute("inline")) {
    //     globalInline.handleInline(moduleELement)
    // }

    // let event = e as InputEvent
    // console.log(event);


    // if (event.inputType === "insertParagraph") {
    //     let sel = document.getSelection()!
    //     console.log("sel.anchorNode:", sel.anchorNode);
    //     let node = sel.anchorNode! as HTMLElement
    //     node.parentElement!.querySelectorAll("br")?.forEach(item => item.remove())


    // }


}
