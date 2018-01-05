(function (module) {
    cloudPOS.controllers = _.extend(module, {
        OrderPanelLeftPaymentController: function (scope, location, sessionManager, translate, $rootScope, localStorageService, keyboardManager, $idle, tmhDynamicLocale,
                                            uiConfigService, $http) {

        }
    });
    cloudPOS.ng.application.controller('OrderPanelLeftPaymentController', [
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
        cloudPOS.controllers.OrderPanelLeftPaymentController
    ]).run(function ($log) {
        $log.info("OrderPanelLeftPaymentController initialized");
    });
}(cloudPOS.controllers || {}));
