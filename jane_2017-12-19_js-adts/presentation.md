name: section
layout: true
class: center, middle, inverse

---

template: section

<h1>
<span style="font-size: smaller">JavaScript Programmers Should Learn</span>
<br>
<span style="font-size: larger">Algebraic Data Types</span>
</h1>

## LambdaConf 2018

by Seth House

@whiteinge<br>
seth@eseth.com

???

Title: Why JavaScript Programmers Should Learn Algebraic Data Types

Abstract Summary:

The JavaScript ecosystem is awash with slightly differing implementations of
the same thing -- view libraries, MVC frameworks, state management, async
helpers, streams, utilities -- over and over again. JavaScript fatigue is real
and spending time to learn new things is an investment that must be justified.

ADTs provide a unique and concise API of specifically interlocking pieces that
allow building complete programs from simple individual parts. Whole libraries
and frameworks can give way to common and well studied and understood concepts.
The often repeated and rarely understood or practiced programming mantras of
single-responsibility, composition, and abstraction are made explicit and
knowable with ADTs.

The goal of this presentation is to excite and encourage developers that have
little to no knowledge of ADTs to want to learn. We will focus single-mindedly
on practical, everyday problems and demonstrate a working, minimal solution to
each problem in plain JavaScript. We will de-emphasize but not avoid
terminology and implementation. Each topic will conclude with next steps and
learning resources.

Some of the problems we will cover are: processing pipelines, null checking,
error handling, branching logic, async management, merging/reducing, reactive
streams, state management, effects management, declarative UIs, and how to
apply your own everyday data to all those scenarios in a composeable,
functional way.

Content relevancy:

As programmers a large emphasis in our jobs and projects is to reuse code and
concepts, to build whole programs from small parts, and to deliver predictable,
maintainable results for our businesses and clients. ADTs help us to achieve
those goals by lifting us out of the implementation details of so many moving
parts so we can stay focused on the higher-level concerns of assembling the
final product.

Questions:

* When is the presentation?
* How long is the presentation?
* What is the fall-back plan if the presentation duration changes?
* How many will attend?
* Who is the audience? Peers, coworkers, investors, superiors?
* Who are the key audience members to influence?
* What is the expected audience attention span?
* Why are these audience members in attendance?
* What does this audience expect?
* What will get the audience's attention?
* What is the audience's subject knowledge?
* Will the audience understand jargon?
* What is the expected reaction to the presentation and the presenter?
* What are likely audience questions?
* What are possible audience questions that will be hard to answer?

Checklist:

* [ ] Create a loose outline of ideas, references, and talking points.
* [ ] Categorize into: must know, need to know, don't need to know (cut!).
* [ ] Restructure to fit the following flow:

  * Opening – Capture attention; avoid introductions and fluff.
  * Current situation – Establish importance.
  * Recommendation.
  * Benefits – Personalize for the audience.
  * Evidence – Support the recommendation; don't revisit current situation.
  * Summary – Short!
  * Action steps – Specific actions; specific time-frame.

---

class: center, middle
layout: false

## JavaScript!

???

* A lot to like; a lot to dislike.
* Big ecosystem. Many people exploring many different things.
* Expressive. Functional ideas have been gaining in popularity. Underscore,
  React, and JavaScript itself had functional inspirations.
* Lots of exploration (good!), and also lots of rewriting & reinvention (often
  bad).
* "JavaScript fatigue" stems from an overwhelming deluge of new things to
  learn. But how many of those new things are slight variations on old things?
* Inadequate primitives make common, basic needs too hard: state management,
  data flow, juggling async, managing side effects, writing things in a way
  that can be easily tested, and code layout and organization.
* The JavaScript world in particular seems to lean on libraries and frameworks
  not just for convenience but to solve the hard problems on our behalf. Better
  language primitives and education focused less on the framework du-jour and
  more on programming fundamentals would benefit us.

---

class: center, middle
layout: false

## Why ADTs?

---

name: common-advice

### Common advice for functional-style coding.

* Write small, single-purpose functions.
--

* Make them pure.
--

* Compose them together into a larger whole.

---

class: center, middle

```js
const tableContents = _.chain(allRecords)
      .filter(_.overEvery(_.values(predicateFns)))
      .slice(curPageStart, curPageOffset)
      .orderBy(..._.unzip(orderedColumns))
      .map(x => _.pick(x, visibleColumns))
      .groupBy(currentSelection)
      .value()
```

---

class: center, middle

```js
const valOrDefault = ifThenElse(
    mq => mq.selected == null && 'defaultall' in $attrs,
    () => true,
    get('selected'));

const valShouldBeSelected = ifThenElse(
    () => selectionOverrides != null,
    mq => selectionOverrides.includes(mq.name),
    valOrDefault);

const markAsSelected = ifThenElse(valShouldBeSelected,
    mq => Object.assign({}, mq, {selected: true}),
    mq => Object.assign({}, mq, {selected: false}));

const getOptions = pipe([
    sortBy('name'),
    map(markAsSelected),
    map(createOption),
]);
```

---

class: center, middle
layout: false

### ...now what?

???

Composing functions into a larger whole is very useful, immediately so, and
that is important -- it would be a nightmare to code something like this in a
procedural style. But what's the next step? Programs are much more than a
collection of pure utility functions.

---

class: center, middle
layout: false

### Composition.

???

It must be important, right? People talk about it all the time.

---

class: center, middle

> Favor composition over inheritance
>
> – Gang of Four

---

class: center, middle

> Designing is fundamentally about taking things apart in such a way that they
> can be put back together. Separating things into things that can be composed.
>
> – Rich Hickey

---

class: center, middle

<img src="./img/blocks-32027_640.png" width="200">

???

https://pixabay.com/en/blocks-building-brick-plastic-toy-32027/

---

class: center, middle

> [Programming is] all about decomposing the problem and then recomposing
> solutions.
> <p>&nbsp;</p>
> <p>&nbsp;</p>
>
> – Bartoz Milewski

---

class: center, middle

> [Programming is] all about decomposing the problem and then recomposing
> solutions.
>
> There are so many ways of composing things and each of them is different.
> <p>&nbsp;</p>
>
> – Bartoz Milewski

---

class: center, middle

> [Programming is] all about decomposing the problem and then recomposing
> solutions.
>
> There are so many ways of composing things and each of them is different.
>
> Category theory describes all these various ways of composing things.
>
> – Bartoz Milewski

???

> Composability measures the extent to which values can be combined with other
> values to produce like values.
>
> – John De Goes https://www.slideshare.net/jdegoes/orthogonal-functional-architecture

> Wouldn't it be wonderful if you could assemble software from predefined
> building blocks? This idea is old, and has been the driving force behind
> object-oriented programming (OOP).
> [...]
> Decades later, it doesn't look like we're much nearer that goal than before,
> but I believe that we'd made at least two (rectifiable) mistakes along the
> way:
> Granularity
> Object-orientation
> [...]
> The vision was always that software 'components' would be able to 'click'
> together, just like Lego bricks.
> While we (me included) have been on an a thirty-odd year long detour around
> object-orientation, I don't think all is lost. I still believe that a
> Lego-brick-like system exists for software development, but I think that it's
> a system that we have to discover instead of invent.
> Another, more crucial, difference to object-oriented programming is that
> these objects are lawful. An object is only a monoid if it obeys the monoid
> laws. An object is only a functor if it obeys the functor laws.
> Such objects are still fine-grained building blocks, but they fit into a
> system. You don't have to learn tens of thousands of specific objects in
> order to get to know a framework. You need to understand the system.
> – Mark Seemann http://blog.ploeh.dk/2018/03/05/some-design-patterns-as-universal-abstractions/

---

class: center, middle

### “The perfect API”.

<p>&nbsp;</p>

---

class: center, middle

### “The perfect API”.

(Brought to you by math.)

???

> Imagine for a second that everything had the same interface. Everything.
>
> – James Forbes https://james-forbes.com/?/posts/the-perfect-api

Using math for better problem solving
https://fixate.it/podcast/using-math-for-better-problem-solving-brian-lonsdorf/

Algebraic Domain Modelling
https://corecursive.com/005-algebraic-domain-modelling-using-functions-with-debashish-ghosh

---

class: center, middle

## Too hard?

???

You CAN use things that are built with these concepts without knowing these
concepts. And that's OK!

See the RxJS project and also Evan Czaplicki - Let's be mainstream!
https://www.youtube.com/watch?v=oYk8CKH7OhE

The jargon is not important to _use_ the thing and should never be a barrier to
entry. However the terms shouldn’t be hidden and become important once you
start wanting to build or extend the thing.

> if you introduce the solution (in this case, a new kind of math) before
> introducing the kind of problems that it’s meant to solve, the solution is
> likely to come across as pointless and arbitrary.
>
> [...]
>
> The thing is, monads aren’t actually all that complicated. In fact, most of
> the experienced functional programmers I’ve met consider them downright
> simple. It’s just that newcomers often have a really hard time trying to
> figure out what exactly monads even are.
>
> [...]
>
> Monads are a solution to a specific problem: the problem of repetitive code.
> If you write enough code in a functional programming language, you start to
> notice that you’re writing a lot of suspiciously similar code to solve a
> bunch of superficially different problems. Wouldn’t it be nice if you could
> just write this code once and then reuse it, instead of rewriting it slightly
> differently every time?
>
> – Max Kreminski https://mkremins.github.io/blog/doors-headaches-intellectual-need/

---

class: center, middle

> If you write anything in italics so it looks like math developers go, "Ooh, I
> can't do that." And I'm really surprised that they have that reaction because
> they can do JavaScript. And JavaScript sometimes involves a lot of little
> picky tiny rules that are quite illogical.
>
> – Philip Wadler

???

> Mathematics is actually much more logical and it's actually easier to
> deal with, I think, but it's taking a while for developers to discover
> that because they think they can't do it but in fact it's easier.
>
> – https://youtu.be/ofN8ui2oH8Y?t=3m22s

> If you're a mechanical engineer or you're a civil engineer, you build a
> bridge or something, you use math. If you're a chemist, you use math. But
> we as computer scientists seem to be afraid of mathematics. What Lamport
> tells you and what I will tell you is you shouldn't be afraid.
>
> – Erik Meijer

---

class: center, middle

> It really does constrain your ability to think when you’re thinking in terms
> of a programming language. Code makes you miss the forest for the
> trees: It draws your attention to the working of individual pieces, rather
> than to the bigger picture of how your program fits together, or what it’s
> supposed to do—and whether it actually does what you think.
>
> – Leslie Lamport

???

> For Lamport, a major reason today’s software is so full of bugs is that
> programmers jump straight into writing code. “Architects draw detailed plans
> before a brick is laid or a nail is hammered,” he wrote in an article. “But
> few programmers write even a rough sketch of what their programs will do
> before they start coding.”
>
> “It really does constrain your ability to think when you’re thinking in terms
> of a programming language,” he says. Code makes you miss the forest for the
> trees: It draws your attention to the working of individual pieces, rather
> than to the bigger picture of how your program fits together, or what it’s
> supposed to do—and whether it actually does what you think.
>
> Lamport sees this failure to think mathematically about what they’re doing as
> the problem of modern software development in a nutshell: The stakes keep
> rising, but programmers aren’t stepping up—they haven’t developed the chops
> required to handle increasingly complex problems. “In the 15th century,” he
> said, “people used to build cathedrals without knowing calculus, and nowadays
> I don’t think you’d allow anyone to build a cathedral without knowing
> calculus. And I would hope that after some suitably long period of time,
> people won’t be allowed to write programs if they don’t understand these
> simple things.”
>
> Newcombe isn’t so sure that it’s the programmer who is to blame. “I’ve heard
> from Leslie that he thinks programmers are afraid of math. I’ve found that
> programmers aren’t aware—or don’t believe—that math can help them handle
> complexity. Complexity is the biggest challenge for programmers.” The real
> problem in getting people to use TLA+, he said, was convincing them it
> wouldn’t be a waste of their time. Programmers, as a species, are
> relentlessly pragmatic. Tools like TLA+ reek of the ivory tower. When
> programmers encounter “formal methods” (so called because they involve
> mathematical, “formally” precise descriptions of programs), their
> deep-seated instinct is to recoil.
>
> – https://www.theatlantic.com/technology/archive/2017/09/saving-the-world-from-code/540393/

---

## Prerequisites.

* Desire to learn more about functional-style JavaScript.
--

* ES5 Array extras: `map`, `filter`, `reduce`.
--

* FP baseline: compose, closures, decorators, partial application, currying.
--

<p>
<img src="./img/allonge.jpg" alt="JavaScript Allonge" height="200">
&nbsp;
<img src="./img/mostly-adequate.png" alt="Mostly adequate guide to FP" height="200">
</p>

???

* JavaScript Allongé:
  https://leanpub.com/javascriptallongesix
* Mostly adequate guide to FP:
  https://github.com/MostlyAdequate/mostly-adequate-guide

---

## Goal.

* Practical use-cases.
--

* Ship code.
--

* Adopt these ideas incrementally with your team.
--


<p>
<img src="./img/fp-professor-frisby.jpg" width="300" align="top">
&nbsp;
<img src="./img/tom-harding.png" width="400" align="top">
</p>

???

* Professor Frisby Introduces Composable Functional JavaScript:
  https://egghead.io/courses/professor-frisby-introduces-composable-functional-javascript
* Tom Harding <3 Fantas, Eel, and Specification:
  http://www.tomharding.me/fantasy-land/
* Jack Hsu:
  https://jaysoo.ca/2017/04/30/learn-fp-with-react-part-1/
* Alex Kelley, From JavaScript to PureScript:
  https://hackernoon.com/make-the-leap-from-javascript-to-purescript-5b35b1c06fef

How much of these ideas you do or don't use is going to depend on your team.
Take it slow. Introduce one new thing at a time. Ensure the introduction to
your codebase and team will be successful by solving real problems, getting
your coworkers on board as you go, and stop when necessary to give them time to
digest these ideas catch up.

> People say why do you need this thing? I can't prove that you need it. I
> would say try it without it and see how much work you have to do. See how
> much discipline you have to have. See how much structure you have to invent.
> And then maybe you'll come to appreciate what philosophies these systems
> embody.
>
> – David Nolen (on Om.Next / Falcor / et al)

> One of the "big problems" I see with OOP as opposed to FP is that in FP,
> little ideas compose elegantly.
>
> As a result, it is nearly always harder to learn the theory than to manage
> the engineering.
>
> That's good architecture.
>
> – Reginald Braithwaite https://twitter.com/raganwald/status/988758332038045697

> I find that when someone's taking time to do something right in the present,
> they're a perfectionist with no ability to prioritize, whereas when someone
> took time to do something right in the past, they're a master artisan of
> great foresight.
>
> – https://xkcd.com/974/

> I want to forget about the details of implementation for this particular
> thing so I can use it later with a hundred other things.
>
> [...]
>
> I don't care how this thing is implemented. I just care how this thing
> relates to other things.
>
> – Bartoz Milewski

---

## Why JavaScript?

* Ubiquitous. (For now.)
--

* We need to up our game.
--

* Our async primitives are not good enough.

???

Because this is a JavaScript audience and Elm is making waves, a quick
comparison is warranted. It's a good, well though out language and framework
and it is tailored specifically to onboarding JavaScript developers into a
functional language. PureScript is also an excellent language and is much more
open ended. Choose the right tool for your team. (Find Hardy Jones quote...)

---

class: center, middle
layout: false

class: center, middle

## Data types not type checking.

???

Type checking is an obvious pairing when using types but we won't be talking
about that today. It isn't strictly necessary to use types, it's not available
in JavaScript, and the language extensions that do provide it like TypeScript
and Flow only provide better error finding and do not provide any guarantees.

Yes, without type checking there will be runtime errors. If a function is
expecting to receive an object with a `map` method and you pass it something
else you're gonna get weird errors. But we're use to those. We can add runtime
validation to help our team members.

---

class: center, middle

# What are ADTs?

???

A type formed by combining other types. There are two ways to combine types:
AND and OR. We're only going to talk about OR today. You're already familiar
with an example of this: a boolean is a type that is either True or False.

---

class: center, middle

## User-defined types.

???

- A type like a boolean, string, etc, except user-defined.
- Trying to solve similar problems as OOP but from a different direction. Some
  suggest that if OOP was taken to an abstracted final result you would end up
  with ADTs.

  - OOP:
    - Objects have methods.
    - Send data through the methods.
  - ADTs:
    - Types have methods.
    - Send data through the types.

---

exclude: true
class: center, middle

## Syntax primer.

???

- Hindley/Milner.
- PureScript.

  > Haskell is no big deal if you know JavaScript. ">>= is then", "do is
  > async", and "<- is await".
  > – https://gist.github.com/MaiaVictor/bc0c02b6d1fbc7e3dbae838fb1376c80

- Can analogize ADTs in JavaScript vs Haskell somewhat like English vs
  non-English: "Seth's toothbrush" vs "the toothbrush of Seth". Put a method on
  a type vs. a type has an interface for a given method.

---

class: center, middle

# Examples.

???

These examples are purposefully minimal and avoid external libraries to
hopefully remove the appearance of magic and aid in learning.

---

## Example: Identity Monad

Problem: Build a pipeline of computations.

--

```js
Box.of('foo')
    .map(([h, ...t]) => `${h.toUpperCase()}${t.join('')}`)
    .map(x => `${x}!`)
// => Box('Foo!')
```
--

```js
const val = Box.of('foo')
const capitalized = val.map(([h, ...t]) => `${h.toUpperCase()}${t.join('')}`)
const exclaimed = capitalized.map(x => `${x}!`)
// => Box('Foo!')
```
???

- Container.
- `map`.

  > map is not about iterating. It’s about going inside of an object or a
  > data structure and running a function from within that data structure on
  > its properties or behavior.
  > – Brian Lonsdorf

  > Functors come with an operation, `map`, that lets you apply a function to
  > any values of that type that might live within it
  > So, mapping `x => x + 1` over `Array Int` will increment _all_ the
  > numbers in the list
  > mapping it over `Maybe Int` will increment the number _if_ it is present
  > (i.e. `Just`, rather than `Nothing`)
  > mapping it over `IO Int` will increment the number that is produced by
  > that IO action
  – Tom Harding

```js
// The `map` we know and love.
// map :: Functor f => (b -> c) -> f b -> f c
const map = f => xs => xs.map(f)

// WHAT IF I TOLD YOU...
const compose = map // WHAT

// Read `f` in the above as ((->) a)...
// map      :: (b -> c) -> ((->) a) b   -> ((->) a) c
// compose  :: (b -> c) -> (a ->    b)  -> a ->     c
```
– http://www.tomharding.me/2017/04/15/functions-as-functors/

Also, from the functor laws: `fx.map(f).map(g) == fx.map(x => g(f(x)))`
Compare with `const compose = (g, f) => x => g(f(x))`


- `map == compose`.
- `chain`.
- Term: Functor!
- `of`.
- Term: Monad!

  - You've used these already (or close).
  - Promises? Close but they suck.
  - RxJS? Yup.

- Evaluated eagerly, but there is a lazy variant.

---

class: center, middle

## Example: Maybe

???

- Problem: you have a value that might be null.
- Something or Nothing.
- Types vs Sum types.
- Pipeline of computation assuming success.
- Pipeline of computation with sub-Maybes assuming success.

---

class: center, middle

## Common example: Either

???

- Problem: you want to take different paths depending on some criteria.
- Success or Error.
- Thing or Other-Thing.
- Same benefits of Maybe except you get to take a branching path (if/else).

---

class: center, middle

## Common example: Task

???

- Problem: you want to do one or more asynchronous things as part of one or
  more pipelines of computations and you'd like it to be syntactically sane.
- Like a promise but lazy and doesn't auto-flatten.
- If you've never used JavaScript before promises were added, it's important to
  note that they're just syntactic sugar around callbacks. They are not magic
  and can be easily implemented.
- Easy sequential operation with chain.
- Easy parallel operation with ap (and currying).
- Term: Applicative!
- FIXME Where to explain "apply a list of functions to a list of values"? Or is
  it better to say that you can use a regular function with the inner values?
  http://fictional.logdown.com/posts/5765399-your-data-is-loading
- Alternative in Task is like Rx's race operator?

---

class: center, middle

## Common example: String & Array

???

- Problem: you want to combine two things of the same type without having to
  write the code to do the combining each time.
- `concat`.
- Term: Semigroup!
- Problem: you can blindly combine things now but it would be nice to be able
  to combine a list of things but you don't know where to start (no seed
  value) -- i.e, reduction.
- Problem: Requiring the initial value to be a certain value makes your
  accumulator function fragile and rely on some external source.
- `empty`.
- Term: Monoid!
- `fold`.
- Example reduceable types:

  - Sum.empty = () => Sum(0);
  - Product.empty = () => Product(1);
  - Max.empty = () => Max(-Infinity);
  - Min.empty = () => Min(Infinity);
  - All.empty = () => All(true);
  - Any.empty = () => Any(false);

> I have been noticing that whenever there is a reduce around, it is indicative
> of an abstraction somewhere. Many people call this a code smell.
– https://joneshf.github.io/programming/2015/12/31/Comonads-Monoids-and-Trees.html

---

class: center, middle

## Common example: ???

???

- Problem: you have a list of containers each with one value but you want one
  container with a list of values instead.
- `sequence`.
- Problem: when you turn something inside out like that you almost always want
  to map a function over all the values.
- `traverse`.
- Term: Traversable!

---

class: center, middle

# Intermission.

---

class: center, middle

# Make your own types.

---

class: center, middle

## Example: XhrResult.

???

- Problem: An XHR request/response has four separate states to keep track of.

  - Don't want to separate each out into different parts of the app. E.g.,

    - Angular: `$scope.spinner = true`
    - Redux: `{...state, spinner: true}`

  - Don't want to have to check for errors at every level.
  - Don't want to have to check the current state at every level.
  - Don't want business logic in the view doing way different things for each state.
  - JavaScript programmers may say, "Doing that isn't hard. Why should I care?"
    and the reason is it keeps the state implicit and self-contained. You can
    pass around this one container, you can perform operations on the success
    condition, and that's _one less thing_ you have to think about.

---

class: center, middle

## Example: Collection.

???

- Problem: You need to add and remove things from a collection and you have
  to create a new add/remove function for each type of thing.

  - Run a reduce operation to add/remove values to a hashmap of values.
  - Using an RxJS `scan` operation to add/remove an object of values over time.

---

class: center, middle

## Example: View

???

- Problem: TODO: Combine HTML markup? Combine CSS markup?

---

class: center, middle

## Example: All-Singing, All-Dancing Synchronous/Asynchronous Show

???

- Problem: You want to very granularly mix and match a ton of asynchronous
  operations with synchronous operations.
- RxJS Observables compose like nobody's business. (Yup, it's a functor,
  pointed functor, monad, semigroup, monoid, and more.)
- Cofree streams. Minimal streaming library with complex composition.

---

class: center, middle

# Bonus Round.

---

class: center, middle

## Example: IO

???

- Problem: you want to encapsulate side effects for use in a pure function.

---

class: center, middle

## Example: Reader

???

- Problem: you want read access to values as part of your pipeline of
  computations.

> To lower cognitive load, keep as many functions as possible outside of your
> closure. Keep as many methods as possible outside of your class (as
> functions). If passing things around gets complex, try Reader, Env, or
> currying.
– https://twitter.com/drboolean/status/976853321293160449

https://gist.github.com/DrBoolean/917f9a34fd87716a455493c96a868633

---

class: center, middle

## Example: Writer

???

???

> Writer is a really neat fit for uni-directional flow, because you can
> actually use the value on the right-hand side as a kind of "exit code" to
> feed back to your caller
> I wrote another post on the Extend typeclass that uses pairs again but as a
> comonad, and that lets you read from the value you've been building up, which
> is pretty neat
> Tuple can do read and write state with extend and bind/chain, but excitingly,
> function arrow (reader) can do read and write with bind and extend (the other
> way round)
> it's almost like there's some kind of pairing between tuples and function
> arrows underneath it all...
– Tom Harding (fp Slack)

---

class: center, middle

## Example: State

???

- Problem: you want read and write access to values as part of your pipeline
  of computations.

???

Use-case: Purely functional logging.

Error handling and logging break the mainline flow of an application.
Violate single-responsibility.

– Michael Feathers https://www.youtube.com/watch?v=AnZ0uTOerUI&t=2216s

---

class: center, middle

## Example: Conditionals/fallbacks

???

- Problem: if something fails you want to return a default or try again or
  try a list of possible things.

---

class: center, middle

## Example: Streams

???

- Problem: you have multiple values over time.
- RxJS definitely. How about a mini stream lib instead?

---

class: center, middle

# Conclusion.

---

class: center, middle

## Summary of types.

???

- Function composition – Functor (`map`)
- Sequential execution – Monad (`map`, `chain`)
- Preprocessing – Contravariant (`contramap`)
- Parallel, recursive execution – Applicative (`ap`, `map`)
- Combination – Semigroup (`concat`)
- Reduction – Monoid (`concat`, `empty`)
- Equality – Setoid (`equals`)
- Ordering – Ord (`equals`, `gte`, `lte`)
- If/else, try/catch, switch – Alternative, Plus (`ap`, `alt`, `zero`)
- Encapsulate side-effects – IO (`map`, `chain`)
- Read-only context – Reader (`map`, `chain`)
- Read/write state – State (`map`, `chain`)
- Streams – Cofree (`extract`, `extend`)

---

class: center, middle

## Closing thoughts.

???

- Use the simplest abstraction to solve the problem.

https://hackernoon.com/two-years-of-functional-programming-in-javascript-lessons-learned-1851667c726
