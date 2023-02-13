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

## `git cherry-pick`

- Sort of a "manual" rebase if you cherry-pick commits _in order_.

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

- Bigger move from one part of the DAG to another. (More conflict-prone.)

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

---

## Interactive rebase: squash and fixup

---

## Interactive rebase: reword

---

## Interactive rebase: pause and edit

- Amend current commit.
- Add brand new commit.

---

## `git commit --fixup`

- `git rebase --autosquash`
- Manually.
- Use history-search ref syntax `:/Foo`
- Use a fuzzy-finder.
- Others can send you a fixup commit.
