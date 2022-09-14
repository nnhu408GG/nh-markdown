import MainPanel from "..";
import { Component } from "../../types/mainPanel";
import { Paragraph } from "../../types/mdast";
import { complierInline } from "../compiler";
import { generatorPhrasingContent } from "../generator";

export default <Component>{
    type: "paragraph",
    generator(ast: Paragraph) {
        let dom = document.createElement("p")
        dom.setAttribute(MainPanel.BLOCK_ATTRIBUTE, ast.type)
        dom.setAttribute(MainPanel.INLINE_SUPPORT, "")
        ast.children && generatorPhrasingContent(dom, ast.children)
        return dom
    },
    complier(el) {
        if (el.childNodes.length) {
            let children = complierInline(el)
            return <Paragraph>{ type: this.type, children }
        } else {
            return <Paragraph>{ type: this.type }
        }
    },
}