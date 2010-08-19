================================
Utah Open Source Conference 2010
================================
Ajax Fragments, Django, jQuery, and You!
----------------------------------------

:Author: Seth House <seth@eseth.com>
:Date: 2010-10-07

.. include:: <s5defs.txt>
.. footer:: Ajax Fragments

Outline
=======

* Fragment IDs

* Performance

* Progressive Enhancement

  ::

    <a href="confirm.php" rel="dialog">

Introduction
============

.. class:: handout

    We’re building on the techniques outlined in Facebook employee, Makinde
    Adeagbo’s, slides from JSConf 2010 entitled `Primer`_ which expound on the
    technique called Ajax Fragments.

    Then we’ll talk progressive enhancement using ajax fragments since search
    bots don’t yet index ajax. Although Google is working on a proposal for
    doing so.

.. _`primer`: http://www.slideshare.net/makinde/javascript-primer

Ajax Fragments
==============

.. class:: handout

    “the team exploited the observation that most controls work the same way:

    * User clicks
    * Sends ASync request
    * Insert/Replace some content

    So the team set up elements like this::

        <a href="/ring.php rel="dialog">...</a>

    …and then hijacked them with a standard listener routine, one that would
    work for most of the controls. (Most, not all; 80/20 principle is in effect
    here.) This way, they could have one small listener routine to handle most
    of the controls on the page.”

    …

    “And they are using a convention: ``ajaxify=1`` on an element indicates
    it's … Ajaxified.

    At this point, the team had now Ajaxified a bunch of features, but people
    were still skeptical about more complicated features. For example, would
    setting status be too hard with the same techniques. So after some
    research, Makinde came back with an epiphany: the humble form. Whereas the
    previous async requests were effectively information-less - just a simple
    directive and maybe an ID - the requests would now include content too. And
    of course, most of these things look nothing like forms due to styling. But
    underneath, they're still forms, e.g. the entire comments block is a single
    form.”

    <form action="/submit/" method="post" ajaxify="1">
        …
    </form>

    .. figure:: ./facebook-ajaxify-form.png

    “Nowadays, most of Facebook runs without complete page refreshes, by
    dynamically flipping the content and the fragment ID. (What Facebook calls
    page transitions.)”

    — http://ajaxian.com/archives/facebook-javascript-jsconf

Does the Googlebot Index Ajax?
==============================

…

Performance
===========

.. class:: handout

    “The first initiative was to include the Javascript at the bottom of the
    page. Great, it's faster, but at what cost? A big one: Users try to click
    on controls, and nothing happens. Back to the drawing board, and the team
    refined the setup so that the actionable stuff was initialised on the top
    of the page. But how to minimise all this code at the top of the page?”

    — http://ajaxian.com/archives/facebook-javascript-jsconf

    “Most important performance metric: TTI (Time to interact) latency From the
    time user clicks on a link to he/she is able to interact with the page.
    Front end latency accounts for more than 70% of total TTI latency:

    Front end latency: > 70%
    Include network latency and browser render time (CSS, JavaScript, images)

    Back end latency: < 30%
    Include page generation time (PHP, DB, Memcache, etc)”

    …

    “Two software abstractions at Facebook Dramatically improve Facebook’s TTI
    latency:

    Quickling: transparentlyajaxifiesthe whole web site
    PageCache: caches user-visited pages in browser”

    …

    “How Quickling works?
    1. User clicks a link or back/forward button
    2. Quickling sends an ajax to server
    3. Response arrives
    4. Quickling blanks the content area
    5. Download javascript/CSS
    6. Show new content”

    …

    “Architecture components:
    Link Controller
    HistoryManager
    Bootloader
    Busy Indicator”

    …

    “LinkController:
    Intercept user clicks on links After DOM content is ready, dynamically
    attach a handler to all link clicks (could also use event delegation)::

    $('a').click(function() {
        // 'payload' is a JSON encoded response from the server
        $.get(this.href, function(payload) {

            // Dynamically load 'js', 'css' resources for this page.
            bootload(payload.bootload, function() {

                // Swap in the new page's content
                $('#content').html(payload.html)

                // Execute the onloadRegister'edjs code 
                execute(payload.onload)
            });
        }
    });
    ”

    …

    “Bootloader:
    Load static resources via ‘script’, ‘link’ tag injection Before entering a
    new page: Dynamically download CSS/Javascript for the next page

    Javascript::

        varscript = document.createElement(&apos;script&apos;);
        script.src = source;
        script.type = &apos;text/javascript&apos;;
        document.getElementsByTagName(&apos;head&apos;)[0].appendChild(script);

    CSS::

        varlink = document.createElement(&apos;link&apos;);
        link.rel = &quot;stylesheet&quot;;
        link.type = &quot;text/css&quot;;
        link.media = &quot;all&quot; ; 
        link.href = source;
        document.getElementsByTagName(&apos;head&apos;)[0].appendChild(link);

    Bootloader (cont.)

    Load static resources via ‘script’, ‘link’ tag injection Reliable callbacks
    to ensure page content shown after depended resources arrive:

    JavaScript resources::

        ‘bootloader.done(resource_name)’ injected at the end of all JS packages.

    CSS resources::

        ‘#bootloader_${resource_name} {height: 42px}’ injected in all CSS packages.

    Bootloader polls the corresponding invisible div height to determine if the
    CSS package arrives.”

    …

    “Problems:

    CSS rules accumulated over time
    Render time is roughly proportional to the # of CSS rules
    Automatically unload CSS rules before leaving a page

    Memory consumption
    Browser memory consumption increase overtime
    Periodically force full page load to allow browsers to reclaim memory”

    — http://www.slideshare.net/ajaxexperience2009/chanhao-jiang-and-david-wei-presentation-quickling-pagecache

::

    /**
     * Adding a single line to this ﬁle requires great internal reﬂection
     * and thought. You must ask yourself if your one line addition is so
     * important, so critical to the success of the company, that it warrants
     * a slowdown for every user on every page load. Adding a single letter
     * here could cost thousands of man hours around the world.
     *
     * That is all.
     */

.. look into labJS or requireJS for async-loading?

**2.5 seconds**

Put JavaScript at the bottom of the page. **(Sometimes!)**

Proof of Concept
================

Widgets

    * Modal
    * Tabs
    * Image carousel (dynamically load next/prev)
    * Comment form
    * Endless scrolling

http://eseth.org/2010/ajax-fragments-django-jquery/

Conclusion
==========

.. class:: handout

    “Ongoing, Makinde says performance optimisation requires ongoing vigilance.
    Every engineer has their special case, but in the scheme of things, it's
    better to say no to new features unless they can be strongly justified. For
    example, we can live with user submitting a form that hasn't yet been
    hijacked; a complete page refresh is fine on occasion. We don't like it,
    but we don't want to make it a special case just for the sake of it.”

    — http://ajaxian.com/archives/facebook-javascript-jsconf