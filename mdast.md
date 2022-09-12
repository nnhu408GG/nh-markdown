### `Paragraph`

```idl
interface Paragraph <: Parent {
  type: "paragraph"
  children: [PhrasingContent]
}
```
```markdown
Alpha bravo charlie.
```

Yields:

```js
{
  type: 'paragraph',
  children: [{type: 'text', value: 'Alpha bravo charlie.'}]
}
```

### `Heading`

```idl
interface Heading <: Parent {
  type: "heading"
  depth: 1 <= number <= 6
  children: [PhrasingContent]
}
```

**Heading** ([**Parent**][dfn-parent]) represents a heading of a section.

**Heading** can be used where [**flow**][dfn-flow-content] content is expected.
Its content model is [**phrasing**][dfn-phrasing-content] content.

A `depth` field must be present.
A value of `1` is said to be the highest rank and `6` the lowest.

For example, the following markdown:

```markdown
# Alpha
```

Yields:

```js
{
  type: 'heading',
  depth: 1,
  children: [{type: 'text', value: 'Alpha'}]
}
```

### `ThematicBreak`

```idl
interface ThematicBreak <: Node {
  type: "thematicBreak"
}
```

**ThematicBreak** ([**Node**][dfn-node]) represents a thematic break, such as a
scene change in a story, a transition to another topic, or a new document.

**ThematicBreak** can be used where [**flow**][dfn-flow-content] content is
expected.
It has no content model.

For example, the following markdown:

```markdown
***
```

Yields:

```js
{type: 'thematicBreak'}
```

### `Blockquote`

```idl
interface Blockquote <: Parent {
  type: "blockquote"
  children: [FlowContent]
}
```

**Blockquote** ([**Parent**][dfn-parent]) represents a section quoted from
somewhere else.

**Blockquote** can be used where [**flow**][dfn-flow-content] content is
expected.
Its content model is also [**flow**][dfn-flow-content] content.

For example, the following markdown:

```markdown
> Alpha bravo charlie.
```

Yields:

```js
{
  type: 'blockquote',
  children: [{
    type: 'paragraph',
    children: [{type: 'text', value: 'Alpha bravo charlie.'}]
  }]
}
```

### `List`

```idl
interface List <: Parent {
  type: "list"
  ordered: boolean?
  start: number?
  spread: boolean?
  children: [ListContent]
}
```

**List** ([**Parent**][dfn-parent]) represents a list of items.

**List** can be used where [**flow**][dfn-flow-content] content is expected.
Its content model is [**list**][dfn-list-content] content.

An `ordered` field can be present.
It represents that the items have been intentionally ordered (when `true`), or
that the order of items is not important (when `false` or not present).

A `start` field can be present.
It represents, when the `ordered` field is `true`, the starting number of the
list.

A `spread` field can be present.
It represents that one or more of its children are separated with a blank line
from its [siblings][term-sibling] (when `true`), or not (when `false` or not
present).

For example, the following markdown:

```markdown
1. foo
```

Yields:

```js
{
  type: 'list',
  ordered: true,
  start: 1,
  spread: false,
  children: [{
    type: 'listItem',
    spread: false,
    children: [{
      type: 'paragraph',
      children: [{type: 'text', value: 'foo'}]
    }]
  }]
}
```

### `ListItem`

```idl
interface ListItem <: Parent {
  type: "listItem"
  spread: boolean?
  children: [FlowContent]
}
```

**ListItem** ([**Parent**][dfn-parent]) represents an item in a
[**List**][dfn-list].

**ListItem** can be used where [**list**][dfn-list-content] content is expected.
Its content model is [**flow**][dfn-flow-content] content.

A `spread` field can be present.
It represents that the item contains two or more [*children*][term-child]
separated by a blank line (when `true`), or not (when `false` or not present).

For example, the following markdown:

```markdown
* bar
```

Yields:

```js
{
  type: 'listItem',
  spread: false,
  children: [{
    type: 'paragraph',
    children: [{type: 'text', value: 'bar'}]
  }]
}
```

### `HTML`

```idl
interface HTML <: Literal {
  type: "html"
}
```

**HTML** ([**Literal**][dfn-literal]) represents a fragment of raw [HTML][].

**HTML** can be used where [**flow**][dfn-flow-content] or
[**phrasing**][dfn-phrasing-content] content is expected.
Its content is represented by its `value` field.

HTML nodes do not have the restriction of being valid or complete HTML
([\[HTML\]][html]) constructs.

For example, the following markdown:

```markdown
<div>
```

Yields:

```js
{type: 'html', value: '<div>'}
```

### `Code`

```idl
interface Code <: Literal {
  type: "code"
  lang: string?
  meta: string?
}
```

**Code** ([**Literal**][dfn-literal]) represents a block of preformatted text,
such as ASCII art or computer code.

**Code** can be used where [**flow**][dfn-flow-content] content is expected.
Its content is represented by its `value` field.

This node relates to the [**phrasing**][dfn-phrasing-content] content concept
[**InlineCode**][dfn-inline-code].

A `lang` field can be present.
It represents the language of computer code being marked up.

If the `lang` field is present, a `meta` field can be present.
It represents custom information relating to the node.

For example, the following markdown:

```markdown
    foo()
```

Yields:

```js
{
  type: 'code',
  lang: null,
  meta: null,
  value: 'foo()'
}
```

And the following markdown:

````markdown
```js highlight-line="2"
foo()
bar()
baz()
```
````

Yields:

```js
{
  type: 'code',
  lang: 'javascript',
  meta: 'highlight-line="2"',
  value: 'foo()\nbar()\nbaz()'
}
```

### `Definition`

```idl
interface Definition <: Node {
  type: "definition"
}

Definition includes Association
Definition includes Resource
```

**Definition** ([**Node**][dfn-node]) represents a resource.

**Definition** can be used where [**content**][dfn-content] is expected.
It has no content model.

**Definition** includes the mixins [**Association**][dfn-mxn-association] and
[**Resource**][dfn-mxn-resource].

**Definition** should be associated with
[**LinkReferences**][dfn-link-reference] and
[**ImageReferences**][dfn-image-reference].

For example, the following markdown:

```markdown
[Alpha]: https://example.com
```

Yields:

```js
{
  type: 'definition',
  identifier: 'alpha',
  label: 'Alpha',
  url: 'https://example.com',
  title: null
}
```

### `Text`

```idl
interface Text <: Literal {
  type: "text"
}
```

**Text** ([**Literal**][dfn-literal]) represents everything that is just text.

**Text** can be used where [**phrasing**][dfn-phrasing-content] content is
expected.
Its content is represented by its `value` field.

For example, the following markdown:

```markdown
Alpha bravo charlie.
```

Yields:

```js
{type: 'text', value: 'Alpha bravo charlie.'}
```

### `Emphasis`

```idl
interface Emphasis <: Parent {
  type: "emphasis"
  children: [TransparentContent]
}
```

**Emphasis** ([**Parent**][dfn-parent]) represents stress emphasis of its
contents.

**Emphasis** can be used where [**phrasing**][dfn-phrasing-content] content is
expected.
Its content model is [**transparent**][dfn-transparent-content] content.

For example, the following markdown:

```markdown
*alpha* _bravo_
```

Yields:

```js
{
  type: 'paragraph',
  children: [
    {
      type: 'emphasis',
      children: [{type: 'text', value: 'alpha'}]
    },
    {type: 'text', value: ' '},
    {
      type: 'emphasis',
      children: [{type: 'text', value: 'bravo'}]
    }
  ]
}
```

### `Strong`

```idl
interface Strong <: Parent {
  type: "strong"
  children: [TransparentContent]
}
```

**Strong** ([**Parent**][dfn-parent]) represents strong importance, seriousness,
or urgency for its contents.

**Strong** can be used where [**phrasing**][dfn-phrasing-content] content is
expected.
Its content model is [**transparent**][dfn-transparent-content] content.

For example, the following markdown:

```markdown
**alpha** __bravo__
```

Yields:

```js
{
  type: 'paragraph',
  children: [
    {
      type: 'strong',
      children: [{type: 'text', value: 'alpha'}]
    },
    {type: 'text', value: ' '},
    {
      type: 'strong',
      children: [{type: 'text', value: 'bravo'}]
    }
  ]
}
```

### `InlineCode`

```idl
interface InlineCode <: Literal {
  type: "inlineCode"
}
```

**InlineCode** ([**Literal**][dfn-literal]) represents a fragment of computer
code, such as a file name, computer program, or anything a computer could parse.

**InlineCode** can be used where [**phrasing**][dfn-phrasing-content] content
is expected.
Its content is represented by its `value` field.

This node relates to the [**flow**][dfn-flow-content] content concept
[**Code**][dfn-code].

For example, the following markdown:

```markdown
`foo()`
```

Yields:

```js
{type: 'inlineCode', value: 'foo()'}
```

### `Break`

```idl
interface Break <: Node {
  type: "break"
}
```

**Break** ([**Node**][dfn-node]) represents a line break, such as in poems or
addresses.

**Break** can be used where [**phrasing**][dfn-phrasing-content] content is
expected.
It has no content model.

For example, the following markdown:

```markdown
foo··
bar
```

Yields:

```js
{
  type: 'paragraph',
  children: [
    {type: 'text', value: 'foo'},
    {type: 'break'},
    {type: 'text', value: 'bar'}
  ]
}
```

### `Link`

```idl
interface Link <: Parent {
  type: "link"
  children: [StaticPhrasingContent]
}

Link includes Resource
```

**Link** ([**Parent**][dfn-parent]) represents a hyperlink.

**Link** can be used where [**phrasing**][dfn-phrasing-content] content is
expected.
Its content model is [**static phrasing**][dfn-static-phrasing-content] content.

**Link** includes the mixin [**Resource**][dfn-mxn-resource].

For example, the following markdown:

```markdown
[alpha](https://example.com "bravo")
```

Yields:

```js
{
  type: 'link',
  url: 'https://example.com',
  title: 'bravo',
  children: [{type: 'text', value: 'alpha'}]
}
```

### `Image`

```idl
interface Image <: Node {
  type: "image"
}

Image includes Resource
Image includes Alternative
```

**Image** ([**Node**][dfn-node]) represents an image.

**Image** can be used where [**phrasing**][dfn-phrasing-content] content is
expected.
It has no content model, but is described by its `alt` field.

**Image** includes the mixins [**Resource**][dfn-mxn-resource] and
[**Alternative**][dfn-mxn-alternative].

For example, the following markdown:

```markdown
![alpha](https://example.com/favicon.ico "bravo")
```

Yields:

```js
{
  type: 'image',
  url: 'https://example.com/favicon.ico',
  title: 'bravo',
  alt: 'alpha'
}
```

### `LinkReference`

```idl
interface LinkReference <: Parent {
  type: "linkReference"
  children: [StaticPhrasingContent]
}

LinkReference includes Reference
```

**LinkReference** ([**Parent**][dfn-parent]) represents a hyperlink through
association, or its original source if there is no association.

**LinkReference** can be used where [**phrasing**][dfn-phrasing-content] content
is expected.
Its content model is [**static phrasing**][dfn-static-phrasing-content] content.

**LinkReference** includes the mixin [**Reference**][dfn-mxn-reference].

**LinkReferences** should be associated with a [**Definition**][dfn-definition].

For example, the following markdown:

```markdown
[alpha][Bravo]
```

Yields:

```js
{
  type: 'linkReference',
  identifier: 'bravo',
  label: 'Bravo',
  referenceType: 'full',
  children: [{type: 'text', value: 'alpha'}]
}
```

### `ImageReference`

```idl
interface ImageReference <: Node {
  type: "imageReference"
}

ImageReference includes Reference
ImageReference includes Alternative
```

**ImageReference** ([**Node**][dfn-node]) represents an image through
association, or its original source if there is no association.

**ImageReference** can be used where [**phrasing**][dfn-phrasing-content]
content is expected.
It has no content model, but is described by its `alt` field.

**ImageReference** includes the mixins [**Reference**][dfn-mxn-reference] and
[**Alternative**][dfn-mxn-alternative].

**ImageReference** should be associated with a [**Definition**][dfn-definition].

For example, the following markdown:

```markdown
![alpha][bravo]
```

Yields:

```js
{
  type: 'imageReference',
  identifier: 'bravo',
  label: 'bravo',
  referenceType: 'full',
  alt: 'alpha'
}
```

## Mixin

### `Resource`

```idl
interface mixin Resource {
  url: string
  title: string?
}
```

**Resource** represents a reference to resource.

A `url` field must be present.
It represents a URL to the referenced resource.

A `title` field can be present.
It represents  advisory information for the resource, such as would be
appropriate for a tooltip.

### `Association`

```idl
interface mixin Association {
  identifier: string
  label: string?
}
```

**Association** represents an internal relation from one node to another.

An `identifier` field must be present.
It can match another node.
`identifier` is a source value: character escapes and character references are
*not* parsed.
Its value must be normalized.

A `label` field can be present.
`label` is a string value: it works just like `title` on a link or a `lang` on
code: character escapes and character references are parsed.

To normalize a value, collapse markdown whitespace (`[\t\n\r ]+`) to a space,
trim the optional initial and/or final space, and perform case-folding.

Whether the value of `identifier` (or normalized `label` if there is no
`identifier`) is expected to be a unique identifier or not depends on the type
of node including the **Association**.
An example of this is that they should be unique on
[**Definition**][dfn-definition], whereas multiple
[**LinkReference**][dfn-link-reference]s can be non-unique to be associated with
one definition.

### `Reference`

```idl
interface mixin Reference {
  referenceType: string
}

Reference includes Association
```

**Reference** represents a marker that is [**associated**][dfn-mxn-association]
to another node.

A `referenceType` field must be present.
Its value must be a [**referenceType**][dfn-enum-reference-type].
It represents the explicitness of the reference.

### `Alternative`

```idl
interface mixin Alternative {
  alt: string?
}
```

**Alternative** represents a node with a fallback

An `alt` field should be present.
It represents equivalent content for environments that cannot represent the
node as intended.

## Enumeration

### `referenceType`

```idl
enum referenceType {
  "shortcut" | "collapsed" | "full"
}
```

**referenceType** represents the explicitness of a reference.

*   **shortcut**: the reference is implicit, its identifier inferred from its
    content
*   **collapsed**: the reference is explicit, its identifier inferred from its
    content
*   **full**: the reference is explicit, its identifier explicitly set



















## Content model

```idl
type MdastContent = FlowContent | ListContent | PhrasingContent
```

Each node in mdast falls into one or more categories of **Content** that group
nodes with similar characteristics together.

### `FlowContent`

```idl
type FlowContent =
  Blockquote | Code | Heading | HTML | List | ThematicBreak | Content
```

**Flow** content represent the sections of document.

### `Content`

```idl
type Content = Definition | Paragraph
```

**Content** represents runs of text that form definitions and paragraphs.

### `ListContent`

```idl
type ListContent = ListItem
```

**List** content represent the items in a list.

### `PhrasingContent`

```idl
type PhrasingContent = Link | LinkReference | StaticPhrasingContent
```

**Phrasing** content represent the text in a document, and its markup.

### `StaticPhrasingContent`

```idl
type StaticPhrasingContent =
  Break | Emphasis | HTML | Image | ImageReference | InlineCode | Strong | Text
```

**StaticPhrasing** content represent the text in a document, and its
markup, that is not intended for user interaction.

### `TransparentContent`

The **transparent** content model is derived from the content model of its
[parent][dfn-parent].
Effectively, this is used to prohibit nested links (and link references).






















## Extensions

Markdown syntax is often extended.
It is not a goal of this specification to list all possible extensions.
However, a short list of frequently used extensions are shown below.

### GFM

The following interfaces are found in [GitHub Flavored Markdown][gfm].

#### `FootnoteDefinition`

```idl
interface FootnoteDefinition <: Parent {
  type: "footnoteDefinition"
  children: [FlowContent]
}

FootnoteDefinition includes Association
```

**FootnoteDefinition** ([**Parent**][dfn-parent]) represents content relating
to the document that is outside its flow.

**FootnoteDefinition** can be used where [**flow**][dfn-flow-content] content is
expected.
Its content model is also [**flow**][dfn-flow-content] content.

**FootnoteDefinition** includes the mixin
[**Association**][dfn-mxn-association].

**FootnoteDefinition** should be associated with
[**FootnoteReferences**][dfn-footnote-reference].

For example, the following markdown:

```markdown
[^alpha]: bravo and charlie.
```

Yields:

```js
{
  type: 'footnoteDefinition',
  identifier: 'alpha',
  label: 'alpha',
  children: [{
    type: 'paragraph',
    children: [{type: 'text', value: 'bravo and charlie.'}]
  }]
}
```

#### `FootnoteReference`

```idl
interface FootnoteReference <: Node {
  type: "footnoteReference"
}

FootnoteReference includes Association
```

**FootnoteReference** ([**Node**][dfn-node]) represents a marker through
association.

**FootnoteReference** can be used where [**phrasing**][dfn-phrasing-content]
content is expected.
It has no content model.

**FootnoteReference** includes the mixin [**Association**][dfn-mxn-association].

**FootnoteReference** should be associated with a
[**FootnoteDefinition**][dfn-footnote-definition].

For example, the following markdown:

```markdown
[^alpha]
```

Yields:

```js
{
  type: 'footnoteReference',
  identifier: 'alpha',
  label: 'alpha'
}
```

#### `Table`

```idl
interface Table <: Parent {
  type: "table"
  align: [alignType]?
  children: [TableContent]
}
```

**Table** ([**Parent**][dfn-parent]) represents two-dimensional data.

**Table** can be used where [**flow**][dfn-flow-content] content is expected.
Its content model is [**table**][dfn-table-content] content.

The [*head*][term-head] of the node represents the labels of the columns.

An `align` field can be present.
If present, it must be a list of [**alignType**s][dfn-enum-align-type].
It represents how cells in columns are aligned.

For example, the following markdown:

```markdown
| foo | bar |
| :-- | :-: |
| baz | qux |
```

Yields:

```js
{
  type: 'table',
  align: ['left', 'center'],
  children: [
    {
      type: 'tableRow',
      children: [
        {
          type: 'tableCell',
          children: [{type: 'text', value: 'foo'}]
        },
        {
          type: 'tableCell',
          children: [{type: 'text', value: 'bar'}]
        }
      ]
    },
    {
      type: 'tableRow',
      children: [
        {
          type: 'tableCell',
          children: [{type: 'text', value: 'baz'}]
        },
        {
          type: 'tableCell',
          children: [{type: 'text', value: 'qux'}]
        }
      ]
    }
  ]
}
```

#### `TableRow`

```idl
interface TableRow <: Parent {
  type: "tableRow"
  children: [RowContent]
}
```

**TableRow** ([**Parent**][dfn-parent]) represents a row of cells in a table.

**TableRow** can be used where [**table**][dfn-table-content] content is
expected.
Its content model is [**row**][dfn-row-content] content.

If the node is a [*head*][term-head], it represents the labels of the columns
for its parent [**Table**][dfn-table].

For an example, see [**Table**][dfn-table].

#### `TableCell`

```idl
interface TableCell <: Parent {
  type: "tableCell"
  children: [PhrasingContent]
}
```

**TableCell** ([**Parent**][dfn-parent]) represents a header cell in a
[**Table**][dfn-table], if its parent is a [*head*][term-head], or a data
cell otherwise.

**TableCell** can be used where [**row**][dfn-row-content] content is expected.
Its content model is [**phrasing**][dfn-phrasing-content] content excluding
[**Break**][dfn-break] nodes.

For an example, see [**Table**][dfn-table].

#### `ListItem` (GFM)

```idl
interface ListItemGfm <: ListItem {
  checked: boolean?
}
```

In GFM, a `checked` field can be present.
It represents whether the item is done (when `true`), not done (when `false`),
or indeterminate or not applicable (when `null` or not present).

#### `Delete`

```idl
interface Delete <: Parent {
  type: "delete"
  children: [TransparentContent]
}
```

**Delete** ([**Parent**][dfn-parent]) represents contents that are no longer
accurate or no longer relevant.

**Delete** can be used where [**phrasing**][dfn-phrasing-content] content is
expected.
Its content model is [**transparent**][dfn-transparent-content] content.

For example, the following markdown:

```markdown
~~alpha~~
```

Yields:

```js
{
  type: 'delete',
  children: [{type: 'text', value: 'alpha'}]
}
```

#### `alignType`

```idl
enum alignType {
  "left" | "right" | "center" | null
}
```

**alignType** represents how phrasing content is aligned
([\[CSSTEXT\]][css-text]).

*   **`'left'`**: See the [`left`][css-left] value of the `text-align` CSS
    property
*   **`'right'`**: See the [`right`][css-right] value of the `text-align`
    CSS property
*   **`'center'`**: See the [`center`][css-center] value of the `text-align`
    CSS property
*   **`null`**: phrasing content is aligned as defined by the host environment

#### `FlowContent` (GFM)

```idl
type FlowContentGfm = FootnoteDefinition | Table | FlowContent
```

#### `TableContent`

```idl
type TableContent = TableRow
```

**Table** content represent the rows in a table.

#### `RowContent`

```idl
type RowContent = TableCell
```

**Row** content represent the cells in a row.

#### `ListContent` (GFM)

```idl
type ListContentGfm = ListItemGfm
```

#### `StaticPhrasingContent` (GFM)

```idl
type StaticPhrasingContentGfm =
  FootnoteReference | Delete | StaticPhrasingContent
```

### Frontmatter

The following interfaces are found with YAML.

#### `YAML`

```idl
interface YAML <: Literal {
  type: "yaml"
}
```

**YAML** ([**Literal**][dfn-literal]) represents a collection of metadata for
the document in the YAML ([\[YAML\]][yaml]) data serialisation language.

**YAML** can be used where [**frontmatter**][dfn-frontmatter-content] content is
expected.
Its content is represented by its `value` field.

For example, the following markdown:

```markdown
---
foo: bar
---
```

Yields:

```js
{type: 'yaml', value: 'foo: bar'}
```

#### `FrontmatterContent`

```idl
type FrontmatterContent = YAML
```

**Frontmatter** content represent out-of-band information about the document.

If frontmatter is present, it must be limited to one node in the
[*tree*][term-tree], and can only exist as a [*head*][term-head].

#### `FlowContent` (frontmatter)

```idl
type FlowContentFrontmatter = FrontmatterContent | FlowContent
```

### Footnotes

The following interfaces are found with footnotes (pandoc).
Note that pandoc also uses [**FootnoteReference**][dfn-footnote-reference]
and [**FootnoteDefinition**][dfn-footnote-definition], but since
[GFM now supports footnotes][gfm-footnote], their definitions were moved to the
[GFM][gfm-section] section

#### `Footnote`

```idl
interface Footnote <: Parent {
  type: "footnote"
  children: [PhrasingContent]
}
```

**Footnote** ([**Parent**][dfn-parent]) represents content relating to the
document that is outside its flow.

**Footnote** can be used where [**phrasing**][dfn-phrasing-content] content is
expected.
Its content model is also [**phrasing**][dfn-phrasing-content] content.

For example, the following markdown:

```markdown
^[alpha bravo]
```

Yields:

```js
{
  type: 'footnote',
  children: [{type: 'text', value: 'alpha bravo'}]
}
```

#### `StaticPhrasingContent` (footnotes)

```idl
type StaticPhrasingContentFootnotes = Footnote | StaticPhrasingContent
```
