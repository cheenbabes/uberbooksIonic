// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js
angular.module('starter', ['ionic', 'starter.controllers', 'firebase', 'flash'])

.run(["$ionicPlatform", "$state", "$rootScope", "$stateParams", function ($ionicPlatform, $state, $rootScope, $stateParams) {
    $ionicPlatform.ready(function () {
        // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
        // for form inputs)
        if (window.cordova && window.cordova.plugins.Keyboard) {
            cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
            cordova.plugins.Keyboard.disableScroll(true);

        }
        if (window.StatusBar) {
            // org.apache.cordova.statusbar required
            StatusBar.styleDefault();
        }

        $rootScope.$on("$stateChangeError", function (event, toState, toParams, fromState, fromParams, error) {
            // We can catch the error thrown when the $requireAuth promise is rejected
            // and redirect the user back to the home page
            if (error === "AUTH_REQUIRED") {
                $state.go("app.login");
            }
        });

        $rootScope.$state = $state;
        $rootScope.$stateParams = $stateParams;

        // add previous state property
        $rootScope.$on('$stateChangeSuccess', function (event, toState, toParams, fromState) {
            $state.previous = fromState;
        });


    });
}])

// let's create a re-usable factory that generates the $firebaseAuth instance
.factory("Auth", ["$firebaseAuth",
  function ($firebaseAuth) {
        var ref = new Firebase("https://uberbookstest.firebaseio.com");
        return $firebaseAuth(ref);
  }
])

.factory("Ref", [
    function () {
        return new Firebase("https://uberbookstest.firebaseio.com");
    }
])

.config(function ($stateProvider, $urlRouterProvider) {
    $stateProvider

        .state('app', {
        url: '/app',
        abstract: true,
        templateUrl: 'templates/menu.html',
        controller: 'AppCtrl'
    })

    .state('app.home', {
        url: '/home',
        views: {
            'menuContent': {
                templateUrl: "templates/dashboard.html",
                controller: 'HomeCtrl'
            }
        }
    })

    .state('app.login', {
        url: '/login',
        views: {
            'menuContent': {
                templateUrl: "templates/login.html",
                controller: 'LoginCtrl'
            }
        }
    })

    .state('app.map', {
        url: '/map',
        views: {
            'menuContent': {
                templateUrl: "templates/map.html",
                controller: 'MapCtrl'
            }
        }
    })

    .state('app.account', {
        url: '/account',
        views: {
            'menuContent': {
                templateUrl: "templates/account.html",
                controller: 'AccountCtrl'
            }
        },
        resolve: {
            // controller will not be loaded until $requireAuth resolves
            // Auth refers to our $firebaseAuth wrapper in the example above
            "user": ["Auth", function (Auth) {
                // $requireAuth returns a promise so the resolve waits for it to complete
                // If the promise is rejected, it will throw a $stateChangeError (see above)
                return Auth.$requireAuth();
                }]
        }
    })

    $urlRouterProvider.otherwise('/app/home');
});