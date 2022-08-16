# nh-markdown

仿造了 Typora 的编辑功能

现阶段正在实现最麻烦的光标选区编辑功能

# 已支持语法
|语法描述|例子|注意|
|-|-|-|
|标题|# 内容|可以多个重复的 `#` 来表示级别 <br> 例如：###### 最小标题六|
|注解框|> 内容|内容前有空格|
|分割行|---|内容前有空格|
|图片的嵌入|\!\[label\]\(url\)|label是图片名称，url是图片的路径|
|无序列表|- 内容|内容前有空格|
|有序列表|1. 内容|内容前有空格|
|表格|\|标题一\|标题二\|……\||至少要有两个标题才能生成表格|
|代码块|```开发语言|开发语言可为空|


# 问题bug
- 粘贴功能还有问题，需要数据模型的建立才能继续实现
- 行内特殊标记符的反斜杠未支持
  > 需追加单边meta
  > 原`inlineStruct`需追加`double`字段
- 未支持 html 元素
- 无使行内元素的换行的操作

# 未来实现计划
- block 元素的字符串数据生成
- 生成文档源码
- 文档源码的导入
- 源码编辑界面
