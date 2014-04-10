
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
		console.log(this.phrase,idx2);
		reg+=this.phrase[idx2];
		return reg;
	}

};