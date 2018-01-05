(function (module) {
    cloudPOS.controllers = _.extend(module, {
        OrderPanelRightFilteredItemsController: function (scope, location, sessionManager, translate, $rootScope, localStorageService, keyboardManager, $idle, tmhDynamicLocale,
                                                    uiConfigService, $http, filterFilter) {
            scope.selectOrderedItem = function (evnt, orderId) {
                scope.orderDataModule.getFoodItemsData(orderId);
            };

            // Filter orders to differentiate between reservations and other orders
            scope.filteredOrders = [];
            scope.IsOrder = (scope.orderDataModule.DataStore.SelectedOrderType != "N");
            var _resID = 0;

            _FilterOrders = function () {
                scope.filteredOrders = filterFilter(scope.orderDataModule.DataStore.SelectedOrdersAr, function (obj, indx, arr) {
                    if (obj.ReservationID == 0) {
                        return true;
                    } else if (obj.ReservationID > 0) {
                        if (_resID == obj.ReservationID) {
                            return false;
                        } else {
                            if(obj.ReservationID != 0) {
                                _resID = obj.ReservationID;
                            }
                            return true;
                        }
                    }
                });
            };

            scope.newButtonAction = function(action) {
                switch(action){
                    case "N":
                        scope.odrShowNewOrderPanel();
                        scope.orderLeftPanelUiHandler.ToggleMainView(1);
                        break;
                    case "T":
                        scope.odrShowNewOrderPanel();
                        scope.orderDataModule.createNewOrder("T");
                        break;
                    case "D":
                        scope.orderDataModule.createNewOrder("D");
                        break;
                    case "F":
                        scope.orderDataModule.createNewOrder("F");
                        break;
                    default:
                }
            };

            scope.$watch("orderDataModule.DataStore.SelectedOrdersAr", function (newVal, oldVal) {
                scope.IsOrder = (scope.orderDataModule.DataStore.SelectedOrderType != "N");
                if(scope.orderDataModule.DataStore.SelectedOrderType == "N") {
                    _FilterOrders();
                } else {
                    scope.filteredOrders = scope.orderDataModule.DataStore.SelectedOrdersAr;
                }
            });
        }
    });
    cloudPOS.ng.application.controller('OrderPanelRightFilteredItemsController', [
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
        'filterFilter',
        cloudPOS.controllers.OrderPanelRightFilteredItemsController
    ]).run(function ($log) {
        $log.info("OrderPanelRightFilteredItemsController initialized");
    });
}(cloudPOS.controllers || {}));
