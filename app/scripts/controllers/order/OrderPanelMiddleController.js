(function (module) {
    cloudPOS.controllers = _.extend(module, {
        OrderPanelMiddleController: function (scope, location, sessionManager, translate, $rootScope, localStorageService, keyboardManager, $idle, tmhDynamicLocale,
                                            uiConfigService, $http, CloudDaoService, filterFilter) {
            scope.odrViewSplitArr = {
                order: 'views/order/panelMiddle/splitOrder/subPanelOrderView.html',
                split: 'views/order/panelMiddle/splitOrder/subPanelSplitView.html',
                newOrder: 'views/order/panelMiddle/splitOrder/subPanelNewOrderView.html'
            };
            // scope.panelMiddleHeaderTextChangeVal("Order Panel");
            scope.odrViewSplitOrder = scope.odrViewSplitArr.order;
            var orderSplitAr = ['Split', 'Order'];
            scope.odrBtnViewSplitOrderVal = orderSplitAr[0];
            scope.odrToggleMiddleView = function(){
                if(scope.odrBtnViewSplitOrderVal.toLowerCase() == orderSplitAr[1].toLowerCase()){
                    scope.odrBtnViewSplitOrderVal = orderSplitAr[0];
                    scope.odrViewSplitOrder = scope.odrViewSplitArr.order;
                }
                else if(scope.odrBtnViewSplitOrderVal.toLowerCase() == orderSplitAr[0].toLowerCase()){
                    scope.odrBtnViewSplitOrderVal = orderSplitAr[1];
                    scope.odrViewSplitOrder = scope.odrViewSplitArr.split;
                }
                scope.orderLeftPanelUiHandler.ToggleMainView(0);
            };


            scope.odrToggleMiddleViewWithNewOrder = function(toggleLeft, pageName) {
                if(typeof(toggleLeft) == "undefined" && typeof(pageName) == "undefined") {
                    toggleLeft = true;
                    pageName = "N";
                }
                scope.odrBtnViewSplitOrderVal = orderSplitAr[1];
                scope.odrViewSplitOrder = scope.odrViewSplitArr.newOrder;
                scope.panelMiddleHeaderTextChangeVal("New Order");
                if(toggleLeft == true) {
                    //scope.orderLeftPanelUiHandler.ToggleMainView(1);
                }
            };

            scope.odrSetNewOrderPanelFunc(function(){scope.odrToggleMiddleViewWithNewOrder();});

            // Get Food data from the server
            scope.odrFoodsData = {};
            function getData(data){
                scope.odrFoodsData = data;
                scope.odrFilterFoodTypes(scope.odrFoodsData.foodCat[0].catId);
                scope.odrFilterFoodItems(scope.odrFoodTypes[0].foodTypeId);
            }
            CloudDaoService.GetMethod(getData, "json/foodTypes2.txt");

            scope.odrFoodTypes = [];
            scope.odrFilterFoodTypes = function(catId){
                scope.odrFoodItems = []; // Empty the food items area after clicking on the food cat buttons
                scope.odrFoodTypes = filterFilter(scope.odrFoodsData.foodTypes, function(obj, index, array){
                    var state = false;
                    if(obj.belongingCats.indexOf(catId)!=-1){
                        state = true;
                    }
                    return state;
                });
            };

            scope.odrFoodItems = [];
            scope.odrFilterFoodItems = function(catId){
                scope.odrFoodItems = filterFilter(scope.odrFoodsData.foodItems, function(obj, index, array){
                    var state = false;
                    if(obj.belongingFoodTypes.indexOf(catId)!=-1){
                        state = true;
                    }
                    return state;
                });
            };
        }
    });
    cloudPOS.ng.application.controller('OrderPanelMiddleController', [
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
        'CloudDaoService',
        'filterFilter',
        cloudPOS.controllers.OrderPanelMiddleController
    ]).run(function ($log) {
        $log.info("OrderPanelMiddleController initialized");
    });
}(cloudPOS.controllers || {}));
