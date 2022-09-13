import { Module, Break } from "../../types/mdast";

export default <Module>{
    type: "break",
    build() {
        return <Break>{ type: this.type }
    },
}