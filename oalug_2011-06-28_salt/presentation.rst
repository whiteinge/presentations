====
Salt
====

:Organization: Ogden Area Linux User Group
:Author: Seth House <seth@eseth.com>
:Date: 2011-06-27

Getting started
===============

Getting started

Overview
--------

.. container:: r2b-note

    “Salt allows commands to be executed across large groups of servers. […]
    Quick introspection into running systems becomes a reality. […] Between the
    remote execution system, and state management Salt addresses the backbone
    of cloud and data center management.”

    — http://saltstack.org/

“Remote execution manager”

Installation
------------

.. container:: r2b-note

    1.  Install the dependencies.
    2.  Install Salt.
    3.  Configure the minion(s) to point at the master.
    4.  Start all the daemons.
    5.  Accept the minion keys.
    6.  Done!

::

    easy_install \
        https://github.com/downloads/thatch45/\
        salt/salt-0.8.8.tar.gz

CLI tools
---------

* ``salt``
* ``salt-master``
* ``salt-minion``
* ``salt-key``
* ``salt-cp``
* ``salt-call``

Using minions
=============

Using minions

Specifying targets
------------------

* ``salt 'host*' test.ping``
* ``salt -E 'host[1-3]' test.ping``
* ``salt -L host1,host2,host3 test.ping``
* ``salt -G 'os:Ubuntu' test.ping``

  * ``salt '*' grains.items``

* ``salt '*' cmd.run,test.ping,test.echo 'whoami',,foo``
* ``salt -X cmd.retcode 'which zsh' test.ping``

Running functions (modules)
---------------------------

.. container:: r2b-note

    ``__salt__['cmd.run']``
        Call other loaded modules from a module.

    ``__virtual__``
        Returns a string or False

    ``returner()``
        Specify how/where to return the result.

* ``salt '*' sys.doc | less``
* ``salt '*' sys.doc test.ping``

Getting the results (returners)
-------------------------------

.. container:: r2b-note

    Any module with a returner() function.

* Redis

Enforcing state (states)
------------------------

::

    apache2:
        pkg:
          - installed
        service:
          - running
          - require:
            - pkg: apache2

Enforcing state (renderers)
---------------------------

::

    {% for item in 'apache2','postgresql' %}
    {{ item }}:
        pkg:
            - installed
    {{ item }}:
        pkg:
          - installed
        service:
          - running
          - require:
            - pkg: {{ item }}
    {% endfor %}

The future of Salt
==================

The future of Salt

The Salt stack
--------------

.. container:: r2b-note

  * Salt

    * Core communication and execution

  * Butter

    * Stats gathering
    * Monitoring
    * Cloud computing

  * Ghee

    * Web GUI for Salt
    * Interface for Butter

* Remote execution
* Configuration management
* Monitoring
* Stats
* Provisioning/automating cloud servers
