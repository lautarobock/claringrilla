// var logentries = require('node-logentries');
// var log = logentries.logger({
//   token:'a5e5473f-568f-4058-9f52-4fb5f1153f22'
// });

var express = require('express');
var http = require('http');
var path = require('path');

var app = express();

app.set('port', process.env.PORT || 3000);
// app.use(express.favicon("client/images/chopp.png"));
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(express.cookieParser('your secret here'));
app.use(express.session());
app.use(app.router);
app.use(express.static(path.join(__dirname, '../client')));

if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

var rootRedirect = function(req, res) {
    res.redirect("html/");
};
app.get("/", rootRedirect);
app.get("/index.html", rootRedirect);

//Connect to Mongoose
require("mongoose").connect(process.env.MONGOLAB_URI);

require("./routes/config").createRoutes(app);

var model = require("./domain/model");
// Parse Words
// var fs = require('fs'),
//     readline = require('readline');

// var rd = readline.createInterface({
//     input: fs.createReadStream('etc/lemario-espanol-2002-10-25_utf8.txt',{
//     	encoding: 'utf8'
//     }),
//     output: process.stdout,
//     terminal: false
// });

// var i = 0;

// rd.on('line', function(line) {
// 	if ( line.length > 5 ) {
// 		var word = model.Word({
// 			_id:i++,
// 			text:line
// 		})
// 		word.save();
// 	    console.log(line);	
// 	}
// });

//Parse frecuency

// var fs = require('fs'),
//     readline = require('readline');

// var rd = readline.createInterface({
//     input: fs.createReadStream('etc/CREA_total_utf.TXT',{
//     	encoding: 'utf8'
//     }),
//     output: process.stdout,
//     terminal: false
// });

// var i=0;
// var j=0;

// rd.on('line', function(line) {
// 	// if ( j++ >= 40 ) return 0;
// 	if ( line.length > 5 ) {
// 		// var word = require("./domain/model").Word({
// 		// 	_id:i++,
// 		// 	text:line
// 		// })
// 		// word.save();
// 		var record = line.split('\t');
// 	    // model.Word.find({text:record[1].trim()}).snapshot(true).exec(function(err, word) {
// 	    // 	if (  !err && word.length != 0 ) { /*i < 5 &&*/
// 	    // 		i++;
// 	    // 		console.log(record[1], parseFloat(record[3]));
// 	    // 		// word[0].frecuency = parseFloat(record[3]);
// 	    // 		// console.log("pre",word[0]);
// 	    // 		model.Word.findByIdAndUpdate(word[0]._id,{$set: {frecuency: parseFloat(record[3])}}).exec(function(err,results) {
// 	    //             console.log("save",err);
// 	    //         });
// 	    // 	} else {
// 	    // 		console.log(err, word);
// 	    // 	}
// 	    // });
// 		if ( record[3] &&  parseFloat(record[3]) != NaN ) {
// 			model.Word.findOneAndUpdate({$and:[{frecuency:{$exists:false}},{text: record[1].trim()}]},{$set: {frecuency: parseFloat(record[3])}}).exec(function(err,results) {
// 	            console.log("save",err,results);
// 	        });	
// 		}
// 	}
// });


var server = http.createServer(app).listen(app.get('port'), function(){
	console.log('Express server listening on port ' + app.get('port'));
});