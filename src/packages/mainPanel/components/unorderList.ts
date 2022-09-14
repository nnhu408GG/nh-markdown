import MainPanel from "..";
import { Component } from "../../types/mainPanel";
import { UnorderList } from "../../types/mdast";
import { generatorFlowContent } from "../generator";

export default <Component>{
    type: "unorderList",
    generator(ast: UnorderList) {
        let dom = document.createElement("ul")
        dom.setAttribute(MainPanel.BLOCK_ATTRIBUTE, ast.type)
        dom.setAttribute(MainPanel.SIGN, ast.sign)
        ast.children.forEach(item => {
            let li = document.createElement("li")
            generatorFlowContent(li, item)
            dom.append(li)
        })
        return dom
    },
}