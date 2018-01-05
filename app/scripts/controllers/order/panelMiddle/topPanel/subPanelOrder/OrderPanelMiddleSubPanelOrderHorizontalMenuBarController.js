(function (module) {
    cloudPOS.controllers = _.extend(module, {
        OrderPanelMiddleSubPanelOrderHorizontalMenuBarController: function (scope, location, sessionManager, translate, $rootScope, localStorageService, keyboardManager, $idle, tmhDynamicLocale,
                                                    uiConfigService, $http) {
            scope.selectCategory = function(evnt, catId){
                $(evnt.target).parent().parent().find('.btn-success').removeClass('active');
                $(evnt.target).addClass('active');
                scope.orderDataModule.filterFoodTypes(catId);
                if(scope.orderDataModule.filteredFoodTypesAr.length>0) {
                    scope.orderDataModule.filterFoodItems(scope.orderDataModule.filteredFoodTypesAr[0].FoodTypeId);
                }
            };
        }
    });
    cloudPOS.ng.application.controller('OrderPanelMiddleSubPanelOrderHorizontalMenuBarController', [
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
        cloudPOS.controllers.OrderPanelMiddleSubPanelOrderHorizontalMenuBarController
    ]).run(function ($log) {
        $log.info("OrderPanelMiddleSubPanelOrderHorizontalMenuBarController initialized");
    });
}(cloudPOS.controllers || {}));