angular.module('lingoApp')
    .controller('signupCtrl', function ($scope, $rootScope, loginService, $location) {
        $scope.something = {};

        $scope.signup = function () {
            loginService.register($scope.something).then(function (res) {
                $location.url('/');

                $rootScope.jwt = res.jwt;
                $rootScope.loggedIn = true;
                $rootScope.user = res;

                setJwtInLocalStorage(res.jwt);
            }).catch(function (err) {
                console.error(err);
            });
        };

        function setJwtInLocalStorage(jwt) {
            localStorage.setItem('lingoZenJwt', jwt);
        }
    })

    .controller('sentenceCtrl', function ($scope, $routeParams, sentenceService) {
        $scope.sentence = {};

        sentenceService.getById($routeParams.id).then(function (sentence) {
            $scope.sentence = sentence;
        }).catch(function (err) {
            console.error(err);
        });
    })

    .controller('homeCtrl', function ($scope, $resource, constants) {
    })

    .controller('userProfileCtrl', function ($scope, $resource, constants) {
    })

    .controller('mainController', function ($rootScope, $scope, loginService, sentenceService, jwtHelper) {
        var jwt = getJwtFromLocaStorage();
        if (jwt && jwt.length) {
            var user = jwtHelper.decodeToken(jwt);
            logUserInWithJwt(user, jwt);
        }

        $scope.login = {};

        $scope.signIn = function () {
            loginService.login($scope.login).then(function (res) {
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

        $scope.searchQuery = {};
        $scope.languages = null;
        $scope.sentences = null;

        $scope.search = function () {
            sentenceService.searchSentences($scope.searchQuery.query).then(function (res) {
                $scope.languages = Object.keys(res).map(function (lang) {
                    return lang !== '$promise' && lang !== '$resolved' && lang;
                }).filter(function (a) {
                    return a;
                });

                $scope.sentences = res
            }).catch(function (err) {
                console.error(err);
            });
        }
    });
