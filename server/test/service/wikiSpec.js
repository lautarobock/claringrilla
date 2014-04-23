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

});