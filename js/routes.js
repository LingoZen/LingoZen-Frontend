angular.module('lingoApp')
    .config(['$routeProvider', function ($routeProvider) {
        $routeProvider
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
            .when('/user-profile', {
                templateUrl: 'pages/user.html',
                controller: 'userProfileCtrl'
            })

            //sentence page
            .when('/sentences/:id', {
                templateUrl: 'pages/sentence.html',
                controller: 'sentenceCtrl'
            })
            .otherwise({
                redirectTo: '/'
            });
    }]);
