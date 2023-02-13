class: center, middle, inverse

<h1 style="color: #777872">
    Git Rebase
    <br>
    <span style="font-size: 60%;">
    A deep dive
    </span>
</h1>

A brownbag workshop at

<img width="200px" src="./logo.png" alt="Descartes & Rock Solid Internet Shipping">

by Seth House

@whiteinge<br>
seth@eseth.com

---

## Rebase or merge?

- Commits communicate _intent_ to your teammates.  
  What are you trying to communicate with a given commit/branch?
  - Individual commits that tell the story of a feature addition.
  - A record of when and who updated a branch?
- ...But: don't rebase shared branches.

---

## Amend a commit

```sh
git commit --amend
```
--

```sh
git reset --soft HEAD~1
# git add -p or VSCode open changes view and right-click.
git commit -c ORIG_HEAD
```
--

```sh
# Reuse commit message/authorship.
git commit -C ORIG_HEAD
```
--

```sh
# Amend a commit message
git commit --amend -o
```

---

## `git cherry-pick`

- Sort of a "manual" rebase (order matters).

---

## `git commit --fixup`

Find the commit message:

- Manually.
- Use history-search ref syntax `:/Foo`.
- Use a fuzzy-finder.
- Others can send you a fixup commit. (Similar to a "suggestion" comment in
  GitHub PRs.)

---

## Rebase

Steps:

1.  Does a hard reset on the current branch to the specifed target SHA.
2.  Commits (saved to a temporary directory), are then replayed on the new SHA
    one-by-one.
3.  Merge conflicts are possible, as per a merge.
--

Use cases:

-   Choose a new base SHA to copy commits to a new place in the DAG  
    (and optionally combine/split/modify/drop commits).
-   Choose the _same_ base SHA to only combine/split/modify/drop commits.

---

## `git rebase`

- Defaults to the upstream tracking branch.
- `--continue` and `--abort` flags while in-progress.

???

1.  Create a feature branch off master.
2.  Make a few commits on feature.
3.  Make a commit on master.
4.  Fetch and rebase feature on master.

---

## `git rebase --onto`

-   Use case: change a branch based off `develop` to be based off `master`
    instead.
--

-   `<new base> <old base> <branch to modify>`
--

-   Often a bigger move and more conflict-prone.


???

1.  Create a master branch; add a commit.
2.  Create a develop branch; add a commit.
3.  Create a feature branch off develop.
4.  Rebase the feature branch from develop onto master.

---

## Interactive rebase: introduction

- Open with `-i`.
- Abort with no changes, empty changes, or non-zero exit code  
  (`:cq` in Vim, [feature request in
  VSCode](https://github.com/microsoft/vscode/issues/157961))

--

Helpful:
```sh
git config --global commit.verbose 2
```

---

## Interactive rebase: reorder commits

???

1.  Create commits A, B, C, D.
2.  Reorder commits A, C, B, D.

---

## Interactive rebase: squash and fixup

???

1.  Create commits A, B, C, D.
2.  Squash B into A.
3.  Fixup D into C.

---

## Interactive rebase: reword

???

1.  Create commits A, B, C.
2.  Reword commit B.

---

## Interactive rebase: pause and edit

- Amend current commit.
- Add brand new commit.

???

1.  Create commits A, B, C, D.
2.  Pause on commit B.
3.  Ammend B.
4.  Create a new commit B2.
5.  Finish rebase.

---

## `git rebase --autosquash`

- `git commit --fixup`
- `git commit --amend`
- `git commit --reword`
- Often helpful with `-p` patch commits.

???

1.  Create commits A, B, B2, C.
2.  Edit the B file to add multiple new blocks.
3.  Stage patch change for B, create fixup commit.
4.  Stage patch change for B2, create fixup commit.
5.  Run interactive rebase with `--autosquash`.
