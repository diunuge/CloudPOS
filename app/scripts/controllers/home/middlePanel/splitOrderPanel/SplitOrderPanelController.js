(function (module) {
    cloudPOS.controllers = _.extend(module, {
        SplitOrderPanelController: function (scope, translate, $rootScope,
                                           uiConfigService, $http, $filter, UrlFactory,
                                           MasterDataStorageHandler, filterFilter, TransactionHandler, ObjectFactoryService, CommonMessages) {
            scope.SplitItems = [];
            scope.OrderedFoodItems = (scope.HomeDataModule.SelectedOrder.OrderDetails) ? scope.HomeDataModule.SelectedOrder.OrderDetails : [];

            /// Temporarily holds one element that is to be added into the SplitItems array
            var SplitItemsTemp = [];

            var TotalAmount = 0;

            /// Split the selected items
            scope.Split = function () {

                if (SplitItemsTemp.length > 0) {

                    /// console.warn(SplitItemsTemp);

                    /// Remove split items from the OrderedFoodItems array
                    let reducedArray = scope.OrderedFoodItems.reduce(function (acc, elem) {

                        if (acc == null) {
                            acc = [];
                        }

                        for (let i = 0; i < SplitItemsTemp.length; i++) {
                            if (elem.OrderDetailID == SplitItemsTemp[i].OrderDetailID) {
                                break;
                            } else if (i == SplitItemsTemp.length - 1) {
                                acc.push(elem);
                            }
                        }

                        return acc;
                    }, null);

                    console.warn(reducedArray);

                    reducedArray = (Array.isArray(reducedArray)) ? reducedArray : [reducedArray];

                    scope.OrderedFoodItems = reducedArray;

                    scope.SplitItems.push({Items: SplitItemsTemp, TotalAmount: TotalAmount});
                    SplitItemsTemp = [];
                    TotalAmount = 0;
                }
            };

            /// Select items which are to be split.
            scope.SelectItem = function (item) {

                if (item) {

                    for (let i = 0; i < SplitItemsTemp.length; i++) {

                        if (SplitItemsTemp[i] === item) {
                            alert("Remove");
                            TotalAmount -= Number(item.Price);
                            SplitItemsTemp.splice(i, 1);
                            item = undefined;
                            break;
                        }
                    }

                    if (item != undefined) {
                        TotalAmount += Number(item.Price);
                        SplitItemsTemp.push(item);
                    }
                }
            };
        }
    });
    cloudPOS.ng.application.controller('SplitOrderPanelController', [
        '$scope',
        '$translate',
        '$rootScope',
        'UIConfigService',
        '$http',
        '$filter',
        'UrlFactory',
        'MasterDataStorageHandler',
        'filterFilter',
        'TransactionHandlerService',
        'ObjectFactoryService',
        'CommonMessages',
        cloudPOS.controllers.SplitOrderPanelController
    ]).run(function ($log) {
        $log.info("SplitOrderPanelController initialized");
    });
}(cloudPOS.controllers || {}));
