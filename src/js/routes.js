angular.module('lingoApp')
    .config(['$routeProvider', function ($routeProvider) {
        $routeProvider
            .when('/', {
                templateUrl: 'home.html',
                controller: 'homeCtrl'
            })

            //Sign up
            .when('/signup', {
                templateUrl: 'signup.html',
                controller: 'signupCtrl'
            })

            //user page
            .when('/user-profile', {
                templateUrl: 'user.html',
                controller: 'userProfileCtrl'
            })

            //sentence page
            .when('/sentences/:id', {
                templateUrl: 'sentence.html',
                controller: 'sentenceCtrl'
            })

            .otherwise({
                redirectTo: '/'
            });
    }]);
