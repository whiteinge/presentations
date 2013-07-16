====================
Vim: the why and how
====================

:Organization: Provo Linux User Group
:Author: Seth House <seth@eseth.com>
:Date: 2013-07-16

.. include:: /home/shouse/src/presentations/beamerdefs.txt

|logo<|

.. image:: img/logo.pdf
    :height: 0.5 cm
    :align: right

|>|

Why Vim?
========

A (very) little history
-----------------------

.. container:: note

    Why are we here to talk about an editor that is old enough to drink?

    * Vi IMproved
    * Has a vi-compatibility mode (no ~/.vimrc)
    * Still not POSIX-compliant
    * ed (1971) -> em (Editor for Mortals) -> en -> ex (extended) (1976) -> vi (1977)
    * vi ~120 KB
    * sed (1973)

.. container:: frame

    * First release — 1991 |pause|
    * Latest release — |pause| last week

.. container:: frame

    .. figure:: img/Adm3aimage.jpg
        :width: 60 %
        :target: http://en.wikipedia.org/wiki/File:Adm3aimage.jpg

        Lear Siegler ADM-3A terminal

.. container:: frame

    .. figure:: img/keyboard.pdf
        :width: 90 %
        :target: http://en.wikipedia.org/wiki/File:KB_Terminal_ADM3A.svg

        Lear Siegler ADM-3A keyboard layout

A philosophy
------------

.. container:: frame

    * Fingers on the home-row
    * Terse, predictable commands
    * Extreme speed
    * Extreme flexibility
    * UNIX as the IDE

Getting started
---------------

.. container:: frame

    |pause| However you're comfortable

.. container:: frame

    .. image:: img/learning_vi_vim.jpg
        :align: right
        :width: 30 %

    .. image:: img/hacking72_front.png
        :align: left
        :width: 30 %

    http://iccf-holland.org/click5.html

.. container:: frame

    .. image:: img/gvim.png
        :width: 80 %

.. container:: frame

    1.  Turn off vi-compatibility

        * Create a ``~/.vimrc`` or ``~/.gvimrc`` |pause|

    2.  Turn on filetype detection (plugins and indentation)

        * ``filetype plugin indent on`` |pause|

    3.  Turn on the completion menu

        * ``set wildmenu``

Getting help
------------

.. container:: note

    Discover key bindings in the various modes.

.. container:: frame

    * ``:help`` |pause|

      * ``:tab help`` |pause|

    * ``:help <bs`` <tab> |pause|
    * ``:help i_`` <tab>
    * ``:help modes`` <tab>

Basics
======

.. container:: note

    Vim: the why and how

    Vim continues to be an incredibly popular editor despite a seemingly arcane
    interface. To appreciate why requires an explanation of a short philosophy
    and a basic orientation. This talk will cover how to think about Vim and
    how to get started. It is aimed at beginners and intermediate users;
    advanced users are encouraged to chime in with tips and personal
    experiences.

Modes
-----

.. container:: frame

    * Normal
    * Insert
    * Visual
    * Command mode

Normal mode: motions
--------------------

.. container:: note

    :help motion.txt

.. container:: frame

    Cursor motions

    * Right/up/down/left: ``h``, ``j``, ``k``, ``l`` |pause|
    * Beginning/end of line: ``0``, ``$`` |pause|

    Word motions

    * Next/prev word beginning: ``w``, ``b``
    * Next/prev word ending: ``e``, ``ge`` |pause|

    Character jump

    * Find char: ``f{char}``, ``F{char}``
    * Find char: ``t{char}``, ``T{char}`` |pause|
    * Repeat find: ``;``, ``,``

    Other movement

    * Sentences: ``)``, ``(``
    * Paragraphs: ``}``, ``{``

Normal mode: counts
-------------------

.. container:: frame

    Motions can be preceeded by counts

    * ``5j``
    * ``3w``
    * ``2}`` |pause|

    See line numbers as relative distance::

        :set relativenumber

Normal mode: edits
------------------

.. container:: frame

    Verbs and nouns (and counts)

    * Change ``c``, ``C``, ``cc``
    * Delete ``d``, ``D``, ``dd``
    * Copy (yank) ``y``, *Y*, ``yy`` |pause|

      * ``map Y y$``

    Modifiers (adjectives)

    * A word/inner word: ``aw``, ``iw``
    * A sentence/inner sentence: ``as``, ``is``
    * A paragraph/inner paragraph: ``ap``, ``ip``
    * A tag/inner tag: ``at``, ``it``
    * Other text objects: ``"``, ``'``, ``>``, ``}``, ``)``, ``]``, `````
      |pause|

    Repeat

    * ``.``

    Joins

    * ``J``

Normal mode: window movement
----------------------------

.. container:: frame

    Scrolling window

    * Page up/down: ``ctrl-f``, ``ctrl-b``
    * Half-page up/down: ``ctrl-d``, ``ctrl-u``
    * Single-line up/down: ``ctrl-y``, ``ctrl-e`` |pause|

    Window positioning relative to cursor

    * Top/middle/bottom: ``zt``, ``zz``, ``zb``

Normal mode: cursor movement
----------------------------

.. container:: frame

    Cursor placement within window

    * Head/middle/last: ``H``, ``M``, ``L`` |pause|

    Moving the cursor line-wise

    * Top of file, bottom of file: ``gg``, ``G`` |pause|
    * Specific line: ``<number>gg``, ``<number>G``

Insert mode: edits
------------------

.. container:: note

    :help insert.txt

.. container:: frame

    * Insert: ``i``, ``I``
    * Append: ``a``, ``A``
    * Delete word: ``ctrl-w``
    * Delete line: ``ctrl-u``
    * Dedent/indent: ``ctrl-d``, ``ctrl-t``

Visual mode: selections
-----------------------

.. container:: frame

    * Character-wise selection: ``v``
    * Line-wise selection: ``V``
    * Block-wise selection: ``ctrl-v``

    Use repeat operator with a visual selection::

        vnoremap . :normal .<cr>

Command mode
------------

.. container:: frame

    * ``:wq``, ``:x``, ``:wqa``, ``:xa``
    * ``:qa!``
    * ``:r <filename>``

Command mode: edits
-------------------

.. container:: frame

    Search/replace

    * ``:%s/foo/bar/g``
    * ``:%s/foo/bar/gc`` |pause|

    Ranges

    * Line 23: ``23`` |pause|
    * Entire file: ``%`` (same as ``1,$``) |pause|
    * Line 4 to "some text": ``4,/some text/`` |pause|
    * Current line to last line: ``.,$`` |pause|
    * Line below line containing "that": ``/that/+1``

Command mode: search (``/``, ``?``)
-----------------------------------

.. container:: frame

    * ``/{pattern}``

    Search settings::

        set hlsearch
        set ignorecase
        set smartcase
        set incsearch

Command mode: filter (``!``)
----------------------------

.. container:: frame

    * ``:%!json_reformat`` |pause|
    * ``:.!ls /path/to/file``
    * ``:'<,'>!sort -rnu``

Stupid Vim tricks
-----------------

.. container:: frame

    Transient shell scripts

    1.  ``ls *.JPEG | vi -``
    2.  ``:%s/.*/mv -i & &/g``
    3.  ``:%s/JPEG$/jpg/g``
    4.  ``:w !sh``

UNIX as an IDE
--------------

.. container:: frame

    * Filter
    * Scripts
    * ``makeprg`` (Syntastic)
    * ``ctags`` (Tagbar)

Buffers, windows, and tabs
--------------------------

.. container:: frame

    Buffer
        A file |pause|
    Window
        A view of a file |pause|
    Tabs
        An arrangement of windows

Registers
---------

.. container:: frame

    * ``:reg`` |pause|
    * Numbered registers

      * ``"0`` last yank
      * ``"1`` to ``"9`` last 9 deletes |pause|

    * Small delete (less than one line) |pause|
    * 26 named registers |pause|
    * Last search register |pause|
    * Selection registers ``*``, ``+``

      * ``:version``

An exercise left to the reader
==============================

What haven't we talked about?
-----------------------------

.. container:: frame

    * Macros
    * Completion
    * Diffing / merging
    * Encrypt files
    * Scripting languages
    * Folding
    * Editing compressed files
    * Editing network files
    * Sessions
    * Spell checking
    * Unicode
    * Syntax highlighting
    * Cursor position histories
    * Undo/redo tree

File type settings
------------------

.. container:: frame

    * ``:help ft-`` <tab> |pause|
    * ``~/.vim/ftplugin/<filetype>.vim``

Plugins
-------

.. container:: frame

    General

    * Pathogen / Vundle |pause|
    * Gundo |pause|
    * NERDtree |pause|
    * Powerline |pause|

    Scripting / programming

    * Syntastic |pause|
    * Tagbar |pause|

    Version control

    * Fugitive |pause|
    * git-gutter
