(function (module) {
    cloudPOS.controllers = _.extend(module, {
        OrderPanelMiddleSubPanelOrderController: function (scope, location, sessionManager, translate, $rootScope, localStorageService, keyboardManager, $idle, tmhDynamicLocale,
                                                    uiConfigService, $http) {
            (function(){
                try {
                    let odm = $scope.orderDataModule;
                    odm.filterFoodTypes(odm.foodCategoriesAr[0].catId);
                    odm.filterFoodItems(odm.filteredFoodTypesAr[0].foodTypeId);
                } catch(ex) {

                }
            })();
        }
    });
    cloudPOS.ng.application.controller('OrderPanelMiddleSubPanelOrderController', [
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
        cloudPOS.controllers.OrderPanelMiddleSubPanelOrderController
    ]).run(function ($log) {
        $log.info("OrderPanelMiddleSubPanelOrderController initialized");
    });
}(cloudPOS.controllers || {}));