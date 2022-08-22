export default function (data: string) {
    let datalist = data.split("\n")
    let res = run(datalist)
    // res.forEach(item => console.log("res:", item))
    return res
}


/**
 * paragraph
 * - hr
 * - image
 * - head
 * unordered-list   合并
 * ordered-list     合并
 * quote            合并
 * table            标记合并
 * precode          标记合并
 */

const mapStruct = {
    hr: /^\-\-\-$/, // ok
    image: /^\!\[(.+)\]\((.+)\)$/, // ok
    header: /^(#{1,6})\s+(.*)/, // ok
    unorderedList1: /^(\-\s+)(.*)/,
    unorderedList2: /^(\+\s+)(.*)/,
    orderedList: /^((\d+)\.\s+)(.*)/,
    quote: /^(>\s?)(.*)/,
    table: /^(?:(\|(?:(?!\|).)+)){2,}\|$/,
    precode: /^```(.*)/,
}

function getModuleType(data: string): [string, RegExpExecArray] {
    let type = "paragraph"
    let mat: RegExpExecArray | undefined

    for (let [_type, regexp] of Object.entries(mapStruct)) {
        let _mat = regexp.exec(data)
        if (_mat) {
            mat = _mat
            type = _type
        }
    }

    if (type === "paragraph") {
        mat = /^(\s*)(.*)$/.exec(data)!
    }

    return [type, mat!]
}


interface ModuleItem {
    type?: string
    children?: unknown
    opt?: unknown
}





function run(datalist: string[]) {
    let res = <ModuleItem[]>[]
    let emptyParagraphCount = 0
    let state = {
        index: 0
    }

    while (state.index < datalist.length) {
        let [type, mat] = getModuleType(datalist[state.index])
        if (type === "header") {
            res.push({ type, children: mat![2] })
        } else if (type === "hr") {
            res.push({ type })
        } else if (type === "image") {
            res.push({ type, opt: { label: mat![1], url: mat![2] } })
        }
        else if (type === "quote") {
            res.push(handleQuote(datalist, state))
        }
        else if (type === "unorderedList1" || type === "unorderedList2") {
            res.push(handleUnorderedList(datalist, state))
        }
        else if (type === "orderedList") {
            res.push(handleOrderedList(datalist, state))
        }
        else if (type === "table") {
            res.push(handleTable(datalist, state))
        }
        else if (type === "precode") {
            res.push(handlePrecode(datalist, state))
        }
        else if (type === "paragraph") {
            if (/^\s*$/.test(datalist[state.index])) {
                emptyParagraphCount++
                if (emptyParagraphCount === 3) {
                    res.push({ type, children: "" })
                } else {
                    state.index++
                    continue
                }
            } else {
                res.push({ type, children: datalist[state.index] })
            }
        }
        state.index++
        emptyParagraphCount = 0
    }

    return res
}


function handleQuote(datalist: string[], state: { index: number }): ModuleItem {
    let [type, mat] = getModuleType(datalist[state.index])
    let list = <string[]>[mat[2]]

    while (state.index + 1 < datalist.length) {
        if (!datalist[state.index + 1]) break

        let data = datalist[state.index + 1]
        let [_type, _mat] = getModuleType(data)

        if (_type === "quote") {
            list.push(_mat[2])
        } else if (_type === "paragraph" && !/^\s*$/.test(data)) {
            list.push(data)
        } else {
            break
        }

        state.index++
    }

    return <ModuleItem>{
        type,
        children: run(list),
    }
}

function handleUnorderedList(datalist: string[], state: { index: number }): ModuleItem {
    let [type, mat] = getModuleType(datalist[state.index])

    let list = <string[][]>[[mat[2]]]

    let spanlen = mat[1].length
    while (state.index + 1 < datalist.length) {
        if (!datalist[state.index + 1]) break

        let data = datalist[state.index + 1]
        let [_type, _mat] = getModuleType(data)
        if (_type === type) {
            list.push([_mat[2]])
            spanlen = _mat[1].length
        } else if (_type === "paragraph" && !/^\s*$/.test(data)) {
            let regexp = new RegExp(`^\\s{${spanlen}}(.*)`)
            let m = regexp.exec(data)
            if (!m) break
            list.at(-1)!.push(m[1])
        } else {
            break
        }
        state.index++
    }

    let children = <ModuleItem[][]>[]

    for (let i = 0; i < list.length; i++) {
        children.push(run(list[i]))
    }

    return <ModuleItem>{ type, children }
}

function handleOrderedList(datalist: string[], state: { index: number }): ModuleItem {
    let [type, mat] = getModuleType(datalist[state.index])
    let start = parseInt(mat[2])

    let list = <string[][]>[[mat[3]]]

    let spanlen = mat[1].length
    while (state.index + 1 < datalist.length) {
        if (!datalist[state.index + 1]) break

        let data = datalist[state.index + 1]
        let [_type, _mat] = getModuleType(data)
        if (_type === "orderedList") {
            list.push([_mat[3]])
            spanlen = _mat[1].length
        } else if (_type === "paragraph" && !/^\s*$/.test(data)) {
            let regexp = new RegExp(`^\\s{${spanlen}}(.*)`)
            let m = regexp.exec(data)!
            if (!m) break
            list.at(-1)!.push(m[1])
        } else {
            break
        }
        state.index++
    }


    let children = <ModuleItem[][]>[]

    for (let i = 0; i < list.length; i++) {
        children.push(run(list[i]))
    }

    return <ModuleItem>{ type, children, opt: { start } }
}


function handleTable(datalist: string[], state: { index: number }): ModuleItem {
    const type = "table"
    if (datalist[state.index] && datalist[state.index + 1] && datalist[state.index + 2]) {

        let matchStepA = datalist[state.index]
        let matchStepB = datalist[state.index + 1]
        let matchStepC = datalist[state.index + 2]

        let [typeA, matA] = getModuleType(matchStepA)
        let [typeB, matB] = getModuleType(matchStepB)
        let [typeC, matC] = getModuleType(matchStepC)

        if (typeB === typeA && typeC === typeA && /^(?:(\|\s*\-+\s*))+?\|$/.test(matchStepB)) {
            let listA = matchStepA.split("|").slice(1, -1)
            let listB = matchStepB.split("|").slice(1, -1)
            let listC = matchStepC.split("|").slice(1, -1)

            if (listB.length === listA.length && listC.length === listA.length) {
                state.index += 2

                let res = <ModuleItem>{ type, children: [listA, listB, listC], }

                while (state.index + 1 < datalist.length) {
                    if (!datalist[state.index + 1]) break

                    let data = datalist[state.index + 1]
                    let [_type, _] = getModuleType(data)
                    if (_type === type) {
                        let _list = data.split("|").slice(1, -1);
                        if (_list.length === listA.length) {
                            ; (res.children as string[][]).push(_list)
                            state.index++
                            continue
                        }
                    }
                    break
                }

                return res
            }

        }
    }

    let res = <ModuleItem>{
        type: "paragraph",
        children: datalist[state.index]
    }

    return res
}

function handlePrecode(datalist: string[], state: { index: number }): ModuleItem {
    let [type, mat] = getModuleType(datalist[state.index])
    let language = mat[1]

    let list = <string[]>[]
    let index = state.index + 1

    while (index < datalist.length) {
        if (datalist[index] === "```") {
            state.index = index
            return <ModuleItem>{ type, children: list, opt: { language } }
        }
        list.push(datalist[index])
        index++
    }

    let res = <ModuleItem>{
        type: "paragraph",
        children: datalist[state.index]
    }

    return res
}
