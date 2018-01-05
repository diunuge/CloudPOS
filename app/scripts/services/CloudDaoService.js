(function (module) {
    cloudPOS.services = _.extend(module, {
        CloudDaoService: function ($http, LoadingScreenService) {
            this.GetMethod = function(func, url, isLoaderScreenEnabled, loaderType) {
                try {
                    if (isLoaderScreenEnabled) {
                        var loader = LoadingScreenService.GetLoader();
                        loaderType = (loaderType === undefined) ? "defaultLoader" : loaderType;
                        loader.StartLoadingScreen(loaderType, null);
                    }

                    var obj = null;
                    $http({
                        method: "GET",
                        url: url
                    }).then(function success(response) {
                        func(response.data);
                        if (isLoaderScreenEnabled) {
                            loader.StopLoadingScreen();
                        }
                    }, function error(response) {
                        console.log("CloudDaoService :" + response.statusText);
                        if (isLoaderScreenEnabled) {
                            loader.StopLoadingScreen();
                        }
                        return -1;
                    });
                } catch (e) {
                    console.log(e);
                }
            };

            this.PostMethod = function(func, url, isLoaderScreenEnabled, loaderType) {
                try {
                    if(isLoaderScreenEnabled) {
                        var loader = LoadingScreenService.GetLoader();
                        loaderType = (loaderType === undefined)? "defaultLoader":loaderType;
                        loader.StartLoadingScreen(loaderType, null);
                    }
                    $http({
                        method: "post",
                        url: url
                    }).then(function success(response) {
                        if(isLoaderScreenEnabled){
                            loader.StopLoadingScreen("default", null);
                        }
                        func(response.data);
                    }, function error(response) {
                        console.log("CloudDaoService :" + response.statustext);
                        if(isLoaderScreenEnabled){
                            loader.StopLoadingScreen("default", null);
                        }
                        return -1;
                    });
                } catch(e) {
                    console.log(e);

                }
            };

            this.JsonPostMethod = function(func, dataJson, url, isLoaderScreenEnabled, loaderType) {
                try {
                    if(isLoaderScreenEnabled) {
                        var loader = LoadingScreenService.GetLoader();
                        loaderType = (loaderType === undefined)? "defaultLoader":loaderType;
                        loader.StartLoadingScreen(loaderType, null);
                    }
                    $http({
                        method: "post",
                        url: url,
                        headers: {
                            "Content-Type": "application/json",
                            "Accept":"application/json"
                        },
                        data: dataJson
                    }).then(function success(response) {
                        if(isLoaderScreenEnabled) {
                            loader.StopLoadingScreen();
                        }
                        func(response.data);
                    }, function error(response) {
                        console.log("CloudDaoService :" + response.statustext);
                        if(isLoaderScreenEnabled) {
                            loader.StopLoadingScreen();
                        }
                        return -1;
                    });
                } catch(e) {
                    console.log(e);

                }
            };

            this.LoginRequest = function(func, dataJson, url, isLoaderScreenEnabled, loaderType) {
                try {
                    if(isLoaderScreenEnabled) {
                        var loader = LoadingScreenService.GetLoader();
                        loaderType = (loaderType === undefined)? "defaultLoader":loaderType;
                        loader.StartLoadingScreen(loaderType, null);
                    }
                    $http({
                        method: "post",
                        url: url,
                        headers: {
                            "Content-Type": "application/json",
                            "Accept":"application/json"
                        },
                        data: dataJson
                    }).then(function success(response) {
                        if(isLoaderScreenEnabled) {
                            loader.StopLoadingScreen();
                        }
                        func(response.data);
                    }, function error(response) {
                        console.log("CloudDaoService :" + response.statustext);
                        if(isLoaderScreenEnabled) {
                            loader.StopLoadingScreen();
                        }
                        return -1;
                    });
                } catch(e) {
                    console.log(e);

                }
            };
        }
    });
    cloudPOS.ng.services.service('CloudDaoService', [
        '$http',
        'LoadingScreenService',
        cloudPOS.services.CloudDaoService
    ]).run(function ($log) {
        $log.info("CloudDaoService initialized");
    });
}(cloudPOS.services || {}));
