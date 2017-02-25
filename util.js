// TODO further isolate this code so that adjectives and animals are saved
// in the module code and not somewhere else

module.exports.loadNames = function() {
    var animals = [],
        adjectives = [];
    var lineReader = require('readline').createInterface({
        input: require('fs').createReadStream(__dirname + '/resources/adjectives')
    });

    lineReader.on('line', function(line) {
        adjectives.push(line);
    });

    lineReader = require('readline').createInterface({
        input: require('fs').createReadStream(__dirname + '/resources/animals')
    });

    lineReader.on('line', function(line) {
        animals.push(line);
    });
    return [adjectives, animals];
}

/*
    adjectives, animals arguments are arrays of strings
    returns a String of the form AdjectiveAnimal
*/
module.exports.generateName = function(adjectives, animals) {
    var first_adjective, second_adjective, animal;
    var rand;
    first_adjective =
        adjectives[Math.floor(Math.random() * adjectives.length)];
    second_adjective =
        adjectives[Math.floor(Math.random() * adjectives.length)];
    animal = animals[Math.floor(Math.random() * adjectives.length)];

    first_adjective =
        first_adjective[0].toUpperCase() + first_adjective.slice(1);
    second_adjective =
        second_adjective[0].toUpperCase() + second_adjective.slice(1);
    animal = animal[0].toUpperCase() + animal.slice(1);

    return first_adjective + animal;
};
