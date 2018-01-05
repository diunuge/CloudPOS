(function (module) {
    cloudPOS.controllers = _.extend(module, {
        OrderPanelRightOptionsController: function (scope, location, sessionManager, translate, $rootScope, localStorageService, keyboardManager, $idle, tmhDynamicLocale,
                                            uiConfigService, $http) {

            scope.filterOrderedItems = function(evnt, orderType) {
                scope.orderDataModule.getOrdersData(orderType);
            };
        }
    });
    cloudPOS.ng.application.controller('OrderPanelRightOptionsController', [
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
        cloudPOS.controllers.OrderPanelRightOptionsController
    ]).run(function ($log) {
        $log.info("OrderPanelRightOptionsController initialized");
    });
}(cloudPOS.controllers || {}));
