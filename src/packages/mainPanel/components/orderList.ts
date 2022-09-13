import MainPanel from "..";
import { Component } from "../../types/mainPanel";
import { OrderList } from "../../types/mdast";
import { generatorFlowContent } from "../globale";

export default <Component>{
    type: "orderList",
    generator(ast: OrderList) {
        let dom = document.createElement("ol")
        dom.setAttribute(MainPanel.BLOCK_ATTRIBUTE, ast.type)
        dom.start = ast.start
        ast.children.forEach(item => {
            let li = document.createElement("li")
            generatorFlowContent(li, item)
            dom.append(li)
        })
        return dom
    },
}