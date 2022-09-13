import { Module, PhrasingContent, InlineCode } from "../../types/mdast";

export default <Module>{
    type: "inlineCode",
    build(opt: { value: PhrasingContent[] }) {
        return <InlineCode>{ type: this.type, value: opt.value }
    },
}