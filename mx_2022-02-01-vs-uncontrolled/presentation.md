class: center, middle, inverse

<h1>
    <span style="color: white">Controlled vs Uncontrolled</span>
    <br>
    <span style="font-size: 60%">A Tale of Two Forms</span>
</h1>

A brownbag deep-dive at

<img width="200px" src="./mx-logo.svg" alt="MX Technologies">

by Seth House

@whiteinge<br>
seth@eseth.com

---

class: center, middle

# Why?

“We had everything before us, we had nothing before us.”

???

Why talk about this? Haven't controlled inputs already "won"?

Tommy asked my opinion on controlled vs uncontrolled back when I first hired
on. I said something about everything always "trends toward controlled" meaning
as the needs or sophistication of a form grows, controlled inputs are either
the easiest approach, or possibly even necessary and the only approach.

---

class: center, middle

# A (quick) introduction

---

## Controlled

```js
<input type="text"
    value={this.state.foo}
    onChange={(ev) => this.setState({foo: ev.target.value})} />
```

--

* Data stored explicitly (component state, hook, Redux, etc).
* Change to data triggers a re-render.
* Retrieve current value by referencing external state.

--

React controls the current value.

---

## Uncontrolled

```js
<input type="text"
    defaultValue={this.state.foo}
    name="foo" />
```

--

* Data stored implicitly (in the DOM tree).
* Change to data does not trigger a render.
* Retrieve current value by reacting to DOM events, or by finding the DOM
  element.

--

The browser controls the current value.

---

## A side-rant about refs

--

Refs are an API "escape hatch":
--

* Useful when necessary.
* Easy to create a mess when overused.
* Always imperative.
--


"Common wisdom" is uncontrolled inputs means using refs. That's only true when
you need imperative access to values. DOM events, `FormData` instances, and
`HTMLFormElement` instances are very flexible.

---

## A quick HTML form primer

--

```html
<form id="myform">
  <fieldset>
    <legend>Inputs</legend>
    <label><input type="text" name="mytext" placeholder="Some Text"></label>
    <br>
    <label><input type="number" name="mynumber" placeholder="Some Number"></label>
  </fieldset>

  <fieldset>
    <legend>Radio and Checkbox</legend>
    <label><input type="radio" name="myradio" value="foo">Foo</label>
    <label><input type="radio" name="myradio" value="bar">Bar</label>
    <br>
    <label><input type="checkbox" name="mycheckbox"> Check?</label>
  </fieldset>

  <fieldset>
    <legend>Buttons</legend>
    <button type="submit">Submit</button>
    <button type="reset">Reset</button>
  </fieldset>
</form>
```

???

* The `id` attribute creates a global variable.
* The `name` attribute creates a form-local variable.
* Disable entire fieldsets
* `form.elements`

---

## `FormData`

```js
const urlEncodedData = new FormData(myform)
```

--

```js
// Automatically sets Content-Type to "multipart/form-data"
fetch('/some/path', {method: 'POST', body: urlEncodedData})
```

--

```js
// As a JavaScript object:
const data = Object.fromEntries(new FormData(myform))
```

---

## `HTMLFormElement`

* Form attributes.
* Form elements: `myform.elements`.

  * Careful not to name any form fields that will shadow existing DOM
    attributes like `length` or `submit`.

* Available via events: `ev => ev.target.form`.

--

Note checkboxes and radio collections don't provide defaults to `FormData` but
those are accessible via `HTMLFormElement`:

```js
const data = Array.from(myform.elements)
        .reduce((acc, cur, idx, collection) => {
  if (cur.type === 'checkbox') { acc[cur.name] =
    collection[cur.name].checked }
  if (cur.type === 'radio') { acc[cur.name] =
    collection[cur.name].value }

  return acc
}, Object.fromEntries(new FormData(myform)))
```

---

## Update another part of the page (controlled)

--

```js
/* ...snip State logic up here... */
<form>
    <h1>{this.state.campaignName || 'Campaign'}</h1>

    <input
        value={this.state.campaignName}
        placeholder="Campaign Name"
        onChange={(ev) =>
            this.setState({campaignName: ev.target.value})} />
</form>
```

---

## Update another part of the page (uncontrolled)

--

```js
<form>
    <h1>
        <output htmlFor="campaignName" name="nameDisplay">
            Campaign
        </output>
    </h1>

    <input
        defaultValue=""
        placeholder="Campaign Name"
        name="campaignName"
        onChange={(ev) =>
            ev.target.form.elements.nameDisplay.value =
                ev.target.value
                || ev.target.form.nameDisplay.defaultValue} />
</form>
```
---

## Disable submit until the form is valid (controlled)

--

```js
<form>
  <input type="text" value={this.state.name} placeholder="name" />

  <br/>

  <button type="submit" disabled={this.isFormValid()}>
    Submit
  </button>
</form>
```

---

## Disable submit until the form is valid (uncontrolled)

--

```js
<form onChange={(ev) =>
    ev.target.form.submit.disabled =
        !ev.target.form.checkValidity()}>

  <input type="text" name="name" placeholder="name" required />

  <br/>

  <button type="submit" name="submitbtn" disabled={true}>
    Submit
  </button>
</form>
```

---

## Form errors (controlled)

--

* State management for values.
--

* State management for errors.
--

  * Set error message.
  * Highlight input.

--


```js
<input type="text" value={this.state.values.name} />
{this.state.errors.name && (
    <span className="error-msg">{this.state.errors.name}</span>
)}
```

---

## Form errors (uncontrolled)

--

```js
<input type="text" name="name" onChange={(ev) => {
    if (ev.target.value === 'forbidden') {
        ev.target.setCustomValidity('Doh!')
    } else {
        ev.target.setCustomValidity('')
    }
    ev.target.reportValidity()
}} />
```
--

```js
<style>
{`
input:invalid {border: 1px solid red;}
input:valid {border: 1px solid green;}
`}
</style>
```

---

## Update component state from uncontrolled inputs

--
```js
<form onChange={(ev) => setState(oldState => ({
    ...oldState,
    [ev.target.name]: ev.target.value,
  }))}>

  <input type="text"
    name="name"
    defaultValue={state.name} />

  <br />

  <input type="number"
    name="zipcode"
    defaultValue={state.zipcode} />
</form>
```

???

Sometimes useful when you have a dynamic form where fields are added and
removed frequently. Be wary as you have two sources of truth -- one should be
primary and the other should be a mirror that is (hopefully) kept up-to-date.

---

class: center, middle

# Summary?

---

## What can controlled inputs learn from from uncontrolled inputs?

--

Embrace or resist (the platform).

<a href="https://thunderlotusgames.com/sundered/"><img
src="./embrace-or-resist.png"></a>

---

class: center, middle

# Addendum

---

## `dialog`

--

```js
<dialog id="mydialog">
    <form method="dialog" >
        <p>Modal content here!</p>
        <button type="submit">Close</button>
    </form>
</dialog>

<button type="button" onclick="mydialog.showModal()">Show</button>

<style>
dialog[open] { max-width: 80%; max-height: 80% }
dialog::backdrop { background: 'black'; opacity: 90% }
</style>
```

---

## `dialog` plus async

```html
<dialog id="mydialog">
    <form
        method="dialog"
        onsubmit="((ev) => {
            ev.preventDefault(); // Stop the modal from closing.
            ev.target.elements.submitbtn.disabled = true
            ev.target.elements.spinner.value = '🌀'
            setTimeout(() => {
                ev.target.submit(); // Close the modal later.
                ev.target.elements.submitbtn.disabled = false
                ev.target.elements.spinner.value = ''
            }, 2000);
        })(event)"
    >
        <button type="submit" name="submitbtn">
            Wait 2s then close.
            <output name="spinner" for="mydialog"></output>
        </button>
    </form>
</dialog>

<button type="button" onclick="mydialog.showModal()">Show</button>
```

???

```html
<style>
dialog[open] { max-width: 80%; max-height: 80%; }
dialog::backdrop { background: 'black'; opacity: 90%; }

@keyframes spin { to {transform:rotate(360deg);} }
button > output {
    animation: spin 1000ms linear infinite;
    display: inline-block;
}
</style>
```
