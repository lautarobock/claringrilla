var model = require('../domain/model.js');
var helper = require('../service/helper');

var WORD_COUNT = 73010;

exports.generateGrill = function(req, res) {
	helper.generateGrill(function(grill) {
		res.send(grill);	
	});
}

