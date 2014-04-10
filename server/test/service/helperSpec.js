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

    

});

