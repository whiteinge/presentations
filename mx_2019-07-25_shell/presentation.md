class: center, middle, inverse

# Navigating the Shell

A brownbag workshop at

<img width="200px" src="./mx-logo.svg" alt="MX Technologies">

by Seth House

@whiteinge<br>
seth@eseth.com

---

class: center, middle

# Presentation Scope:<br>Just the Basics

_How not to look like your parents<br>
trying to use a computer._

---

## Cursor

_Archaic mappings and semantics for things you already know how to do._

Key | Description
--- | -----------
|
--

`^a` | Home
--

`^e` | End
--

`^w` | kill word
--

`^u` | kill line
--

`^y` | yank last kill<br>(i.e., paste)

---

## Navigation

_There and back again: A UNIX Tale._

Command | Description
------- | -----------
|
--

`cd` | Go to `$HOME`
--

`cd -` | Toggle between `$OLDPWD` and `$PWD`
--

`..` | Up one directory
--

`git checkout -` | Toggle between branches

---

## History

_How to never, ever, ever type (or remember) any command after the first time._

Tip | Description
--- | -----------
|
--

`^r` | Start searching history
--

`^r` (again) | Next match
--

`^s` | Prev match<br>(but won't work without `stty -ixon`)
--

`!!` | Substitute the last command
--

`!$` | Substitute the last argument from the last command

--

(We'll come back to this one.)

---

## Completion

_How to never blindly stumble around the filesystem._
<br>
_(And self-discover some program arguments too.)_

Tip | Description
--- | -----------
|
--

`Tab` | Show completion options
--

(Sorta...)

---

class: center, middle

# Configuration

_How to ruin your ability to ever use anyone else's shell._
<br>
_(And ruin their ability to use your shell too.)_

---

## `$HOME/.inputrc`

--

* Readline

--

  (Works in `irb` too!)

  ```readline
  $if Ruby
  ...ruby-specific stuff here...
  $endif
  ```

--

* Temporary override (like on a shared server):

  `INPUTRC=/path/to/.inputrc-youruser exec bash`

---

```readline
# Complete by showing an ephemeral menu instead of printing matches.
TAB: menu-complete
# Enable shift-tab to complete backward.
"\e[Z": menu-complete-backward

# Show completion options on first tab; begin cycling on second tab.
set menu-complete-display-prefix on

# Show all available completion options on second tab.
set show-all-if-ambiguous on
set show-all-if-unmodified on

# Avoid duplicating text when completing an option mid-word.
set skip-completed-text on

# Use colors in the completion options.
set colored-stats on

# Treat symbols as word delimiters too.
set bind-tty-special-chars off

# Expand C-w to use more than just whitespace as a delimeter.
"\C-w": backward-kill-word

# Complete the current line from the shell history.
"\C-p": history-search-backward
"\C-n": history-search-forward
```

---
class: center, middle

# Extras

---

## `$HOME/.bashrc`

--

```sh
PS1='\w \$ '

alias ls='ls -F --color'
alias ll='ls -l'
```

---

## Git Prompt Status & Completion

Homebrew, XCode, Apple's "Command Line Tools":<br>
It's probably already on your system somewhere.

--

```
% find / -name 'git-prompt\.sh' 2>/dev/null
/usr/local/etc/bash_completion.d/git-prompt.sh
/Library/Developer/CommandLineTools/usr/share/git-core/git-prompt.sh
/Applications/Xcode.app/Contents/Developer/usr/share/git-core/git-prompt.sh
```

```
% find / -name 'git-completion\.bash' 2>/dev/null
/usr/local/etc/bash_completion.d/git-completion.bash
/Library/Developer/CommandLineTools/usr/share/git-core/git-completion.bash
/Applications/Xcode.app/Contents/Developer/usr/share/git-core/git-completion.bash
```

---

## `$HOME/.bashrc`

```sh
source /usr/local/etc/bash_completion.d/git-prompt.sh
source /usr/local/etc/bash_completion.d/git-completion.bash

GIT_PS1_SHOWCOLORHINTS=1
GIT_PS1_SHOWDIRTYSTATE=1
GIT_PS1_SHOWSTASHSTATE=1
GIT_PS1_SHOWUPSTREAM="verbose"

function __git_ps1_sha() { git rev-parse --short HEAD 2>/dev/null; }

PROMPT_COMMAND='__git_ps1 "\w" " \$ " " ($(__git_ps1_sha) %s)"'
```

---

class: center, middle

# Discussion!
