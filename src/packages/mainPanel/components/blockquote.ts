import MainPanel from "..";
import blockquote from "../../mdast/components/blockquote";
import { Component } from "../../types/mainPanel";
import { Blockquote } from "../../types/mdast";

import * as global from "../generator"

export default <Component>{
    type: blockquote.type,
    generator(ast: Blockquote): HTMLQuoteElement {
        let dom = document.createElement("blockquote")
        dom.setAttribute(MainPanel.BLOCK_ATTRIBUTE, ast.type)
        global.generatorFlowContent(dom, ast.children)
        return dom
    },
}