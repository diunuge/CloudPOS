(function (module) {
    cloudPOS.controllers = _.extend(module, {
        OrderPanelMiddleSubPanelSplitTopMenuController: function (scope, location, sessionManager, translate, $rootScope, localStorageService, keyboardManager, $idle, tmhDynamicLocale,
                                                    uiConfigService, $http) {

            function SplitObject()
            {
                this.invoiceId = "New";
                this.orderId = null;
                this.totalAmount = 0;
                this.splitFoods = [];
            }

            // Creates a new split item from the selected items
            scope.btnSplitClick = function() {
                var splitObj = new SplitObject();
                splitObj.orderId = scope.orderDataModule.getSelectedOrder.orderId;
                for (let item in scope.selectedItems) {
                    let indx = scope.selectedItems[item];
                    // alert($scope.addedItems[indx].price);
                    splitObj.splitFoods.push(scope.addedItems[indx]);
                    splitObj.totalAmount += scope.addedItems[indx].price;
                }

                scope.selectedItems.sort((a, b)=>a - b);// [1,2,3,6]
                for (let i = 0; i < scope.selectedItems.length; i++) {
                    //alert($scope.selectedItems[i]);
                    let indx = scope.selectedItems[i];
                    if (i < scope.selectedItems.length - 1) {
                        // $scope.selectedItems[i + 1] -= i;
                    }
                    scope.addedItems.splice(indx - i, 1);

                    // alert(item);
                }
                scope.clearSelectedItems();
                scope.orderDataModule.getSplitFoodItemsArr.push(splitObj);
            };

            scope.btnSplitAllClick = function() {
                var coverLength = (scope.orderDataModule.getSelectedOrder.noOfGuests + 1) || 1;

                for(let i1 = 0; i1 < coverLength; i1++) {
                    let temp = new SplitObject();
                    let guestTemp = (i1==0)?'T':i1;
                    for(let i2 = 0; i2 < scope.addedItems.length; i2++) {
                        if(scope.addedItems[i2].cover === guestTemp) {
                            temp.splitFoods.push(scope.addedItems[i2]);
                            temp.totalAmount += scope.addedItems[i2].price;
                            scope.addedItems.splice(i2, 1);
                            i2 -= 1;
                        }
                    }
                    if(temp.splitFoods.length > 0) {
                        scope.orderDataModule.getSplitFoodItemsArr.push(temp);
                    }
                }
            };
        }
    });
    cloudPOS.ng.application.controller('OrderPanelMiddleSubPanelSplitTopMenuController', [
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
        cloudPOS.controllers.OrderPanelMiddleSubPanelSplitTopMenuController
    ]).run(function ($log) {
        $log.info("OrderPanelMiddleSubPanelSplitTopMenuController initialized");
    });
}(cloudPOS.controllers || {}));