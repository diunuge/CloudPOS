(function (module) {
    cloudPOS.controllers = _.extend(module, {
        MultipleOptionsPanelController: function (scope, sessionManager, $rootScope, localStorageService, $idle, uiConfigService,
                                           $http, filterFilter, MasterDataStorageHandler, CommonMessages) {

            scope.MultipleOptionsPanelDataModule = (function (multiplePayment) {
                var DataModule = {};

                DataModule.NavigationHandler = {
                    ToMultiplePayment: function () {
                        console.log(multiplePayment);
                        console.log(scope);
                        scope.UrlFactory.UrlExchanger.HomePage.MiddlePanel.BodyArea.MultipleOptionsPanelView.BodyArea.ToMultiplePaymentView();
                    },

                    ToDiscount: function () {
                        if (!(multiplePayment.length > 0)) {
                            scope.UrlFactory.UrlExchanger.HomePage.MiddlePanel.BodyArea.MultipleOptionsPanelView.BodyArea.ToDiscountPanelView();
                        }
                        else {
                            if (confirm("Do you want to close multiple payment")) {
                                multiplePayment.splice(0, multiplePayment.length);
                                scope.UrlFactory.UrlExchanger.HomePage.MiddlePanel.BodyArea.MultipleOptionsPanelView.BodyArea.ToDiscountPanelView();
                            }
                        }
                    },

                    ToAdvanceDeposit: function () {
                        if (!(multiplePayment.length > 0)) {
                            scope.UrlFactory.UrlExchanger.HomePage.MiddlePanel.BodyArea.MultipleOptionsPanelView.BodyArea.ToAdvanceDepositView();
                        }
                        else {
                            if (confirm("Do you want to close multiple payment")) {
                                multiplePayment.splice(0, multiplePayment.length);
                                scope.UrlFactory.UrlExchanger.HomePage.MiddlePanel.BodyArea.MultipleOptionsPanelView.BodyArea.ToAdvanceDepositView();
                            }
                        }
                    }
                };

                return DataModule;
            })(scope.HomeDataModule.SelectedOrder.MultiplePayment);
        }
    });
    cloudPOS.ng.application.controller('MultipleOptionsPanelController', [
        '$scope',
        'SessionManager',
        '$rootScope',
        'localStorageService',
        '$idle',
        'UIConfigService',
        '$http',
        'filterFilter',
        'MasterDataStorageHandler',
        'CommonMessages',
        cloudPOS.controllers.MultipleOptionsPanelController
    ]).run(function ($log) {
        $log.info("MultipleOptionsPanelController initialized");
    });
}(cloudPOS.controllers || {}));
