import MainPanel from "..";
import blockquote from "../../mdast/components/blockquote";
import heading from "../../mdast/components/heading";
import { Component } from "../../types/mainPanel";
import { Blockquote, Heading } from "../../types/mdast";

import * as global from "../globale"

export default <Component>{
    type: heading.type,
    generator(ast: Heading): HTMLHeadingElement {
        let dom = document.createElement(`h${ast.depth}`) as HTMLHeadingElement
        dom.setAttribute(MainPanel.BLOCK_ATTRIBUTE, ast.type)
        // global.generatorFlowContent(dom, ast.children)
        global.generatorPhrasingContent(dom, ast.children)
        return dom
    },
}