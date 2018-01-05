(function (module) {
    cloudPOS.controllers = _.extend(module, {
        BillDisplayPanelController: function (scope, sessionManager, $rootScope, localStorageService, $idle, uiConfigService,
                                          $http, filterFilter, MasterDataStorageHandler,
                                          CommonMessages, TransactionHandler, ObjectFactoryService) {

            scope.BillDataModule = (function (scope) {
                var DataModule = {};
                var CurrentOrder = scope.HomeDataModule.SelectedOrder.Order;

                DataModule.BillSummary = {
                    Quantity: 0,
                    GrandTotal: 0,
                    NetTotal: 0,
                    DiscountTotal: 0,
                    TaxTotal: 0,
                    ServiceChargeTotal: 0
                };

                DataModule.OrderDetailsList = [];

                var UpdateBillSummary = function (order) {
                    DataModule.BillSummary.Quantity += order.TotalItems;
                    DataModule.BillSummary.GrandTotal += order.TotalPrice;
                    DataModule.BillSummary.NetTotal += order.NetPrice;
                    DataModule.BillSummary.DiscountTotal += order.DiscountPrice;
                    DataModule.BillSummary.ServiceChargeTotal += order.ServiceChargePrice;
                    DataModule.BillSummary.TaxTotal += order.TaxPrice;
                };

                var ClearBillSummary = function () {
                    DataModule.BillSummary.Quantity = 0;
                    DataModule.BillSummary.GrandTotal = 0;
                    DataModule.BillSummary.NetTotal = 0;
                    DataModule.BillSummary.DiscountTotal = 0;
                    DataModule.BillSummary.ServiceChargeTotal = 0;
                    DataModule.BillSummary.TaxTotal = 0;
                };

                var FoodItemsList = (function () {
                    return JSON.parse(MasterDataStorageHandler.DataStorageHandler.GetMasterFoodsData()).FoodItems;
                })();

                /// Load order details from the server
                var LoadOrderDetails = function (ordersList) {

                    var orderDetails = [];
                    DataModule.OrderDetailsList = orderDetails;

                    for (let i = 0; i < ordersList.length; i++) {
                        TransactionHandler.Execute.Order.ReadById(function (response) {
                            /// console.error(response);

                            for (let i1 = 0; i1 < response.OrderDetailResponseDto.length; i1++) {

                                if (response.OrderDetailResponseDto[i1].Status.trim() == "D" ||
                                    response.OrderDetailResponseDto[i1].Status.trim() == "S") {
                                    continue;
                                }

                                let foodItem = FoodItemsList.find(function (elem) {
                                    return (elem.FoodId == response.OrderDetailResponseDto[i1].FoodID);
                                });

                                if (foodItem !== undefined) {

                                    let orderDetail = Object.assign({}, foodItem, response.OrderDetailResponseDto[i1]);
                                    orderDetails.push(orderDetail);
                                }
                            }

                           /// DataModule.OrderDetailsList = DataModule.OrderDetailsList.concat(response.OrderDetailResponseDto);
                        }, ordersList[i].OrderID);
                    }
                };

                var MultipleOrdersWatchCallback = function (newVal) {

                    /// alert("Multiple Payment");
                    if (newVal !== undefined && Array.isArray(newVal) && newVal.length > 0) {
                        ClearBillSummary();
                        for (let i = 0; i < newVal.length; i++) {
                            UpdateBillSummary(newVal[i]);
                        }

                        LoadOrderDetails(newVal);
                    }
                    else if (Array.isArray(newVal) && newVal.length == 0) {
                        ClearBillSummary();
                        UpdateBillSummary(CurrentOrder);
                        LoadOrderDetails([CurrentOrder]);
                    }
                };

                scope.$watch("HomeDataModule.SelectedOrder.MultipleOrders", MultipleOrdersWatchCallback, true);

                scope.$watch("HomeDataModule.SelectedOrder.MultipleOrders", function (newVal) {
                    if (newVal !== undefined && Array.isArray(newVal)) {
                        MultipleOrdersWatchCallback(newVal);
                    }
                });

                return DataModule;
            })(scope);
        }
    });
    cloudPOS.ng.application.controller('BillDisplayPanelController', [
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
        'ObjectFactoryService',
        cloudPOS.controllers.BillDisplayPanelController
    ]).run(function ($log) {
        $log.info("BillDisplayPanelController initialized");
    });
}(cloudPOS.controllers || {}));
