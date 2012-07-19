=======
git svn
=======

:Organization: Cars.com
:Author: Seth House <shouse@cars.com>
:Date: 2012-07-31

.. include:: ../beamerdefs.txt

.. Checklist:
..
    [X] When is the presentation?
    [X] How long is the presentation?
        One hour
    [X] What is the fall-back plan if the presentation duration changes?
        Fewer live demo examples
    [X] How many will attend?
        Sitedev, NCIS, and possibly QA/product due to invite mistake
    [X] Who is the audience? Peers, coworkers, investors, superiors?
        See above
    [X] Who are the key audience members to influence?
        Everyone
    [X] What is the expected audience attention span?
        Great
    [X] Why are these audience members in attendance?
        See git-svn demoed
    [X] What does this audience expect?
        A working knowledge of how to get started with git-svn
    [X] What will get the audience's attention?
        Branch merges, branch comparisons via log, diff
    [X] What is the audience's subject knowledge?
        Good
    [X] Will the audience understand jargon?
        Yes
    [X] What is the expected reaction to the presentation and the presenter?
        Friendly
    [X] What are likely audience questions?
        * Git questions / rebase questions
    [X] What are possible audience questions that will be hard to answer?
        * Settting svn properties
        * svn tags/branches -> git refs

Git
===

.. figure:: img/progit.jpg
    :width: 50px

    http://git-scm.com/book/en/Git-and-Other-Systems-Git-and-Subversion

git-svn
=======

``man 1 git-svn``

Cloning
=======

.. container:: r2b-note

    ::

        % git svn clone -s http://django-syncr.googlecode.com/svn django-syncr

``git svn clone -s svn://path/to/repo``

``git svn clone -T trunk -t tags -b branches svn://path/to/repo``

It's all refs
=============

* Branches are imported as *remote refs*
* Tags are imported *remote refs*

  * Subversion tags are "branches by contract"

Getting around
==============

* ``git svn info``
* ``git svn show-ignore > .git/info/exclude``
* ``git svn log`` (local!)

Committing
==========

* ``git svn dcommit -n``
* ``git svn dcommit``
* All your commits are now rebased!

Creating branches
=================

``git svn branch XXXX-mybranch``

Careful with multiple branches
==============================

.. container:: r2b-note

    git-svn dcommit will commit to the same Subversion branch as the most
    recent commit with git-svn-id in the commit message.

* ``git log --grep='^git-svn-id:' --first-parent -1``
* ``git svn dcommit -n``

Getting around in style
=======================

``git log --oneline --decorate trunk..XXXX-mybranch``

Merging
=======

Merging Subversion branches::

    git merge --no-ff --stat somebranch

Merging Git branches:

* Only fast-forward merges
* Rebase

Staying up-to-date
==================

``git svn fetch``

Remote-tracking branches
========================

* Remember you can remote-track any ref

Customizing complicated trunk/branches/tags
===========================================

.. container:: r2b-note

    git-svn does not automatically handle name collisions! (e.g., two branches
    with the same name on different paths). You must tailor your .git/config
    file carefully.

``.git/config``::

    [svn-remote "svn"]
	url = svn://path/to/repo
	fetch = trunk:refs/remotes/trunk
	branches = branches/*:refs/remotes/*
        # tags = tags/*:refs/remotes/tags/*
	tags = release/tags/{prod,stage}/*\
                :refs/remotes/tags/*
	tags = release/{prod,stage,qa}\
                :refs/remotes/tags/release/*
