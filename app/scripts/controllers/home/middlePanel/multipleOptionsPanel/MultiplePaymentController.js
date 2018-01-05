(function (module) {
    cloudPOS.controllers = _.extend(module, {
        MultiplePaymentController: function (scope, sessionManager, $rootScope, localStorageService, $idle, uiConfigService,
                                             $http, filterFilter, MasterDataStorageHandler, CommonMessages, TransactionHandler) {
            scope.MultiplePaymentDataModule = (function (multiplePayment) {

                var DataModule = {};

                DataModule.DiningOrders = [];

                DataModule.TakeoutOrders = [];

                DataModule.DeliveryOrders = [];

                DataModule.TabOrders = [];

                DataModule.LoadOrders = (function (dataModule) {
                    var OrderCategories = scope.HomeDataModule.OrderCategories;
                    var LoadDiningOrders = function () {
                        TransactionHandler.Execute.Order.ReadByOrderCategoryId(function (response) {
                            dataModule.DiningOrders = response.OrderHeaderResponse;
                            console.log(response);
                        }, OrderCategories.DiningOrder.OrderCategoryId);
                    };

                    var LoadTakeoutOrders = function () {
                        TransactionHandler.Execute.Order.ReadByOrderCategoryId(function (response) {
                            dataModule.TakeoutOrders = response.OrderHeaderResponse;
                        }, OrderCategories.TakeoutOrder.OrderCategoryId);
                    };

                    var LoadDeliveryOrders = function () {
                        TransactionHandler.Execute.Order.ReadByOrderCategoryId(function (response) {
                            dataModule.DeliveryOrders = response.OrderHeaderResponse;
                        }, OrderCategories.DeliveryOrder.OrderCategoryId);
                    };

                    var LoadTabOrders = function () {
                        TransactionHandler.Execute.Order.ReadByOrderCategoryId(function (response) {
                            dataModule.TabOrders = response.OrderHeaderResponse;
                        }, OrderCategories.TabOrder.OrderCategoryId);
                    };

                    return function () {
                        LoadDeliveryOrders();
                        LoadDiningOrders();
                        LoadTabOrders();
                        LoadTakeoutOrders();
                    };
                })(DataModule);

                DataModule.OrderManipulation = (function () {
                    var orderManip = {};

                    var OrderUiManip = function (e) {
                        let elem = $(e.currentTarget);

                        if (elem.attr("selected") === undefined) {
                            elem.css("background-color", "lightblue");
                            elem.attr("selected", "");
                        }
                        else {
                            elem.css("background-color", "");
                            elem.removeAttr("selected");
                        }
                    };

                    orderManip.OrderClick = function (e, order) {
                        OrderUiManip(e);
                        console.log(order);

                        let foundOrder = multiplePayment.find(function (elem) {
                            return (elem === order);
                        });

                        if (foundOrder === undefined) {
                            multiplePayment.push(order);
                        }
                        else {
                            for (let i = 0; i < multiplePayment.length; i++) {
                                if (multiplePayment[i] === foundOrder) {
                                    multiplePayment.splice(i, 1);
                                }
                            }
                        }
                    };

                    return orderManip;
                })();

                return DataModule;
            })(scope.HomeDataModule.SelectedOrder.MultiplePayment);

            /// Initializes the module
            (function () {

                scope.MultiplePaymentDataModule.LoadOrders();
            })();
        }
    });
    cloudPOS.ng.application.controller('MultiplePaymentController', [
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
        'TransactionHandlerService',
        cloudPOS.controllers.MultiplePaymentController
    ]).run(function ($log) {
        $log.info("MultiplePaymentController initialized");
    });
}(cloudPOS.controllers || {}));
