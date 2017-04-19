function somethingThatMayFail(didFail = false) {
    if (didFail) {
        return Either.Left({error: 'Could not retrive value.'});
    } else {
        return Either.Right('Celebrate good times.');
    }
}

var value = somethingThatMayFail();

var pipeline1 = value
    .map(x => x.toUpperCase())
    .map(x => x.replace(/.$/, '!'));

var pipeline2 = pipeline1
    .map(x => `<blink>${x}</blink>`);

pipeline2.fold(
    x => console.log('Error:', x),
    x => console.log('Success:', x));
