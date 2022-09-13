# 1.quote blockquote

```html
<blockquote mdtype="blockquote">
  <p mdtype="paragraph">...</p>
</blockquote>
```

# 2.unordered-list & task

```html
<ul mdtype="unordered-list">
  <li>
    <p mdtype="paragraph">...</p>
  </li>

  <li class="task">
    <div class="checkbox" contenteditable="false">
      <input type="checkbox" />
    </div>
    <p mdtype="paragraph">...</p>
  </li>
</ul>
```

# 3.ordered-list

```html
<ol mdtype="ordered-list">
  <li>
    <p mdtype="paragraph">...</p>
  </li>
</ol>
```

==============================================================================================

# 5.hr

```html
<div mdtype="hr" contenteditable="false">
  <hr />
</div>
```

# 6.precode

```html
<pre mdtype="precode">
    <code>
        <p>...</p>
    </code>
    <div contenteditable="false" language>
        <span contenteditable="true">js</span>
    </div>
</pre>
```

# 7.image

```html
<div class="image">
  <img src="/src/mi0s9AY0zj_w1920_h1080.jpg" alt="" />
  <div class="params">
    <div class="container">
      <div class="label">label</div>
      <div class="value " contenteditable="true" spellcheck="false">
        xxxx
      </div>
      <div class="label">url</div>
      <div class="value focus" contenteditable="true" spellcheck="false">
        eeee
      </div>
    </div>
  </div>
</div>
```

# 8.h1 head1 heading1

```html
<h1 mdtype="head">...</h1>
<h2 mdtype="head">...</h2>
<h3 mdtype="head">...</h3>
<h4 mdtype="head">...</h4>
<h5 mdtype="head">...</h5>
<h6 mdtype="head">...</h6>
```

# 9.table

> |head1|head2|...|

```html
<figure mdtype="table">
  <div class="toolContainer" contenteditable="false">
    <span>
      <button aria-label="调整表格">::before</button>
    </span>
    <span>
      <button aria-label="左对齐">::before</button>
      <button aria-label="居中对齐">::before</button>
      <button aria-label="右对齐">::before</button>
    </span>
    <span>
      <button aria-label="删除表格">::before</button>
    </span>
  </div>

  <table>
    <thead>
      <tr>
        <th>head1</th>
        <th>head2</th>
        <th>...</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <th>contnet1</th>
        <th>contnet2</th>
        <th>...</th>
      </tr>
      <tr>
        <th>...</th>
      </tr>
    </tbody>
  </table>
</figure>
```

> 最外层有个 tooltip ：instant/shown 提示工具 tip

# 10.paragraph

```html
<p mdtype="paragraph">...</p>
```

==============================================================================================

# 1.code

```html
<span mdtype="code">
    <span class="meta">`</span>
    <code>...<code>
    <span class="meta">`</span>
</span>
```

# 2.b bold strong

```html
<span mdtype="strong">
    <span class="meta">**</span>
    <strong>...<strong>
    <span class="meta">**</span>
</span>
```

# 3.em

```html
<span mdtype="em">
    <span class="meta">*</span>
    <em>...<em>
    <span class="meta">*</span>
</span>
```

# 4.link

<a mdtype="link" href="urlxxxxxxx">
    <span class="meta">[</span>
    <span>label</span>
    <span class="meta">](</span>
    <span class="meta url">urlxxxxxxx</span>
    <span class="meta">)</span>
</a>
