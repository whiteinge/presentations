=======================================================
Continuous code delivery and integration with SaltStack
=======================================================

:Organization: SaltConf
:Author: Seth House <shouse@saltstack.com>
:Date: 2014-01-29

.. include:: /home/shouse/src/presentations/beamerdefs.txt

|logo<|

.. image:: logo.pdf
    :height: 0.5 cm
    :align: right

|>|

..
    A discussion and demo of where SaltStack can and should fit into the
    continuous integration, delivery, and deployment landscape. We will talk
    high-level at first then dive into examples and demos with Jenkins, Travis,
    plus a lightweight Salt-only approach.

A note on terminology
=====================

Continuous integration
----------------------

.. container:: frame

    * Continuously merge changes with a mainline branch. |pause|
    * Incoming changes can be tested against other incoming changes. |pause|
    * Catch errors fast and early. |pause|

    **Requires**: a build server; automating builds.

Continuous delivery
-------------------

.. container:: frame

    * Deliver tested code to an environment for users. |pause|
    * Code review, QA, staging, perhaps production. |pause|

    **Requires**: automating deploying to an environment.

Continuous deployment
---------------------

.. container:: frame

    * Deliver tested code to production as soon as it is ready. |pause|
    * Automation is key; deployment should take minutes. |pause|
    * Logs and metrics determine effectiveness |pause|

      * Error rate, conversion rate, user registration rate, response time,
        traffic, etc. |pause|

    **Requires**: continuous integration, continuous delivery.

Where Salt fits
===============

Salt does not dictate your infrastructure
-----------------------------------------

.. container:: frame

    It depends.

        "Don't get set into one form, adapt it and build your own, and let it
        grow, be like water. Empty your mind, be formless, shapeless — like
        water. Now you put water in a cup, it becomes the cup; You put water
        into a bottle it becomes the bottle; You put it in a teapot it becomes
        the teapot. Now water can flow or it can crash. Be water, my friend."

        -- Bruce Lee

Build tools, testing tools
--------------------------

.. container:: frame

    * Travis-CI
    * Jenkins-CI
    * Buildbot

Example: Travis-CI
==================

Web hooks
---------

.. container:: frame

    * Notify Salt
    * Pass data
    * Transfer files

Demo!
-----

.. container:: frame

    * Testrepo

Salt Events and the Salt Reactor
================================

Overview
--------

.. container:: frame

    * Send events from minions to the master.
    * Trigger operations throughout your infrastructure.

Firing events
-------------

.. container:: frame

    .. code-block:: bash

        salt-call event.fire_master \
            '{"foo": "Foo!", "bar": "Bar!"}' \
            'myapp/myevent/somevalue'

Watching the event bus
----------------------

.. container:: frame

    .. code-block:: bash

        python /path/to/salt/tests/eventlisten.py

Listening to events with the Salt Reactor
-----------------------------------------

.. container:: frame

    ``/etc/salt/master.d/react_myapp.conf``:

    .. code-block:: yaml

        reactor:
          - 'myapp/myevent/somevalue':
            - /srv/salt/react_myapp.sls

    |pause|

    ``/srv/salt/react_myapp.sls``:

    .. code-block:: yaml

        deploy_myapp:
          cmd.state.highstate:
            - tgt: 'web*'
            - arg:
              - 'pillar={{ data|yaml }}'


Debugging the Salt Reactor
--------------------------

.. container:: frame

    .. code-block:: bash

        salt-master -l debug

Example: CI using Salt States
=============================

Step 1: ``post_recieve`` Git hook
---------------------------------

.. container:: frame

    .. code-block:: bash

        #!/bin/bash
        newrev=$(git rev-parse $2)

        salt-call event.fire_master \
            "{\"newrev\": \"$newrev\"}" \
            "myapp/git/push"

Step 2: React to the push event
-------------------------------

.. container:: frame

    ``/etc/salt/master.d/react_git_push.conf``:

    .. code-block:: yaml

        reactor:
          - 'myapp/git/push':
            - /srv/salt/react_git_push.sls

    |pause|

    ``/srv/salt/react_git_push.sls``:

    .. code-block:: yaml

        test_myapp:
          cmd.state.sls:
            - tgt: 'buildserver'
            - arg:
              - run_tests
              - 'pillar={{ data|yaml }}'

Step 3: Run the test suite
--------------------------

.. container:: frame

    ``/srv/salt/run_tests.sls``:

    .. code-block:: yaml

        run_tests:
          cmd:
            - run
            - name: python -m unittest tests
            - cwd: /path/to/testrepo

        deploy_stage:
          module:
            - wait
            - name: event.fire_master
            - data:
                newrev: {{ salt['pillar.get']('data:newrev') }}
            - tag: myapp/tests/pass
            - watch:
              - cmd: run_tests

Step 4: React to the test event
-------------------------------

.. container:: frame

    ``/etc/salt/master.d/react_tests_pass.conf``:

    .. code-block:: yaml

        reactor:
          - 'myapp/tests/pass':
            - /srv/salt/react_tests_pass.sls

    |pause|

    ``/srv/salt/react_tests_pass.sls``:

    .. code-block:: yaml

        deploy_myapp:
          cmd.state.sls:
            - tgt: 'web*'
            - arg:
              - deploy_myapp
              - 'pillar={{ data|yaml }}'

Step 5: Deploy the new code to stage
------------------------------------

.. container:: frame

    ``/srv/salt/deploy_myapp.sls``:

    .. code-block:: yaml

        myapp:
          git:
            - latest
            - name: git@github.com/myorg/myapp
            - target: /var/www/myapp
            - rev: {{ salt['pillar.get']('data:newrev') }}
            - watch_in:
              - service: apache

        apache:
          service:
            - running
            - name: httpd
