(function (module) {
    cloudPOS.controllers = _.extend(module, {
        OrderPanelMiddleSubPanelNewOrderController: function (scope, location, sessionManager, translate, $rootScope, localStorageService, keyboardManager, $idle, tmhDynamicLocale,
                                                    uiConfigService, $http) {
            // Initialization Function
            (function(){

            })();
        }
    });
    cloudPOS.ng.application.controller('OrderPanelMiddleSubPanelNewOrderController', [
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
        cloudPOS.controllers.OrderPanelMiddleSubPanelNewOrderController
    ]).run(function ($log) {
        $log.info("OrderPanelMiddleSubPanelNewOrderController initialized");
    });
}(cloudPOS.controllers || {}));