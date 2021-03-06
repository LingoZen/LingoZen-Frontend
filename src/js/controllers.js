angular.module('lingoApp')
    .controller('signupCtrl', ['$scope', '$rootScope', 'loginService', '$location', 'constants', function ($scope, $rootScope, loginService, $location, constants) {
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
    }])

    .controller('sentenceCtrl', ['$scope', '$routeParams', '$uibModal', 'sentenceService', function ($scope, $routeParams, $uibModal, sentenceService) {
        $scope.sentence = {};

        sentenceService.getById($routeParams.id).then(function (sentence) {
            $scope.sentence = sentence;
        }).catch(function (err) {
            console.error(err);
        });

        $scope.addCommentToSentence = function (sentenceId) {
            var modalInstance = $uibModal.open({
                templateUrl: 'modal-templates/add-comment-to-sentence.html',
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
                templateUrl: 'modal-templates/add-translation-to-sentence.html',
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
    }])

    .controller('homeCtrl', ['$scope', '$uibModal', '$location', 'sentenceService', function ($scope, $uibModal, $location, sentenceService) {
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

        $scope.addSentence = function () {
            var modalInstance = $uibModal.open({
                templateUrl: 'modal-templates/add-sentence.html',
                controller: 'addModalController',
                size: 'lg',
                resolve: {}
            });

            modalInstance.result.then(function (resolved) {
                if (resolved && resolved.sentence) {
                    $location.url('/sentences/' + resolved.sentence.id);
                }
            }).catch(function (err) {
                if (err) {
                    console.error(err);
                }
            });
        };

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
    }])

    .controller('userProfileCtrl', ['$rootScope', '$scope', 'userService', function ($rootScope, $scope, userService) {
        $scope.update = function () {
            if ($rootScope.user.password &&
                ($rootScope.user.password === '' || $rootScope.user.password.indexOf('$2a$10$') >= -1)) {
                delete $rootScope.user.password;
            }

            userService.updateMyUser($rootScope.user).then(function (updatedUser) {
                console.log('updated User is', updatedUser);
            }).catch(function (err) {
                console.error(err);
            })
        }
    }])

    .controller('mainController', ['$rootScope', '$scope', '$location', 'jwtHelper', 'loginService', 'constants', function ($rootScope, $scope, $location, jwtHelper, loginService, constants) {
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
    }])

    .controller('addCommentToSentenceModalController', ['$scope', '$uibModalInstance', 'sentenceId', 'sentenceService', function ($scope, $uibModalInstance, sentenceId, sentenceService) {
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
    }])

    .controller('addTranslationToSentenceModalController', ['$scope', '$uibModalInstance', 'sentenceId', 'sentenceService', 'languageService', function ($scope, $uibModalInstance, sentenceId, sentenceService, languageService) {
        $scope.translation = {};
        $scope.languages = [];

        languageService.getLanguages().then(function (languages) {
            $scope.languages = languages;
        });

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
    }])

    .controller('addModalController', ['$scope', '$uibModalInstance', 'sentenceService', 'languageService', function ($scope, $uibModalInstance, sentenceService, languageService) {
        $scope.sentence = {};
        $scope.languages = [];

        languageService.getLanguages().then(function (languages) {
            $scope.languages = languages;
        });

        $scope.cancel = function () {
            $uibModalInstance.dismiss();
        };

        $scope.ok = function () {
            sentenceService.addSentence($scope.sentence).then(function (sentence) {
                $uibModalInstance.close({sentence: sentence});
            }).catch(function (err) {
                console.error(err);
            });
        };
    }]);
