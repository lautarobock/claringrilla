var model = require("../domain/model");
var dictionary = require("./dictionary");
var phrase = require("./phrase");

exports.beautifyPhrase = function (phrase) {
	phrase = phrase.toLowerCase();
	phrase = phrase.replace('á','a');
	phrase = phrase.replace('é','e');
	phrase = phrase.replace('í','i');
	phrase = phrase.replace('ó','o');
	phrase = phrase.replace('ú','u');
	phrase = phrase.replace(/[^a-zñ]/ig, '');
	return phrase;
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

exports.getRandomInt = function(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

exports.getRndWord = function(regexp, excludes, callback) {
	//Busco en RAW ya que de la frase viene sin acentos
	model.Word.find({raw:regexp}).exec(function(err, result) {
		//tengo que armar mi array para el "sorteo"
		if ( result.length == 0 ) {
			callback(null);
		} else {
			var choices = exports.buildChoices(result);
			var idx = exports.getRandomInt(0,choices.length-1);
			callback(choices[idx]);	
		}
	});
}

exports.buildChoices = function(result) {
	// console.log("buildChoices", result);
	var choices = [];
	for( var i=0; i<result.length; i++ ) {
		var base1Frec = Math.round(result[i].frecuency||0)+1;
		for( var j=0; j<base1Frec; j++ ) {
			choices.push(result[i]);
		}
	}
	return choices;
}

exports.generatePos = function(max) {
	var res = {
		col1:null,
		col2:null
	};
	res.col1 = exports.getRandomInt(0,max-3);
	res.col2 = exports.getRandomInt(res.col1+2,max-1);
	return res;
};


exports.generateGrill = function(mainCb) {
	// var phrase = "En esta comunidad, ¡yo soy la leys!";
	

	var onPhrase = function(phrases) {
		var pos = exports.generatePos(6);
		var col1 = pos.col1;
		var col2 = pos.col2;
		phraseHelper = new exports.PhraseHelper(phrases.quotes[0],col1,col2);

		var wordsCount = phraseHelper.availableWords();

		var words = [];

		var frecuencies = [];

		var definitions = [];

		var syllables = [];

		var excludes = [];

		var i=0;

		var callback = function(word, definition) {

			if ( !word || excludes.indexOf(word.text) != -1 ) {
				phrase.randomList(function(phrases) {
					onPhrase(phrases);
				});
				return;
			} else if ( !definition ) {
				console.log("Busco definicion para:", word.text);
				dictionary.define(word.text, function(err, newDef) {
					if ( !err ) {
						console.log("Definicion:", newDef);
						callback(word, newDef);
					} else {
						excludes.push(word.text);
						var regExp = new RegExp(phraseHelper.buildRegExpForRow(i));
						exports.getRndWord(regExp, words, callback);
					}
				});
				return;
			}

			i++;

			// console.log("add word", word);
			words.push(word.text);
			frecuencies.push(word.frecuency||0);
			definitions.push(definition);

			if ( i<wordsCount) {
				var regExp = new RegExp(phraseHelper.buildRegExpForRow(i));
				// console.log("regexp",regExp);
				exports.getRndWord(regExp, words, callback);	
			} else {
				var avgFrecuency = 0;

				for( var k = 0; k<words.length; k++ ) {
					avgFrecuency += frecuencies[k];
					// console.log("word", words[k]);
					var sils = dictionary.splitSyllables(words[k]);
					for( var l = 0; l<sils.length; l++ ) {
						syllables.push(sils[l]);
					}
				}
				avgFrecuency = avgFrecuency/words.length;
				var grill = {
					matrix: words,
					definitions: definitions,
					syllables: shuffle(syllables),
					phraseCol1: col1,
					phraseCol2: col2,
					phrase: phrases.quotes[0],
					author: phrases.author,
					avgFrecuency: avgFrecuency,
					frecuencies: frecuencies
				}

				mainCb(grill);
			}
		}

		var regExp = new RegExp(phraseHelper.buildRegExpForRow(i));
		console.log("regexp", regExp);
		exports.getRndWord(regExp, words, callback);
	}

	// var phrases = {
	// 	quotes: ["La vida es sueño, y los sueños, sueños son"],
	// 	author: "yo"
	// };
	phrase.randomList(function(phrases) {
		console.log("Frase", phrases.quotes[0]);
		console.log("Auhor", phrases.author);
		onPhrase(phrases);
	})


}

function shuffle(array) {
  var currentIndex = array.length
    , temporaryValue
    , randomIndex
    ;

  // While there remain elements to shuffle...
  while (0 !== currentIndex) {

    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    // And swap it with the current element.
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  return array;
}