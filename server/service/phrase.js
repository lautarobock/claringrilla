var helper = require("./helper");
var net = require("../util/net");

exports.randomPage = function(callback) {
    
    var opt = {
        hostname: 'es.wikiquote.org',
        path: '/w/api.php?action=query&list=random&format=json&rnnamespace=0&rnlimit=1'
    };

    net.doGet(opt).run(function(err, object) {
        if ( !err ) {
            callback(null, object.query.random[0].id);    
        } else {
            callback(err)
        }
    });

};

exports.randomList = function(callback) {
	var onPageSuccess = function(err, pageID) {
		// console.log("randomPage: ", pageID);
		exports.listFrom(pageID, function (err, list) {
			// console.log("list: ", list);
			if ( list && list.quotes.length>0 ) {
				callback(list);
			} else {
				exports.randomPage(onPageSuccess);
			}
		});
	};
	exports.randomPage(onPageSuccess);
};

exports.listFrom = function(pageID, callback) {
    // console.log("PAGE_ID: ", pageID);
	var opt = {
        hostname: 'es.wikiquote.org',
        path: '/w/api.php?format=json&action=query&pageids='+pageID+'&prop=revisions&rvprop=content'
    };

    net.doGet(opt).run(function(err, object) {
        if ( err ) {
            callback(err);
            return;
        }

        var page = null;
        var pageKey = null;
        for ( var k in object.query.pages ) {
            pageKey = k;
            break;
        }

        if ( pageKey == -1 ) {
            callback({
                code: "NOT_FOUND",
                message: "No se ha encontrado la palabra"
            })
            return;
        }
        page = object.query.pages[k];
        //Definicion completa en formato wiki
        var def = page.revisions[0]['*'];


        var all = def.match(/\"(.*)\"/g);
        // console.log("all",all.length);
        if ( !all || all.length == 0 ) {
            all = def.match(/«(.*)»/g);
        }

        var result = [];
        if ( !all ) {
            callback(null, {
                quotes: result,
                author: page.title
            });
            return;
        }
        
        for( var i=0; i<all.length; i++ ) {
            all[i] = all[i].substr(1,all[i].length-2);
            all[i] = all[i].substr(0,all[i].indexOf('.'));

            var normalized = helper.beautifyPhrase(all[i]);
            
            if ( normalized.length >= 10 && normalized.length <= 40 && normalized.length % 2 == 0 ) {
                result.push(all[i]);
            }
        }

        callback(null, {
            quotes: result,
            author: page.title
        });
    });
};

