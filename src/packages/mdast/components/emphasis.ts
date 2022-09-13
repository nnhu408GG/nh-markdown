import { Module, Emphasis, PhrasingContent } from "../../types/mdast";

export default <Module>{
    type: "emphasis",
    build(opt: {
        sign: string,
        value: PhrasingContent[]
    }) {
        return <Emphasis>{ type: this.type, value: opt.value, sign: opt.sign }
    },
}