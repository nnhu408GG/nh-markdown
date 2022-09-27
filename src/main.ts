import './style.less'
// import "./agate.css"
import "./xcode.css"

import { nhMrk } from './packages'
import md from "./assets/test.md?raw" // vite 引入纯文本的方式
// import md from "./assets/简历.md?raw" // vite 引入纯文本的方式
// import md from "../开发需求.md?raw" // vite 引入纯文本的方式
// import md from "../mdast.md?raw" // vite 引入纯文本的方式
import Mdast from './packages/mdast';
import MainPanel from './packages/mainPanel';

const app = document.querySelector<HTMLDivElement>('#app')!;

const dom = document.createElement("div")
app.append(dom)

// let wys = new nhMrk(dom)



let ast = Mdast.Parser(md)
let panel = new MainPanel(dom)
panel.generator(ast)

