angular.module('lingoApp', ['ngRoute', 'ngResource', 'angular-jwt'])

    .constant("constants", {
        // "backendApiUrl": "http://54.175.240.69:3000/"
        "backendApiUrl": "http://localhost:3000/"
    })

    .config(['$resourceProvider', function ($resourceProvider) {
        // Don't strip trailing slashes from calculated URLs
        $resourceProvider.defaults.stripTrailingSlashes = false;
    }]);
