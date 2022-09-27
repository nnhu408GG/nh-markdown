import immediateEscape from "./immediateCompile"

const config = {
    /** 主要面板的className */
    CLASS_NAME: "nh-mrkEdit",

    /** block类型的标记 */
    BLOCK_ATTRIBUTE: "block",
    /** inline的标志 */
    INLINE_ATTRIBUTE: "inline",

    /** 区分component类型 */
    COMPONENT_TYPE: "mdtype",

    /** block区块支持inline的标志 */
    INLINE_SUPPORT: "inline-support",

    /** sign标记，因兼容多种语法生成同种ast，需要加以区分 */
    SIGN: "sign",
    /** 聚焦block类型的标记 */
    BLOCK_FOCUS: "block-focus",
    /** 聚焦inline类型的标记 */
    INLINE_FOCUS: "inline-focus",
}

export class nhMrk {
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




// 双分栏 SourcePreview,
