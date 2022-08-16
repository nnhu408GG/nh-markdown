import immediateCompile from "..";
import * as global from "../global"
import * as globalInline from "../module_inline"

export default function (this: immediateCompile, e: ClipboardEvent) {

    /** todo
     * 多行粘贴文本进行源码直译
     * 判断属区 code table ul ol BIND_ELEMENT 等情况
     */
    console.log("IS_PASTEEVENT");
    e.preventDefault()

    let sel = document.getSelection()
    // console.log(sel);
    let range = sel?.getRangeAt(0)
    // console.log("collapsed:", range?.collapsed);
    if (!range?.collapsed) {
        console.log("range:", range);
        console.log("commonAncestorContainer:", range?.commonAncestorContainer);
        if (range?.commonAncestorContainer === global.state.BIND_ELEMENT) {
        }
    }

    // let moduleElement = global.getModuleELement(e.target as HTMLElement)
    // navigator.clipboard.readText().then(eventClip => {
    //     let data = eventClip.replaceAll(" ", "\u00A0")
    //     let textNode = document.createTextNode(data)
    //     let range = document.getSelection()?.getRangeAt(0)
    //     range?.insertNode(textNode)
    //     range?.collapse()
    //     moduleElement && globalInline.handleInline(moduleElement)
    // })
}