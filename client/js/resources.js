define([],function() {

    var res = angular.module("resources", ['ngResource']);

    var path = "api/"
    
    res.factory("Login", function($resource) {
        return $resource("/api/login/by_google/:google_id", {}, {});
    });

    var services = ['User','Grill'];
    angular.forEach(services,function(s) {
        res.factory(s,function($resource, $rootScope) {
            var params = function() {
                return $rootScope.user ? $rootScope.user.google_id : null;
            };
            return $resource( "/" + path + s + '/:_id',{_id:"@_id",google_id:params}, {});
        });
    });

    res.factory('GrillFactory',function($resource, $rootScope) {
        var params = function() {
            return $rootScope.user ? $rootScope.user.google_id : null;
        };
        return $resource( "/" + path + 'newgrill/',{google_id:params}, {
            random: {method:'GET', params: {}, isArray:false}
        });
    });

    return res;
});