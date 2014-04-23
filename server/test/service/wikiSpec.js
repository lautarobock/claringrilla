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

	it("Should parse 'gentilicio' template", function(done) {

		var text = wiki.wiki2html("{{gentilicio|[[Calahorra]]}}.")
		expect(text).toBe("Originario, relativo a, o propio de Calahorra.");
		done();

	});

	it("Should parse 'sustantivo de adjetivo' template", function(done) {

		var text = wiki.wiki2html("{{sustantivo de adjetivo|cándido}}.")
		expect(text).toBe("Condición o carácter de cándido.");
		done();

	});

	it("Should parse 'forma participio' template", function(done) {

		var text = wiki.wiki2html("{{forma participio|pospuesto|f|pl}}.")
		// expect(text).toBe("Forma del femenino plural de pospuesto, participio irregular de posponer.");
		expect(text).toBe("Forma del femenino plural de pospuesto.");

		text = wiki.wiki2html("{{forma participio|pospuesto|m|sing}}.")
		expect(text).toBe("Forma del masculino singular de pospuesto.");

		text = wiki.wiki2html("{{forma participio|pospuesto|masculino|sing}}.")
		expect(text).toBe("Forma del masculino singular de pospuesto.");

		text = wiki.wiki2html("{{forma participio|pospuesto|m}}.")
		expect(text).toBe("Forma del masculino de pospuesto.");

		done();

	});

	it("Should replace fixed templates", function(done) {
		
		var text = wiki.wiki2html("bla bla {{DLC1842‎}} pag 606")
		expect(text).toBe("bla bla <b>segun diccionario 1842‎</b> pag 606");

		text = wiki.wiki2html("bla bla {{DLC1914|514}} pag 606")
		expect(text).toBe("bla bla <b>segun diccionario 1914|514</b> pag 606");

		done();
	});


	it("Should parse 'forma verbo' template", function(done) {

		var text = wiki.wiki2html("{{forma verbo|fijar|1s|pres|ind|pronom=x}}.")
		expect(text).toBe("Primera persona del singular del presente de fijar.");

		text = wiki.wiki2html("{{forma verbo|fijar|p=1s|t=presente|ind|pronom=x}}.")
		expect(text).toBe("Primera persona del singular del presente de fijar.");

		//Segunda del singular en presente
		text = wiki.wiki2html("{{forma verbo|fijar|2s|t=presente|ind|pronom=x}}.")
		expect(text).toBe("Segunda persona del singular del presente de fijar.");

		//Tercera del plural en presente
		text = wiki.wiki2html("{{forma verbo|fijar|ellos|t=presente|ind|pronom=x}}.")
		expect(text).toBe("Tercera persona del plural del presente de fijar.");

		//Tercera del plural en futuro
		text = wiki.wiki2html("{{forma verbo|fijar|ellos|futuro|ind|pronom=x}}.")
		expect(text).toBe("Tercera persona del plural del futuro de fijar.");

		//Primera del singular en pasado
		text = wiki.wiki2html("{{forma verbo|fijar|1s|pret|ind|pronom=x}}.")
		expect(text).toBe("Primera persona del singular del pasado de fijar.");


		// text = wiki.wiki2html("{{forma verbo|fijar|p=1s|t=presente|ind|pronom=x}}.")
		// expect(text).toBe("Primera persona del singular del presente de fijar.");

		done();

	});


});