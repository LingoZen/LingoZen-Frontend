//create module

var lingoApp = angular.module('lingoApp', ['ngRoute', 'ngResource', 'angular-jwt']);

lingoApp.constant("constants", {
    "backendApiUrl": "http://54.175.240.69:3000/"
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
        .when('/sentences', {
            templateUrl: 'pages/sentences.html',
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

lingoApp.controller('signupCtrl', function ($scope, $resource, constants) {
    var resource = $resource("", [], {
        signup: {
            method: 'POST',
            url: constants.backendApiUrl + 'users',
            isarray: true

        }
    }, {});

    $scope.something = {};
    $scope.search = {

    };

    $scope.signup = function () {
        resource.signup($scope.something).$promise.then(function (res) {
        }).catch(function (err) {
            console.error(err);
        });
    }
});

lingoApp.controller('homeCtrl', function ($scope, $resource, constants) {
});

lingoApp.controller('mainController', function ($rootScope, $scope, $resource, constants, jwtHelper) {
    function onInit() {
        var jwt = getJwtFromLocaStorage();
        if (jwt && jwt.length) {
            var user = jwtHelper.decodeToken(jwt);
            logUserInWithJwt(user, jwt);
        }
    }
    onInit();

    var resources = $resource("", [], {
        signIn: {
            method: 'POST',
            url: constants.backendApiUrl + 'users/login',
            isarray: true
        }
    }, {});

    $scope.login = {};

    $scope.signIn = function () {
        resources.signIn($scope.login).$promise.then(function (res) {
            logUserInWithJwt(res, res.jwt);
        }).catch(function (err) {
            console.error(err);
        });
    };

    $scope.logOut = function () {
        logUserOutAndClearJwt();
    };

    function getJwtFromLocaStorage() {
        return localStorage.getItem('lingoZenJwt');
    }

    function setJwtInLocalStorage(jwt) {
        localStorage.setItem('lingoZenJwt', jwt);
    }

    function logUserInWithJwt(user, jwt) {
        $rootScope.jwt = jwt;
        $rootScope.loggedIn = true;
        $rootScope.user = user;
        setJwtInLocalStorage(jwt)
    }

    function logUserOutAndClearJwt() {
        $rootScope.jwt = null;
        $rootScope.loggedIn = false;
        $rootScope.user = null;
        localStorage.removeItem('lingoZenJwt');
    }
});