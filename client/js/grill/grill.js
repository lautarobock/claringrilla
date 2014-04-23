define([], function() {

	var grill = angular.module("grill", []);

	grill.controller("GrillController", function($scope,GrillFactory,Grill,$routeParams) {
		$scope.matrix = [];
		$scope.maxLength = 0;

		function callback(grill) {
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
		}
		$scope.loadRandom = $routeParams.id == null;
		if ( $routeParams.id ) {
			$scope.grill = Grill.get({_id:$routeParams.id},callback);
		} else {
			$scope.grill = GrillFactory.random(callback);
		}
		

		$scope.isPhrase = function($index) {
			return $scope.grill.phraseCol1 == $index || $scope.grill.phraseCol2 == $index;
		}

		$scope.orderSil = function(obj) {
			return obj;
		};

		$scope.reverseText = function(value) {
			return util.reverse(value);
		};
	});

});