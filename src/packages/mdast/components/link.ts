import { Module, Link } from "../../types/mdast";

export default <Module>{
    type: "link",
    build(opt: { label: string, url: string }) {
        return <Link>{ type: this.type, label: opt.label, url: opt.url }
    },
}