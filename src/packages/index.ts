import immediateEscape from "./immediateCompile"


class wys {
    #BINDELEMENT?: HTMLElement
    #sourceData: string = ""
    #obj: immediateEscape

    constructor(bindElement: HTMLElement) {
        if (!bindElement) {
            console.error("You have no bound the element yet! (initSourceData)")
        }
        this.#BINDELEMENT = bindElement
        this.#obj = new immediateEscape(this.#BINDELEMENT, this.#sourceData)
    }

    set source(data: string) {
        this.#obj.source = data
    }

    get source() {
        return this.#obj.source
    }


    /** 切换模式 */
    // set setwysMode(mode: "edit" | "source") {
    //     // this.#sourceData = this.getSource()!
    //     // this.#switchMode()
    // }

    // #switchMode() {
    //     if (!this.#BINDELEMENT) {
    //         console.error("You have no bound the element yet! (#switchMode)")
    //         return
    //     }
    //     switch (this.#mode) {
    //         case "edit":
    //             let func = new immediateEscape(this.#BINDELEMENT, this.#sourceData)
    //             this.getSource = func.getSource.bind(func)
    //             break;
    //         case "source":
    //             break;
    //         default:
    //             console.error(`mode '${this.#mode}' is undefined!`)
    //     }
    // }
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