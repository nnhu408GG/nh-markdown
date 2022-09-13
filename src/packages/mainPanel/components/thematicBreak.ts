import MainPanel from "..";
import thematicBreak from "../../mdast/components/thematicBreak";
import { Component } from "../../types/mainPanel";
import { ThematicBreak } from "../../types/mdast";

export default <Component>{
    type: thematicBreak.type,
    generator(ast: ThematicBreak): HTMLElement {
        let dom = document.createElement("div")
        dom.setAttribute(MainPanel.BLOCK_ATTRIBUTE, ast.type)
        dom.setAttribute(MainPanel.SIGN, ast.sign)
        dom.contentEditable = "false"
        let hr = document.createElement("hr")
        dom.append(hr)
        return dom
    }
}

// generator(ast: ThematicBreak): HTMLHRElement {
// let dom = document.createElement("hr")
// dom.setAttribute(MainPanel.BLOCK_ATTRIBUTE, ast.type)
// dom.setAttribute(MainPanel.SIGN, ast.sign)
// dom.contentEditable = "false"