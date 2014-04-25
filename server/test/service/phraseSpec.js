var phrase = require("../../service/phrase");
var helper = require("../../service/helper");

describe("phrase.js", function() {

	// it("Should retrive a random page ID", function(done) {

	// 	phrase.randomPage(function(err, pageID) {
	// 		// console.log("pageID",pageID);

	// 		expect(pageID).toBeDefined();

	// 		done();
	// 	});
		
	// });


	// it("Should retrive a phrases of einstein", function(done) {

	// 	phrase.listFrom("86",function(err, phrases) {
			
	// 		// console.log("length: ",phrases.length);
	// 		// console.log("phrases: ",phrases);
	// 		expect(phrases.quotes.length).toBe(8);
	// 		expect(phrases.author).toBe("Albert Einstein");
			
	// 		expect(phrases).toBeDefined();
	// 		expect(phrases.quotes).toBeDefined();


	// 		done();
	// 	});
		
	// },10000);


	// it("Should retrive a phrases of 19633", function(done) {

	// 	phrase.listFrom("19633",function(err, phrases) {
			
	// 		// console.log("length: ",phrases.length);
	// 		// console.log("phrases: ",phrases);
	// 		// console.log("phrases(opt): ",helper.beautifyPhrase(phrases.quotes[0]));
			
	// 		expect(phrases.quotes.length).toBe(2);
	// 		expect(helper.beautifyPhrase(phrases.quotes[0])).toEqual('laexpresionartisticabr');

	// 		done();
	// 	});
		
	// },10000);

	// it("Should retrive a random phrases", function(done) {

	// 	// console.log("Should retrive a random phrases");
	// 	phrase.randomList(function(phrases) {
	// 		expect(phrases.quotes).toBeDefined();
	// 		expect(phrases.quotes.length).toBeDefined();

	// 		// console.log("length: ",phrases.quotes.length);
	// 		// console.log("phrases: ",phrases);
	// 		// console.log("phrases(opt): ",helper.beautifyPhrase(phrases.quotes[0]));
			
	// 		done();			
	// 	})
		
		
	// },10000);

	

});