'use strict';
angular.module('google-places', ['ui.bootstrap'])
    .provider('googlePlacesService', function googlePlacesServiceProvider() {

        var gpProvider = this;

        gpProvider.config = {
            MAP_RADIUS: 10000,
            DEFAULT_LOCATION: '12.9153884,80.22565039999999',
            RESTRICT_RADIUS: false
        };

        //var supportedTypes = [{ "key": "accounting", "desc": "Accounting" }, { "key": "airport", "desc": "Airport" }, { "key": "amusement_park", "desc": "Amusement park" }, { "key": "aquarium", "desc": "Aquarium" }, { "key": "art_gallery", "desc": "Art gallery" }, { "key": "atm", "desc": "Atm" }, { "key": "bakery", "desc": "Bakery" }, { "key": "bank", "desc": "Bank" }, { "key": "bar", "desc": "Bar" }, { "key": "beauty_salon", "desc": "Beauty salon" }, { "key": "bicycle_store", "desc": "Bicycle store" }, { "key": "book_store", "desc": "Book store" }, { "key": "bowling_alley", "desc": "Bowling alley" }, { "key": "bus_station", "desc": "Bus station" }, { "key": "cafe", "desc": "Cafe" }, { "key": "campground", "desc": "Campground" }, { "key": "car_dealer", "desc": "Car dealer" }, { "key": "car_rental", "desc": "Car rental" }, { "key": "car_repair", "desc": "Car repair" }, { "key": "car_wash", "desc": "Car wash" }, { "key": "casino", "desc": "Casino" }, { "key": "cemetery", "desc": "Cemetery" }, { "key": "church", "desc": "Church" }, { "key": "city_hall", "desc": "City hall" }, { "key": "clothing_store", "desc": "Clothing store" }, { "key": "convenience_store", "desc": "Convenience store" }, { "key": "courthouse", "desc": "Courthouse" }, { "key": "dentist", "desc": "Dentist" }, { "key": "department_store", "desc": "Department store" }, { "key": "doctor", "desc": "Doctor" }, { "key": "electrician", "desc": "Electrician" }, { "key": "electronics_store", "desc": "Electronics store" }, { "key": "embassy", "desc": "Embassy" }, { "key": "fire_station", "desc": "Fire station" }, { "key": "florist", "desc": "Florist" }, { "key": "funeral_home", "desc": "Funeral home" }, { "key": "furniture_store", "desc": "Furniture store" }, { "key": "gas_station", "desc": "Gas station" }, { "key": "gym", "desc": "Gym" }, { "key": "hair_care", "desc": "Hair care" }, { "key": "hardware_store", "desc": "Hardware store" }, { "key": "hindu_temple", "desc": "Hindu temple" }, { "key": "home_goods_store", "desc": "Home goods store" }, { "key": "hospital", "desc": "Hospital" }, { "key": "insurance_agency", "desc": "Insurance agency" }, { "key": "jewelry_store", "desc": "Jewelry store" }, { "key": "laundry", "desc": "Laundry" }, { "key": "lawyer", "desc": "Lawyer" }, { "key": "library", "desc": "Library" }, { "key": "liquor_store", "desc": "Liquor store" }, { "key": "local_government_office", "desc": "Local government office" }, { "key": "locksmith", "desc": "Locksmith" }, { "key": "lodging", "desc": "Lodging" }, { "key": "meal_delivery", "desc": "Meal delivery" }, { "key": "meal_takeaway", "desc": "Meal takeaway" }, { "key": "mosque", "desc": "Mosque" }, { "key": "movie_rental", "desc": "Movie rental" }, { "key": "movie_theater", "desc": "Movie theater" }, { "key": "moving_company", "desc": "Moving company" }, { "key": "museum", "desc": "Museum" }, { "key": "night_club", "desc": "Night club" }, { "key": "painter", "desc": "Painter" }, { "key": "park", "desc": "Park" }, { "key": "parking", "desc": "Parking" }, { "key": "pet_store", "desc": "Pet store" }, { "key": "pharmacy", "desc": "Pharmacy" }, { "key": "physiotherapist", "desc": "Physiotherapist" }, { "key": "plumber", "desc": "Plumber" }, { "key": "police", "desc": "Police" }, { "key": "post_office", "desc": "Post office" }, { "key": "real_estate_agency", "desc": "Real estate agency" }, { "key": "restaurant", "desc": "Restaurant" }, { "key": "roofing_contractor", "desc": "Roofing contractor" }, { "key": "rv_park", "desc": "Rv park" }, { "key": "school", "desc": "School" }, { "key": "shoe_store", "desc": "Shoe store" }, { "key": "shopping_mall", "desc": "Shopping mall" }, { "key": "spa", "desc": "Spa" }, { "key": "stadium", "desc": "Stadium" }, { "key": "storage", "desc": "Storage" }, { "key": "store", "desc": "Store" }, { "key": "subway_station", "desc": "Subway station" }, { "key": "synagogue", "desc": "Synagogue" }, { "key": "taxi_stand", "desc": "Taxi stand" }, { "key": "train_station", "desc": "Train station" }, { "key": "transit_station", "desc": "Transit station" }, { "key": "travel_agency", "desc": "Travel agency" }, { "key": "university", "desc": "University" }, { "key": "veterinary_care", "desc": "Veterinary care" }, { "key": "zoo", "desc": "Zoo" }];

        var GooglePlacesService = function($http, $q, $uibModal) {
            var googlePlacesParams = {
                location: gpProvider.config.DEFAULT_LOCATION,
                radius: gpProvider.config.MAP_RADIUS,
                strictbounds: gpProvider.config.RESTRICT_RADIUS
            };

            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(function(position) {
                    googlePlacesParams.location = [position.coords.latitude, position.coords.longitude].join(',')
                }, function(error) {
                    switch (error.code) {
                        case error.PERMISSION_DENIED:
                            showError("User denied the request for Geolocation.");
                            break;
                        case error.POSITION_UNAVAILABLE:
                            showError("Location information is unavailable.");
                            break;
                        case error.TIMEOUT:
                            showError("The request to get user location timed out.");
                            break;
                        case error.UNKNOWN_ERROR:
                            showError("An unknown error occurred.");
                            break;
                    }
                });
            } else {
                showError("Geolocation is not supported by this browser.");
            }

            this.getPlaces = function(query) {
                if (!query) {
                    return $q.when([]);
                }
                var qParams = angular.extend({ input: query }, googlePlacesParams);
                var url = 'maps/api/place/queryautocomplete/json';
                return $http.get(url, { params: qParams }).then(function(res) {
                    if (res.data.status && res.data.status.toLowerCase() === "ok") {
                        return res.data.predictions;
                    } else {
                        showGoogleError(res.data);
                        return [];
                    }
                }, function(err) {
                    showError("OOPS! Something went wrong. Retry after sometime.");
                    return [];
                });
            };

            var getVicinityAsync = function(res) {
                var placeUrl = 'maps/api/place/details/json';
                for (var r = 0; r < res.data.results.length; r++) {
                    var placeParam = { placeid: res.data.results[r].place_id };
                    $http.get(placeUrl, { params: placeParam }).then(function(place) {
                        return function(pres) {
                            if (res.data.status && res.data.status.toLowerCase() === "ok") {
                                place.vicinity = pres.data.result.vicinity;

                            } else {
                                showGoogleError(pres.data);
                            }
                        }
                    }(res.data.results[r]));

                }
            };

            var paginationParams = {};

            this.getPlaceDetails = function(query) {
                if (!query) {
                    return $q.when([]);
                }
                var qParams = angular.extend({ query: query }, googlePlacesParams);
                var url = 'maps/api/place/textsearch/json';
                return $http.get(url, { params: qParams }).then(function(res) {
                    if (res.data.status && res.data.status.toLowerCase() === "ok") {
                        //getVicinityAsync(res);
                        paginationParams.next_page_token = res.data.next_page_token;
                        return res.data.results;
                    } else {
                        showGoogleError(res.data);
                        return [];
                    }
                }, function(err) {
                    showError("OOPS! Something went wrong. Retry after sometime.");
                    return [];
                });
            };

            this.hasNextPage = function() {
                return paginationParams.next_page_token;
            }

            this.loadNextPage = function(listToAppend) {
                if (!paginationParams.next_page_token) {
                    return $q.when([]);
                }
                var qParams = angular.extend({ pagetoken: paginationParams.next_page_token }, googlePlacesParams);
                var url = 'maps/api/place/textsearch/json';
                return $http.get(url, { params: qParams }).then(function(res) {
                    if (res.data.status && res.data.status.toLowerCase() === "ok") {
                        //getVicinityAsync(res);
                        paginationParams.next_page_token = res.data.next_page_token;
                        for (var i = 0; listToAppend && i < res.data.results.length; i++) {
                            listToAppend.push(res.data.results[i]);
                        }
                        return res.data.results;
                    } else {
                        showGoogleError(res.data);
                        return [];
                    }
                }, function(err) {
                    showError("OOPS! Something went wrong. Retry after sometime.");
                    return [];
                });
            };

            var showGoogleError = function(res) {
                if (res.status === "ZERO_RESULTS") {
                    res.error_message = "No results for your search!"
                } else if (res.status === "INVALID_REQUEST") {
                    res.error_message = "OOPS!!! Something went wrong. Try after sometime."
                }
                showError(res.error_message);
            };

            var showError = function(message) {
                $uibModal.open({
                    templateUrl: 'Google/ErrorTemplate.html',
                    controller: 'ErrorDialogController',
                    resolve: {
                        message: function() {
                            return message;
                        }
                    }
                });
            };

        };

        gpProvider.$get = ['$http', '$q', '$uibModal', function($http, $q, $uibModal) {
            return new GooglePlacesService($http, $q, $uibModal);
        }]

    })
    .directive('searchPlacesComponent', [function() {
        return {
            restrict: 'E',
            transclude: true,
            templateUrl: 'Google/SearchPlacesComponent.html',
            scope: {
                shouldBeFocused: '@'
            },
            controller: ['$scope', 'googlePlacesService', function(scope, googlePlacesService) {
                scope.vdo = {
                    search: '',
                    places: [],
                    options: {
                        debounce: 750
                    },
                    isLoadingLocations: false
                };

                scope.getPlaces = googlePlacesService.getPlaces;

                scope.events = {
                    onSearchSelection: function($item, $model, $label, $event) {
                        emitEventToSubcribers("ON_SEARCH_SELECTION", [$item.description]);
                        scope.vdo.selectedVal = $item.description;
                    }
                }

                var unbindWatch = scope.$watch('vdo.isLoadingLocations', function(newval, oldval) {
                    if (newval && newval !== oldval) {
                        emitEventToSubcribers("ON_LOADING_PLACES", []);
                        //scope.vdo.selectedVal = '';
                    }
                });
                scope.$on('$destroy', function() {
                    unbindWatch();
                })

                var emitEventToSubcribers = function(eventName, paramsArray) {
                    var handlers = controllerEvents[eventName] || [];
                    for (var h = 0; h < handlers.length; h++) {
                        handlers[h].apply({}, paramsArray || []);
                    }
                }
                var controllerEvents = {
                    "ON_LOADING_PLACES": [],
                    "ON_SEARCH_SELECTION": []
                };
                this.on = function(eventName, handler) {
                    controllerEvents[eventName] = controllerEvents[eventName] || [];
                    controllerEvents[eventName].push(handler);
                };
                if (scope.shouldBeFocused === "true") {
                    document.getElementsByName("text_search")[0].focus();
                }
            }],

        }
    }])
    .directive('placesInfoComponent', ['googlePlacesService', function(googlePlacesService) {
        return {
            restrict: 'E',
            templateUrl: 'Google/PlacesInfoComponent.html',
            require: '^searchPlacesComponent',
            scope: true,
            link: function(scope, elem, attr, ctrl) {
                scope.infoVdo = {
                    placeList: []
                }

                scope.events = {
                    onLoadMoreClicked: function() {
                        if (scope.infoVdo.hasNextPage = googlePlacesService.hasNextPage()) {
                            googlePlacesService.loadNextPage(scope.infoVdo.placeList);
                        }
                    }
                }

                ctrl.on("ON_LOADING_PLACES", function() {
                    scope.infoVdo.placeList = [];
                });
                ctrl.on("ON_SEARCH_SELECTION", function(query) {
                    googlePlacesService.getPlaceDetails(query).then(function(list) {
                        scope.infoVdo.placeList = list;
                        scope.infoVdo.hasNextPage = googlePlacesService.hasNextPage();
                    })
                });
            }
        }
    }])
    .controller('ErrorDialogController', ['$scope', '$uibModalInstance', 'message', function($scope, $modalInstance, message) {
        $scope.message = message;
        $scope.close = function() {
            $modalInstance.close();
        }
        var rootElement = angular.element(document);
        rootElement.on('keyup', function(e) {
            if (e.keyCode === 13 || e.keyCode === 27) {
                $modalInstance.close();
            }
        })
        $scope.$on('$destroy', function() {
            rootElement.off('keyup');
        });
    }])