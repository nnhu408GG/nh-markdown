import { Module, Text } from "../../types/mdast";

export default <Module>{
    type: "text",
    build(opt: { value: string }) {
        return <Text>{ type: this.type, value: opt.value }
    },
}