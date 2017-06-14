'use strict';
angular.module('main', ['google-places']).config([
    'googlePlacesServiceProvider',
    function(gpProvider) {
        gpProvider.config.RESTRICT_RADIUS = true;
    }
]);
angular.bootstrap(document.body, ['main']);