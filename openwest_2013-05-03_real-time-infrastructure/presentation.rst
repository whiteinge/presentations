=============================================
Real-time infrastructure management with Salt
=============================================

:Organization: OpenWest Conference 2013
:Author: Seth House <seth@eseth.com>
:Date: 2013-05-03

.. include:: /home/shouse/src/presentations/beamerdefs.txt

.. Outline:
    My goal with this talk is threefold: to highlight what Salt is
    capable of in contrast to similarly categorized tools, to demonstrate
    a handful of patterns for common configuration needs and data
    gathering, and to provide references for the audience on where and how
    to deep-dive into the material I covered after the talk and conference
    has concluded.
..
    One highlight of Salt (among many) is speed. Salt is a real-time
    infrastructure management tool. It's core functionality is a high-speed
    communication channel that enables remote execution and configuration
    management that are so core to system administration. Learn how to
    integrate real-time interaction between your code and your infrastructure
    using Salt.

.. figure:: img/logo.pdf

Salt internals (briefly)
========================

|frame|
|title<| Salt internals |>|
|end_frame|

Master
------

* ``salt-master -d``
* Open two ports (pub/sub & reply channel)

Minions
-------

* ``salt-minion -d``
* Connect to the master
* No open ports required
* Listens for pubs from the master

``/etc/salt/minion``:

.. code-block:: ini

    #master: salt

Execution modules
-----------------

* Contain all the functionality

Execution example
-----------------

.. code-block:: bash

    salt 'web-*' network.interfaces

State modules
-------------

* Wrap execution modules
* Before-check
* ``test=true``
* Call out to execution modules
* After-check

State module example
--------------------

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

|frame|
|title<| Why is Salt fast? |>|
|end_frame|

Communication
-------------

* ZeroMQ
* msgpack

pub/sub
-------

* Asynchronous
* Minions determine targeting match
* Minions do all the work

Minion data
===========

|frame|
|title<| Sharing minion data |>|

.. container:: r2b-simplecolumns

    <-- Live

    -- Recent --

    Historic -->

.. container:: r2b-simplecolumns

    peer interface

    Salt Mine

    Returners

|end_frame|

Peer
----

``/etc/salt/master``:

.. code-block:: yaml

    peer:
      lb-.*:
        - network.interfaces

* Be mindful of data security
* Communication still goes through the master

Peer example
------------

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

``/etc/salt/{master,minion}``:

.. code-block:: yaml

    redis.db: 0
    redis.host: myredis
    redis.port: 6379

* Minions write directly
* Can be read into Pillar via ``ext_pillar``

Returner full-circle example
----------------------------

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

|frame|
|title<| Events |>|
|end_frame|

Fire events
-----------

.. code-block:: bash

    salt 'lb-*' event.fire_master \
        refresh_pool loadbalancer

Watch for events (manually)
---------------------------

* Some assembly required
* ``salt/tests/eventlisten.py``
* Coming soon to ``salt-api``

Reactor (react to events)
-------------------------

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

|frame|
|title<| Schedules |>|
|end_frame|

Add events
----------

``/etc/salt/{master,minion}`` (or pillar):

.. code-block:: yaml

    schedule:
      highstate:
        function: state.highstate
        minutes: 60

Stats gathering
---------------

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

* Configure inline with existing states
* Individual components are in place
* Needed: glue
* Needed: alerting

Data resolution
---------------

* Time-series data
* Thin and/or summarize older and older data
* Free with some returners
