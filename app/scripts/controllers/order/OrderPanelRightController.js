(function (module) {
    cloudPOS.controllers = _.extend(module, {
        OrderPanelRightController: function (scope, location, sessionManager, translate, $rootScope, localStorageService, keyboardManager, $idle, tmhDynamicLocale,
                                            uiConfigService, $http, CloudDaoService) {
            var func = (function (This) {
                return function (data) {
                    console.log(data);
                };
            })(this);
            //CloudDaoService.getDataPost(func, "http://45.35.4.156:8888/CloudPosService.svc/GetFoodDetails");
        }
    });
    cloudPOS.ng.application.controller('OrderPanelRightController', [
        '$scope',
        '$location',
        'SessionManager',
        '$translate',
        '$rootScope',
        'localStorageService',
        'keyboardManager',
        '$idle',
        'tmhDynamicLocale',
        'UIConfigService',
        '$http',
        'CloudDaoService',
        cloudPOS.controllers.OrderPanelRightController
    ]).run(function ($log) {
        $log.info("OrderPanelRightController initialized");
    });
}(cloudPOS.controllers || {}));
