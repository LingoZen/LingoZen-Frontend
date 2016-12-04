angular.module('lingoApp')
    .service('sentenceService', ['$resource', 'constants', function ($resource, constants) {
        var resources = $resource("", [], {
            getById: {
                method: 'GET',
                url: constants.backendApiUrl + 'sentences/:id'
            },
            searchSentences: {
                method: 'GET',
                url: constants.backendApiUrl + 'sentences'
            },
            addCommentToSentence: {
                method: 'POST',
                url: constants.backendApiUrl + 'comments/sentences/:id'
            },
            addTranslationToSentence: {
                method: 'POST',
                url: constants.backendApiUrl + 'sentences/:id/translations'
            },
            addSentence: {
                method: 'POST',
                url: constants.backendApiUrl + 'sentences'
            }
        }, {});

        this.searchSentences = function (searchQuery) {
            return resources.searchSentences({search: searchQuery}).$promise;
        };

        this.getById = function (id) {
            return resources.getById({id: id}).$promise;
        };

        this.addCommentToSentence = function (sentenceId, comment) {
            return resources.addCommentToSentence({id: sentenceId}, comment).$promise;
        };

        this.addTranslationToSentence = function (sentenceId, translation) {
            return resources.addTranslationToSentence({id: sentenceId}, translation).$promise;
        };

        this.addSentence = function (sentence) {
            return resources.addSentence(sentence).$promise;
        };
    }])

    .service('loginService', ['$resource', 'constants', function ($resource, constants) {
        var resources = $resource("", [], {
            login: {
                method: 'POST',
                url: constants.backendApiUrl + 'users/login',
                isarray: true
            },
            //todo: why is isAttay true for these
            register: {
                method: 'POST',
                url: constants.backendApiUrl + 'users',
                isarray: true
            }
        }, {});

        this.login = function (user) {
            return resources.login(user).$promise;
        };

        this.register = function (user) {
            return resources.register(user).$promise;
        };
    }])

    .service('userService', ['$resource', 'constants', function ($resource, constants) {
        var resources = $resource("", [], {
            updateMyUser: {
                method: 'PUT',
                url: constants.backendApiUrl + 'users/me'
            }
        }, {});

        this.updateMyUser = function (user) {
            return resources.updateMyUser(user).$promise;
        };
    }])

    .service('languageService', ['$resource', 'constants', '$cacheFactory', '$q', function ($resource, constants, $cacheFactory, $q) {
        var resources = $resource("", [], {
            getLanguages: {
                method: 'GET',
                url: constants.backendApiUrl + 'languages',
                isArray: true
            }
        }, {});
        var languageCache = $cacheFactory('language');

        this.getLanguages = function (user) {
            return $q(function (resolve, reject) {
                var cachedLanguages = languageCache.get('languages');
                if (cachedLanguages) {
                    return resolve(cachedLanguages);
                }

                resources.getLanguages(user).$promise.then(function (languages) {
                    languageCache.put('languages', languages);
                    return resolve(languages);
                }).catch(function (err) {
                    return reject(err);
                })
            });
        };
    }])
