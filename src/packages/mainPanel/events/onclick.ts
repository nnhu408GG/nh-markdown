import MainPanel from "..";
import image from "../components/image";
import thematicBreak from "../components/thematicBreak";
import * as global from "../global"

export default function (this: MainPanel, e: MouseEvent) {
    let eventTarget = e.target as HTMLElement
    let sel = document.getSelection()!

    /* 获取并设置 block */
    let block = global.getParentAttribute(this, eventTarget, MainPanel.BLOCK_ATTRIBUTE)
        || global.getParentAttribute(this, sel.anchorNode, MainPanel.BLOCK_ATTRIBUTE) as HTMLElement;
    global.setFocusBlock(this, block);

    /* 选中 image、thematicBreak 时，若光标不在此内，则移除光标 */
    let component = global.getComponent(block)
    if ([image.type, thematicBreak.type].includes(component.type)) {
        if (sel.anchorNode) {
            let _block = global.getParentAttribute(this, sel.anchorNode, MainPanel.BLOCK_ATTRIBUTE)
            if (_block !== block) {
                sel.removeAllRanges()
            }
        }
    }

    global.autoSetInlineFocus(this)
}
