function somethingThatMayFail(didFail = false) {
    if (didFail) {
        return Maybe.Nothing();
    } else {
        return Maybe.Just('foo');
    }
}

var value = somethingThatMayFail();

var pipeline1 = value
    .map(x => x.toUpperCase())
    .map(x => `${x}!`);

var pipeline2 = pipeline1
    .chain(x =>
        somethingThatMayFail()
            .map(y => `${x} & ${y}`))
    .map(x => `<blink>${x}</blink>`);

var result = pipeline2.getOrElse('Doh!');
console.log('Result:', result);