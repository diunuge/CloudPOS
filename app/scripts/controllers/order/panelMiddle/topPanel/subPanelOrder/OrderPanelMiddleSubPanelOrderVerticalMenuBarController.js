(function (module) {
    cloudPOS.controllers = _.extend(module, {
        OrderPanelMiddleSubPanelOrderVerticalMenuBarController: function (scope, location, sessionManager, translate, $rootScope, localStorageService, keyboardManager, $idle, tmhDynamicLocale,
                                                    uiConfigService, $http) {
            scope.selectFoodItems = function(evnt, foodTypeId){
                scope.orderDataModule.filterFoodItems(foodTypeId);
                $(evnt.target).parent().find('button').removeClass('active');
                $(evnt.target).addClass('active');
            };
        }
    });
    cloudPOS.ng.application.controller('OrderPanelMiddleSubPanelOrderVerticalMenuBarController', [
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
        cloudPOS.controllers.OrderPanelMiddleSubPanelOrderVerticalMenuBarController
    ]).run(function ($log) {
        $log.info("OrderPanelMiddleSubPanelOrderVerticalMenuBarController initialized");
    });
}(cloudPOS.controllers || {}));