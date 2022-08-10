// import type { Module } from "../types"
import * as global from "../global"
import { Module } from "../types"
// import paragraph from "./paragraph"
export default <Module>{
    mdtype: "strong",
    // keycodeSign: ["**", "__"],

    // focusEvent(el) {
    //     console.log("strong focusEvent");
    // },

    // 遍历所有的textNode，找出所有匹配的区间，并作处理
    // upgradeInKeyup() {
    //     let sel = document.getSelection()
    //     if (sel) {
    //         // let node = sel.anchorNode?.parentElement
    //         // console.log("<strong>1:", node);
    //         // console.log("<strong>2:", sel.anchorNode);
    //         // console.log("<strong>3:", sel.anchorNode?.parentElement);
    //         // for (let node in sel.anchorNode?.parentElement!.childNodes!) {
    //         // console.log(node);
    //         // }
    //         // console.log();

    //         // 从前往后遍历textNode
    //         // for(let index = 0; index < sel.anchorNode?.parentElement!.childNodes!.length!; index++)

    //         // let pair: any = []
    //         let pair: any = {}
    //         for (let i = 0; i < this.keycodeSign.length; i++) {
    //             pair[this.keycodeSign[i]] = false
    //         }
    //         console.log("pair:", pair);

    //         let childNodes = sel.anchorNode?.parentElement?.childNodes!
    //         for (let index = 0; index < childNodes.length!; index++) {
    //             let node = childNodes[index]
    //             if (node instanceof Text) {
    //                 node.textContent
    //             }
    //         }


    //     }
    // },

}