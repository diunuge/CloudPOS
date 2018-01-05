(function (module) {
    cloudPOS.services = _.extend(module, {
        ObjectMapperService: function () {

        }
    });
    cloudPOS.ng.services.service('ObjectMapperService', [
        cloudPOS.services.ObjectMapperService
    ]).run(function ($log) {
        $log.info("ObjectMapperService initialized");
    });
}(cloudPOS.services || {}));
