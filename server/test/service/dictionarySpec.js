var http = require('http');
var dictionary = require("../../service/dictionary");

describe("dictionary.js", function() {

	it("Should retrive a definition", function(done) {

		dictionary.define("casa", function(err, definition) {
			
			expect(definition).toBe('{{ucf|edificación}} destinada a [[vivienda]]. ');

	        dictionary.define("herbívoro", function(err, definition) {
				
				expect(definition).toBe('Que se alimenta de [[vegetal]]es de cualquier tipo');

				dictionary.define("coco", function(err, definition) {
					expect(definition).toBe('(\'\'Cocos nucifera\'\') [[palmera|Palmera]] [[pantropical]], única de su género, que crece en [[hábitat]]s [[arenoso]]s y [[salino]]s. Alcanza los 30 m de altura, con [[hoja]]s pinnadas de hasta 6 m de largo. Se aprovecha extensamente, utilizándose la [[fibra]] de sus hojas para fuertes [[tejido]]s y sobre todo la [[pulpa]] de su [[fruto]], una [[drupa]] fibrosa, en alimentación');

					done();	        	
		        });       	
	        });
		});
		
	});

	it("Should return error if not found", function(done) {

		dictionary.define("Pelopopopopopo", function(err, definition) {

			expect(err).toBeDefined();
			expect(err.code).toBe("NOT_FOUND");
			expect(definition).not.toBeDefined();

			done();

		});

	});

	it("Should separate in syllables", function(done) {

		expect(dictionary.splitSyllables("locomotora")).toEqual("lo-co-mo-to-ra".split("-"));
		expect(dictionary.splitSyllables("hermafrodita")).toEqual("her-ma-fro-di-ta".split("-"));
		done();

	});	

});