import type { Image, ModuleBlock } from "../../types/mdast"
export default <ModuleBlock>{
  type: "image",
  // regexp: /^\!\[(.+)\]\((.+)\)$/,
  regexp: /^\!\[(.+)\]\((.+)\)$/,
  build(state): Image {
    let res = <Image>{
      type: this.type,
      label: state.mat[1],
      url: state.mat[2],
    }
    return res
  }
}
