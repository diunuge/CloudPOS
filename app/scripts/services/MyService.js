(function (module) {
    cloudPOS.services = _.extend(module, {
        MyService: function (http) {

        }
    });
    cloudPOS.ng.services.service('MyService', [
        'HttpService',
        cloudPOS.services.MyService
    ]).run(function ($log) {
        $log.info("MyService initialized");
    });
}(cloudPOS.services || {}));







/*(function (module) {
    cloudPOS.services = _.extend(module, {
        CloudDaoService: function ($http) {
            this.getData = function(func, url){
                var obj = null;
                $http({
                    method : "GET",
                    url : url
                }).then(function success(response) {
                    func(response.data);
                }, function error(response) {
                    console.log("CloudDaoService :" + response.statusText);
                    return -1;
                });
            };
        }
    });
    cloudPOS.ng.services.config(function ($provide) {
        $provide.provider('CloudDaoService', cloudPOS.services.CloudDaoService);
    }).run(function ($log) {
        $log.info("CloudDaoService initialized");
    });
}(cloudPOS.services || {}));*/
