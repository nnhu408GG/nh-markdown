import MainPanel from "."
import { Component } from "../types/mainPanel"

/** 冒泡寻找指定特征的父级 */
export function getParentAttribute(this: MainPanel, node: Node, targetAttribute: string): HTMLElement | void {
    if (node instanceof HTMLElement) {
        if (node === this.bindElement) {
            return
        } else if (node.hasAttribute(targetAttribute)) {
            return node
        }
    }
    return getParentAttribute.bind(this, node.parentElement, targetAttribute)()
}

export function setFocusBlock(this: MainPanel, el: HTMLElement) {
    if (this.focusBlock === el) return

    if (this.focusBlock) {
        this.focusBlock.classList.remove(MainPanel.BLOCK_FOCUS)
    }

    this.focusBlock = el
    this.focusBlock.classList.add(MainPanel.BLOCK_FOCUS)
}

export function setFocusInline(this: MainPanel, el: HTMLElement) {
    if (this.focusInline === el) return

    if (this.focusInline) {
        this.focusInline.classList.remove(MainPanel.INLINE_FOCUS)
    }

    this.focusInline = el
    this.focusInline.classList.add(MainPanel.INLINE_FOCUS)
}

export function removeFocusInline(this: MainPanel) {
    if (!this.focusInline) return
    this.focusInline.classList.remove(MainPanel.INLINE_FOCUS)
    this.focusInline = undefined
}

export function getComponent(this: MainPanel, el: HTMLElement): Component {
    let type = el.getAttribute(MainPanel.COMPONENT_TYPE)
    return MainPanel.COMPONENTS_FLOWCONTENT.find(item => item.type === type)
}