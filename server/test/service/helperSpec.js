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

        beauty = helper.beautifyPhrase("[[Invento|Inventar]] un avión no es nada");

        expect(beauty).toBe("inventarunavionnoesnada");

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

    // it("Should generate a grill with words", function(done) {
    //     var can = true;
    //     var j = 0;
    //     spyOn(dictionary, 'define').andCallFake(function (word, callback) {
    //         can = !can;
    //         j++;
    //         if ( can ) {
    //             callback(null, "definicion de [[" + word + ", "+(j)+"]]");
    //         } else {
    //             callback({code: "NOT_FOUND"});
    //         }
    //     });
    //     var i = 0;
    //     spyOn(model.Word, 'find').andCallFake(function() {
    //         return {
    //             exec: function(cb) {
    //                 // console.log("i",i);
    //                 cb(null, [{
    //                     _id: 1,
    //                     text: "Palabra"+(i++),
    //                     frecuency: 1
    //                 },{
    //                     _id: 1,
    //                     text: "Palabrota"+(i++),
    //                     frecuency: 10
    //                 }])
    //             }
    //         }
    //     });
    //     helper.generateGrill(function(grill) {
    //         // console.log("Words", grill.matrix);
    //         // console.log("definitions", grill.definitions);
    //         // console.log("syllables", grill.syllables);

    //         expect(grill.phrase).toBeDefined();
    //         expect(grill.author).toBeDefined();

    //         expect(grill.matrix).toBeDefined();
    //         // expect(grill.matrix.length).toBe(13);

    //         expect(grill.definitions).toBeDefined();
    //         // expect(grill.definitions.length).toBe(13);

    //         expect(grill.syllables).toBeDefined();
    //         // expect(grill.definitions.length).toBe(13);

    //         done();
    //     });
    // });

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
        spyOn(helper,"getRandomInt").andReturn(1);

        var regexp = new RegExp("^..l..r");
        helper.getRndWord(regexp, [], function(word) {
            // console.log("Word", word);
            expect(word.text).toBe("Palabra 2");
            done();
        });
    });

    it("Should generate a random word but not found", function(done) {
        var i = 0;
        spyOn(model.Word, 'find').andCallFake(function() {
            return {
                exec: function(cb) {
                    cb(null, []);
                }
            }
        });
        spyOn(helper,"getRandomInt").andReturn(3);

        var regexp = new RegExp("^..l..r");
        helper.getRndWord(regexp, [], function(word) {
            // console.log("Word", word);
            expect(word).toBe(null);
            done();
        });
    });

    it("Should generate array of choices", function(done) {

        var words = [{text: "Casa", frecuency: 4},
            {text: "Pelo", frecuency: 3.3},
            {text: "Polo", frecuency: 1.9},
        ];
        var array = helper.buildChoices(words);
        // expect(array.length).toBe(12);
        expect(array.length).toBe(3);
        var casa = 0;
        var pelo = 0;
        var polo = 0;
        for(var i=0; i<array.length; i++) {
            if ( array[i].text == "Casa") casa++;
            if ( array[i].text == "Pelo") pelo++;
            if ( array[i].text == "Polo") polo++;
        }
        // expect(casa).toBe(5);
        // expect(pelo).toBe(4);
        // expect(polo).toBe(3);
        expect(casa).toBe(1);
        expect(pelo).toBe(1);
        expect(polo).toBe(1);
        done();
    });

    it("Should generate random phrase position", function(done) {

        // var max = 6;
        for ( var i=0;i<10;i++) {
            for ( var max=4; max<=8; max++ ) {
                var pos = helper.generatePos(max);
                // console.log("POS:", pos);
                expect(pos.col1).toBeDefined();
                expect(pos.col2).toBeDefined();
                expect(pos.col1<(pos.col2-1)).toBeTruthy();
                expect(pos.col2<max).toBeTruthy();
            }   
        }
        
        done();

    });

    it("Should shortify URL", function(done) {
        var initURL = "http://www.google.com/";
        helper.shortUrl(initURL, function(err, shortUrl) {
            // console.log("shortUrl", shortUrl);

            helper.expandUrl(shortUrl, function(err, url) {
                // console.log("URL", url);

                expect(url).toBe(initURL);

                done();
            });
        });
    });
    

});

