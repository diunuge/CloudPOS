(function (module) {
    cloudPOS.controllers = _.extend(module, {
        HomeLeftPanelPricingController: function (scope, translate, $rootScope,
                                                             uiConfigService, UrlFactory,
                                                             MasterDataStorageHandler, filterFilter,
                                                             TransactionHandler, ObjectFactoryService, CommonMessages) {
            ///
            scope.HomeLeftPanelPricingDataModule = (function (scope) {
                var DataModule = {};

                /// Multiple payment array
                var MultiplePayment = scope.HomeDataModule.SelectedOrder.MultiplePayment;
                var CurrentOrder = scope.HomeDataModule.SelectedOrder.Order;

                /// Summary of selected orders
                DataModule.OrderSummary = scope.HomeDataModule.SelectedOrder.PricesSummary;

                 /*{
                    NetTotal: 0,
                    TaxTotal: 0,
                    GrandTotal: 0,
                    DiscountTotal: 0,
                    ServiceChargeTotal: 0
                 };*/

                var SetSummary = function (order) {
                    DataModule.OrderSummary.NetTotal += order.NetPrice;
                    DataModule.OrderSummary.TaxTotal += order.TaxPrice;
                    DataModule.OrderSummary.DiscountTotal += Number(order.LineDiscountPrice) +
                    Number(order.DiscountPrice);
                    DataModule.OrderSummary.GrandTotal += order.TotalPrice;
                    DataModule.OrderSummary.NoOfItems += order.TotItem;
                };

                var ClearSummary = function () {
                    DataModule.OrderSummary.NetTotal = 0;
                    DataModule.OrderSummary.TaxTotal = 0;
                    DataModule.OrderSummary.DiscountTotal = 0;
                    DataModule.OrderSummary.GrandTotal = 0;
                    DataModule.OrderSummary.NoOfItems = 0;
                };

                /// Watch for multiple orders
                scope.$watch(()=>{return MultiplePayment}, function (newVal) {

                    if (newVal !== undefined && Array.isArray(newVal) && newVal.length > 0) {
                        ClearSummary();
                        SetSummary(CurrentOrder);
                        MultiplePayment.forEach(function (elem) {
                            SetSummary(elem);
                        });
                    }
                    else {
                        ClearSummary();
                        SetSummary(CurrentOrder);
                    }

                    console.log("__________________________________");
                    console.log(DataModule.OrderSummary);
                }, true);

                return DataModule;
            })(scope);
        }
    });
    cloudPOS.ng.application.controller('HomeLeftPanelPricingController', [
        '$scope',
        '$translate',
        '$rootScope',
        'UIConfigService',
        'UrlFactory',
        'MasterDataStorageHandler',
        'filterFilter',
        'TransactionHandlerService',
        'ObjectFactoryService',
        'CommonMessages',
        cloudPOS.controllers.HomeLeftPanelPricingController
    ]).run(function ($log) {
        $log.info("HomeLeftPanelPricingController initialized");
    });
}(cloudPOS.controllers || {}));
