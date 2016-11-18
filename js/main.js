//create module

var lingoApp = angular.module('lingoApp', ['ngRoute', 'ngResource']);

lingoApp.constant("constants", {
    "apiXyz": "http://54.175.240.69:3000/"
});

//routes
lingoApp.config(['$routeProvider', function ($routeProvider) {
    $routeProvider

        //home route
        .when('/', {
            templateUrl: 'pages/home.html',
            controller: 'homeCtrl'
        })

        //Sign up
        .when('/signup', {
            templateUrl: 'pages/signup.html',
            controller: 'signupCtrl'
        })

        //user page
        .when('/user', {
            templateUrl: 'pages/user.html',
            controller: 'userCtrl'
        })
        .when('/sentenceS', {
            templateUrl: 'pages/sentenceS.html',
            controller: 'sentenceSCtrl'
        })
        .when('/sentence', {
            templateUrl: 'pages/sentence.html',
            controller: 'sentenceCtrl'
        })
        .otherwise({
            redirectTo: '/'
        });
}]);

lingoApp.config(['$resourceProvider', function ($resourceProvider) {
    // Don't strip trailing slashes from calculated URLs
    $resourceProvider.defaults.stripTrailingSlashes = false;
}]);

/*lingoApp.config('sentenceCtrl'), function(){

}*/

lingoApp.controller('signupCtrl', function ($scope, $resource, constants) {
    var fuckYou = $resource("", [], {
        signup: {
            method: 'POST',
            url: constants.apiXyz + 'users',
            isarray: true

        }
    }, {});

    $scope.something = {};

    $scope.signup = function () {
        fuckYou.signup($scope.something).$promise.then(function (res) {
            console.log('we got ', res[0]);
        }).catch(function (err) {
            console.error(err);
        });
    }
});

lingoApp.controller('homeCtrl', function ($scope, $resource, constants) {
});

lingoApp.controller('mainController', function ($rootScope, $scope, $resource, constants) {
    var fuckMe = $resource("",[], {
        signin: {
            method: 'POST',
            url: constants.apiXyz + 'users/login',
            isarray: true
        }
    }, {});

    $scope.login={};

    $scope.signin = function() {
        console.log("fuckme")
        fuckMe.signin($scope.login).$promise.then(function (res) {
            $rootScope.jwt = res.jwt
            console.log(res.jwt);
            $rootScope.loggedin = true
            $rootScope.user = res;
            console.log('we got ', res);
        }).catch(function (err) {
            console.error(err);
        });
    }
});