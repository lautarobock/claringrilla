var http = require("https");

exports.doGet = function(opt) {
	if ( !opt.hostname ) throw new {message: 'Domain required'};

	var opt = {
        hostname: opt.hostname,
        port: opt.port || 44311,
        path: opt.path || '',
        method: 'GET'
    };

    return {
    	run: function(callback) {
    		console.log("RUN", opt);
    		var msg = "";

		    var iReq = http.request(opt, function(iRes) {
		        iRes.setEncoding('utf8');
		        iRes.on('data', function(chunk) {
		        	// console.log("data", chunk);
		            msg += chunk;
		        });
		        iRes.on('end', function() {
		        	// console.log("END", msg);
		            var object = eval("("+msg+")");
		            callback(null, object);
		        });
		    });

		    iReq.on('error', function(e) {
		        // console.log('[NET] problem with the request: ' + e.message);
		        callback(e)
		    });

		    iReq.end();
    	}
    };

    
}