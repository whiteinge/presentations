=====================================
Git: Remotes, Branching, and Rebasing
=====================================

:Organization: Skullcandy
:Author: Seth House <seth@eseth.com>
:Date: 2012-02-03

.. raw:: latex

    \beamertemplatenavigationsymbolsempty

Remotes
=======

Remotes

Viewing remotes
---------------

.. code-block:: bash

    % git remote -v
    origin  git+ssh://git@git.myremote.com/myrepo

Adding remotes
--------------

On a remote machine:

.. code-block:: bash

    git init --bare ~/myrepo.git

Then add the new remote:

.. code-block:: bash

    git remote add myremote git+ssh://myhost/myrepo

Mirroring a repo
----------------

.. code-block:: bash

    git push --mirror myremote

or:

.. code-block:: bash

    git push myremote \
        refs/remotes/myremote/*:refs/heads/*

Remote branches
---------------

.. code-block:: bash

    git branch -r

Remote-tracking branches
------------------------

Create a new branch that tracks the remote:

.. code-block:: bash

    git checkout --track origin/somebranch

Or for existing branches:

.. code-block:: bash

    git branch --set-upstream somebranch\
        origin/somebranch

Or for new branches:

.. code-block:: bash

    git push -u origin mynewbranch

Remote-tracking shorthand
-------------------------

.. code-block:: bash

    git rev-parse --short @{upstream}
    git rev-parse --short @{u}

Viewing differences with upstream
---------------------------------

Overview:

.. code-block:: bash

    git status

Incoming changesets:

.. code-block:: bash

    git log --oneline --decorate ..@{u}

Outgoing changesets:

.. code-block:: bash

    git log --oneline --decorate @{u}..

All local branches:

.. code-block:: bash

    git branch -v

Viewing differences in your prompt
----------------------------------

.. code-block:: bash

    wget https://raw.github.com/git/git/master/\
        contrib/completion/git-completion.bash

Add this to your ``~/.bashrc``:

.. code-block:: bash

    source ~/path/to/git-completion.bash
    GIT_PS1_SHOWUPSTREAM="verbose" # or "auto"

Add ``$(__git_ps1 " (%s)")`` to your ``PS1``:

.. code-block:: bash

    PS1='\u@\h:\W$(__git_ps1 " (%s)")\$ '

``git pull`` considered harmful
-------------------------------

.. code-block:: bash

    git fetch
    git merge @{u}

Or:

.. code-block:: bash

    git fetch
    git rebase @{u}

Branching
=========

Branching

The DAG
-------

.. figure:: img/dag.pdf

refs/heads
----------

.. code-block::

    % cat .git/refs/heads/master
    6bf4e7278d0cd3301ac40874d6aca6636c21975d

Rebasing
========

Rebasing

``commit --amend``
------------------

.. r2b-simplecolumns::

    .. code-block:: bash

        touch A && git add A
        git commit -m "Added A"
        git tag first-commit
        touch B && git add B
        git commit -m "Added B"

    .. figure:: img/ex-amend1.pdf
        :width: 140px
        :align: right

----

.. r2b-simplecolumns::

    .. code-block:: bash

        git commit --amend \
            -m "Added B and stuff"

    .. figure:: img/ex-amend2.pdf
        :width: 140px
        :align: right

Interactive
-----------

.. code-block:: bash

    % git status -s -b
    ## mybranch...origin/develop [ahead 7]
    % git rebase -i @{u} # or git rebase -i HEAD~7

Upstream
--------

.. code-block:: bash

    git fetch
    git rebase @{u}

``rebase --onto``
-----------------

.. code-block:: bash

    git rebase --onto newbranch oldbranch branchname

``reset --soft``
----------------

.. container:: r2b-note

    http://progit.org/2011/07/11/reset.html

1.  Moves the ref ``HEAD`` points to.

``reset [--mixed]``
-------------------

1.  Moves the ref ``HEAD`` points to.
2.  Updates the index to match ``HEAD``.

``reset --hard``
----------------

1.  Moves the ref ``HEAD`` points to.
2.  Updates the index to match ``HEAD``.
3.  Updates the working directory to match ``HEAD``.

The reflog
----------

.. code-block:: bash

    git reflog --date=relative

Garbage collection
------------------

* Git garbage collects objects with no references that are older than 30 days.
* The reflog counts as a reference.

  * reflog entries are pruned after 90 days.
