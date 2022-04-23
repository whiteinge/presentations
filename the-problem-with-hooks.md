I'm not sure Hooks are _objectively_ bad. They do come with quite a few caveats
and unsolved problems. `useEffect` is the worst offender. I'll list a few
problems that I personally have with them.

- They're often touted as an alternative to Redux as a way to avoid the usual
  Redux boilerplate. But bypassing Redux comes with all the usual problems of
  randomly distributing your state and business logic throughout the component
  tree which gets messy _fast_. Component state is convenient and has some
  advantages that are very hard to replicate in non-component state (such as
  data life cycles -- e.g., when do you know a bit of data is no longer used
  and can be cleaned up?). But distributing/sharing/communicating component
  state was heavily explored in the early days of React and nobody ever found
  a silver bullet and Hooks are just a different syntax on top of that same,
  unsolved problem. The Redux hooks do look nice to use but I haven't tried
  them yet.

- Hooks have fewer capabilities than is available in component methods and
  component life cycle methods. If you write a complicated functional component
  then need one of those additional capabilites it is often very difficult to
  switch from one syntax to the other, especially if you're relying on props
  changes to trigger functionality (see below).

- The execution semantics are...unusual...and the execution semantics are
  _different_ for each hook type. There's nothing in JavaScript that will
  prepare you for how to use hooks because they're entirely specific to React's
  render scheduler semantics. All hooks get invoked in every single component
  render but then each hook selectively decides whether it will do anything on
  that invocation or ignore that invocation. useRef is different than useState
  is different than useEffect without dependencies is different than useEffect
  with dependencies is different than...etc.

  The arguments to each hook also have differing execution semantics. For
  example, the argument to useRef is ignored after the first invocation, where
  as the argument to useEffect is re-run when an item in the dependency array
  changes (knowing which dependency changed is another problem). It's more
  correct to say the _value_ given as the argument to useRef is ignored but the
  argument itself is executed as normal -- e.g., if you pass an empty object as
  the argument a new empty object is created on _every single render_, but only
  the value on the first render is used. This isn't a performance issue (though
  it is unecessary work) but it is noteworthy because you have to know that is
  happening because it differs from how JavaScript usually works -- e.g., say
  you want to execute a function to provide the initial value, you must know
  that function is going to get executed _a lot_ and plan performance/memory
  usage accordingly (or wrap it in yet another hook, useMemo).

- Because the execution semantics can _only_ happen within the render method of
  a component you're entirely locked into the render chain in the same way you
  can get locked into a promise chain. That forces you to use _more_ hook or
  React machinery to achieve things you could otherwise achieve with vanilla JS
  utility functions, modules, imports.

- Hooks haphazardly rely on variable closure, especially where multiple hooks
  interoperate. Sometimes you pass an argument to a hook directly, othertimes
  a hook must grab a value from the current variable scope. Using two hooks
  together requires that you do the latter (e.g., using a useState value inside
  a useEffect callback). This effectively makes it impossible to refactor out
  the logic in a hook so that it lives outside the functional component. If you
  do the JavaScript-usual thing of refactoring logic out into a function it
  will often not work correctly because hooks have unusual execution semantics.
  Instead you must refactor functionality out in the form of a new, custom hook
  which must defined in terms of the semantics of other, existing hooks --
  which means having to learn the peculiarities of each new hook that is added.
  E.g., does my new useThing() hook follow the semantics of useEffect, or
  useState, or useRef...or some combination?

- Because the execution and closure semantics are so unusual they're very
  difficult to use with regular, non-React JavaScript. E.g., getting called too
  often (every render), and must be wrapped yet another hook (useMemo) to avoid
  that. E.g., passing a value from a hook as an argument into an external
  function; when is the value updated, will the external function be re-invoked
  when that happens, if not we must wrap the function in another hook to work
  around the problem. E.g., the function is invoked inside a hook that relies
  on variable closure, and in order to re-run that function the hook must first
  destroy and recreate the function entirely, this entirely prevents using
  functions that memoize, decorate, or close over their own values such as
  Lodash's `_uniqueId`, or `_memoize`, or `_once`, instead they must be wrapped
  in another hook to workaround the problem.

  Like violence and XML: if hooks aren't solving your problem you're not using
  enough of them. Hooks upon hooks upon hooks.

- How to write tests for hooks is a bit of an open question. Since they live
  inside a JavaScript function you can't test them without first calling that
  function which might also do a bunch of other things you want to test
  separately but cannot. Since they live directly in the function instead of
  getting passed in as an argument you must mock them at the import-level.
  Since they have unusual execution semantics you need React-specific mocking
  in order to test them. Since they rely on closure you cannot easily extract
  functionality to only test a single hook.

- Hooks are often used as an ad-hoc messaging system to inform other hooks or
  trigger events when something happens. But unfortunately this messaging
  system is passive and implicit -- the thing that cares about the change must
  passively watch a variable (usually state or props) _to change_ as the
  notification that it should trigger. This leads to extremely implicit code
  that has all the complexities of a state machine without any of the structure
  or guarantees. E.g. if prop `foo` is `undefined` that means the ajax call
  hasn't happened yet, once it changes to `null` then trigger the ajax call and
  set the loading spinner to true, once complete set the loading spinner to
  false and set `foo` to the ajax response. How do we trigger that ajax call
  a second time if we need to? That will require rethinking that entire
  workflow. If you have two inter-dependent useEffect hooks that are messaging
  each other the result is often incomprehensible because the meaning of each
  variable used to message is assumed and implicit.

- Hooks have no way to send messages to each other and sometimes people will
  try to use state and the depdency array to trigger behavior. E.g., set
  a value via useState, which a useEffect is watching, when the useEffect
  triggers due to the change the value of the variable must be inspected to
  determine whether to trigger an ajax response. This is not messaging but
  rather a passive and implicit substitute.

- The dependency array for useEffect is a dumpster fire of gotchas. It depends
  entirely on variable equality checks which is something JavaScript is already
  not very good at doing, and you can't customize that in any way (like you can
  with, say, a selector function). Your only option is to watch some value for
  changes. This often has all the implicit problems mentioned above. And the
  dependency array is not passed as an argument to the useEffect callback, if
  you care about which dependency changed you have to check that all over again
  inside your callback.

- Variable closure inside a useEffect callback cannot receive updated values
  from elsewhere in the component. It must be entirely destroyed and recreated.
  This is true for closures inside the useEffect closure too.

- The cleanup function of useEffect runs _every time_ a dependency changes
  which is mind-blowingly weird and pretty much _never_ what I want. Destroying
  and restarting timers, unsubscribing and resubscribing to observables (which
  is the opposite of how an observable is intended to be used and severly
  restricts the value of using observables), removing an event listener just to
  re-add the exact same event listener a few miliseconds later. Is it
  a show-stopper? Not really. Is it awkward AF? Very.

- useEffect's dependency array and cleanup function effectively make useEffect
  a terrible imitation of a 'disposable' and better implementations exist in
  other libraries (e.g., RxJS).

- In order to fully understand all the caveats around useEffect you must read
  all of Dan Abramov's "A complete guide to useEffect" which clocks in at
  10,000 words -- and you'll probably need to read it multiple times. This is
  not a sign of a good API. :stuck_out_tongue:
