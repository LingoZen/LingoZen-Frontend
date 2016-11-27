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

        $scope.addCommentToSentence = function (sentenceId) {
            var modalInstance = $uibModal.open({
                templateUrl: 'pages/modal-templates/add-comment-to-sentence.html',
                controller: 'addCommentToSentenceModalController',
                size: 'lg',
                resolve: {
                    sentenceId: function () {
                        return sentenceId;
                    }
                }
            });

            modalInstance.result.then(function (resolved) {
                if (resolved && resolved.comment) {
                    if ($scope.sentence.id === sentenceId) {
                        return $scope.sentence.comments.push(resolved.comment);
                    }

                    $scope.sentence.translations.forEach(function (translation, index) {
                        if (translation.id === sentenceId) {
                            $scope.sentence.translations[index].comments.push(resolved.comment);
                        }
                    })
                }
            }).catch(function (err) {
                if (err) {
                    console.error(err);
                }
            });
        };

        $scope.addTranslationToSentence = function () {
            var modalInstance = $uibModal.open({
                templateUrl: 'pages/modal-templates/add-translation-to-sentence.html',
                controller: 'addTranslationToSentenceModalController',
                size: 'lg',
                resolve: {
                    sentenceId: function () {
                        return $scope.sentence.id;
                    }
                }
            });

            modalInstance.result.then(function (resolved) {
                if (resolved && resolved.translation) {
                    return $scope.sentence.translations.push(resolved.translation);

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

    .controller('addCommentToSentenceModalController', function ($scope, $uibModalInstance, sentenceId, sentenceService) {
        $scope.comment = {};

        $scope.cancel = function () {
            $uibModalInstance.dismiss();
        };

        $scope.ok = function () {
            sentenceService.addCommentToSentence(sentenceId, $scope.comment).then(function (comment) {
                $uibModalInstance.close({comment: comment});
            }).catch(function (err) {
                console.error(err);
            });
        };

    })

    .controller('addTranslationToSentenceModalController', function ($scope, $uibModalInstance, sentenceId, sentenceService) {
        $scope.translation = {};

        $scope.cancel = function () {
            $uibModalInstance.dismiss();
        };

        $scope.ok = function () {
            sentenceService.addTranslationToSentence(sentenceId, $scope.translation).then(function (translation) {
                $uibModalInstance.close({translation: translation});
            }).catch(function (err) {
                console.error(err);
            });
        };

    })
