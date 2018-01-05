(function (module) {
    cloudPOS.controllers = _.extend(module, {
        OrderPanelMiddleSubPanelOrderFilteredItemsController: function (scope, location, sessionManager, translate, $rootScope, localStorageService, keyboardManager, $idle, tmhDynamicLocale,
                                                    uiConfigService, $http) {
            scope.addFoodItems = function(indx){
                scope.orderDataModule.addFoodItem(indx, scope.orderDataModule.guestsSelectedVal);
            };
        }
    });
    cloudPOS.ng.application.controller('OrderPanelMiddleSubPanelOrderFilteredItemsController', [
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
        cloudPOS.controllers.OrderPanelMiddleSubPanelOrderFilteredItemsController
    ]).run(function ($log) {
        $log.info("OrderPanelMiddleSubPanelOrderFilteredItemsController initialized");
    });
}(cloudPOS.controllers || {}));
