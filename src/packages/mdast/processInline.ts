import type { Break, Delete, Emphasis, InlineCode, MaybeSign, PhrasingContent, Strong, Text } from "./types"

export default function _processInline(data: string): PhrasingContent[] {
    let stack = <(MaybeSign | PhrasingContent)[]>[]
    // if (opt.hasCheckbox) {
    //     if (data.startsWith("[x] ")) {
    //         data = data.slice(4)
    //         stack.push(<Checkbox>{ type: "checkbox", checkout: true })
    //     } else if (data.startsWith("[ ] ")) {
    //         data = data.slice(4)
    //         stack.push(<Checkbox>{ type: "checkbox", checkout: false })
    //     }
    // }

    let index = 0

    while (data[index]) {
        if (["*", "~", "_", "`"].includes(data[index])) {
            let sign = data[index]
            let _index = index
            let len = 0
            while (data[_index] && (data[_index] === sign)) {
                _index++
                len++
            }
            // 排除单个 ~ 符号
            if (sign === "~" && len === 1) {
                index++
                continue
            }
            // string类型转Text类型
            let str = data.slice(0, index)
            str && stack.push(<Text>{ type: "text", value: str })
            // 是否匹配到前缀字符
            let beforeSign = stack.find(item => (item.hasOwnProperty("len") && ((item as MaybeSign).sign === sign)))
            if (beforeSign) {
                let _i = stack.indexOf(beforeSign)
                let _t = [...stack.slice(_i), <MaybeSign>{ sign: sign, len }]
                stack = stack.slice(0, _i)
                stack.push(flat(_t))
            } else {
                stack.push(<MaybeSign>{ sign: sign, len })
            }
            data = data.slice(_index)
            index = 0
            continue
        }

        else if (data[index] === "\n") {
            let str = data.slice(0, index)
            str && stack.push(<Text>{ type: "text", value: str })
            stack.push(<Break>{ type: "break" })
            data = data.slice(index + 1)
            index = 0
            continue
        }

        index++
    }

    data && stack.push(<Text>{ type: "text", value: data })

    // todo 将所有 MaybeSign 转为 type:text ，然后再将相邻的 type:text 合并
    stack = formatList(stack)

    // stack.forEach(item => console.log(item))
    return stack as PhrasingContent[]
}





function formatList(list: (MaybeSign | PhrasingContent)[]): PhrasingContent[] {
    let index = 0
    while (list[index]) {
        if ((list[index] as MaybeSign).len) {
            let _item = list[index] as MaybeSign
            list[index] = <Text>{ type: "text", value: _item.sign.repeat(_item.len) }
        }

        let _item = list[index] as Text

        if (_item.type === "text") {
            let _lastItem = list[index - 1] as Text
            if (_lastItem && _lastItem.type === "text") {
                _lastItem.value += _item.value
                list = [...list.slice(0, index), ...list.slice(index + 1)]
                continue
            }
        }

        index++
    }

    return list as PhrasingContent[]
}

function flat(list: any[]) {
    let before = list[0]
    let after = list[list.length - 1]
    let min = before.len <= after.len ? before : after
    let res: Emphasis | Strong | Delete | InlineCode
    if (min.sign === "*") {
        if (min.len === 1) {
            list = bothEndsOfList(list, 1)
            list = formatList(list)
            res = <Emphasis>{ type: "emphasis", sign: "*", value: list }
        } else if (min.len === 2) {
            list = bothEndsOfList(list, 2)
            list = formatList(list)
            res = <Strong>{ type: "strong", sign: "**", value: list }
        } else if (min.len >= 3) {
            list = bothEndsOfList(list, 3)
            list = formatList(list)
            res = <Strong>{
                type: "strong", sign: "**", value: [
                    <Emphasis>{ type: "emphasis", sign: "*", value: list }
                ]
            }
        }
    } else if (min.sign === "_") {
        if (min.len === 1) {
            list = bothEndsOfList(list, 1)
            list = formatList(list)
            res = <Emphasis>{ type: "emphasis", sign: "_", value: list }
        } else if (min.len >= 2) {
            list = bothEndsOfList(list, 2)
            list = formatList(list)
            res = <Strong>{ type: "strong", sign: "__", value: list }
        }
    } else if (min.sign === "~") {
        list = bothEndsOfList(list, 2)
        list = formatList(list)
        res = <Delete>{ type: "delete", value: list }
    } else if (min.sign === "`") {
        list = bothEndsOfList(list, 1)
        list = formatList(list)
        res = <InlineCode>{ type: "inlineCode", value: list }
    }
    return res
}

function bothEndsOfList(list: (MaybeSign | PhrasingContent)[], len: number) {
    let before = list.shift() as MaybeSign
    let after = list.pop() as MaybeSign

    if ((before.len - len) !== 0) {
        list.unshift(<PhrasingContent>{ type: "text", value: before.sign.repeat(before.len - len) })
    }

    if ((after.len - len) !== 0) {
        list.push(<PhrasingContent>{ type: "text", value: after.sign.repeat(after.len - len) })
    }
    return list
}
