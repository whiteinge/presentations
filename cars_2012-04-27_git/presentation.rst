========================================
Git mastery in twenty minutes increments
========================================

:Organization: Cars.com
:Author: Seth House <shouse@cars.com>
:Date: 2012-07-24

.. include:: ../beamerdefs.txt

.. 1.   Create a loose outline of ideas, references, and talking points.
.. 2.   Categorize into: must know, need to know, don't need to know (cut).
.. 3.   Restructure into the following sections:
..
    * Opening. Capture attention; avoid introductions and fluff.
    * Current situation. Establish importance.
    * Recommendation.
    * Benefits. Personalize for the audience.
    * Evidence. Support the recommendation; don't revisit current situation.
    * Summary. Short!
    * Action steps. Specific actions; specific time-frame.

.. Outline:
    1. Objects
    2. refnames
    3. Remotes
    4. Rebase

Introduction
============

A series of twenty-minute presentations on Git.

.. figure:: img/progit.jpg
    :width: 50px

    Only essential information is presented here; for in-depth knowledge check
    the slide notes for references and read the Pro Git book by Scott Chacon.

    http://git-scm.com/book/

Understanding Git objects
=========================

Commit objects
--------------

sha1 hash of:

* Message
* Author / committer
* Date
* Parents (if any)
* Pointer to the contents (tree)

Demonstration
-------------

.. container:: r2b-note

    ::

        % git init /tmp/testrepo
        Initialized empty Git repository in /tmp/testrepo/.git/

        % cd /tmp/testrepo

        % touch A

        % git add A

        % git ci -m "Added A"
        [master (root-commit) 78f90b1] Added A
        0 files changed, 0 insertions(+), 0 deletions(-)
        create mode 100644 A

        % touch B

        % git add B

        % git ci -m "Added B"
        [master 77dac77] Added B
        0 files changed, 0 insertions(+), 0 deletions(-)
        create mode 100644 B

        % git cat-file -p HEAD~1
        tree 7c178d1296d8b87e83382c324aeb32e2def2a5af
        author Seth House <shouse@cars.com> 1343066015 -0700
        committer Seth House <shouse@cars.com> 1343066015 -0700

        Added A

        % git cat-file -p HEAD
        tree c448aecc36a5100553afa394feb0fcdb30aa2ac8
        parent 78f90b1022fe51e876ef1d9d16b549926c7f304b
        author Seth House <shouse@cars.com> 1343066025 -0700
        committer Seth House <shouse@cars.com> 1343066025 -0700

        Added B

* Create two commits
* View the raw commit

Branches
--------

.. container:: r2b-note

    If you have a feature branch off master, then you merge that branch back
    into master, then you "delete" that branch using ``git branch -d
    myfeature`` Git does not lose information (only the ref).

* A commit knows its parents!
* Branch names are for humans

  * master
  * origin/master

Demonstration
-------------

.. container:: r2b-note

    ::

        % git checkout -b myfeature master
        Switched to a new branch 'myfeature'

        % touch C

        % git add C

        % git ci -m "Added C"
        [myfeature e57bbdb] Added C
        0 files changed, 0 insertions(+), 0 deletions(-)
        create mode 100644 C

        % git checkout master
        Switched to branch 'master'

        % git merge --no-ff myfeature
        Merge made by the 'recursive' strategy.
        0 files changed, 0 insertions(+), 0 deletions(-)
        create mode 100644 C

        % git graph-dag master | dot -Tpng | display

        % git branch -d myfeature
        Deleted branch myfeature (was e57bbdb).

        % git graph-dag master | dot -Tpng | display

* Create feature branch (off master)
* Make a commit
* Merge into master
* Delete the branch

Directed acyclic graph (DAG)
----------------------------

.. container:: r2b-note

    A DAG is a graph that moves in one direction and does not circle back on
    itself. (I'm sure that description is missing some nuance.)

    Say two clones of a repo have wildly divergent histories for a long period
    of time and then one is fetched into the other. The incoming repository
    history will simply be added to the DAG starting at where they diverged.

    Your repository::

        % for commit in A B C D
        for> touch $commit && git add $commit && git commit -m "Added $commit"

.. figure:: img/branchone.pdf

Directed acyclic graph (DAG)
----------------------------

.. container:: r2b-note

    Their repository::

        % for commit in E F G H I
        for> touch $commit && git add $commit && git commit -m "Added $commit"

.. figure:: img/branchtwo.pdf

Directed acyclic graph (DAG)
----------------------------

.. container:: r2b-note

    Your repository after fetching their repository.

.. figure:: img/branchesonetwo.pdf

Understanding Git refnames
==========================

Git refs
--------

.. container:: r2b-note

    We saw previously that deleting a "branch" does not delete the branch in
    the DAG but rather just removes the refname that points to that section of
    the DAG.

    * A "branch" is a ref that moves with each commit to the tip of the current
      branch in the DAG. It points to a commit object.
    * A remote is a ref that serves as a bookmark for where the remote
      repository "branches" are since the last time you fetched.
    * HEAD is a pointer to a ref that is used to track what branch you are on.
    * A lightweight tag is a "branch" that never moves.

      * An annotated (heavy) tag is a tag object (similar to a commit object)
        that points to a commit.

"refname" may refer to:

* sha1
* ``master``
* ``origin/master``
* ``HEAD``
* ``HEAD~1``
* Tags
* Many, many others; see ``git-rev-parse(1)`` for more

refs are for humans
-------------------

.. container:: r2b-note

    This is a lie to emphasize that refs are ephemeral; keep reading.

* A ref points to an object
* That's it

Demonstration
-------------

.. container:: r2b-note

    ::

        % cat .git/HEAD
        ref: refs/heads/master

        % git branch -v
        * master 4a217bd Merge branch 'branchtwo'

        % mv .git/refs/heads/master .

        % git branch -v

        % cat master
        4a217bd8451707396b8168efd73f426e877846b4

        % git graph-dag 4a217bd8 | dot -Tpng | display

        % mv master .git/refs/heads

* Delete the ref that points to ``master``

.. container:: r2b-note

    Since our testrepo does not yet have a remote defined this example is taken
    from elsewhere but note how the sha1 for each ref is identical. Each ref is
    pointing to the exact same location in the DAG::

        % cat .git/refs/heads/master
        bc41940d503c9a9254080eb995b800908fae19ff

        % cat .git/refs/remotes/upstream/master
        bc41940d503c9a9254080eb995b800908fae19ff


Objects without refs are garbage collected
------------------------------------------

.. container:: r2b-note

    I lied. Git plumbing does care about refs.

* Unreachable objects older than 30 days
* The reflog counts as a reference

  * reflog entries are pruned after 90 days

Demonstration
-------------

.. container:: r2b-note

    ::

        % git checkout -b doomedtofailure
        Switched to a new branch 'doomedtofailure'

        % touch Z

        % git add Z

        % git ci -m "Added Z"
        [doomedtofailure 833dee4] Added Z
        0 files changed, 0 insertions(+), 0 deletions(-)
        create mode 100644 Z

        % git graph-dag master HEAD | dot -Tpng | display

        % git co master
        Switched to branch 'master'

        % git branch -D doomedtofailure
        Deleted branch doomedtofailure (was 833dee4).

        % git graph-dag master | dot -Tpng | display

        % git graph-dag master 833dee4 | dot -Tpng | display

        % git fsck --unreachable

        % git --no-pager reflog --date=relative
        4a217bd HEAD@{5 minutes ago}: checkout: moving from doomedtofailure to master
        833dee4 HEAD@{5 minutes ago}: commit: Added Z
        4a217bd HEAD@{5 minutes ago}: checkout: moving from master to doomedtofailure
        4a217bd HEAD@{11 hours ago}: merge branchtwo: Merge made by the 'recursive' strategy.
        e74f3cf HEAD@{11 hours ago}: checkout: moving from branchtwo to master
        e343dbe HEAD@{12 hours ago}: commit: Added B
        e74f3cf HEAD@{12 hours ago}: checkout: moving from master to branchtwo
        e74f3cf HEAD@{12 hours ago}: commit (initial): Added A

        % git fsck --unreachable --no-reflogs
        unreachable commit 833dee43cc88852bc44cad3b0963627a44483a80
        unreachable tree 9a1920489f280899d7f40cc957db0dcbb8d7ef80

* Create a branch
* Make a new commit
* Delete that branch

Understanding Git remotes
=========================

Remotes
-------

* Fetching from a remote adds to your local DAG
* "Remote branches" are stored locally
* You don't need to define a remote to fetch

Demonstration
-------------

.. container:: r2b-note

    This builds off our example from the end of the first section. We have a
    local repository with a branch ``branchone`` containing commits B, C, and
    D. We have a remote repository with a branch ``branchtwo`` containing
    commits E, F, G, H, and I.

    The file A contains text that has been similarly changed in both branches.
    This will be a merge conflict.

    ::

        % git fetch https://github.com/shouse-cars/testrepo.git
        From https://github.com/shouse-cars/testrepo
         * branch            HEAD       -> FETCH_HEAD

        % git fetch https://github.com/shouse-cars/testrepo.git branchtwo:mybranchtwo
        From https://github.com/shouse-cars/testrepo
         * [new branch]      branchtwo  -> mybranchtwo

        % git branch -D mybranchtwo

        % git remote add upstream https://github.com/shouse-cars/testrepo.git

        % git fetch --all --tags
        Fetching upstream
        From https://github.com/shouse-cars/testrepo
         * [new branch]      branchtwo  -> upstream/branchtwo
         * [new branch]      master     -> upstream/master

        % git --no-pager log --oneline --decorate branchone..upstream/branchtwo
        3cd72d7 (tag: I, upstream/branchtwo) Added I
        7d94a91 (tag: H) Added H
        fb1db9c (tag: G) Added G
        95b4047 (tag: F) Added F
        f41f082 (tag: E) Added E

        % git --no-pager log --oneline --decorate upstream/branchtwo..branchone
        a053d49 (tag: D, branchone) Added D
        7858d16 (tag: C) Added C
        4938b78 (tag: B) Added B

        % git --no-pager diff --stat branchone..upstream/branchtwo
         A |    2 +-
         1 files changed, 1 insertions(+), 1 deletions(-)

        % git difftool branchone..upstream/branchtwo

        % git show branchone..upstream/branchtwo

        % git --no-pager diff branchone..upstream/branchtwo -- A
        diff --git a/A b/A
        index a85c644..e47f59e 100644
        --- a/A
        +++ b/A
        @@ -1 +1 @@
        -Something 1n Here Is Wrong.
        +Something In Here Is Wrong.

        % git merge --no-ff upstream/branchtwo
        Auto-merging A
        CONFLICT (content): Merge conflict in A
        Automatic merge failed; fix conflicts and then commit the result.

        % git mergetool

* Fetch a remote branch
* Compare commits
* Compare changes
* Merge the remote branch

Remote tracking
---------------

.. container:: r2b-note

    Add tracking::

        % git branch --set-upstream master upstream/master

    Add tracking during a push::

        % git push -u origin mybranch

    Quick comparison::

        % git status
        # On branch salt-shebangs
        # Your branch is ahead of 'origin/develop' by 1 commit

    Here's a (truncated) snippet from my Salt clone::

        % git branch -v
        * develop                e5ea497 Merge pull request #1691 from techhat
          doc-authentication     05908f7 [ahead 1] wip: Added documentation on
          doc-backward-compat    0702a7f [ahead 1] wip: Added doc on Salt's ba
          doc-community          7faf4d7 [ahead 1] wip: Added a styleguide and
          doc-componentgraph     36afc12 [ahead 1] wip: Added component graphi
          doc-faq                5b0ef1b [ahead 1] wip: Added FAQ document
          doc-optdeps            8a0dcb8 [ahead 1] wip: Work out a way to list
          doc-renderers          8077a64 [ahead 1] wip: Added doc on jinja ren
          doc-sphinximprovements f24c9a0 [ahead 2] wip: Added a require_sphinx
          doc-topfilegrains      19c013c [ahead 1] wip: Added matching with gr
          doc-topology           496c162 [ahead 1] wip: Added docs on the Salt
          doc-troubleshooting    b9a8529 [ahead 1] wip: Added doc on troublesh
          doc-writing-grains     8bda07d [ahead 1] wip: Added info about writi
          doc-writing-modules    e06bfc3 [ahead 1] wip: Added documentation on
          doc-writing-states     fa1eaa8 [ahead 1, behind 2766] wip: Added doc
          master                 5d7d55f Merge branch '0.10.1'
          salt-define-file_roots baa1039 [ahead 1, behind 3010] Added file_roo
          salt-fixcmdwithenv     19bf131 [ahead 1, behind 2878] Replaced doubl
          salt-fixyumversions    eb0433c [ahead 1, behind 1525] Remove version
          salt-perlpie           4ae8554 Add perlpie module and state.
          salt-shebangs          62909bc [ahead 1] Switch all the shebangs to
          salt-sshfile           ad71bcb [ahead 1, behind 3260] wip: Use the f
          salt-tests             d0f1529 [ahead 3, behind 2806] wip: Added ini
          salt-vcs               2ada7a6 [ahead 1] wip: Added state for managi
          salt-versiongit        14b3a29 [ahead 1] Added Git revision informat
          salt-virtualenv-manage edfda8b Rename virtualenv.manage to managed f
          technoviking-deb       ccfcaa5 [ahead 1, behind 2935] Copied deb pac

    Syntactic sugar::

        % git log --oneline --decorate @{u}..

* At-a-glance comparison
* Syntactic sugar
* Track any ref (not just "remote branches")
