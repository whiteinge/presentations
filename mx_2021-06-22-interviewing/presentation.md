class: center, middle, inverse

<h1>
Interviewing
<br>
<span style="font-size: 60%;">
and Interviewing for JavaScript
</span>
</h1>

A brownbag at

<img width="200px" src="./mx-logo.svg" alt="MX Technologies">

by Seth House

@whiteinge<br>
seth@eseth.com

---

# Presentation Caveats

--
- Advice; not rules; not even best practices.

--
- No "one size fits all".

--
- Tailor questions to the interviewee.

---

class: center, middle

# Interviewing Tips

---

class: inline-list

## Interviewing is Hard

--
- Nervous,

--
- Shy,

--
- Introvert,

--
- Extrovert,

--
- Impostor syndrome,

--
- Speaker,

--
- Reader,

--
- Writer,

--
- Thinker,

--
- Talker,

--
- Explorer,

--
- Focused,

--
- Wanderer,

--
- Junior,

--
- Mid-level,

--
- Senior.

---

## Time is Short

--
- An hour is not enough time.

--
- You *will not* get enough feedback to make an informed decision.

--
- But you do have to make a decision.

---

## Interview Goal

--
- Meet them where they are,

--
- to get them talking,

--
- and make the most of the time you have,

--
- so you get the least inaccurate impression.

---

## Company Goal

--
- Turnover is time-consuming and expensive.

--
- Will this person survive at the company?

--
- Will this person make the company & a team better?

--
- How much effort will be required to onboard?

--
- Will this person be a worthwhile investment?

--
- It's hard to say "no". It's easy to say "yes".

---

## Preparation

--
- Review the resume beforehand. Make notes;

--
- be quick to abandon your notes if needed.

--
- Choose starting questions they **should** be able to answer.

---

## Start the Interview

--
- Short(!) introductions; say enough about yourself, position, & background
  that they can ask follow-up questions if wanted/needed.

--
- Establish the schedule for the hour.

--
- Go!

---

## Question for Experience Level

--
- Discover junior/mid/senior status quickly.

--
- Tailor your questions for that level.

--
- Follow a question path until you find their limits.

--
- Include your thoughts on experience level in your review.

---

## Avoid "Filler" Questions

--
- Don't ask them to repeat their resume.

--
- You're not a psychologist:

  > If you were a car, what kind of car would you be?

--
- Have a desired deliverable for each question you ask.

--
- Stop a line of questioning early if it isn't providing you insight.

--
- Stop an answer if it's overly long or rambly and isn't providing you insight.

---

## What Questions to Ask

--
- Start with something they've done or are proud of.

--
- Ask for more detail about their answers.

--
- Insights, not trivia.

--
- Keep asking until you reach the limit of their experience (knowledge or
  _direct_ involvement).

--
- Ascertain & verify what they've **already said they know** and **how well**
  they know it.

--
- Have they used something "in anger"?

  > What's your favorite X?

  > Tell me all the bad things about X.

--
- "Personality" questions and can often be combined with technical questions.

--
  > How did your team take to your suggestion to use X?

  > What did you do to convince your team of your approach?

  > What parts of your suggestion were a success? What parts were a failure?

---

## Interviewing "Up"

--
- Sometimes you'll be outclassed. Own it.

--
- Don't apologize, don't pretend...and don't give them a pass.

--
- Turn the tables.

--
- Ask them what interview questions they would ask.

--
- Ask them questions from your relative perspective.

  > "If I came to you with situation X..."

  > "If you were leading my team and problem Y happened..."

  > "I don't know Z very well. How would you mentor me on Z?"

--
- Ask how they would build/organize a team/feature/strategy and what are their
  success/failure criteria. Ask how they would approach a failure.

???

Maybe they know a topic better than you. Maybe they're applying for something
you haven't experienced yet. You can't ask meaningful questions about a topic
you're not familiar with so stick to your own perspective.

---

class: center, middle

# JavaScript Questions

---

## Question for Experience

--
- Code camp graduate.

--
- Code camp trainer.

--
- CS degree.

--
- Work experience.

---

## Syntax vs Understanding

--
- Use precise terminology; ask for precise terminology.

--
- ES6+ adds a _ton_ of (confusing) syntax.

--
```js
useEffect(() => {
    const cleanupThing = doThing();
    return () => cleanupThing();
}, [])
```

--
```js
const [state, setState] = useState({})
```

--
```js
const newObject = {...oldObject, foo: 'Foo!'}
```

---

## JavaScript Basics

--
- Hoisting, type coersion, `this`.

--
- Methods of binding `this`.

--
- `var`, `let`, `const`.

--
- "Array extras" -- `map`, `filter`, `reduce`.

---

## React Basics

--
- Why does it exist?

--
- Lifecycle methods.

--
- Hooks vs lifecycle methods.

--
- Where to make an ajax request? How to handle the response?

---

## JavaScript Intermediate

--
- Variable closure.

--
- Partial application; currying.

--
- IIFEs.

---

## DOM API Basics

--
- What is React and what is "the platform"?

--
- Querying nodes; event listeners; document "ready" event.

---

## Interest in a Checklist?

Interest in standardizing (somewhat) our common MX questions?
