var model = require("../../domain/model");
var helper = require("../../service/helper");
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
        var i = 0;
        spyOn(model.Word, 'find').andCallFake(function() {
            return {
                exec: function(cb) {
                    cb(null, [{
                        _id: 1,
                        text: "Palabra "+(i++)
                    }])
                }
            }
        });
        helper.generateGrill(function(grill) {
            console.log("Words", grill.matrix);
            expect(grill.matrix).toBeDefined();
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
                        text: "Palabra "+(i++)
                    }])
                }
            }
        });
        var regexp = new RegExp("^..l..r");
        helper.getRndWord(regexp, [], function(word) {
            console.log("Word", word);
            expect(word[2]).toBe("l");
            expect(word[5]).toBe("r");
            done();
        });
    });
    

});

