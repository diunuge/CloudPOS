(function (module) {
    cloudPOS.controllers = _.extend(module, {
        WastageRightPanelTopPanelController: function (scope, location, sessionManager, translate, $rootScope, localStorageService, keyboardManager, $idle, tmhDynamicLocale,
                                             uiConfigService, $http) {
            scope.uiHandlers.noOfItemsToAdd = 1;
            scope.uiHandlers.addSelectedToWastage = function() {
                if(scope.uiHandlers.selectedFoodItemId != null) {
                    scope.wastageDataModule.addItemToWastage(scope.uiHandlers.selectedFoodItemId, scope.uiHandlers.noOfItemsToAdd);
                    //$scope.uiHandlers.selectedFoodItemId = null;
                    scope.uiHandlers.noOfItemsToAdd = 1;
                } else {
                    console.log("Trying to add a foodItem without selecting one");
                }
            };
        }
    });
    cloudPOS.ng.application.controller('WastageRightPanelTopPanelController', [
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
        cloudPOS.controllers.WastageRightPanelTopPanelController
    ]).run(function ($log) {
        $log.info("WastageRightPanelTopPanelController initialized");
    });
}(cloudPOS.controllers || {}));
