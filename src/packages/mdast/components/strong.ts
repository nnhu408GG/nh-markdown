import { Module, PhrasingContent, Strong } from "../../types/mdast";

export default <Module>{
    type: "strong",
    build(opt: { sign: string, value: PhrasingContent[] }) {
        return <Strong>{ type: this.type, sign: opt.sign, value: opt.value }
    },
}