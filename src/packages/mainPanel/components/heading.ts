import MainPanel from "..";
import heading from "../../mdast/components/heading";
import { Component } from "../../types/mainPanel";
import { Heading } from "../../types/mdast";
import { complierInline } from "../compiler";

import * as global from "../generator"

export default <Component>{
    type: heading.type,
    generator(ast: Heading): HTMLHeadingElement {
        let dom = document.createElement(`h${ast.depth}`) as HTMLHeadingElement
        dom.setAttribute(MainPanel.COMPONENT_TYPE, ast.type)
        dom.setAttribute(MainPanel.BLOCK_ATTRIBUTE, "")
        dom.setAttribute(MainPanel.INLINE_SUPPORT, "")
        global.generatorPhrasingContent(dom, ast.children)
        return dom
    },
    complier(el) {
        let depth = parseInt(el.tagName.slice(1))
        let children = complierInline(el)
        return <Heading>{ type: this.type, depth, children }
    },
}