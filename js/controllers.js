angular.module('lingoApp')
    .controller('signupCtrl', function ($scope, $rootScope, loginService, $location, constants) {
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
            localStorage.setItem(constants.jwtId, jwt);
        }
    })

    .controller('sentenceCtrl', function ($scope, $routeParams, $uibModal, sentenceService) {
        $scope.sentence = {};

        sentenceService.getById($routeParams.id).then(function (sentence) {
            $scope.sentence = sentence;
        }).catch(function (err) {
            console.error(err);
        });

        $scope.addCommentToSentence = function () {
            var modalInstance = $uibModal.open({
                templateUrl: 'pages/modal-templates/add-comment-to-sentence.html',
                controller: 'addCommentToSentenceModalController',
                size: 'lg',
                resolve: {
                    sentence: function () {
                        return $scope.sentence;
                    }
                }
            });

            modalInstance.result.then(function (comment) {
                if (comment) {
                    $scope.sentence.comments.push(comment);
                }
            }).catch(function (err) {
                if (err) {
                    console.error(err);
                }
            });
        };
    })

    .controller('homeCtrl', function ($scope, sentenceService) {
        $scope.searchQuery = {};
        $scope.searchResultLanguages = [];
        $scope.searchResultSentences = {};

        $scope.lastSearchedQuery = null;
        $scope.$watchCollection('searchQuery', function (newValue) {
            if ($scope.searchQuery.query !== $scope.lastSearchedQuery) {
                search($scope.searchQuery.query);
                $scope.lastSearchedQuery = $scope.searchQuery.query;
            }
        });

        function search(searchQuery) {
            sentenceService.searchSentences($scope.searchQuery.query).then(function (res) {
                $scope.searchResultLanguages = Object.keys(res).map(function (lang) {
                    return lang !== '$promise' && lang !== '$resolved' && lang;
                }).filter(function (a) {
                    return a;
                });

                $scope.searchResultSentences = res
            }).catch(function (err) {
                console.error(err);
            });
        }
    })

    .controller('userProfileCtrl', function ($scope) {
    })

    .controller('mainController', function ($rootScope, $scope, $location, jwtHelper, loginService, constants) {
        $scope.goTo = function (url) {
            $location.url(url);
        };
        $scope.errors = [];

        $scope.thisYear = new Date().getFullYear();

        var jwt = getJwtFromLocaStorage();
        if (jwt && jwt.length) {
            var user = jwtHelper.decodeToken(jwt);
            logUserInWithJwt(user, jwt);
        }

        $scope.login = {};

        $scope.signIn = function () {
            return loginService.login($scope.login).then(function (res) {
                logUserInWithJwt(res, res.jwt);
                $scope.errors = [];
            }).catch(function (err) {
                console.error(err);

                if (err && err.data && err.data.error === 'PASSFAIL') {
                    $scope.errors.push("Incorrect username or password");
                }
            });
        };

        $scope.removeError = function (index) {
            $scope.errors.splice(index, 1);
        };

        $scope.logOut = function () {
            return logUserOutAndClearJwt();
        };

        function getJwtFromLocaStorage() {
            return localStorage.getItem(constants.jwtId);
        }

        function setJwtInLocalStorage(jwt) {
            return localStorage.setItem(constants.jwtId, jwt);
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
            localStorage.removeItem(constants.jwtId);
        }
    })

    .controller('addCommentToSentenceModalController', function ($scope, $uibModalInstance, sentence, sentenceService) {
        $scope.comment = {};

        $scope.cancel = function () {
            $uibModalInstance.dismiss();
        };

        $scope.ok = function () {
            sentenceService.addCommentToSentence(sentence.id, $scope.comment).then(function (comment) {
                $uibModalInstance.close({comment: comment});
            }).catch(function (err) {
                console.error(err);
            });
        };

    })
