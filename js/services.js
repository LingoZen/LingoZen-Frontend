angular.module('lingoApp')
    .service('sentenceService', function ($resource, constants) {
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
    })

    .service('loginService', function ($resource, constants) {
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
    })
