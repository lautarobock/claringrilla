var model = require('../domain/model.js');
var helper = require('../service/helper');

var WORD_COUNT = 73010;

exports.generateGrill = function(req, res) {
	var phrase = "En esta comunidad, ¡yo soy la leys!";
	phraseHelper = new helper.PhraseHelper(phrase,2,5);

	model.Word.find({text:new RegExp(phraseHelper.buildRegExpForRow(1))}).exec(function(err, result) {
		console.log(err, result);
		var grill = {
			matrix: ["sodas", "egipcio", "misogino", "infractor","lautaro"],
			definitions: ["def para soda","def para egipcio","def para misogino","def para infractor"],
			syllables: ["so","da","e","gip","cio","mi", "so", "gi", "no","in","frac","tor","lau","ta","ro"],
			phraseCol1: 2,
			phraseCol2: 4
		}
		res.send(grill);		
	});
	
}

