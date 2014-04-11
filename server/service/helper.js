var model = require("../domain/model");

exports.beautifyPhrase = function (phrase) {
	return phrase.replace(/[^a-z]/ig, '').toLowerCase();
};

/**
Only phrases with pair number of chars
*/
exports.PhraseHelper = function(phrase, col1, col2) {
	this.phrase = exports.beautifyPhrase(phrase);
	this.col1 = col1;
	this.col2 = col2;


	//process
	this.availableWords = function() {
		return this.phrase.length / 2;
	}

	this.isValid = function() {
		return this.phrase.length % 2 == 0;
	}

	this.buildRegExpForRow = function(row) {
		var idx1 = row;
		var idx2 = row+this.availableWords();
		var reg = "^"; //"^..h..u"
		for (var i=0; i<this.col1; i++ ) {
			reg+=".";
		}
		reg+=this.phrase[idx1];
		for (var i=(this.col1+1); i<this.col2; i++ ) {
			reg+=".";
		}
		// console.log(this.phrase,idx2);
		reg+=this.phrase[idx2];
		return reg;
	}

};

exports.getRndWord = function(regexp, excludes, callback) {
	model.Word.find({text:regexp}).exec(function(err, result) {
		callback(result[0].text);
	});
}


exports.generateGrill = function(mainCb) {
	var phrase = "En esta comunidad, ¡yo soy la leys!";
	phraseHelper = new exports.PhraseHelper(phrase,2,5);

	var wordsCount = phraseHelper.availableWords();

	var words = [];

	var i=0;

	var callback = function(word) {
		words.push(word);

		if ( i<wordsCount) {
			var regExp = new RegExp(phraseHelper.buildRegExpForRow(i++));
			exports.getRndWord(regExp, words, callback);	
		} else {
			var grill = {
				matrix: words,
				definitions: ["def para soda","def para egipcio","def para misogino","def para infractor"],
				syllables: ["so","da","e","gip","cio","mi", "so", "gi", "no","in","frac","tor","lau","ta","ro"],
				phraseCol1: 2,
				phraseCol2: 4
			}
			mainCb(grill);
		}
	}

	var regExp = new RegExp(phraseHelper.buildRegExpForRow(i++));
	exports.getRndWord(regExp, words, callback);

}