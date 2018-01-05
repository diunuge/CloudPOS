(function (module) {
    cloudPOS.controllers = _.extend(module, {
        OrderPanelLeftPaymentMainController: function (scope, location, sessionManager, translate, $rootScope, localStorageService, keyboardManager, $idle, tmhDynamicLocale,
                                            uiConfigService, $http) {

            scope.odrLftPaymentOptionsTabsPathAr = [
                "views/order/panelLeft/panelLeft/subViewOne/payment/paymentOptionsTab/cashPaymentView.html",
                "views/order/panelLeft/panelLeft/subViewOne/payment/paymentOptionsTab/creditCardPaymentView.html",
                "views/order/panelLeft/panelLeft/subViewOne/payment/paymentOptionsTab/chequePaymentView.html",
                "views/order/panelLeft/panelLeft/subViewOne/payment/paymentOptionsTab/cityLedgerPaymentView.html",
                "views/order/panelLeft/panelLeft/subViewOne/payment/paymentOptionsTab/dutyMealPaymentView.html",
                "views/order/panelLeft/panelLeft/subViewOne/payment/paymentOptionsTab/advancePaymentView.html"
            ];
            scope.odrLftPaymentOptionPath = scope.odrLftPaymentOptionsTabsPathAr[0];
            scope.odrLftPaymentInforText = "Cash Payment :";
            var paymentOptionsTextAr = [
                "cashPayment",
                "creditCardPayment",
                "chequePayment",
                "cityLedgerPayment",
                "dutyMealPayment",
                "advancePayment"
            ];
            scope.odrLftPaymentSelectOption = function(evnt, option) {
                switch (option.toUpperCase()){
                    case paymentOptionsTextAr[0].toUpperCase():
                        scope.odrLftPaymentOptionPath = scope.odrLftPaymentOptionsTabsPathAr[0];
                        $(evnt.target.parentNode.parentNode).find('button').removeClass('active');
                        $(evnt.target).addClass('active');
                        scope.odrLftPaymentInforText = "Cash Payment :";
                        break;
                    case paymentOptionsTextAr[1].toUpperCase():
                        scope.odrLftPaymentOptionPath = scope.odrLftPaymentOptionsTabsPathAr[1];
                        $(evnt.target.parentNode.parentNode).find('button').removeClass('active');
                        $(evnt.target).addClass('active');
                        scope.odrLftPaymentInforText = "Credit Card Payment :";
                        break;
                    case paymentOptionsTextAr[2].toUpperCase():
                        scope.odrLftPaymentOptionPath = scope.odrLftPaymentOptionsTabsPathAr[2];
                        $(evnt.target.parentNode.parentNode).find('button').removeClass('active');
                        $(evnt.target).addClass('active');
                        scope.odrLftPaymentInforText = "Cheque Payment :";
                        break;
                    case paymentOptionsTextAr[3].toUpperCase():
                        scope.odrLftPaymentOptionPath = scope.odrLftPaymentOptionsTabsPathAr[3];
                        $(evnt.target.parentNode.parentNode).find('button').removeClass('active');
                        $(evnt.target).addClass('active');
                        scope.odrLftPaymentInforText = "City Ledger Payment :";
                        break;
                    case paymentOptionsTextAr[4].toUpperCase():
                        scope.odrLftPaymentOptionPath = scope.odrLftPaymentOptionsTabsPathAr[4];
                        $(evnt.target.parentNode.parentNode).find('button').removeClass('active');
                        $(evnt.target).addClass('active');
                        scope.odrLftPaymentInforText = "Duty Meal Payment :";
                        break;
                    case paymentOptionsTextAr[5].toUpperCase():
                        scope.odrLftPaymentOptionPath = scope.odrLftPaymentOptionsTabsPathAr[5];
                        $(evnt.target.parentNode.parentNode).find('button').removeClass('active');
                        $(evnt.target).addClass('active');
                        scope.odrLftPaymentInforText = "Advance Payment :";
                        break;
                    default :
                        scope.odrLftPaymentOptionPath = scope.odrLftPaymentOptionsTabsPathAr[0];
                        $(evnt.target.parentNode.parentNode).find('button').removeClass('active');
                        $(evnt.target).addClass('active');
                        scope.odrLftPaymentInforText = "Cash Payment :";
                        break;
                }
            };

        }
    });
    cloudPOS.ng.application.controller('OrderPanelLeftPaymentMainController', [
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
        cloudPOS.controllers.OrderPanelLeftPaymentMainController
    ]).run(function ($log) {
        $log.info("OrderPanelLeftPaymentMainController initialized");
    });
}(cloudPOS.controllers || {}));
