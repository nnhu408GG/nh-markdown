import type { MaybeSign, PhrasingContent, Text } from "../types/mdast"
import _break from "./components/break"
import _delete from "./components/delete"
import emphasis from "./components/emphasis"
import inlineCode from "./components/inlineCode"
import link from "./components/link"
import strong from "./components/strong"
import text from "./components/text"

/** string转为ast */
export default function _processInline(data: string): PhrasingContent[] {
    let stack = <(MaybeSign | PhrasingContent)[]>[]
    let index = 0

    while (data[index]) {
        if (data[index] === "[") {
            let _indexLabel = index
            let type = ""
            while (data[_indexLabel]) {
                if (data[_indexLabel] === "]") {
                    type = "bracket"
                    break
                }
                _indexLabel++
            }

            let _indexUrl = _indexLabel
            if (type === "bracket" && data[_indexUrl + 1] && data[_indexUrl + 1] === "(") {
                _indexUrl++
                while (data[_indexUrl]) {
                    if (data[_indexUrl] === ")") {
                        type = "link"
                        break
                    }
                    _indexUrl++
                }
            }

            if (type === "link") {
                data.slice(0, index) && stack.push(text.build({ value: data.slice(0, index) }))
                stack.push(link.build({
                    label: data.slice(index + 1, _indexLabel),
                    url: data.slice(_indexLabel + 2, _indexUrl),
                }))
                data = data.slice(_indexUrl + 1)
                index = 0
                continue
            }
        }

        else if (["*", "~", "_", "`"].includes(data[index])) {
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
            str && stack.push(text.build({ value: str }))
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
            str && stack.push(text.build({ value: str }))
            stack.push(_break.build())
            data = data.slice(index + 1)
            index = 0
            continue
        }

        index++
    }

    data && stack.push(text.build({ value: data }))

    stack = formatList(stack)

    return stack as PhrasingContent[]
}

function formatList(list: (MaybeSign | PhrasingContent)[]): PhrasingContent[] {
    let index = 0
    while (list[index]) {
        if ((list[index] as MaybeSign).len) {
            let _item = list[index] as MaybeSign
            list[index] = text.build({ value: _item.sign.repeat(_item.len) })
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
    let res: PhrasingContent
    if (min.sign === "*") {
        if (min.len === 1) {
            list = bothEndsOfList(list, 1)
            list = formatList(list)
            res = emphasis.build({ sign: "*", value: list })
        } else if (min.len === 2) {
            list = bothEndsOfList(list, 2)
            list = formatList(list)
            res = strong.build({ sign: "**", value: list })
        } else if (min.len >= 3) {
            list = bothEndsOfList(list, 3)
            list = formatList(list)
            res = strong.build({
                sign: "**", value: [
                    emphasis.build({ sign: "*", value: list })
                ]
            })
        }
    } else if (min.sign === "_") {
        if (min.len === 1) {
            list = bothEndsOfList(list, 1)
            list = formatList(list)
            res = emphasis.build({ sign: "_", value: list })
        } else if (min.len >= 2) {
            list = bothEndsOfList(list, 2)
            list = formatList(list)
            res = strong.build({ sign: "__", value: list })
        }
    } else if (min.sign === "~") {
        list = bothEndsOfList(list, 2)
        list = formatList(list)
        res = _delete.build({ value: list })
    } else if (min.sign === "`") {
        list = bothEndsOfList(list, 1)
        list = formatList(list)
        res = inlineCode.build({ value: list })
    }
    return res
}

function bothEndsOfList(list: (MaybeSign | PhrasingContent)[], len: number) {
    let before = list.shift() as MaybeSign
    let after = list.pop() as MaybeSign

    if ((before.len - len) !== 0) {
        list.unshift(text.build({ value: before.sign.repeat(before.len - len) }))
    }

    if ((after.len - len) !== 0) {
        list.push(text.build({ value: after.sign.repeat(after.len - len) }))
    }
    return list
}
