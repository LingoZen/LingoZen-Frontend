angular.module('lingoApp', ['ngRoute', 'ngResource', 'angular-jwt', 'ui.bootstrap'])

    .constant("constants", {
        // "backendApiUrl": "http://54.175.240.69:3000/"
        "backendApiUrl": "http://localhost:3000/",
        "jwtId": "lingoZenJwt"
    })

    .config(['$resourceProvider', function ($resourceProvider) {
        // Don't strip trailing slashes from calculated URLs
        $resourceProvider.defaults.stripTrailingSlashes = false;
    }])

    .config(function ($httpProvider, jwtOptionsProvider, constants) {
        jwtOptionsProvider.config({
            whiteListedDomains: ['lingozen.com', 'localhost'],
            tokenGetter: function () {
                return localStorage.getItem(constants.jwtId);
            }
        });

        $httpProvider.interceptors.push('jwtInterceptor');
    })
