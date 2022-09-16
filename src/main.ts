import './style.less'
// import "./agate.css"
import "./xcode.css"

// import nhMrk from './packages'
import md from "./assets/test.md?raw" // vite 引入纯文本的方式
// import md from "../开发需求.md?raw" // vite 引入纯文本的方式
// import md from "../mdast.md?raw" // vite 引入纯文本的方式
import Mdast from './packages/mdast';
import MainPanel from './packages/mainPanel';

const app = document.querySelector<HTMLDivElement>('#app')!;

const dom = document.createElement("div")
app.append(dom)



// let wys = new nhMrk.wys(dom)



// console.time()
let ast = Mdast.Parser(md)
// console.timeEnd()
// ast.forEach(item => console.log(item))
// console.log("");


let panel = new MainPanel(dom)
panel.generator(ast)
// let ast2 = panel.compiler()
// ast2.forEach(item => console.log(item))

// console.log(JSON.stringify(ast) === JSON.stringify(ast2));

// let data = `嗯~~\`嗯~~**嗯嗯\n嗯嗯****\`**`
// let data = "EEE\n~~AAAEE"
// parser.processInline(data)



// let Text = document.createTextNode(data)
// setTimeout(() => {
//     //     dom.firstElementChild.append(Text)
//     dom.firstElementChild.innerHTML = data
// }, 1000);

