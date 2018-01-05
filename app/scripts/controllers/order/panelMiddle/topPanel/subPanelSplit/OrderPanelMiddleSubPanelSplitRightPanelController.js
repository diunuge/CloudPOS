(function (module) {
    cloudPOS.controllers = _.extend(module, {
        OrderPanelMiddleSubPanelSplitRightPanelController: function (scope, location, sessionManager, translate, $rootScope, localStorageService, keyboardManager, $idle, tmhDynamicLocale,
                                                    uiConfigService, $http) {

        }
    });
    cloudPOS.ng.application.controller('OrderPanelMiddleSubPanelSplitRightPanelController', [
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
        cloudPOS.controllers.OrderPanelMiddleSubPanelSplitRightPanelController
    ]).run(function ($log) {
        $log.info("OrderPanelMiddleSubPanelSplitRightPanelController initialized");
    });
}(cloudPOS.controllers || {}));