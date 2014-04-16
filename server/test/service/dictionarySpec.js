var http = require('http');
var dictionary = require("../../service/dictionary");

describe("dictionary.js", function() {

	it("Should retrive a definition", function(done) {

		var opt = {
	        hostname: 'es.wiktionary.org',
	        port: 80,
	        path: '/w/api.php?format=json&action=query&titles=casa&prop=revisions&rvprop=content',
	        method: 'GET'
	    };

	    var msg = "";

	    var iReq = http.request(opt, function(iRes) {
	        iRes.setEncoding('utf8');
	        iRes.on('data', function(chunk) {
	            msg += chunk;
	        });
	        iRes.on('end', function() {
	            var object = eval("("+msg+")");
	            var def = object.query.pages['7665'].revisions[0]['*'];
	            
	            var first = def.substr(def.indexOf(";1:")+4,def.indexOf('\n')-8);
	            // console.log("definition",first);

	            expect(first).toBe('{{ucf|edificación}} destinada a [[vivienda]].');

	            done();
	        });
	    });

	    iReq.on('error', function(e) {
	        console.log('problem with the request: ' + e.message);
	    });

	    iReq.end();

		
	});

	it("Should retrive a definition (2)", function(done) {

		dictionary.define("casa", function(err, definition) {
			
			expect(definition).toBe('{{ucf|edificación}} destinada a [[vivienda]]. ');

	        dictionary.define("herbívoro", function(err, definition) {
				
				expect(definition).toBe('Que se alimenta de [[vegetal]]es de cualquier tipo');

				// dictionary.define("coco", function(err, definition) {
				
				// 	expect(definition).toBe('{{árbol}}: (\'\'Cocos nucifera\'\') [[palmera|Palmera]] [[pantropical]], única de su género, que crece en [[hábitat]]s [[arenoso]]s y [[salino]]s. Alcanza los 30 m de altura, con [[hoja]]s pinnadas de hasta 6 m de largo. Se aprovecha extensamente, utilizándose la [[fibra]] de sus hojas para fuertes [[tejido]]s y sobre todo la [[pulpa]] de su [[fruto]], una [[drupa]] fibrosa, en alimentación');

					done();	        	
		  //       });       	
	        });
		});

		
	});

});