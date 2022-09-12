import type { FlowContent, ModuleBlock, ParserInterface, ParserState } from "./types"
import _processInline from "./processInline"

import image from "./components/image"
import thematicBreak from "./components/thematicBreak"
import heading from "./components/heading"
import code from "./components/code"
import blockquote from "./components/blockquote"
import orderList from "./components/orderList"
import unorderList from "./components/unorderList"
import table from "./components/table"
import paragraph from "./components/paragraph"

export default class Mdast {
    private constructor() { }
    private static parser: Parser
    public static getParser(data: string) {
        if (!this.parser) {
            this.parser = new Parser()
        }
        let list = data.split("\n")
        return Mdast.parser.process(list)
        // return Mdast.parser
    }
}

class Parser implements ParserInterface {
    block: ModuleBlock[]
    constructor() {
        // 为inline和block添加模块
        this.block = [thematicBreak, heading, image, code, blockquote, orderList, unorderList, table]
    }

    public getModuleType(data: string) {
        let res = { type: paragraph.type, mat: null }
        for (let { type, regexp } of this.block) {
            let mat = regexp.exec(data)
            if (mat) {
                res.mat = mat
                res.type = type
                break
            }
        }
        return res
    }

    public process(list: string[]): FlowContent[] {
        let tempRes = <(FlowContent | string)[]>[]
        let state = <ParserState>{
            list: list,
            index: 0,
            mat: null,
            parser: this,
            type: ""
        }
        while (state.index < list.length) {
            let { type, mat } = this.getModuleType(list[state.index])
            state.type = type
            state.mat = mat

            for (let mod of this.block) {
                if (mod.type === type) {
                    let sub = mod.build(state)
                    sub && tempRes.push(sub)
                    break
                }
            }

            if (state.type === paragraph.type) {
                tempRes.push(list[state.index])
            }

            state.index++
        }

        paragraph.build(tempRes)

        return tempRes as FlowContent[]
    }

}









