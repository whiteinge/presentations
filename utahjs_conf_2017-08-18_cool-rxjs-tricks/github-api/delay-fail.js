/**
A json-server middleware that adds a random delay to each response and
occassionally times out or fails a request.
**/
module.exports = function delay(req, res, next) {
    var pctl = Math.floor(Math.random() * 100);

    // Fail 2% of the time.
    if (pctl < 3) {
        if (pctl === 2) { /* timeout; don't respond */ }
        else {
            console.log('res', res);
            res.statusCode = 500;
            res.statusMessage = 'An error occurred';
            next();
        }
    } else {
        setTimeout(() => next(), Math.floor(Math.random() * 1000));
    }
};
