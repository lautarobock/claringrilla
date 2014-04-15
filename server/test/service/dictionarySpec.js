var http = require('http');

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

	            console.log("definition",object.query.pages['7665'].revisions[0]['*'].substr(0,200));

	            expect(object).toBeDefined();

	            done();
	        });
	    });

	    iReq.on('error', function(e) {
	        console.log('problem with the request: ' + e.message);
	    });

	    iReq.end();

		
	});

});