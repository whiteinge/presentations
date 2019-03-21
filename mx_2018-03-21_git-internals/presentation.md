class: center, middle, inverse

<h1 style="color: #777872">
    Git Internals
</h1>

A brownbag workshop at

<img width="200px" src="./mx-logo.svg" alt="MX Technologies">

by Seth House

@whiteinge<br>
seth@eseth.com

???

Bring your laptop, a bash shell, and install graphviz. Grab lunch downstairs
then head up as soon as you can so we can start on time.

Topics (other topic requests welcome):

* Branches.
* Local and remote refs.
* The reflog and garbage collection.
* Visualize the DAG.
* Rebasing and merge strategies.

<!--
Remark cheatsheet:

class: left, center, right, top, middle, bottom

background-image: url(image.jpg)
background-position: center;
background-repeat: no-repeat;
background-size: contain;

count: true
exclude: false


.left-column[
Text here
]

.right-column[
Text here
]

.footnote[
* [Link](http://example.com)
* [Link 2](http://example.org)
* [Link 3](http://example.net)
]
-->

---

## Hands-on; Ask Questions!

--

* `brew install graphviz`

* `apt-get install graphviz`

--

  * Windows users may want something like `wsl-open`.

--

* `curl -L https://git.io/fjfQB -o /usr/local/bin/git-graph-dag`

  (https://github.com/whiteinge/dotfiles/blob/master/bin/git-graph-dag)

--

* Wraps `git rev-list <commit>...`.
--

* Run `git graph-dag` without args to see usage.

  Can also be called directly. (`chmod +x git-graph-dat`)

--

* Note, possible (likely, even) to generate multi-gigabyte images.

  * `ctrl-c` to abort.
  * Limit commit ranges.

---

## Example

```sh
git graph-dag master~10..master origin/master~10..origin/master \
    | dot -Tpng \
    | open -a Preview -f
```

---

class: center, middle

# Graphs & Pointers

---

## Branches

--

* `find .git/refs`

--

* `cat .git/refs/heads/master`

--

* `less .git/packed-refs`

---

# Refs

* Branches (local and remote).

* Tags.

* HEAD.

---

## show

--

* `git show @{u}..`

--

* `show --summary --stat --pretty=fuller --patch`

--

* `printf 'foo\n' | git hash-object -w`

---

## Local and remote refs

* `git fetch`
--

* `git branch --set-upstream-to=origin/master`

---

class: center, middle

# Rebasing

---

## Example

```sh
git init testrepo
cd testrepo
for commit in A B; do git stub $commit; done
git checkout -b feature HEAD~1
for commit in C D E; do git stub $commit; done

# git graph-dag master feature
# git rebase master
# git graph-dag master feature
# git graph-dag master feature <old-E-ref>
```

---

## Interactive

```sh
git init testrepo
cd testrepo
for commit in A B C D E F G; do git stub $commit; done
git rebase -i HEAD~5
```

---

## Reflog

* `git --no-pager reflog --date=relative`
* The reflog counts as a reference!
* Persists for 90-days (default).

---

class: center, middle

# Merging

---

## Merge Conflicts

```diff
<<<<<<< HEAD
twas brillig, and the slithy toves
Did gyre and gimble in the wabe:
all mimsy were the borogoves,
And the mome raths outgrabe.
=======
'Twas brillig, and the slithy toves
Did gyre and gimble in the wabe:
All mimsy were the borogroves
And the mome raths outgabe.
>>>>>>> branchA
```

---

class: center, middle

# Call to Action:<br>Experiment!
