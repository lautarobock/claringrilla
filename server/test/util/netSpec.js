var net = require("../../util/net");

describe("net.js", function() {

	// it("Should make a SSL post to google shortUrl", function(done) {

	// 	net.doSSLPost({
	// 		hostname:'www.googleapis.com',
	// 		path: '/urlshortener/v1/url'
	// 	},{
	// 		"longUrl": "http://www.google.com/"
	// 	})
	// 	.run(function(err, response) {
	// 		expect(err).toBeNull();
	// 		expect(response.id).toBeDefined();
	// 		// console.log("response",JSON.stringify(response));
	// 		done();
	// 	});
	// });

	// it("Should make a SSL request to expand url (google)", function(done) {

	// 	net.doSSLGet({
	// 		hostname: "www.googleapis.com",
	// 		path: "/urlshortener/v1/url?shortUrl=http://goo.gl/R3J2rf"
	// 	})
	// 	.run(function(err, data) {
	// 		// console.log("err", err);
	// 		// console.log("data", data);
	// 		expect(data.longUrl).toBe("http://www.google.com/");
	// 		expect(data.status).toBe("OK");
	// 		done();
	// 	});

	// },10000);

	// it("Should make a GET request to wiktionary", function(done) {

	// 	net.doGet({
	// 		hostname: "es.wiktionary.org",
	// 		path: "/w/api.php?format=json&action=query&titles=echador&prop=revisions&rvprop=content"
	// 	})
	// 	.run(function(err, data) {
	// 		// console.log("err", err);
	// 		// console.log("data", data.query.pages['110061'].revisions[0]['*']);
	// 		// expect(data.longUrl).toBe("http://www.google.com/");
	// 		expect(data.query.pages['110061'].revisions[0]['*'].indexOf('{{ES|echador}}')).toBe(0);
	// 		done();
	// 	});

	// },10000);

});