============
Git: Merging
============

:Organization: SaltStack
:Author: Seth House <shouse@saltstack.com>
:Date: 2014-07-17

.. include:: /home/shouse/src/presentations/beamerdefs.txt

|logo<|

.. image:: logo.pdf
    :height: 0.5 cm
    :align: right

|>|

Merging
=======

Not fast-forward merges
-----------------------

.. container:: frame

    * Moves the branch pointer.
    * No changes to the DAG.

Regular commit object; two parents
----------------------------------

.. container:: frame

    * Plain ol' commit object.
    * Two parents.
    * Easy to revert an entire branch merge.

Commit message
--------------

.. container:: frame

    * For humans!
    * Contains default text.
    * Add, edit, or augment.

Merge conflicts
---------------

.. container:: frame

    * Stages all successful automatic merges
    * Surrounds conflicts with conflict markers

Demo: merge conflicts
---------------------

.. container:: note

    .. include:: conflicts.sh
        :code: bash

.. container:: frame

    * Make a branch
    * Make an edit
    * Make a new branch
    * Make a conflicting edit
    * Merge the other branch
    * Resolve the conflict
    * Stage the change
    * Commit (use/modify the default message)

mergetools
----------

.. container:: frame

    Three-way merge.

    * LOCAL
    * BASE
    * REMOTE
    * MERGED

Demo: mergetools
----------------

.. container:: frame

    * View the previous demo with a mergetool.

Roadmap
=======

Where we've been
----------------

.. container:: frame

    Cherry picking has served us well. |pause|

    * Community-centric.
    * Near-zero barrier to commit. |pause|

    Cherry picking doesn't scale to multiple LTS branches.

    * Book-keeping nightmare.
    * Manual back-port to *each* LTS branch.

Where we're going
-----------------

.. container:: frame

    * Don't back-port; merge forward! |pause|
    * (Except for community fixes to LTS branches.) |pause|
    * Git traverses the history when merging.
    * SHAs do not change; commits are grouped; merges are preserved.
    * Git ``log`` and ``diff`` can *intelligently* compare branches.

Merge forward workflow
======================

Requirements
------------

.. container:: frame

    * Feature addition or bug? |pause|
    * One "story" per pull request.

Feature additions
-----------------

.. container:: frame

    * Branch off ``develop``::

        git fetch upstream
        git checkout -b myfeature upstream/develop
        git pull --rebase

    * Open pull request against ``develop``.

Bug fixes
---------

.. container:: frame

    1.  Identify the origin.
            Reproduce the bug on each LTS branch until the original source is
            found. |pause|

    2.  Branch off the oldest affected LTS branch. |pause|

    3.  Open pull request containing the fix against that branch. |pause|

    4.  Merge into oldest affected LTS branch. |pause|

    5.  Merge forward. |pause|

        * Merge the LTS containing the fix into the next-oldest LTS branch.
          |pause|
        * E.g., ``2014.7`` is merged into ``2014.11`` is merged into
          ``2015.4``. |pause|
        * Finally merge into ``develop``.

Community-sent pull requests
----------------------------

.. container:: frame

    * One "story" per pull request.
    * Features opened against ``develop``.
    * Bug fixes opened against current release branch. |pause|

      * Help identify that branch.
      * Ask pull requests be split into single "stories".
      * Ask to re-open a pull request against another branch.

Back-porting community-sent fixes
---------------------------------

.. container:: frame

    We must still back-port fixes to LTS branches. |pause|

    1.  Merge pull request against current release branch. |pause|

    2.  Rebase the entire pull request onto oldest affected LTS:

    ::

        git checkout -b bp-1234 upstream/pr/1234
        git log --topo-order upstream/develop...HEAD
        git rebase --onto 2014.7 <orig-base> bp-1234

    |pause|

    3.  Merge rebased branch into oldest affected LTS:

    ::

        git checkout 2014.7
        git merge -e --no-ff bp-1234

    |pause|

    4.  Annotate the commit message with relevant details. Pull request number,
        original commit SHAs, etc. |pause|

    5.  Open pull request against oldest affected LTS.

    6.  Merge PR. Merge forward; Git will ignore the duplicate content.
