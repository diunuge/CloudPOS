(function (module) {
    cloudPOS.services = _.extend(module, {
        DataAccessService: function ($http, LoadingScreenService, MasterDataStorageHandler) {

            /// Authentication ticket holder
            /// All request methods use this token.
            var AuthenticationTicket = {SessionKey: "upg2YwqCrFFjLxmD5Mot5BWsUOAigQtZe9I8UHkJl3grRr9l500RQLTUZ6FNMj1W"};

            /// Singleton method used to initialize AuthenticationTicket
            this.SetAuthenticationTicket = function (authenticationTicket) {
                  ////  AuthenticationTicket.SessionKey = authenticationTicket;
            };

            /// Set authentication ticket to the cached object
            var RestoreAuthenticationTicket = function () {
                let authenticationTicket = JSON.parse(MasterDataStorageHandler.DataStorageHandler.GetAuthenticationData());

                if (authenticationTicket.SessionKey !== AuthenticationTicket.SessionKey) {
                     /// AuthenticationTicket.SessionKey = authenticationTicket.SessionKey;
                }
            };

            /// Http GET method for data retrieval.
            this.GET = function (resUrl, callback, queryString, isLoadingOn, acceptType) {

                /// Initial tasks
                callback = (callback == undefined) ? ()=> {
                } : callback;
                queryString = "?sessionKey=" + encodeURIComponent(AuthenticationTicket.SessionKey);
                isLoadingOn = (isLoadingOn != undefined);
                acceptType = (acceptType != undefined) ? acceptType : "application/json";

                $http({
                    method: "GET",
                    url: resUrl + queryString,
                    headers: {
                        "Accept": acceptType,
                        "SessionKey": AuthenticationTicket.SessionKey
                    }
                }).then(function (response) {
                    callback(response);
                }, function (response) {
                    callback({Error: response});
                });
            };

            /// Http POST method for data creation or modification.
            this.POST = function (resUrl, callback, data, isLoadingOn, contentType, acceptType) {
                callback = (callback == undefined) ? ()=> {
                } : callback;
                data = (data == undefined) ? "" : data;
                isLoadingOn = (isLoadingOn != undefined);
                contentType = (contentType != undefined) ? contentType : "application/json";
                acceptType = (acceptType != undefined) ? acceptType : "application/json";

                $http({
                    method: "POST",
                    url: resUrl + ((resUrl.indexOf("?")==-1) ? "?sessionKey=" +
                    encodeURIComponent(AuthenticationTicket.SessionKey) : "&sessionKey=" +
                    encodeURIComponent(AuthenticationTicket.SessionKey)),
                    data: data,
                    eventHandlers: {
                        readystatechange: (event)=> {
                            console.log("State changed");
                        }
                    },
                    headers: {
                        "Accept": acceptType,
                        "Content-Type": contentType,
                        "SessionKey": AuthenticationTicket.SessionKey
                    }

                }).then(function (response) {
                    callback(response);
                }, function (response) {
                    callback({Error: response});
                });
            };

            /// Http PUT method for data modification.
            this.PUT = function (resUrl, callback, data, isLoadingOn, contentType, acceptType) {
                callback = (callback == undefined) ? ()=> {
                } : callback;
                data = (data == undefined) ? "" : data;
                isLoadingOn = (isLoadingOn != undefined);
                contentType = (contentType != undefined) ? contentType : "application/json";
                acceptType = (acceptType != undefined) ? acceptType : "application/json";

                $http({
                    method: "PUT",
                    url: resUrl + "?sessionKey=" + encodeURIComponent(AuthenticationTicket.SessionKey),
                    data: data,
                    headers: {
                        "Accept": acceptType,
                        "Content-Type": contentType,
                        "SessionKey": AuthenticationTicket.SessionKey
                    }

                }).then(function (response) {
                    callback(response);
                }, function (response) {
                    callback({Error: response});
                });

                /// console.log(AuthenticationTicket);

                RestoreAuthenticationTicket();
            };

            /// Http DELETE method for data deletion.
            this.DELETE = function (resUrl, callback, data, queryString, isLoadingOn, acceptType) {

                /// Initial tasks
                callback = (callback == undefined) ? ()=> {
                } : callback;
                queryString = (queryString == undefined) ? "" : "?" + queryString;
                isLoadingOn = (isLoadingOn != undefined);
                acceptType = (acceptType != undefined) ? acceptType : "application/json";

                $http({
                    method: "DELETE",
                    url: resUrl + "?sessionKey=" + encodeURIComponent(AuthenticationTicket.SessionKey),
                    data: data,
                    headers: {
                        "Accept": acceptType,
                        "SessionKey": AuthenticationTicket.SessionKey
                    }

                }).then(function (response) {
                    callback(response);
                }, function (response) {
                    callback({Error: response});
                });
            };

            /// Authentication request
            /// Use to authenticate user only
            this.AuthenticateUser = function (url, userCredentials, isLoadingOn, callback) {

                $http({
                    method: "POST",
                    url: url,
                    headers: {
                        "Content-Type": "application/json"
                    },
                    data: {
                        "restaurantId": userCredentials.restaurantId,
                        "userName": userCredentials.username,
                        "passWord": userCredentials.password
                    }
                }).then((response)=> {
                    console.log(response);
                    callback(response);
                }, (response)=> {
                    callback({Error: response});
                });
            };
        }
    });
    cloudPOS.ng.services.service('DataAccessService', [
        '$http',
        'LoadingScreenService',
        'MasterDataStorageHandler',
        cloudPOS.services.DataAccessService
    ]).run(function ($log) {
        $log.info("DataAccessService initialized");
    });
}(cloudPOS.services || {}));
