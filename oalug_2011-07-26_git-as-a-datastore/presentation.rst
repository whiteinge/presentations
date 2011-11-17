====================
Git internal storage
====================

:Organization: Ogden Area Linux User Group
:Author: Seth House <seth@eseth.com>
:Date: 2011-07-26

.. raw:: latex

    \beamertemplatenavigationsymbolsempty

Pro Git
=======

.. figure:: img/pro-git.jpg
    :target: http://progit.org/

    http://progit.org/

Git
===

What is Git?
------------

.. container:: r2b-notes

    re: Scott Chacon's presentation at Scottish Rubyconf

* Simple key/value content storage system
* Directory snapshot storage system
* History of directory snapshots system

The Index
---------

Storage for building a snapshot before you commit that snapshot to history.

Branching
=========

A quick note about Git branches

The DAG
-------

.. figure:: img/dag.pdf

refs
----

.. code-block::

    % cat .git/refs/heads/master
    6bf4e7278d0cd3301ac40874d6aca6636c21975d

SHA-1
-----

.. code-block:: bash

    % git cat-file -p HEAD
    tree c448aecc36a5100553afa394feb0fcdb30aa2ac8
    parent 82e9f5ef437004119322389bc9f433655a591e9d
    author Seth House <seth@eseth.com> 1311715135 -0600
    committer Seth House <seth@eseth.com> 1311715553 -0600

    Added B

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

The reflog
----------

.. code-block:: bash

    git reflog --date=relative

Garbage collection
------------------

* Git garbage collects objects with no references that are older than 30 days.
* The reflog counts as a reference.

  * reflog entries are pruned after 90 days.

Visualizing the DAG
-------------------

.. code-block:: bash

    git graph-dag HEAD --all \
        $(git fsck --unreachable \
        --no-reflogs | awk '{print $3}') \
        | dot -Tpng | display

Git as a data store
===================

Using Git as a key-value data store (to build a todo list app)

Inputting data
--------------

.. code-block:: bash

    % echo "walk the dog" \
        | git hash-object -w --stdin
    cfb23f77043b418856a33e4f15178e1298bf02dd

Retriving data
--------------

.. code-block:: bash

    % git cat-file -p \
        cfb23f77043b418856a33e4f15178e1298bf02dd
    walk the dog

Associating data
----------------

.. code-block:: bash

    % git update-index --add --cacheinfo \
        100644 \
        cfb23f77043b418856a33e4f15178e1298bf02dd \
        cfb23f77043b418856a33e4f15178e1298bf02dd
    % git write-tree
    3d936620e22a88f9963e778a85082297e49c2824

Searching data
--------------

.. code-block:: bash

    % git grep --cached dog
    cfb23f77043b418856a33e4f15178e1298bf02dd:walk the dog
