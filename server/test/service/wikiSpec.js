var wiki = require("../../service/wiki");


describe("wiki.js", function() {

	it("Should parse simple links", function(done) {

		var text = wiki.wiki2html('Edificacion destinada a [[vivienda]].')

		expect(text).toBe("Edificacion destinada a vivienda.");

		text = wiki.wiki2html('[[palmera|Palmera]] [[pantropical]], única de su género');

		expect(text).toBe("Palmera pantropical, única de su género");

		text = wiki.wiki2html('{{ucf|conjunto}} de {{plm|plantas}}');

		expect(text).toBe("Conjunto de Plantas");

		text = wiki.wiki2html('[[cinco|Cinco]] veces [[diez]]');

		expect(text).toBe("Cinco veces diez")

		done();

	});

	it("Should parse 'participio' template", function(done) {

		var text = wiki.wiki2html("{{participio|ojetear}}.")
		expect(text).toBe("Participio de ojetear.");
		text = wiki.wiki2html("{{participio|ojetear|irregular=|pronominal=|leng=es}}.")
		expect(text).toBe("Participio de ojetear.");
		done();

	});

	it("Should parse 'participio' template", function(done) {

		var text = wiki.wiki2html("{{participio|ojetear}}.")
		expect(text).toBe("Participio de ojetear.");
		text = wiki.wiki2html("{{participio|ojetear|irregular=|pronominal=|leng=es}}.")
		expect(text).toBe("Participio de ojetear.");
		done();

	});

	it("Should parse 'sustantivo de verbo' template", function(done) {

		var text = wiki.wiki2html("{{sustantivo de verbo|operar}}.")
		expect(text).toBe("Acción o efecto de operar.");
		done();

	});

	it("Should parse 'adverbio de adjetivo' template", function(done) {

		var text = wiki.wiki2html("{{adverbio de adjetivo|duro}}.")
		expect(text).toBe("De un modo duro.");
		done();

	});

	it("Should parse 'adjetivo de sustantivo' template", function(done) {

		var text = wiki.wiki2html("{{adjetivo de sustantivo|la prosodia}}.")
		expect(text).toBe("Que pertenece o concierne a la prosodia.");
		done();

	});


});