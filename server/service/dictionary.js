var http = require("http");

exports.define = function(word, callback) {

	var opt = {
        hostname: 'es.wiktionary.org',
        port: 80,
        path: '/w/api.php?format=json&action=query&titles='+word+'&prop=revisions&rvprop=content',
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
            var page = null;
            for ( var k in object.query.pages ) {
            	page = object.query.pages[k];
            	break;
            }
            var def = page.revisions[0]['*'];

            var first = def.substr(def.indexOf(";1:")+4);
            var first = first.substr(0,first.indexOf('\n'));
            
            console.log(word, first);            

            callback(null, first);
        });
    });

    iReq.on('error', function(e) {
        console.log('[Dictionary] problem with the request: ' + e.message);
        callback(e)
    });

    iReq.end();

};