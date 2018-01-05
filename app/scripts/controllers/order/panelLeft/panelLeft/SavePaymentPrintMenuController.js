(function (module) {
    cloudPOS.controllers = _.extend(module, {
        SavePaymentPrintMenuController: function (scope, location, sessionManager, translate, $rootScope, localStorageService, keyboardManager, $idle, tmhDynamicLocale,
                                                   uiConfigService, $http) {
           /*         this.getSelectedOrder = null;
            this.getOrderTypeCache = "";*/

            scope.disablePaymentBtn = "disabled";
            scope.saveOrderOnClick = function () {};


            (function(scope) {
     /*            scope.$watch("orderDataModule.DataStore.SelectedOrder", function (newVal, oldVal) {
                 if(newVal !== undefined || newVal != null) {

                 }
                 });
                var _DisableState = {disabled: "disabled", enabled: ""};
                scope.disableSaveBtn = _DisableState.disabled;
                scope.$watch("orderDataModule.DataStore.SelectedFoodItemsAr", function (newVal, oldVal) {
                    if (newVal !== undefined || newVal != null) {
                        var newElem = newVal.find(function (elem, indx, arr) {
                            if ("NewOrderDetail" in elem) {
                                return elem;
                            }
                        });
                        if (newElem !== undefined && scope.orderDataModule.DataStore.SelectedOrder != null && scope.orderDataModule.DataStore.SelectedOrder !== undefined) {
                            // custom code goes here
                            scope.disableSaveBtn = _DisableState.enabled;
                            scope.disablePaymentBtn = _DisableState.disabled;
                        } else if (scope.orderDataModule.DataStore.SelectedOrder != null && scope.orderDataModule.DataStore.SelectedOrder !== undefined) {
                            scope.disableSaveBtn = _DisableState.disabled;
                            scope.disablePaymentBtn = _DisableState.enabled;
                        }
                    }
                }, true);*/
            })(scope);
        }
    });
    cloudPOS.ng.application.controller('SavePaymentPrintMenuController', [
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
        cloudPOS.controllers.SavePaymentPrintMenuController
    ]).run(function ($log) {
        $log.info("SavePaymentPrintMenuController initialized");
    });
}(cloudPOS.controllers || {}));

