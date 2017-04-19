var value = tryCatcher(() => JSON.parse(JSON.stringify('foo')));;
// var value = tryCatcher(() => JSON.parse(''));;

var pipeline1 = value
    .map(x => x.toUpperCase())
    .map(x => x.replace(/.$/, '!'));

var pipeline2 = pipeline1
    .map(x => `<blink>${x}</blink>`);

pipeline2.fold(
    x => console.log('Error:', x.message),
    x => console.log('Success:', x));
