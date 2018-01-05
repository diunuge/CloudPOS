(function (module) {
    cloudPOS.services = _.extend(module, {
        DataAccessServiceProvider: function ($http) {
            this.getFoodsData = function(func) {
                var obj = null;
                $http({
                    method: "GET",
                    url: "json/foodTypes2.txt"
                }).then(function success(response) {
                    // func(JSON.stringify(response.data));
                    func(response.data);
                    // return response.data;

                }, function error(response) {
                    console.log(response.statusText);
                    return -1;
                });
            };
        }
    });
    cloudPOS.ng.services.config(function ($provide) {
        $provide.provider('DataAccessService', cloudPOS.services.DataAccessServiceProvider);
    }).run(function ($log) {
        $log.info("DataAccessService initialized");
    });
}(cloudPOS.services || {}));
