# Presentations repo

This is a slide-deck archive going back to 2007. Older directories use a
variety of legacy formats — Remark, reStructuredText, Beamer, plain text,
and others. New presentations use a custom Pandoc-based pipeline in `pandoc/`.

## Two kinds of decks — don't confuse them

- **Pandoc decks** have a `Makefile -> ../pandoc/Makefile` symlink. Their
  source is `presentation.md` in the format below.
- **Legacy decks** don't. Their source files (`presentation.md`,
  `presentation.rst`, `presentation.txt`, `presentation.tex`, etc.) and
  `presentation.pdf` are read-only archive. Don't migrate, modify, or "fix"
  them unless explicitly asked.

The user creates new deck directories and the Makefile symlink manually; Vim
fills in `presentation.md` from a template. Don't preempt those steps.

## Slide format (Pandoc decks)

Plain Markdown plus a few opt-in HTML extensions. **The source must render
cleanly on GitHub, GitLab, and Android Markdown viewers** — portability is
a hard requirement.

### Slide separator

A horizontal rule (`---`) on its own line, blank lines around it.

### Per-slide CSS classes

```markdown
<!-- class: center middle inverse -->

# Title slide
```

HTML comments are invisible to Markdown viewers. Known classes:

| Class | Effect |
|---|---|
| `center` | horizontal text centering |
| `middle` | vertical centering of slide content |
| `inverse` | dark background, gray text (title/section-divider slides) |
| `image-slide` | drops slide padding to 0; hides all headings |
| `no-page-num` | hides the page-number badge on this slide |

Multiple classes are space-separated. Place the comment anywhere inside the
slide; order doesn't matter.

### Incremental reveals — `<x-inc>`

```markdown
Always-visible content here.

<x-inc>

Revealed on first click.

Revealed on second click.

</x-inc>
```

- **Each direct child of `<x-inc>` is one click step.** A single child = one
  click; N children = N clicks.
- **Blank lines around the opening and closing tags are required**, otherwise
  the inner Markdown won't parse.
- **Multiple `<x-inc>` blocks in one slide** concatenate into a single reveal
  sequence in document order.

For per-item reveal of a single list, opt in with `each`:

```markdown
<x-inc each>

- First item
- Second item
- Third item

</x-inc>
```

`each` only descends when the single direct child is a `<ul>` or `<ol>`. For
mixed grouping (some items together, some separate), use multiple sibling
`<x-inc>` blocks.

### Speaker notes — `<aside>`

```markdown
## Slide heading

Visible slide content.

<aside>

Notes for the presenter, or for someone reading the source on GitHub.
Hidden in the slide and PDF; visible everywhere else.

</aside>
```

Blank lines around the tags are required, as with `<x-inc>`.

### Image slides

```markdown
<!-- class: image-slide -->

## Heading (hidden in slide; kept for GitHub)

![](./diagram.png)
```

`image-slide` drops the slide's padding and hides all headings; the image
scales to fit. Keep the heading in source so Markdown viewers render cleanly.

## Authoring tone and shape

Look at recent Pandoc decks for voice and density. Older decks in
`presentation.md`, `presentation.rst`, and `presentation.txt` files are also
useful samples — the slide format differs but the speaker's voice doesn't.
Heuristics:

- **Sparse slides.** One idea per slide. The speaker is the explanation —
  don't pre-empt them with paragraph-length slide bodies.
- **Use `<x-inc>` for timing**, not for every list. Reveals work best when
  there's a beat in the talk where the speaker wants the audience to
  anticipate. A static list with no rhetorical pause shouldn't be wrapped.
- **Use `<aside>` for context** — citations, prior incidents, jokes that
  won't age well, asides that the speaker may or may not say out loud.
- **Code blocks** should be the smallest snippet that makes the point.
- **Bullet points end with punctuation** — usually a period, occasionally
  a semicolon when two bullets span a single thought (e.g., a contrastive
  pair). Question-marked items (`"What do you think?"`) already terminate
  themselves.

When asked to draft or expand narrative, **prefer adding `<aside>` notes
alongside terse slide content** rather than fattening the slide text.

## Watch out for

- Don't add YAML frontmatter to `presentation.md` — Pandoc would parse it.
- Don't use Pandoc's `:::` fenced divs — they leak as literal text on GitHub.
