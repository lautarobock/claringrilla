define([], function() {

	var grill = angular.module("grill", []);

	grill.controller("GrillController", function($scope,GrillFactory) {
		$scope.matrix = [];
		$scope.maxLength = 0;
		$scope.grill = GrillFactory.random(function(grill) {
			angular.forEach(grill.matrix, function(word) {
				var row = [];
				for ( var i=0; i<word.length; i++ ) {
					// if ( grill.phraseCol1 == i || grill.phraseCol2 == i ) {
						// row.push(word[i]);
					// } else {
						row.push("");
					// }
				}
				$scope.matrix.push(row);

				if ( word.length > $scope.maxLength ) {
					$scope.maxLength = word.length;
				}
			});
		});

		$scope.isPhrase = function($index) {
			return $scope.grill.phraseCol1 == $index || $scope.grill.phraseCol2 == $index;
		}
	});

});