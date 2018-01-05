(function (module) {
    cloudPOS.controllers = _.extend(module, {
        OrderPanelMiddleSubPanelSplitController: function (scope, location, sessionManager, translate, $rootScope, localStorageService, keyboardManager, $idle, tmhDynamicLocale,
                                                    uiConfigService, $http) {
            scope.addedItems = [];//scope.orderDataModule.getFoodItemsArr.slice(0, scope.orderDataModule.getFoodItemsArr.length);
            scope.selectedItems = [];
            scope.orderDataModule.getSplitFoodItemsData(1);
            scope.clearSelectedItems = function() {
                scope.selectedItems = [];
            };

            scope.$watch('orderDataModule.selectedOrder', function(newEm, oldEm) {

            });

            function removeEqualObject(obj, arr) {
                for(var i = 0; i < arr.length; i++) {
                    if (arr[i] === obj) {
                        arr.splice(i, 1);
                    }
                }
            }
        }
    });
    cloudPOS.ng.application.controller('OrderPanelMiddleSubPanelSplitController', [
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
        cloudPOS.controllers.OrderPanelMiddleSubPanelSplitController
    ]).run(function ($log) {
        $log.info("OrderPanelMiddleSubPanelSplitController initialized");
    });
}(cloudPOS.controllers || {}));
