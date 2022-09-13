import { Module, Delete, PhrasingContent } from "../../types/mdast";

export default <Module>{
    type: "delete",
    build(opt: { value: PhrasingContent[] }) {
        return <Delete>{ type: this.type, value: opt.value }
    },
}