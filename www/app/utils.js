angular.module('utils', [])
/*************************** FACTORIES ***************************/

.factory('localStorage', ['$window', function ($window) {
    return {
        set: function (key, value) {
            $window.localStorage[key] = value;
        },
        get: function (key, defaultValue) {
            return $window.localStorage[key] || defaultValue;
        },
        remove: function (key) {
            delete $window.localStorage[key];
        },
        setObject: function (key, value) {
            $window.localStorage[key] = JSON.stringify(value);
        },
        getObject: function (key) {
            return JSON.parse($window.localStorage[key] || '{}');
        },
        setArray: function (key, value) {
            $window.localStorage[key] = JSON.stringify(value);
        },
        getArray: function (key) {
            return JSON.parse($window.localStorage[key] || '[]');
        },
        hasArrayKeyValue: function(array, key, value){
            for(var i = 0; i < array.length; i++){
                if(array[i][key] == value){
                    return true;
                }
            }
            return false;
        },
        getArrayObjectByKeyValue: function(name, key, value){
            var array = this.getArray(name);
            for(var i = 0; i < array.length; i++){
                if(array[i][key] == value){
                    return array[i];
                }
            }
            return null;
        },
        setArrayObjectByKeyValue: function(name, key, value){
            var array = this.getArray(name);
            for(var i = 0; i < array.length; i++){
                if(array[i][key]){
                    array[i][key] = value;
                    this.setArray(name, array);
                    return true;
                }
            }
            return false;
        },
        clear: function(){
            $window.localStorage.clear();
        }
    }
}])
/*
.factory('api', ['$http', '$ionicPopup', 'config', 'localStorage', function ($http, $ionicPopup, config, localStorage) {
    return {
        get: function (uri, params, successCallback, errorCallback, errorCount) {
            var _this = this;

            errorCount = errorCount || 0;

            params = params || {};
            if (localStorage.get('api_key')) {
                params.api_key = localStorage.get('api_key');
            }

            console.log("Making API call to " + uri);
            $http.jsonp(config.apiUrl + uri + '?callback=JSON_CALLBACK', {
                params: params,
                responseType: 'json'
            }).
            success(function (data, status, headers, config) {
                if (successCallback) {
                    successCallback(data, status, headers, config);
                }
            }).
            error(function (data, status, headers, config) {
                if (errorCallback) {
                    errorCallback(data, status, headers, config);
                } else if (status != 400 && status != 404 && errorCount < 5) {
                    errorCount += 1;
                    console.log("Repeating call after " + errorCount + " errors");
                    setTimeout(function () {
                        _this.get(uri, params, successCallback, errorCallback, errorCount);
                    }, 1000);
                }
            });
        },
        post: function (uri, params, bodyData, successCallback, errorCallback, errorCount) {
            var _this = this;

            errorCount = errorCount || 0;

            params = params || {};
            if (localStorage.get('api_key')) {
                params.api_key = localStorage.get('api_key');
            }

            bodyData = bodyData || {};

            $http({
                url: config.apiUrl + uri,
                method: "POST",
                params: params,
                data: bodyData,
                responseType: 'json',
            }).
            success(function (data, status, headers, config) {
                if (successCallback) {
                    successCallback(data, status, headers, config);
                }
            }).
            error(function (data, status, headers, config) {
                if (errorCallback) {
                    errorCallback(data, status, headers, config);
                } else if (status != 400 && status != 404 && errorCount < 5) {
                    errorCount += 1;
                    console.log("Repeating call after " + errorCount + " errors");
                    setTimeout(function () {
                        _this.post(uri, params, bodyData, successCallback, errorCallback, errorCount);
                    }, 1000);
                }
            });
        },
        put: function (uri, params, bodyData, successCallback, errorCallback, errorCount) {
            var _this = this;

            errorCount = errorCount || 0;

            params = params || {};
            if (localStorage.get('api_key')) {
                params.api_key = localStorage.get('api_key');
            }

            bodyData = bodyData || {};

            $http({
                url: config.apiUrl + uri,
                method: "PUT",
                params: params,
                data: bodyData,
                responseType: 'json',
            }).
            success(function (data, status, headers, config) {
                console.log("AWDAWDAW",data);
                if (successCallback) {
                    successCallback(data, status, headers, config);
                }
            }).
            error(function (data, status, headers, config) {
                console.log("AWDaaaaaAWDAW",data);
                if (errorCallback) {
                    errorCallback(data, status, headers, config);
                } else if (status != 400 && status != 404 && errorCount < 5) {
                    errorCount += 1;
                    console.log("Repeating call after " + errorCount + " errors");
                    setTimeout(function () {
                        _this.post(uri, params, bodyData, successCallback, errorCallback, errorCount);
                    }, 1000);
                }
            });
        }
    }
}])
*/
