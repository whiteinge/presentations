==================
Stupid tmux tricks
==================

:Organization: Ogden Area Linux User Group
:Author: Seth House <seth@eseth.com>
:Date: 2013-01-29

Why tmux
========

    “tmux is a terminal multiplexer: it enables a number of terminals (or
    windows), each running a separate program, to be created, accessed, and
    controlled from a single screen. tmux may be detached from a screen and
    continue running in the background, then later reattached.”

    — http://tmux.sourceforge.net/

Coming from GNU screen
----------------------

::

    /usr/share/doc/tmux-1.6/examples/screen-keys.conf

::

    ctrl-a ?

::

    man tmux

Windows
-------

::

    last-window
    next-window
    previous-window
    choose-window

Splits & layouts
----------------

::

    split-window -h
    split-window -v
    next-layout
    previous-layout

Panes
-----

::

    mouse-select-pane on
    select-pane -L
    select-pane -D
    select-pane -U
    select-pane -R
    command-prompt "resize-pane -L %1"
    command-prompt "resize-pane -D %1"
    command-prompt "resize-pane -U %1"
    command-prompt "resize-pane -R %1"
    setw synchronize-panes

Scrollback
----------

::

    set -g history-limit 10000

* Search forward/backward
* Copy to a buffer
* Block selection

Multiple buffers
----------------

::

    list-buffers

Piping buffers
--------------

::

    bind > command-prompt -p "Write buffer:" \
        "run 'tmux save-buffer -b %1 - \
            | xclip -i -select clipboard'"
    bind < command-prompt -p "Read into buffer:" \
        "run 'xclip -o -selection clipboard \
            | tmux load-buffer -b %1 -'"

Interactive command-line
------------------------

::

    :clear-history
    :kill-window

Toggling bindings
-----------------

Omit the ``on`` or ``off``::


    bind m setw monitor-activity on
    bind m setw monitor-activity

Interactive binding
-------------------

Use ``command-prompt``::

    bind M command-prompt -p \
        "monitor-silence (seconds)" \
        "setw monitor-silence %%"

Scripting layouts
-----------------

::

    tmux splitw; tmux splitw; tmux splitw; \
    tmux selectl main-horizontal;

.. FIXME Add slides on
    * tmux powerline
    * wemux
    * tmuxinator
    * vimux
