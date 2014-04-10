define("app", [
    "locale/locale",
    "menu/menu",
    "resources",
    "util/directives",
    "gplus"
    ], function(locale, menu, resources, gplus, beer, rating) {

    var app = angular.module("app", [
        'ngRoute',
        'ngSanitize',
        'ui.bootstrap',
        'pascalprecht.translate',
        'menu',
        'resources',
        'directives',
        'gplus']);

    //Esto esta aca porque este .js se carga en forma asincronica
    angular.element(document).ready(function() {
        // setTimeout(function() {
            angular.bootstrap(document, ['app']);    
        // },3000);
    });
    
    // app.run(['$rootScope',function($rootScope) {
    //     navigator.geolocation.getCurrentPosition(function(position) {
    //         if (position) {
    //             $rootScope.position = position;
    //         }
    //     });
    // }]);

    app.run(function($rootScope, $translate, $log) {

        $rootScope.$log = $log;

    });

    app.run(function($rootScope, Login, evaluateAuthResult, User, $log) {

        $rootScope.loginSuccess = false;

        $rootScope.$on('g+login', function(event, authResult) {

            evaluateAuthResult(authResult, function(err, googleUser) {
                if ( err ) {
                    $rootScope.loginError = err.message;
                    $rootScope.$apply();
                    $log.error("ERROR", "Login Error", err.message);
                } else if ( googleUser ) {
                    $rootScope.googleUser = googleUser;
                    Login.get({
                            google_id:googleUser.id, 
                            name:googleUser.name, 
                            email: googleUser.email
                        }, function(user) {
                            $rootScope.user = User.get({_id: user._id}, function(user) {
                                $rootScope.loginSuccess = true;
                            });
                    });
                } else {
                    $log.info("ERROR", "Silent Login Error");
                }
            });
        });
        
    });



    app.config(['$logProvider',function($logProvider) {
        $logProvider.debugEnabled(false);
    }]);
 
    app.config(['$translateProvider','$routeProvider', function ($translateProvider, $routeProvider) {

        //Configure Translate
        $translateProvider.translations('es', locale.es);
        $translateProvider.preferredLanguage('es');

        //Configure Routes
        // $routeProvider.otherwise({redirectTo: '/beer'});

    }]);


    app.factory('loading', function($rootScope) {
        var services = 0;
        return {
            inc: function(count) {
                services += count||1;
                $rootScope.$broadcast('loading', services);
            },
            dec: function(count) {
                services -= count||1;
                $rootScope.$broadcast('loading', services);
            }
        };
    })

    app.directive("loading", function() {
        return {
            transclude: true,
            template: '<div class="dl-loading" ng-show="loading" ><span ng-transclude></span> ({{loading}})</div>',
            link: function(scope) {
                scope.loading = null;
                scope.$on("loading", function(e, value) {
                    scope.loading = value;
                });
            }
        };
    });

    app.factory('httpInterceptor', function($q,loading,$injector) {
        var _http = null;
        var _requestEnded = function() {
            _http = _http || $injector.get('$http');
            loading.dec();
        };
        return {
            request: function(config) {
                loading.inc();
                return config;
            },

            response: function(response) {
                _requestEnded();
                return response;
            },

            responseError: function(reason) {
                _requestEnded();
                return $q.reject(reason);
            }
        }
    });

    app.config(['$httpProvider',function($httpProvider) {
        $httpProvider.interceptors.push('httpInterceptor');    
    }]);
    
});