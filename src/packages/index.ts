import immediateEscape from "./immediateCompile"

// type wysMode = "Edit" | "Source" | "Preview" | "SourcePreview";

type wysMode = "Edit" | "Source" | "Preview";
class wys {
    #BINDELEMENT?: HTMLElement
    #mode: wysMode
    #sourceData: string = ""

    constructor(mode: wysMode = "Edit") {
        this.#mode = mode
    }

    /** @description 所有操作之前都需要先绑定元素 */
    bind(el: HTMLElement) {
        this.#BINDELEMENT = el
        this.#switchMode()
        return this
    }

    #isBind(): boolean {
        if (!this.#BINDELEMENT) {
            console.error("You have no bound the element yet! (initSourceData)")
            return false
        }
        return true
    }

    /** 初始化内容 */
    set initSourceData(source: string) {
        if (!this.#isBind()) return
        this.#sourceData = source
        this.#switchMode()
    }

    /** 切换模式 */
    set setwysMode(mode: wysMode) {
        if (!this.#isBind()) return
        this.#sourceData = this.getSource()!
        this.#switchMode()
    }

    getSource(): string | void {
        if (!this.#isBind()) return
        // todo
    }

    #switchMode() {
        if (!this.#BINDELEMENT) {
            console.error("You have no bound the element yet! (#switchMode)")
            return
        }
        switch (this.#mode) {
            case "Edit":
                let func = new immediateEscape(this.#BINDELEMENT, this.#sourceData)
                this.getSource = func.getSource.bind(func)
                break;
            case "Preview":
                break;
            case "Source":
                break;
            default:
                console.error(`mode '${this.#mode}' is undefined!`)
        }
    }
}

export default {
    /** 
     * @param mode Edit / Source / Preview
     * @default 
     * mode = "Edit"
     * @example
     * new nhMrk.wys().bind(dom)
     */
    wys,

    // 双分栏 SourcePreview,
}