import type { Image, ModuleBlock } from "../types"
export default <ModuleBlock>{
  type: "image",
  // regexp: /^\!\[(.+)\]\((.+)\)$/,
  regexp: /^\!\[(.+)\]\((.+)\)(\s"(.*)")?$/,
  build(state): Image {
    let res = <Image>{
      type: this.type,
      alt: state.mat[1],
      url: state.mat[2],
    }
    state.mat[4] && (res.title = state.mat[4])
    return res
  }
}
