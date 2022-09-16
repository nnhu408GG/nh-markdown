import MainPanel from "..";
import { ComponentBlock } from "../../types/mainPanel";
import { Image } from "../../types/mdast";

export default <ComponentBlock>{
    type: "image",
    generator(ast: Image) {
        let dom = document.createElement("div")
        dom.setAttribute(MainPanel.COMPONENT_TYPE, ast.type)
        dom.setAttribute(MainPanel.BLOCK_ATTRIBUTE, "")
        dom.contentEditable = "false"

        let img = document.createElement("img")
        img.src = ast.url
        img.alt = ast.label
        img.title = ast.label
        dom.append(img)

        let params = document.createElement("div")
        params.classList.add("params")
        dom.append(params)

        let container = document.createElement("div")
        container.classList.add("container")
        params.append(container)

        let labelA = document.createElement("div")
        let labelB = document.createElement("div")
        labelA.classList.add("label")
        labelB.classList.add("label")
        labelA.append("label")
        labelB.append("url")
        let valueA = document.createElement("div")
        let valueB = document.createElement("div")
        valueA.classList.add("value")
        valueB.classList.add("value")
        valueA.contentEditable = "true"
        valueB.contentEditable = "true"
        valueA.spellcheck = false
        valueB.spellcheck = false
        valueA.append(ast.label)
        valueB.append(ast.url)

        container.append(labelA)
        container.append(valueA)
        container.append(labelB)
        container.append(valueB)

        return dom
    },
    complier(el) {
        let img = el.firstElementChild as HTMLImageElement
        let label = img.alt
        let url = img.src
        return <Image>{ type: this.type, label, url }
    },
    backspace(el) {
        
    },
}