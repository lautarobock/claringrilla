var model = require("../../domain/model");
var helper = require("../../service/helper");
var dictionary = require("../../service/dictionary");
var mongoose = require("mongoose");

describe("grill.js", function() {

    it("Should beautify the phrase", function(done) {

    	var beauty = helper.beautifyPhrase("En esta comunidad, ¡yo soy la ley!");

    	expect(beauty).toBe("enestacomunidadyosoylaley");

    	beauty = helper.beautifyPhrase("Hola\nMundo");

    	expect(beauty).toBe("holamundo");

        done();
    });    

    it("Should return available amount of words", function(done) {
    	var ph = new helper.PhraseHelper("Hola\nMundos",2,5);

    	expect(ph.isValid()).toBeTruthy();
    	expect(ph.availableWords()).toBe(5);
    	expect(ph.buildRegExpForRow(0)).toBe("^..h..u");

    	ph = new helper.PhraseHelper("Hola\nMundo");

    	expect(ph.isValid()).toBeFalsy();

    	ph = new helper.PhraseHelper("En esta comunidad, ¡yo soy la leys!",2,5);

    	expect(ph.isValid()).toBeTruthy();
    	expect(ph.availableWords()).toBe(13);
    	expect(ph.buildRegExpForRow(0)).toBe("^..e..a");

    	

    	done();
    });

    it("Should generate a grill with words", function(done) {
        var can = true;
        var j = 0;
        spyOn(dictionary, 'define').andCallFake(function (word, callback) {
            can = !can;
            j++;
            if ( can ) {
                callback(null, "definicion de [[" + word + ", "+(j)+"]]");
            } else {
                callback({code: "NOT_FOUND"});
            }
        });
        var i = 0;
        spyOn(model.Word, 'find').andCallFake(function() {
            return {
                exec: function(cb) {
                    // console.log("i",i);
                    cb(null, [{
                        _id: 1,
                        text: "Palabra"+(i++),
                        frecuency: 1
                    },{
                        _id: 1,
                        text: "Palabrota"+(i++),
                        frecuency: 10
                    }])
                }
            }
        });
        helper.generateGrill(function(grill) {
            // console.log("Words", grill.matrix);
            // console.log("definitions", grill.definitions);
            // console.log("syllables", grill.syllables);

            expect(grill.matrix).toBeDefined();
            expect(grill.matrix.length).toBe(13);

            expect(grill.definitions).toBeDefined();
            expect(grill.definitions.length).toBe(13);

            expect(grill.syllables).toBeDefined();
            // expect(grill.definitions.length).toBe(13);

            done();
        });
    });

    it("Should generate a random word", function(done) {
        var i = 0;
        spyOn(model.Word, 'find').andCallFake(function() {
            return {
                exec: function(cb) {
                    cb(null, [{
                        _id: 1,
                        text: "Palabra 1",
                        frecuency: 2
                    },{
                        _id: 1,
                        text: "Palabra 2",
                        frecuency: 3
                    }]);
                }
            }
        });
        spyOn(helper,"getRandomInt").andReturn(3);

        var regexp = new RegExp("^..l..r");
        helper.getRndWord(regexp, [], function(word) {
            // console.log("Word", word);
            expect(word).toBe("Palabra 2");
            done();
        });
    });

    it("Should generate array of choices", function(done) {

        var words = [{text: "Casa", frecuency: 4},
            {text: "Pelo", frecuency: 3.3},
            {text: "Polo", frecuency: 1.9},
        ];
        var array = helper.buildChoices(words);
        expect(array.length).toBe(12);
        var casa = 0;
        var pelo = 0;
        var polo = 0;
        for(var i=0; i<array.length; i++) {
            if ( array[i] == "Casa") casa++;
            if ( array[i] == "Pelo") pelo++;
            if ( array[i] == "Polo") polo++;
        }
        expect(casa).toBe(5);
        expect(pelo).toBe(4);
        expect(polo).toBe(3);
        done();
    });



    

});

