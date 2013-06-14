====================================
Real-time cloud management with Salt
====================================

:Organization: Unlocked.io
:Author: Seth House <shouse@saltstack.com>
:Date: 2013-06-14

.. include:: /home/shouse/src/presentations/beamerdefs.txt

|logo<|

.. image:: logo.pdf
    :height: 0.5 cm
    :align: right

|>|

Salt philosophy
===============

Building blocks
---------------

.. container:: frame

    .. figure:: img/Green_Lego_Baseplate.jpg
        :width: 100%

        By Stilfehler (Own work) GFDL or CC-BY-SA-3.0-2.5-2.0-1.0

.. container:: frame

    * Everything we have is built on earlier generations
    * Building blocks of history

      * Agriculture
      * Cities
      * Governments
      * Mathematics
      * Manufacturing
      * Language

What are our building blocks?
-----------------------------

.. container:: frame

    * Computers Systems

      * Data centers are the modern platform of invention
      * Large scale computing drives virtually all high level human
        interactions

    * Data centers themselves are becoming the building blocks

Building blocks and complexity
------------------------------

.. container:: frame

    * As systems grow they become more complex
    * Increased complexity makes using larger building blocks impossible
    * Building blocks used today are simple

      * Easy to use
      * Easy to understand
      * Yet powerful

Success comes from simplicity
-----------------------------

.. container:: frame

    * Viable building blocks are fundamentally simple
    * Things that are in themselves simple to understand and use
    * Concepts that can cross barriers and cleanly apply to many higher level uses
    * YAML is a great example
    * Unix is a great example

Salt is aptly named
-------------------

.. container:: frame

    .. figure:: img/Lego_Color_Bricks.jpg
        :width: 100%

        By Alan Chia (Lego Color Bricks) CC-BY-SA-2.0

.. container:: frame

    * The name is the vision
    * Salt is in nature, a building block
    * Salt is in cooking, a building block
    * Salt is in life, a building block
    * Yes, this is where the logo came from
    * Yes, this is why it is Salt STACK

Flow + state = EVERYTHING
-------------------------

.. container:: frame

    * Core idea behind Salt
    * Flow = Access and control
    * State = The functional state of the system
    * Between them All things are controlled

Building on state and flow
--------------------------

.. container:: frame

    * Basics

      * Remote execution built on Flow
      * Config Management built on State

    * Ramping Up

      * Monitoring build on Flow + State
      * Cloud management is Flow + State
      * Auto healing is Flow + Flow
      * Orchestration is Flow + State
      * Distributed Deployment is Flow + State

Building blocks for infra
-------------------------

.. container:: frame

    * Salt **has** "Configuration Management"
    * Salt **has** "Remote Execution"

Building remote ex
------------------

.. container:: frame

    * Async Message Bus
    * Micro publish commands
    * Minion Side Logic
    * Return to arbitrary location

Building states
---------------

.. container:: frame

    * All about data
    * Low level data structure calls state functions
    * High level data structure defines state calls
    * Languages are now arbitrary

Building cloud
--------------

.. container:: frame

    * Remote Ex controls hypers
    * Remote ex commands hypers
    * All runs on Live data

Building monitoring
-------------------

.. container:: frame

    * Remote Ex build on system libs
    * Data gathering is already there!
    * States used to detect the state of a system
    * States can declare that the state of a system is out of bounds
    * Fires back to the event bus

Conclusion
----------

.. container:: frame

    .. figure:: img/LEGO_HNK_Zagreb.JPG
        :width: 100%

        By Ex13 (Own work) CC-BY-SA-3.0

.. container:: frame

    * Salt is comprised of many building blocks
    * The underlying components are available, but they do not need to be interfaced with
    * Salt is made to morph into the needs of the infra
    * Made to make small infrastructures easy, and large infrastructures powerful

Salt internals (briefly)
========================

Master
------

.. container:: frame

    * ``salt-master -d``
    * Open two ports (pub/sub & reply channel)

Minions
-------

.. container:: frame

    * ``salt-minion -d``
    * Connect to the master
    * No open ports required
    * Listens for pubs from the master

    ``/etc/salt/minion``:

    .. code-block:: ini

        #master: salt

Execution modules
-----------------

.. container:: frame

    * Contain all the functionality

Execution example
-----------------

.. container:: frame

    .. code-block:: bash

        salt 'web-*' network.interfaces

State modules
-------------

.. container:: frame

    * Wrap execution modules
    * Before-check
    * ``test=true``
    * Call out to execution modules
    * After-check

State module example
--------------------

.. container:: frame

    ``top.sls``:

    .. code-block:: yaml

        base:
          'web-*':
            - httpd

    ``httpd.sls``:

    .. code-block:: yaml

        httpd:
          pkg:
            - installed

Salt speed
==========

Communication
-------------

.. container:: frame

    * ZeroMQ
    * msgpack

pub/sub
-------

.. container:: frame

    * Asynchronous
    * Minions determine targeting match
    * Minions do all the work

Minion data
===========

.. container:: frame

    * Live data; peer interface
    * Recent data; Salt mine
    * Historical data; returners

Peer
----

.. container:: frame

    ``/etc/salt/master``:

    .. code-block:: yaml

        peer:
          lb-.*:
            - network.interfaces

    * Be mindful of data security
    * Communication still goes through the master

Peer example
------------

.. container:: frame

    Configuring ``haproxy.cfg``:

    .. code-block:: jinja

        {% for server,ip in
            salt['publish.publish'](
                'web*',
                'network.interfaces',
                ['eth0']).items() %}
        server {{ server }} {{ ip[0] }}:80 check
        {% endfor %}

Salt Mine
---------

.. container:: frame

    ``/etc/salt/{master,minion}``:

    .. code-block:: jinja

        mine_functions:
            network.interfaces: [eth0]

        mine_interval: 60

    * New in Salt v0.15
    * Either master or minion config
    * Be mindful of data security

Salt Mine example
-----------------

.. container:: frame

    Configuring ``haproxy.cfg``:

    .. code-block:: jinja

        {% for server,ip in
            salt['mine.get'](
                'web-*',
                'network.interfaces',
                ['eth0']).items() %}
        server {{ server }} {{ ip[0] }}:80 check
        {% endfor %}

Returners
---------

.. container:: frame

    ``/etc/salt/{master,minion}``:

    .. code-block:: yaml

        redis.db: 0
        redis.host: myredis
        redis.port: 6379

    * Minions write directly
    * Can be read into Pillar via ``ext_pillar``

Returner full-circle example
----------------------------

.. container:: frame

    Collect the data:

    .. code-block:: bash

        salt 'web-*' network.interfaces eth0 \
            --return redis_return

    Fetch the data via a custom ``ext_pillar`` module.

    Use the data:

    .. code-block:: jinja

        {% for server,ip in
            salt['pillar.get']('web.ip_addrs', {}).items() %}
        server {{ server }} {{ ip[0] }}:80 check
        {% endfor %}

Events
======

Fire events
-----------

.. container:: frame

    .. code-block:: bash

        salt 'lb-*' event.fire_master \
            refresh_pool loadbalancer

Watch for events (manually)
---------------------------

.. container:: frame

    * Some assembly required
    * ``salt/tests/eventlisten.py``
    * Coming soon to ``salt-api``

Reactor (react to events)
-------------------------

.. container:: frame

    ``/etc/salt/master``:

    .. code-block:: yaml

        reactor:
          - loadbalancer:
            - /src/reactor/refresh_pool.sls

    ``/src/reactor/refresh_pool.sls``:

    .. code-block:: jinja

        {% if data['type'] == 'refresh_pool' %}
        highstate_run:
          cmd.state.highstate:
            - tgt: lb-*
        {% endif %}

Schedules
=========

Add events
----------

.. container:: frame

    ``/etc/salt/{master,minion}`` (or pillar):

    .. code-block:: yaml

        schedule:
          highstate:
            function: state.highstate
            minutes: 60

Stats gathering
---------------

.. container:: frame

    .. code-block:: yaml

        schedule:
          uptime:
            function: status.uptime
            seconds: 60
            returner: redis
          meminfo:
            function: status.meminfo
            minutes: 5
            returner: redis

What's coming
=============

|frame|
|title<| What's coming |>|

Salt ``v.0.next``

|end_frame|

Monitoring states
-----------------

.. container:: frame

    * Configure inline with existing states
    * Individual components are in place
    * Needed: glue
    * Needed: alerting

Data resolution
---------------

.. container:: frame

    * Time-series data
    * Thin and/or summarize older and older data
    * Free with some returners
