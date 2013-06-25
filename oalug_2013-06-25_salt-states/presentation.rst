==================================
Configuration management with Salt
==================================

:Organization: Ogden Area Linux User Group
:Author: Seth House <seth@eseth.com>
:Date: 2013-06-25

.. include:: /home/shouse/src/presentations/beamerdefs.txt

|logo<| OALUG |>|

Salt states: an introduction
============================

It's all about the data
-----------------------

.. container:: note

    This point is critical to understanding and appreciating Salt's state
    system.

    Salt does not have a configuration language; Salt can use *any* language to
    generate the necessary data structure. Declarative style, imperative style,
    YAML, Python, Ruby, local file system, generated from database queries --
    Salt does not care (and has a variety of built-in options).

    .. code-block:: python

        import yaml

        yaml.load("""\
        httpd:
          pkg:
            - installed
        """)

.. container:: frame

    .. code-block:: yaml

        httpd:
          pkg:
            - installed

.. container:: frame

    Only the data structure matters |pause|

    * YAML
    * Jinja
    * Mako
    * JSON
    * Wempy
    * Python
    * PyDSL |pause|
    * ???

.. container:: frame

    |block<| YAML |>|

    .. code-block:: yaml

        httpd:
          pkg:
            - installed

    |end_block|

    |block<| Generated data structure |>|

    .. code-block:: python

        {'httpd': {'pkg': ['installed']}}

    |end_block|

.. container:: frame

    Declarative / imperative. Full language / templating language. **Your
    choice.**

    .. code-block:: python

        #!pydsl

        apache = state('apache')
        apache.pkg.installed()
        apache.service.running()

Execution happens on the minions
--------------------------------

.. container:: note

    This is also critical to understanding Salt's state system. Since the data
    structure is generated on the minion it has immediate access to the
    entirety of the minion's system. Since high-speed communication with the
    master is ever-present, it can request immediate data from the master or
    from other minions.

    The Salt execution workflow:

    * Minions connect to the master.

      * No req'd open ports on the minion(!)
      * Two open ports on the master

    * The master sends out a pub to all connected minions

      * Target
      * Command

    * Each minion individually determines if the target applies to it.
    * If so, each applicable minion executes the command.
    * If the command requires additional files from the master, they are
      requested and downloaded from the master

      * Only if not yet downloaded
      * Checks for new versions

    * The return from the command is sent back to the master on a dedicated
      reply channel.

    Distributing compilation work across many minions is part of what make Salt
    fast. Note, this is truly asyncronous execution (despite the synchronous
    appearance of the ``salt`` CLI command).

.. container:: frame

    .. code-block:: yaml

        hostname:
          cmd:
            - run

.. container:: frame

    Each minion can take local data and local executions into account.

    .. code-block:: yaml

        apache:
          pkg:
            - installed
            {% if grains['os'] == 'RedHat' %}
            - name: httpd
            {% elif grains['os'] == 'Ubuntu' %}
            - name: apache2
            {% endif %}

.. container:: frame

    Each minion can take local data and local executions into account.

    .. code-block:: yaml

        {% if salt['file.file_exists']
            ('/tmp/specialfile') %}
        dosomething:
          cmd:
            - run
        {% endif %}

Anatomy of the highstate data structure
---------------------------------------

.. container:: note

    The highstate data structure has a one-to-one mapping to the function
    signature for each state module function.

.. container:: frame

    A unique identifier (the key in a dictionary).

    .. code-block:: yaml

        httpd:          # ID declaration
          pkg:
            - installed

.. container:: frame

    The ``pkg`` state module.

    .. code-block:: yaml

        httpd:
          pkg:          # state declaration
            - installed

.. container:: frame

    The ``installed`` function in the ``pkg`` state module.

    .. code-block:: yaml

        httpd:
          pkg:
            - installed # function declaration

.. container:: frame

    This data structure maps to the ``pkg.installed`` function signature.

    .. code-block:: python

        salt.states.pkg.installed(
            name,
            version=None,
            refresh=False,
            fromrepo=None,
            skip_verify=False,
            pkgs=None,
            sources=None,
            **kwargs)

.. vim fix**

.. container:: frame

    .. code-block:: yaml

        httpd:
          pkg:
            - installed
            - version: 2.2.23 # function arg declaration

.. container:: frame

    .. code-block:: yaml

        httpd:
          pkg:
            - installed
            - version: 2.2.23
            - arbitrary: "key/vals are passed as
                          keyword arguments"

.. container:: frame

    The first argument to the function is implictly taken from the ID
    declaration unless specified.

    .. code-block:: yaml

        myapacheinstall:
          pkg:
            - installed
            - name: httpd

.. container:: frame

    Multiple state declarations can live under one ID declaration.

    .. code-block:: yaml

        httpd:
          pkg:
            - installed
          service:
            - running

In summary
----------

.. container:: note

    You don't have to understand Salt states in order to use them because by
    default they're simple YAML.

    For advanced use or to truly take advantage of all Salt's strengths you
    must understand this section before moving to the next.

.. container:: frame

    * Each minion builds it's own data structure.
    * The data structure can be built by any programming language or templating
      engine.
    * All logic happens in that build process.
    * The Salt minion runs *deterministic* executions based on that data
      structure.

Demo: basic states
==================

Installing a package
--------------------

.. container:: frame

    .. code-block:: yaml

        httpd:
          pkg:
            - installed
          service:
            - running

Running states
--------------

.. container:: frame

    * ``state.sls``
    * ``state.highstate`` |pause|
    * ``startup_states`` |pause|
    * ``state.show_highstate``
    * ``state.show_lowstate``

State config options
--------------------

.. container:: frame

    * ``state_verbose``
    * ``state_output``
    * ``failhard``

Tying ``sls`` files together with a top file
--------------------------------------------

.. container:: frame

    |block<| top.sls |>|

    .. code-block:: yaml

        '*':
          - base
        'app*':
          - web_app
        'web*':
          - web_server
        'virtual:virtual':
          - match: grain
          - rackspace_stuff

    |end_block|

Transfering a file from the master
----------------------------------

.. container:: frame

    .. code-block:: yaml

        /srv/http/index.html:
          file:
            - managed
            - source: salt://index.html
            - user: root
            - group: root
            - mode: 644

Execution happens on the minion
-------------------------------

.. container:: frame

    .. code-block:: yaml

        {% if salt["cmd.run"]
            ("free -m | awk '!/^[A-Z ]/ { print $4 }")
            > 2000 %}
        mem_intensive_op:
          cmd:
            - run
        {% endif %}

Templating a YAML file with Jinja
---------------------------------

.. container:: frame

    .. code-block:: yaml

        {% for user in ['fred', 'tom', 'george'] %}
        {{ user }}:
          user:
            - present
        {% endfor %}

Creating Jinja macros
---------------------

.. container:: frame

    .. code-block:: yaml

        {% macro make_user(name) %}
        {{ name }}
          user:
            - present
        {% endmacro %}

        {{ make_user('fred') }}
        {{ make_user('tom') }}
        {{ make_user('george') }}

Salt states: diving deeper
==========================

Special constructs in the highstate data structure
--------------------------------------------------

.. container:: frame

    Salt can alter the data structure at compilation-time if certain constructs
    are present as well as alter the exection flow. |pause|

    Top level:

    * ``include``
    * ``extend``

    |pause|

    Declaration level:

    * ``names``
    * ``require`` / ``require_in``
    * ``watch`` / ``watch_in``
    * ``prereq`` / ``prereq_in``
    * ``use`` / ``use_in``
    * ``failhard``
    * ``order``

``names``
---------

.. container:: frame

    ``names`` will cause the entire dictionary to be duplicated for each item
    in the list.

    .. code-block:: yaml

        phpstuff:
          pkg:
            - installed
            - names:
              - php
              - php-mysql
              - drupal7

.. container:: frame

    .. code-block:: yaml

        php:
          pkg:
            - installed

        php-mysql:
          pkg:
            - installed

        drupal7:
          pkg:
            - installed

.. container:: frame

    (Actually there's a better option for the ``pkg.installed`` function.)

    .. code-block:: yaml

        phpstuff:
          pkg:
            - installed
            - pkgs:
              - php
              - php-mysql
              - php-mbstring
              - php-gd
              - php-xml
              - drupal7

Delay execution until all requirements are met
----------------------------------------------

.. container:: note

    The ``require`` and ``require_in`` statements cause Salt to build a
    dependency tree and delay execution until requirements are met.

.. container:: frame

    .. code-block:: yaml

        httpd:
          pkg:
            - installed

        /etc/httpd/httpd.conf:
          file:
            - managed
            - require:
              - pkg: httpd

.. container:: frame

    .. code-block:: yaml

        httpd:
          pkg:
            - installed
            - require_in:
              - file: /etc/httpd/httpd.conf

        /etc/httpd/httpd.conf:
          file:
            - managed

React to a change in the dependency tree
----------------------------------------

.. container:: note

    ``watch`` is the same as require but will also execute the ``mod_watch``
    function in a state module if one exists. This can be used, for example, to
    restart the Apache service if the Apache config file changes.

.. container:: frame

    .. code-block:: yaml

        httpd:
          pkg:
            - installed
          service:
            - running
            - watch:
              - file: /etc/httpd/httpd.conf

        /etc/httpd/httpd.conf:
          file:
            - managed
            - require:
              - pkg: httpd

Optionally execute a state based on a test run
----------------------------------------------

.. container:: note

    The state with the prereq will execute the required state in test mode. If
    it detects that changes will be made then it will execute itself. If it's
    own execution suceeds then it will execute the prereq.

.. container:: frame

    .. code-block:: yaml

        apachectl graceful:
          cmd:
            - run
            - prereq:
              - git: myapp

        myapp:
          git:
            - latest
            - name: git://internal/myapp.git
            - target: /srv/http/mysite

Reuse default args in multiple states
-------------------------------------

.. container:: frame

    .. code-block:: yaml

        fred:
          user:
            - present
            - fullname: Fred Jones
            - home: /home/fred
            - shell: /bin/zsh
            - groups:
              - wheel

        tom:
          user:
            - present
            - fullname: Tom Smith
            - home: /home/tom
            - use:
              - user: fred

Spread a state tree across multiple files
-----------------------------------------

.. container:: frame

    |block<| services.sls |>|

    .. code-block:: yaml

        httpd:
          pkg:
            - installed
          service:
            - running

    |end_block|

    |block<| app.sls |>|

    .. code-block:: yaml

        include:
          - services

        php:
          pkg:
            - installed
            - require:
              - pkg: httpd

    |end_block|

Modify a state in another file
------------------------------

.. container:: frame

    |block<| app.sls |>|

    .. code-block:: yaml

        include:
          - services

        extend:
          httpd:
            service:
              - watch:
                - git: myapp

        myapp:
          git:
            - latest
            - name: git://internal/myapp.git
            - target: /srv/http/mysite

    |end_block|

Cease all execution on failure
------------------------------

.. container:: note

    Not commonly used. Possibly useful as a replacement for many, many
    occurances of a ``require`` statement.

.. container:: frame

    .. code-block:: yaml

        myapp:
          git:
            - latest
            - name: git://internal/myapp.git
            - target: /srv/http/mysite
            - failhard: True

State ordering
--------------

.. container:: note

    Most if not all ordering should be done through ``require`` statements.
    Occasionally it is useful to be able to add explicit ordering in the case
    of ties or to specify that an action should always occur last.

.. container:: frame

    .. code-block:: yaml

        kernel:
          pkg:
            - latest

        reboot:
          cmd:
            - run
            - order: last

Salt states: fetching data from the master
==========================================

Pillar
------

.. container:: frame

    * Fetch data from the master

      * Flat files on the filesystem
      * Commands that return JSON/YAML
      * Cobbler
      * Hiera
      * libvirt
      * Mongo
      * ldap
      * Puppet |pause|

    * Private data
    * Parameterization
    * Config values
    * Targeting

Private data
------------

.. container:: frame

    A pillar top file dictates which minions see what data.

    |block<| /srv/pillar/top.sls |>|

    .. code-block:: yaml

        '*':
          - global_stuff
        'minion1':
          - private_minion1_stuff
        'os:RedHat':
          - match: grain
          - redhat_stuff

    |end_block|

Parameterization
----------------

.. container:: frame

    |block<| /srv/pillar/pkg_rosetta.sls |>|

    .. code-block:: yaml

        pkgs:
          {% if grains['os_family'] == 'RedHat' %}
          apache: httpd
          vim: vim-enhanced
          {% elif grains['os_family'] == 'Debian' %}
          apache: apache2
          vim: vim
          {% endif %}

    |end_block|

    |block<| /srv/salt/somesls.sls |>|

    .. code-block:: yaml

        {{ salt['pillar.get']('pkgs.apache') }}:
          pkg:
            - installed

    |end_block|

Config values
-------------

.. container:: note

    Pillar can be thought of as an extension to the minion config. Many config
    parameters can be placed in pillar. In addition the master config values
    are also available via pillar (this can be disabled).

.. container:: frame

    Minion config **or** in a minion's pillar:

    .. code-block:: yaml

        schedule:
          highstate:
            function: state.highstate
            minutes: 60

Targeting
---------

.. container:: frame

    .. code-block:: bash

        salt -I 'somekey:specialvalue' test.ping

Salt states: fetching data from other minions
=============================================

Live data: peer interface
-------------------------

.. container:: frame

    * Realtime data
    * Communication goes through the master
    * Whitelist

.. container:: frame

    .. code-block:: jinja

        {% for server,ip in
            salt['publish.publish'](
                'web*',
                'network.interfaces',
                ['eth0']).items() %}
        server {{ server }} {{ ip[0] }}:80 check
        {% endfor %}

Recent data: Salt mine
----------------------

.. container:: frame

    * Recent data (configurable)
    * Cached on the master (faster lookup)

    ``/etc/salt/{master,minion}``:

    .. code-block:: jinja

        mine_functions:
            network.interfaces: [eth0]

        mine_interval: 60

.. container:: frame

    .. code-block:: jinja

        {% for server,ip in
            salt['mine.get'](
                'web-*',
                'network.interfaces',
                ['eth0']).items() %}
        server {{ server }} {{ ip[0] }}:80 check
        {% endfor %}

Salt states: orchestration
==========================

Batch execution
---------------

.. container:: frame

    * Execute a command incrementally across minions

      * By ``N`` at a time
      * By a percentage of all minions

    .. code-block:: bash

        salt -G 'os:RedHat' \
            --batch-size 25% service.restart httpd

Overstate
---------

.. container:: frame

    Incremmentually execute a series of state trees that depend on each other.

    .. code-block:: yaml

        mysql:
          match: db*
          sls:
            - mysql.server

        webservers:
          match: web*
          require:
            - mysql

        all:
          match: '*'
          require:
            - mysql
            - webservers

See also
--------

.. container:: frame

    * Reacting to live events with Salt's reactor
    * Schedule system monitoring with Salt's scheduler
