=====================================================
Zsh: A high-level overview of shell-use and scripting
=====================================================

:Organization: Utah Open Source Conference 2012
:Author: Seth House <seth@eseth.com>
:Date: 2012-05-05

Why Zsh
=======

**Why Zsh**

A short history
---------------

* Written in 1990 by Paul Falstad at Princeton University
* Named for the login of a teaching assistant, Zhong Shao
* Implements many of the features of bash, ksh, and csh

Basics
------

* ``~/.zprofile``
* ``~/.zshrc``
* ``~/.zlogin``
* ``~/.zlogout``

Interactive setup
-----------------

::

    autoload -Uz zsh-newuser-install
    zsh-newuser-install -f

Compatibility Modes
-------------------

Tries to emulate *sh* or *ksh* when invoked as ``sh`` or ``ksh``,
respectively.

Themeable Prompts
-----------------

Preview all built-in themes::

    prompt -p

Shell Options
-------------

* ``auto_cd``
* ``extendedglob``
* ``no_clobber``
* ``rm_star_wait``
* ``share_history``

Spelling correction
-------------------

::

    % setopt correct
    % sl

Zsh Line Editor (``zle``)
-------------------------

* **Zsh does not use readline!**
* Excellent Multiline Editing

zmv
---

::

    zmv '(*)-(*).mpeg3' '$2_$1.mp3'
    alias mmv='noglob zmv -W'
    mmv *pl.bak backups/*.pl

Alias Suffixes
--------------

Allow for default handlers based on file extensions::

    alias -s \
        php="/usr/share/vim/vim73/macros/less.sh"

Global aliases
--------------

::

    alias -g IN='..@{u}'
    alias -g OUT='@{u}..'
    alias -g UP='@{u}'

Glob Qualifiers
===============

**Glob Qualifiers**

``zshexpn(1)`` manpage under "Glob Qualifiers"

Globbing
--------

Recursive Search
    ``**/``
Numeric Ranges
    ``ls file<1-5>``, ``ls file<50->``
Negate Matches
    ``ls ^*.o``
Grouping
    ``ls (foo|bar)``

Globbing Basics
---------------

Regular Files
    ``ls *(.)``
Irregular Files
    ``ls *(^.)``
Directories
    ``ls *(/)``
Executable Files (non-directories)
    ``ls *(*)``
Symbolic Links
    ``ls *(@)``
Follows Symbolic Links
    ``ls *(-)``

File access time
----------------

For files accessed less than 5 hours ago::

    ls *(ah-5)

* `a` file access time (atime)
* `m` file modification time
* `c` inode change time

Time can be either `+` or `-` the current time.

Units:

* `M` months
* `w` weeks
* `h` hours
* `m` minutes
* `s` seconds

File size
---------

For files of size ((L)ength) greater than 100 KB::

    ls (Lk+100)

Size can be specified with `-` or `+` and units can be specified with
kilobytes `k`, megabytes `m`, gigabytes `g`, or blocks `P`.

File types
----------

For all directories::

    ls *(/)

Type units can be directories `/`, non-empty directories `F`, regular files
`.`, symbolic links `@`, sockets `=`, fifos `p`, executable files `*`,
device files `%`, block special `%b`, character special `%c`.

Files on device
---------------

Only list files on the specified device::

    ls *(d65030)

File permissions
----------------

owner, group, world-readable, writable, executable, setuid, setgid, sticky::

    ls *(r)     # readable by the current user
    ls *(U)     # owned by the current user
    ls *(u1000) # owned by uid 1000

Long-form (`-`, `+`, `=` and octal)::

    ls *(f:gu+w,o-rx:)

Current user: ``(r)``, ``(w)``, ``(x)``
All users: ``(R)``, ``(W)``, ``(X)``
Owned by you: ``(U)``
Setuid: ``(s)``, ``ls /**/*(s)``

Globbing Combinations
---------------------

Readable, not writable for you::

    ls *(r^w)

Executable files (after following symbolic links)::

    ls *(-*)

Broken Symbolic Links::

    rm *(-@)


Completion
==========

**Completion**

Completion
----------

* compinit
* compinstall
* bashcompinit

Completion style syntax::

    :completion:function:\
        completer:command:argument:tag

Completion Caching
------------------

Cache expensive completions::

    zstyle ':completion:*' use-cache on
    zstyle ':completion:*' cache-path ~/.zsh/cache

    % rm ~/.zcompdump && exec zsh

Completion Sorting
------------------

Sort specific completions::

    zstyle ':completion:*:*:xdvi:*' menu yes select
    zstyle ':completion:*:*:xdvi:*' file-sort time

Arrays
======

**Arrays**

``zshexpn(1)`` manpage under "PARAMETER EXPANSION"

``zshparam(1)`` manpage under "ARRAY PARAMETERS"

Arrays
------

Joins, splits, set operations(!)

Argument handling
=================

``zshmodules(1)`` manpage under "zparseopts"

zparseopts
----------

::

    function mplayerx2() {
        local -a args
        zparseopts -D -E -a args -- s: -speed:
        mplayer -af scaletempo -speed ${args[2]:=1.5} $1
    }
