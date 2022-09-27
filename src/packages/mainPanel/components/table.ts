import MainPanel from "..";
import table from "../../mdast/components/table";
import { generatorPhrasingContentVnode, render } from "../../render";
import { ComponentBlock } from "../../types/mainPanel";
import { PhrasingContent, Table } from "../../types/mdast";
import { VNode } from "../../types/render";
import { complierInline } from "../compiler";

export default <ComponentBlock>{
    type: table.type,
    isInlineSupport: true,
    generator(ast: Table) {
        let tableTool: VNode = {
            type: "div",
            prop: { class: "toolContainer" },
            children: [
                {
                    type: "span",
                    children: [
                        {
                            type: "button",
                            prop: { ariaLabel: "调整表格" },
                            children: "调整表格",
                        },
                    ],
                },
                {
                    type: "span",
                    children: [
                        {
                            type: "button",
                            prop: { ariaLabel: "左对齐" },
                            children: "左对齐",
                        },
                        {
                            type: "button",
                            prop: { ariaLabel: "居中对齐" },
                            children: "居中对齐",
                        },
                        {
                            type: "button",
                            prop: { ariaLabel: "右对齐" },
                            children: "右对齐",
                        },
                    ],
                },
                {
                    type: "span",
                    children: [
                        {
                            type: "button",
                            prop: { ariaLabel: "删除表格" },
                            children: "删除表格",
                        },
                    ],
                },
            ],
        };

        let tbodyChildren = ast.children.map(
            (item) =>
                <VNode>{
                    type: "tr",
                    children: item.map((sub, index) => {
                        return <VNode>{
                            type: "th",
                            prop: {
                                [MainPanel.INLINE_SUPPORT]: "",
                                style: `text-align: ${ast.align[index]}`,
                            },
                            children: generatorPhrasingContentVnode(sub),
                        };
                    }),
                }
        );

        let table = <VNode>{
            type: "table",
            children: [
                {
                    type: "tbody",
                    prop: { contenteditable: true },
                    children: tbodyChildren,
                },
            ],
        };

        return {
            type: "figure",
            prop: {
                [MainPanel.COMPONENT_TYPE]: ast.type,
                [MainPanel.BLOCK_ATTRIBUTE]: "",
                contenteditable: false,
            },
            children: [tableTool, table],
        };
    },

    complier(el) {
        let children = <PhrasingContent[][][]>[];

        let tbody = el.lastElementChild.lastElementChild as HTMLTableSectionElement;
        for (let i = 0; i < tbody.children.length; i++) {
            let tr = tbody.children.item(i);
            let tbodyAst = <PhrasingContent[][]>[];
            for (let j = 0; j < tr.children.length; j++) {
                let th = tr.children.item(j);
                tbodyAst.push(complierInline(th));
            }
            children.push(tbodyAst);
        }

        let align = [];
        for (let i = 0; i < tbody.children[0].children.length; i++) {
            let th = tbody.children[0].children[i] as HTMLTableCellElement;
            align.push(th.style.textAlign);
        }

        return <Table>{ type: this.type, align, children };
    },

    backspace(el) { },
    enter(state, event, el) { },
};
