

exports.doSSLGet = function(opt) {
	return doGet(opt,true);
};

exports.doGet = function(opt) {
	return doGet(opt,false);
};

exports.doSSLPost = function(opt, data) {
	return doPost(opt,data, true);
};

exports.doPost = function(opt, data) {
	return doPost(opt,data, false);
};


function doPost(opt, data, isSSL) {
	var http;
	var defaultPort;
	if ( isSSL ) {
		http = require("https");
		defaultPort = 443;
	} else {
		http = require("http");
		defaultPort = 80;
	}

	if ( !opt.hostname ) throw new {message: 'Domain required'};

	var opt = {
        hostname: opt.hostname,
        port: opt.port || defaultPort,
        path: opt.path || '',
        method: 'POST',
        headers: {
        	'Content-Type': 'application/json'
        }
    };

    return {
    	run: function(callback) {
    		// console.log("RUN", opt);
    		// console.log("DATA", JSON.stringify(data));
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
		    
		    iReq.write(JSON.stringify(data));
		    iReq.end();
    	}
    };
}

function doGet(opt, isSSL) {
	var http;
	var defaultPort;
	if ( isSSL ) {
		http = require("https");
		defaultPort = 443;
	} else {
		http = require("http");
		defaultPort = 80;
	}

	if ( !opt.hostname ) throw new {message: 'Domain required'};

	var opt = {
        hostname: opt.hostname,
        port: opt.port || defaultPort,
        path: opt.path || '',
        method: 'GET'
    };

    return {
    	run: function(callback) {
    		// console.log("RUN", opt);
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
