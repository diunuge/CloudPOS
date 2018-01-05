(function (module) {
    cloudPOS.controllers = _.extend(module, {
        OrderPanelMiddleSubPanelOrderFilteredItemsGuestsBarController: function (scope, location, sessionManager, translate, $rootScope, localStorageService, keyboardManager, $idle, tmhDynamicLocale,
                                                    uiConfigService, $http) {
            scope.noOfGuests = scope.orderDataModule.getNoOfGuests;
            scope.selectedVal = scope.orderDataModule.guestsSelectedVal;

            scope.$watch('selectedVal', function(newVal, oldVal){
                scope.orderDataModule.guestsSelectedVal = newVal;
            });

            scope.$watch('orderDataModule.getNoOfGuests', function(newVal, oldVal){
                //alert();
               // scope.noOfGuests = newVal;
            });
        }
    });
    cloudPOS.ng.application.controller('OrderPanelMiddleSubPanelOrderFilteredItemsGuestsBarController', [
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
        cloudPOS.controllers.OrderPanelMiddleSubPanelOrderFilteredItemsGuestsBarController
    ]).run(function ($log) {
        $log.info("OrderPanelMiddleSubPanelOrderFilteredItemsGuestsBarController initialized");
    });
}(cloudPOS.controllers || {}));