var backendIpAddress = '54.175.240.69';
angular.module('lingoApp', ['ngRoute', 'ngResource', 'angular-jwt', 'ui.bootstrap'])

    .constant("constants", {
        // "backendApiUrl": "http://"+backendIpAddress+":3000/",
        "backendApiUrl": "http://localhost:3000/",
        "jwtId": "lingoZenJwt"
    })

    .config(['$resourceProvider', function ($resourceProvider) {
        // Don't strip trailing slashes from calculated URLs
        $resourceProvider.defaults.stripTrailingSlashes = false;
    }])

    .config(['$httpProvider', 'jwtOptionsProvider', 'constants', function ($httpProvider, jwtOptionsProvider, constants) {
        jwtOptionsProvider.config({
            whiteListedDomains: ['localhost', backendIpAddress],
            tokenGetter: function () {
                return localStorage.getItem(constants.jwtId);
            }
        });

        $httpProvider.interceptors.push('jwtInterceptor');
    }])
