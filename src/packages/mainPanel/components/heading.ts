import MainPanel from "..";
import heading from "../../mdast/components/heading";
import { Component } from "../../types/mainPanel";
import { Heading } from "../../types/mdast";

import * as global from "../generator"

export default <Component>{
    type: heading.type,
    generator(ast: Heading): HTMLHeadingElement {
        let dom = document.createElement(`h${ast.depth}`) as HTMLHeadingElement
        dom.setAttribute(MainPanel.BLOCK_ATTRIBUTE, ast.type)
        global.generatorPhrasingContent(dom, ast.children)
        return dom
    },
}