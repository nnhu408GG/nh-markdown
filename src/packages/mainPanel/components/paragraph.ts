import MainPanel from "..";
import { Component } from "../../types/mainPanel";
import { Paragraph } from "../../types/mdast";
import { generatorPhrasingContent } from "../generator";

export default <Component>{
    type: "paragraph",
    generator(ast: Paragraph) {
        let dom = document.createElement("p")
        dom.setAttribute(MainPanel.BLOCK_ATTRIBUTE, ast.type)
        ast.children && generatorPhrasingContent(dom, ast.children)
        return dom
    },
}