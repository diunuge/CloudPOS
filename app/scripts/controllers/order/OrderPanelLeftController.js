(function (module) {
    cloudPOS.controllers = _.extend(module, {
        OrderPanelLeftController: function (scope, location, sessionManager, translate, $rootScope, localStorageService, keyboardManager, $idle, tmhDynamicLocale,
                                   uiConfigService, $http) {
            scope.odrLftContentArr = [
                "views/order/panelLeft/panelLeft/subViewOne/addedItemsTableView.html",
                "views/order/panelLeft/panelLeft/subViewOne/paymentView.html"
            ];
            scope.odrLftContentTab = scope.odrLftContentArr[0];
            var paymentAddedListBtnTextArr = ['Payment', 'Items'];
            scope.odrLftPaymentAddedListBtnText = paymentAddedListBtnTextArr[0];
            scope.odrLftToggleContentTab = function(){
                if(scope.odrLftPaymentAddedListBtnText.toUpperCase() == paymentAddedListBtnTextArr[0].toUpperCase()){
                    scope.odrLftPaymentAddedListBtnText = paymentAddedListBtnTextArr[1];
                    scope.odrLftContentTab = scope.odrLftContentArr[1];
                }else{
                    scope.odrLftPaymentAddedListBtnText = paymentAddedListBtnTextArr[0];
                    scope.odrLftContentTab = scope.odrLftContentArr[0];
                }
            };


        }
    });
    cloudPOS.ng.application.controller('OrderPanelLeftController', [
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
        cloudPOS.controllers.OrderPanelLeftController
    ]).run(function ($log) {
        $log.info("OrderPanelLeftController initialized");
    });
}(cloudPOS.controllers || {}));
