var http = require('http');
var dictionary = require("../../service/dictionary");

describe("dictionary.js", function() {

	// it("Should retrive a definition", function(done) {

	// 	// var words = ["casa","herbívoro","coco","simplemente","salsifí","averiguar","echador"];
	// 	var words = ["casa","salsifí","echador"];

	// 	var count = 0;
	// 	var definitions = {
	// 		"casa": '{{ucf|edificación}} destinada a [[vivienda]].',
	// 		"herbívoro": 'Que se alimenta de [[vegetal]]es de cualquier tipo',
	// 		"coco": '(\'\'Cocos nucifera\'\') [[palmera|Palmera]] [[pantropical]], única de su género, que crece en [[hábitat]]s [[arenoso]]s y [[salino]]s. Alcanza los 30 m de altura, con [[hoja]]s pinnadas de hasta 6 m de largo. Se aprovecha extensamente, utilizándose la [[fibra]] de sus hojas para fuertes [[tejido]]s y sobre todo la [[pulpa]] de su [[fruto]], una [[drupa]] fibrosa, en alimentación',
	// 		"simplemente": "Que se hace [[simple|simple]].<br>",
	// 		"salsifí": "(''Tragopogon porrifolius'') Planta bienal de la familia de las [[compuestas|Compuestas]], nativa de la Europa mediterránea. Tiene flores color púrpura muy vistosas. Sus raíces tienen una forma cónica y son de color amarillo blancuzco, miden unos 15 cm de largo y dos o tres de grueso. Como hortaliza sus hojas se consumen crudas en ensaladas, fritas y guisadas de diversas formas, las raíces se consumen cocidas. En medicina natural la decocción sirve contra la gota y el reumatismo.<ref>Ejemplos de uso en Google libros: [http://www.google.es/search?q=salsif%C3%ADs&btnG=Buscar+libros&tbm=bks&tbo=1&hl=es salsifís] - [http://www.google.es/search?q=salsif%C3%ADes&btnG=Buscar+libros&tbm=bks&tbo=1&hl=es salsifíes]</ref>",
	// 		"averiguar": "{{ucf|preguntar}}, [[explorar]] o [[investigar]] para [[descubrir]] la [[verdad]] acerca de un [[asunto]]",
	// 		"echador": "Que [[echar|echa]] o [[arrojar|arroja]]<ref name=\"dpu\">{{cita libro|autor=Luis P. de Ramón|título=Diccionario popular universal de la lengua española|URL=http://books.google.com/books?id=SqUyAQAAIAAJ&pg=PA19&vq=echar&hl=es|año=1885|editor=Imprenta y Librería Religiosa y Científica del Heredero de D. Pablo Riera)}}</ref>"
	// 	};

	// 	function onResponse(word) {
	// 		return function (err, definition) {
	// 			expect(err).toBeNull();
	// 			// definition[word] = definition;
	// 			expect(definition.trim()).toBe(definitions[word]);
	// 			count++;
	// 			if ( count == words.length ) {
	// 				done();
	// 			}
	// 		}	
	// 	}
		
	// 	for ( var i=0; i<words.length; i++ ) {
	// 		dictionary.define(words[i], onResponse(words[i]));
	// 	}
		
	// });

	it("Should return error if not found", function(done) {

		dictionary.define("Pelopopopopopo", function(err, definition) {

			expect(err).toBeDefined();
			expect(err.code).toBe("NOT_FOUND");
			expect(definition).not.toBeDefined();

			done();

		});

	},10000);

	it("Should separate in syllables", function(done) {

		expect(dictionary.splitSyllables("locomotora")).toEqual("lo-co-mo-to-ra".split("-"));
		expect(dictionary.splitSyllables("hermafrodita")).toEqual("her-ma-fro-di-ta".split("-"));
		done();

	});	

});