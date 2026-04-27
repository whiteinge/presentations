<!-- class: center middle inverse -->

# Claude Code

A brownbag workshop at

<img width="200px" src="./logo.svg" alt="ContextOS">

by Seth House

@whiteinge<br>
seth@eseth.com

---

<!-- class: center middle -->

# Onboarding

---

## Start with `CLAUDE.md`

Write down the particulars of your codebase:

<x-inc>

- Noteworthy file locations.
- How to run the linter, formatter, and test suite.
- Architectural principles and code conventions.
- Commit expectations.
- Idiosyncrasies and known temporary placeholders.

</x-inc>

<aside>

This is the single biggest investment you'll make. Every new session
reads it; take your time and it pays off greatly in the long-run.

Don't restate things that are clear from the code itself — Claude can
read it. `CLAUDE.md` is for context that *isn't* derivable.

</aside>

---

## Source of truth

Code and version-controlled files are authoritative. Sessions,
prompts, and memory are layers on top.

<aside>

When sources contend, the more durable one wins:
file > `CLAUDE.md` > memory > session prompt. This hierarchy is what
makes Claude reproducible across machines, sessions, and teammates.
Anything you want durable and team-shared belongs in version control;
anything in a session or in private memory is by definition not
authoritative for the team.

</aside>

---

## `CLAUDE.md` hierarchy

<x-inc each>

- `~/.claude/CLAUDE.md` — your preferences across all projects.
- `<project>/CLAUDE.md` — rules for this codebase.
- `<project>/weirdModule/CLAUDE.md` — rules just for that subdirectory.

</x-inc>

<aside>

All three are concatenated into context, not overridden — they layer.
The subdirectory one loads on-demand: only when Claude reads a file
in or under that subdirectory.

Also useful: `CLAUDE.local.md` (gitignored) for personal preferences
that shouldn't be committed alongside the project's `CLAUDE.md`.

</aside>

---

## Path-specific rules — `.claude/rules/`

Markdown files with glob frontmatter; load on-demand when Claude
reads a matching path.

```markdown
---
paths: ["src/auth/**/*"]
---

Auth code uses `bcrypt` for password hashing — never plaintext.
Session tokens always flow through `SessionManager`.
```

<aside>

Same idea as the per-subdirectory `CLAUDE.md` from the previous
slide, but scoped by file pattern instead of directory. Useful for
cross-cutting concerns ("all auth code", "all test files") that
don't fit one tidy folder.

</aside>

---

## Define success criteria

> "Before showing the result: run the linter, run the formatter,
> and run the test suite."

<aside>

Without this, Claude declares victory based on "looks right to me."
Make it earn the win.

</aside>

---

## Reference other files with `@`

```
@.claude/api-docs.md
@docs/architecture.md
```

<aside>

Useful when `CLAUDE.md` gets long, or when domain-specific reference
docs already exist. The contents are expanded into context at session
start.

</aside>

---

## Always be updating `CLAUDE.md`

<x-inc>

- After a session goes sideways, ask Claude what was missing.
- Remove redundancies and conflicting bits.
- Add the rule that would have prevented the confusion.

</x-inc>

<aside>

Treat `CLAUDE.md` like a living code style guide. Ask Claude to review
it for you periodically — it's good at spotting its own confusion in
hindsight.

</aside>

---

## When Claude is wrong, fix the code first

<x-inc>

- A clearer docstring or function name often beats another `CLAUDE.md` rule.
- Define a "golden master" file for Claude to pattern-match against.
- Migrate legacy code to the new pattern only when modifying it,
  in a separate "update old patterns" commit.

</x-inc>

<aside>

The codebase is the ultimate source of truth. `CLAUDE.md` should be
short and authoritative; the code should be readable.

</aside>

---

## Whitelist commands deliberately

The permission system is configurable, not fuzzy:

<x-inc>

- `default` — prompts for risky actions.
- `acceptEdits` — auto-allows file writes.
- `plan` — read-only mode.
- `bypassPermissions` — allows everything (be careful).

</x-inc>

<aside>

Use `/permissions` to inspect what's allowed right now. Start strict —
only add commands you've thought about. Read-only commands (`ls`,
`grep`, `git status`) are safe to allow widely.

</aside>

---

<!-- class: center middle -->

# Working with Claude

---

## Use the CLI, not the web

Even for one-off, "I just need to know X" questions.

<aside>

The CLI session has your `CLAUDE.md`, your codebase, and your
conventions loaded. The web tab opens cold every time. Even a quick
clarification gets a sharper answer when Claude has the full picture
— and the onboarding work you've already done pays off again.

</aside>

---

## Plan mode

A read-only mode. Claude can research and reason, but can't change
files until you approve a plan.

`Shift+Tab` to cycle, or `/plan` to jump in.

<aside>

Use it for architectural decisions, refactors touching many files,
or any time you want to see the approach before any code changes.

</aside>

---

## Tell Claude to propose plan mode

In `CLAUDE.md`:

> "For architectural changes or work touching multiple modules,
> propose plan mode before starting."

<aside>

Claude can't enter plan mode on its own, but it can ask you to enter
it. Without this instruction, Claude defaults to just doing the work,
and you only realize you wanted a plan when something's already been
written.

</aside>

---

## Tell Claude to bail early

> "If an approach fails or gets complicated, STOP and re-plan —
> don't keep pushing down a broken path."

<aside>

Without this, Claude can dig deep into a wrong solution before
realizing. With it, Claude tends to surface and ask sooner.

</aside>

---

## Don't accept "done" without proof

> "Never mark a task complete without proving it works
> (run tests and demonstrate correctness)."

<aside>

The cost of one extra test run is much lower than the cost of a
green checkmark on broken code.

</aside>

---

## Ask Claude what it needs

It's surprisingly good at telling you what's ambiguous.

<aside>

Especially before non-trivial tasks. "Anything unclear before you
start?" beats "go ahead" every time.

</aside>

---

## Ask Claude to push back

AI agents will happily do what you ask — which can be a problem when
you've made a mistake.

But you can also ask them to push back and point out any problems in
your thinking.

<aside>

Without explicit permission to disagree, Claude tends to assume you're
right and just execute. Invite the disagreement — especially in design
discussions and architecture reviews.

</aside>

---

## Ask Claude (seriously, ask)

Don't just tell. Consult.

<x-inc>

- "What do you think of this approach?"
- "What would you add to this design?"
- "What are the trade-offs between X and Y?"

</x-inc>

<aside>

Claude's read of a problem is often valuable before you write a line.
You don't have to take the suggestion — the conversation usually
sharpens your own thinking either way. The shift from instructing to
consulting is one of the bigger mindset changes of working with an
agent.

</aside>

---

## Or: instruct, then leave room

> "Do X — but point out if you see a better way."

<aside>

When you know roughly what you want done but don't want Claude to
charge ahead silently if it spots a better path, this hybrid form
gets you both: the work and the feedback. Cheap to bolt onto any
prompt, and the friction cost of a "by the way, you might want to
do Y instead" reply is much lower than discovering it after the
commit.

</aside>

---

## Commit early, rebase later

Make incremental `wip` commits between Claude operations.

For amendments to earlier commits: `git commit --fixup=<sha>` — no
message required.

<aside>

Claude produces a lot of code quickly. Small commits = easy rollback
when something goes wrong, and Claude is quite good at undoing its
own changes if you ask before you commit.

Squash before pushing: `git rebase -i --autosquash` folds fixup
commits into their targets automatically — no manual reordering,
no "squash" markers to type.

</aside>

---

<!-- class: center middle -->

# File format quirks

---

## Markdown

Long-line-per-idea formatting works better than hard-wrapped prose.

<aside>

Soft-wrapped paragraphs survive edits cleanly. Hard-wrapped lines
create diff noise whenever a sentence grows or shrinks, and Claude
has to reflow the whole paragraph on every edit.

</aside>

---

## JSON

Prefer line-per-entry formatting over fully minified or fully pretty-printed.

<aside>

Minified JSON forces a single-line scan. Fully indented JSON puts
every token on its own line — too sparse. The goldilocks zone is
one entry per line, similar to JSONL but actually JSON.

</aside>

---

<!-- class: center middle -->

# Subagents

---

## Subagents start fresh

<x-inc>

- They don't inherit your conversation or your prompt;
- they *do* read `CLAUDE.md`.
- Brief them like a colleague who just walked into the room.

</x-inc>

<aside>

The Agent tool prompt is the agent's entire universe. Include the
context they need, the question to answer, and the format you want
back. Vague prompts produce shallow, generic work.

</aside>

---

## When to reach for subagents

For sequential, conversational work — design, architecture review,
debugging — a single thread with focused prompts usually wins.

Reach for subagents when:

<x-inc each>

- Multiple lookups can run in parallel and don't depend on each other.
- You want noisy or large output kept out of the main session.
- You need a wide-search-space exploration with isolated context.

</x-inc>

<aside>

The "team" metaphor oversells the coordination benefit. Subagents
shine on genuinely independent tasks. For anything you'd want to
follow the reasoning of yourself, single-thread Claude with
sequential prompts ("now focus on tests", "now on architecture") is
simpler — and in practice the results don't seem noticeably better
with a team.

Full feature reference: <https://code.claude.com/docs/en/agent-teams>

</aside>

---

<!-- class: center middle -->

# Useful slash commands

---

## `/resume` — find an old session

Lists previous sessions; fuzzy-find supported.

<aside>

You don't have to remember the magic continuation incantation.

</aside>

---

## `/btw` — ask a side question

Doesn't add to the conversation history.

<aside>

For "what does this flag do" or "remind me what `--depth=1` means"
without polluting the active session.

</aside>

---

## `/status` — token usage and cost

Check current model, version, and session name.

```
Session
Total cost:            $35.04
Total duration (API):  1h 10m 42s
Total duration (wall): 22h 26m 36s
Total code changes:    2350 lines added, 257 lines removed
Usage by model:
    claude-haiku-4-5:  5.4k input, 4.8k output, 233.4k cache read, 194.1k cache write, 2 web search ($0.3152)
     claude-opus-4-7:  408 input, 291.9k output, 39.7m cache read, 1.2m cache write ($34.73)

Current session
█████████                                          18% used
Resets 8:30pm (America/Denver)

Current week (all models)
████▌                                              9% used
Resets Apr 30, 11pm (America/Denver)
```

<aside>

You don't need to keep the web dashboard open. The CLI tells you
what you're spending in real time.

</aside>

---

## `/remote-control` — work from your phone

Makes the session available via claude.ai.

<aside>

Doesn't open local ports. Useful for monitoring a long-running task
from somewhere else, or replying to a question while away from your
desk.

Cool when it works, but currently in alpha.

When the remote session (your phone) connects to the local agent, it can cause
the task the agent is working on to hang. You'll need to disconnect and resume
to fix it. Suggest: don't use remote control on that session again, but start
a new one instead.

</aside>

---

## Make your own slash commands

<x-inc each>

- `~/.claude/commands/<name>.md` — personal, across all projects.
- `<project>/.claude/commands/<name>.md` — shared with the team via git.

</x-inc>

<aside>

Each file is a prompt that runs when you type `/<name>`. Useful for
codebase-specific recipes — "review this PR for X", "regenerate the
fixtures the way we always do", "summarize today's failed CI runs".
Commit the project version so the whole team gets the same shortcuts.

</aside>

---

## Example: a `/wrap-up` command

End-of-session housekeeping:

<x-inc each>

- Review memory and `CLAUDE.md` for stale or duplicate entries.
- Propose migrating personal memory to `CLAUDE.md` when it's become
  a team convention.
- Write a session summary to `WIP.md` so the next session can pick up
  cleanly.

</x-inc>

<aside>

Version-controlled files are the team's source of truth — coworkers
on different machines and different sessions should produce same-y
output. Auto-memory is per-user and quietly drifts; periodic
consolidation pulls durable knowledge into the shared `CLAUDE.md`
so the whole team benefits.

The session-summary half comes from a coworker: end with "write me a
`WIP.md` summarizing what we did, what's pending, and what the next
session should know." Starting fresh from that file beats re-explaining
context for ten minutes.

</aside>

---

## `Esc` once to interrupt

Single `Esc` stops the current operation.

<aside>

Double `Esc` is a different feature — it opens the rewind overlay
to jump back to a previous turn. Easy to confuse.

</aside>

---

## Input shortcuts

<x-inc each>

- `Ctrl+J` — newline without submitting (multi-line input).
- `Ctrl+G` or `Ctrl+X Ctrl+E` — open current input in `$EDITOR`.
- `Ctrl+R` — search history.
- `Ctrl+V` — paste an image.
- `Ctrl+L` — redraw; clear input.
- Emacs-style `Ctrl+A`/`E`/`W` work if your terminal sets them.

</x-inc>

<x-inc>

- `/keybindings` — customize your own.
- `/config` — enable Vim mode! 😮

</x-inc>

<aside>

For long prompts that span sentences or include code, `Ctrl+G` drops
the input into your real editor — much easier than typing in the
constrained input field. The Emacs line-edit gotcha is the one that
will trip up bash/zsh muscle memory the most.

</aside>

---

## Watch the CLI output

Status lines and command transitions surface tips you'd otherwise
miss.

<aside>

The CLI passively reports model info, context usage, and occasional
hints. Don't tune them out — that's where you find out you're about
to hit a token limit, or that there's a slash command for the thing
you're typing the long way.

</aside>

---

## Epilogue

This deck was drafted by Claude Code from a messy, simple, first-draft
outline.

<x-inc each>

- It spotted factual mistakes in my outline and fixed them.
- It restructured the flow into themed sections.
- It verified details (slash commands, `CLAUDE.md` hierarchy) via web lookups.
- It used the same `<x-inc>` and `<aside>` features this deck shows off.

</x-inc>

<x-inc>

_**Eat the dog food.**_

</x-inc>

<aside>

Each correction came from spawning a `claude-code-guide` subagent
that checked the actual docs before rewriting the slide.

The pipeline that built this PDF — the Pandoc setup, the custom HTML
elements for incremental reveals, the per-slide CSS hooks, the
`CLAUDE.md` that taught Claude the slide format — was designed
collaboratively in the same conversation.

</aside>
