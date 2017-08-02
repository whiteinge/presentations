var _ = require('lodash');
var faker = require('faker');
var Identicon = require('identicon.js');

module.exports = genData;

// ----------------------------------------------------------------------------

function genData(userCount = 50, maxRepos = 5) {
    var users = _.chain(_.range(userCount))
        .reduce(genUser, [])
        .value();

    var repos = _.chain(users)
        .flatMap(user => _.range(_.random(0, maxRepos)).map(x => user))
        .reduce(genRepo, [])
        .value();

    return {
        users,
        repos,
    };
}

function genUser(acc, user) {
    var id = faker.internet.userName().toLowerCase();
    var user = {
        id,
        avatar: new Identicon(faker.random.uuid()).toString(),
        url: `/users/${id}`,
        repos_url: `/users/${id}/repos`,
    };

    acc.push(user);
    return acc;
}

function genRepo(acc, user) {
    var id = faker.lorem.slug();
    var repo = {
        id,
        userId: user.id,
        url: `/repos/${id}`,
        stars: _.random(0, 2000),
    };

    acc.push(repo);
    return acc;
}
