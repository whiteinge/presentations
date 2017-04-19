var body = document.querySelector('body');
body.innerHTML = `
<ul>
    <li>foo</li>
    <li data-tooltip="You found bar.">bar</li>
</ul>
`;

// ---------------------------------------------------------------------------

var valueFromElement = fromNullable(document.querySelector('ul'))
    .chain(x => fromNullable(x.querySelector('li:last-child')))
    .chain(x => fromNullable(x.dataset.tooltip))
    .do(x => console.log('x', x))
    .map(x => x.toUpperCase())
    .map(x => x.replace(/.$/, '!'));

var result = valueFromElement.getOrElse('Doh!');
console.log('Result:', result);