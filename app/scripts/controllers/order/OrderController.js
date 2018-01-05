(function (module) {
    cloudPOS.controllers = _.extend(module, {
        OrderController: function (scope, location, sessionManager, translate, $rootScope, localStorageService, keyboardManager, $idle, tmhDynamicLocale,
                                   uiConfigService, $http, CloudDaoService, filterFilter, LoadingScreenService) {
            scope.orderDataModule = new (function (scope, cloudDaoService, filterFilter) {
                this.headerText = "";
                this.foodCategoriesAr = [];
                this.foodTypesAr = [];
                this.foodItemsAr = [];
                this.ordersAr = [];
                this.refreshOrders = function () {
                };
                this.filterOrders = function (orderType) {
                };
                this.filterFoodTypes = function (foodCatId) {
                };
                this.filterFoodItems = function (foodTypes) {
                };
                this.filteredOrdersAr = [];
                this.filteredFoodTypesAr = [];
                this.filteredFoodItemsAr = [];
                this.selectedOrder = {order: {}, foodItems: []};
                this.guestsSelectedVal = "T";
                this.selectOrderFunc = function (orderId) {
                };
                this.addFoodItem = function (foodItemId) {
                };
                this.removeFoodItem = function (foodItemId) {
                };
                this.saveSelectedOrder = function () {
                };
                this.getSplitArrayOfSelectedOrder = function () {
                };
                this.getUnsplittedFoodItems = function () {
                };
                this.saveFoodItems = function () {
                };
                this.foodItemState = {};

                // new properties and methods //
                this.getOrdersData = function (orderType) {
                };
                this.getFoodItemsData = function (orderId) {
                };
                // State Values //
                this.getOrderTypes = {tableOrder: 'N', takeoutOrder: 'T', deliveryOrder: 'D', tabOrder: 'F'};
                this.getOrderItemState = {newlyAdded: -1, removed: -2, edited: -3};
                this.getSelectedOrder = null; //expired
                this.getOrderTypeCache = ""; //expired
                this.getNoOfGuests = 1;

                // Arrays //
                this.getOrdersArr = [];
                this.foodItemsForSelectedOrder = []; // selected Food Items
                this.getSplitFoodItemsArr = [];

                this.DataStore = {
                    FoodCategoriesAr: [], // OK
                    FoodTypesAr: [], // OK
                    FoodItemsAr: [], // OK
                    SelectedOrdersAr: [], // OK
                    SelectedFoodItemsAr: [], // OK
                    SelectedOrderType: "", // OK
                    SelectedOrder: null, // OK
                    SelectedReservation: null
                };

                function _MajorFoodsDataLoader(This) {
                    var tempFoodData;
                    var func = function (data) {

                        if (data != null) {

/*                            This.foodCategoriesAr = data.FoodCategories;
                            This.foodTypesAr = data.FoodTypes;
                            This.foodItemsAr = data.FoodItems;*/
                            This.DataStore.FoodCategoriesAr = data.FoodCategories;
                            This.DataStore.FoodTypesAr = data.FoodTypes;
                            This.DataStore.FoodItemsAr = data.FoodItems;
                            console.log('Data Loaded OrderDataModule, Loaded Data : Food Categories, Food Types, Food Items');
                            if (This.DataStore.FoodCategoriesAr.length < 1) {
                                console.log("There are no FoodCategories: orderDataModule");
                                alert();
                                return -1;
                            }
                            scope.BrowserCacheHandler.AddObject({
                                Object: {
                                    FoodCategories: data.FoodCategories,
                                    FoodTypes: data.FoodTypes,
                                    FoodItems: data.FoodItems
                                },
                                Name: "MajorFoodsDataCaching",
                                Controller: "OrderController"
                            });
                        } else {
                            let temp = scope.BrowserCacheHandler.GetObject("MajorFoodsDataCaching");
                            This.DataStore.FoodCategoriesAr = temp.Object.FoodCategories;
                            This.DataStore.FoodTypesAr = temp.Object.FoodTypes;
                            This.DataStore.FoodItemsAr = temp.Object.FoodItems;
                        }

                        $(document).ready(function () {
                            This.filterFoodTypes(This.DataStore.FoodCategoriesAr[0].CategoryId);
                            // This.filterFoodItems(This.filteredFoodTypesAr[0].FoodTypeId);
                        });
                    };

                    // Caching Major Data //
                    // CachingName - MajorFoodsDataCaching

                    if (scope.BrowserCacheHandler.GetObject("MajorFoodsDataCaching") == -1) {
                        var credentials = scope.BrowserCacheHandler.GetCachedCredentialsFromMemory();
                        var data = {
                            "authenticationTicket": {
                                "SessionKey": credentials.SessionKey,
                                "RestaurantID": credentials.RestaurantID,
                                "UserId": credentials.UserId
                            }
                        };
                        cloudDaoService.JsonPostMethod(func, data, encodeURI("http://45.35.4.156:3232/OrderService.svc/GetAllFoodsData"), true, "circleLoader");
                    } else {
                        func(null);
                    }
                }


                this.filterFoodTypes = function (foodCategoryId) {
                    var odrFoodTypesTemp = filterFilter(this.DataStore.FoodTypesAr, function (obj, index, array) {
                        var state = false;
                        if (obj.CategoryId == foodCategoryId) {
                            state = true;
                        }
                        return state;
                    });
                    // alert(this.filterFoodItems);
                    this.filteredFoodTypesAr = odrFoodTypesTemp;
                    if (odrFoodTypesTemp.length !== undefined && odrFoodTypesTemp.length > 0) {
                        this.filterFoodItems(odrFoodTypesTemp[0].FoodTypeId);
                    } else {
                        this.filteredFoodItemsAr = [];
                    }
                };

                this.filterFoodItems = function (foodTypeId) {
                    let odrFoodItemsTemp = filterFilter(this.DataStore.FoodItemsAr, function (obj, index, array) {
                        var state = false;
                        if (obj.FoodTypeId == foodTypeId) {
                            state = true;
                        }
                        return state;
                    });
                    this.filteredFoodItemsAr = odrFoodItemsTemp;
                };


                this.addFoodItem = function (foodItemId, guestNo) {
                    (function (This, id, guestNo) {
                        for (var i = 0; i < This.DataStore.FoodItemsAr.length; i++) {
                            if (This.DataStore.FoodItemsAr[i].FoodId == id) {
                                /*      This.selectedOrder.foodItems.push({itemId:This.selectedOrder.foodItems.length, foodItem:This.DataStore.FoodItemsAr[i], c:guestNo, invoiceId: This.foodItemState.newlyAdded()});*/

                                let temp = This.DataStore.FoodItemsAr[i];
                                let newOrderDetail = Object.assign(temp);
                                newOrderDetail.NewOrderDetail = "";
                                console.log(newOrderDetail);
                                This.DataStore.SelectedFoodItemsAr.push(newOrderDetail);
                  /*              This.DataStore.SelectedFoodItemsAr.push({
                                    orderDetailId: This.getOrderItemState.newlyAdded,
                                    FoodId: temp.FoodId,
                                    foodName: temp.FoodName,
                                    splitId: -1,
                                    price: temp.Price,
                                    cover: guestNo
                                });*/
                            }
                        }
                    })(this, foodItemId, guestNo);
                };

                this.removeFoodItem = function (index) {

                    for (var i = 0; i < this.DataStore.SelectedFoodItemsAr.length; i++) {

                        if (index == i && "NewOrderDetail" in this.DataStore.SelectedFoodItemsAr[i]) {

                            this.DataStore.SelectedFoodItemsAr.splice(i, 1);
                            break;
                        }
                    }
                };

                this.saveFoodItems = function () {
                    var newlyAddedItems = [];
                    var foodItems = this.DataStore.SelectedFoodItemsAr;

                    for (var i = 0; i < foodItems.length; i++) {
                        if (foodItems[i].orderDetailId == this.getOrderItemState.newlyAdded) {
                            newlyAddedItems.push(foodItems[i]);
                            //alert(newlyAddedItems[0].orderDetailId);
                        }
                    }
                };

                /*                this.foodItemState = (function () {
                 var unsplitted = -1;
                 var newlyAdded = -2;
                 var deleted = -3;

                 function gett() {
                 this.unsplitted = function () {
                 return unsplitted;
                 };
                 this.newlyAdded = function () {
                 return newlyAdded;
                 };
                 this.deleted = function () {
                 return deleted;
                 };
                 }

                 return new gett();
                 })();*/

                this.getOrdersData = function (orderType) {
                    var func = (function (This) {
                        return function (data) {
                            //This.DataStore.SelectedOrdersAr = data.OrderHeaderResponse.slice(0, data.OrderHeaderResponse.length);
                            This.DataStore.SelectedOrdersAr = data.OrderHeaderResponse;
                            This.getFoodItemsData(This.DataStore.SelectedOrdersAr[0].OrderID);

                        };
                    })(this);
                    var credentials = scope.BrowserCacheHandler.GetCachedCredentialsFromMemory();
                    var data = {
                        "authenticationTicket": {
                            "SessionKey": credentials.SessionKey,
                            "RestaurantID": credentials.RestaurantID,
                            "UserId": credentials.UserId
                        },
                        "orderTypeName": orderType
                    };
                    cloudDaoService.JsonPostMethod(func, data, "http://45.35.4.156:3232/OrderService.svc/GetAllOrders");
                    this.DataStore.SelectedOrderType = orderType;
                };

                this.getFoodItemsData = function (orderId) {
                    var func = (function (This) {
                        return function (data) {
                            This.DataStore.SelectedFoodItemsAr = data.OrderDetailResponse;
                            for (let i = 0; i < This.DataStore.SelectedOrdersAr.length; i++) {
                                if (This.DataStore.SelectedOrdersAr[i].OrderID == orderId) {
                                    This.DataStore.SelectedOrder = This.DataStore.SelectedOrdersAr[i];
                                    /// This.getNoOfGuests = This.DataStore.SelectedOrder.noOfGuests;
                                    ///console.log(This.DataStore.SelectedOrder);
                                    break;
                                }
                            }
                        };
                    })(this);
                    var credentials = scope.BrowserCacheHandler.GetCachedCredentialsFromMemory();
                    var data = {
                        "authenticationTicket": {
                            "SessionKey": credentials.SessionKey,
                            "RestaurantID": credentials.RestaurantID,
                            "UserId": credentials.UserId
                        },
                        "orderID": orderId
                    };

                    cloudDaoService.JsonPostMethod(func, data, "http://45.35.4.156:3232/OrderService.svc/GetAllOrderDetails", true);
                    /*                    var temp = {"data":""};
                     cloudDaoService.JsonPostMethod(func, temp,"http://45.35.4.156:8888/CloudPosService.svc/GetFoodDetails");*/
                };

                this.getSplitFoodItemsData = function (orderId) {
                    var func = (function (This) {
                        return function (data) {
                            This.getSplitFoodItemsArr = data.splits;
                        };
                    })(this);
                    cloudDaoService.GetMethod(func, "json/splits.json");
                };

                // Set HeaderText value for middlePanel of the orderPanel
                scope.$watch('orderDataModule.DataStore.SelectedOrder', function (newVal, oldVal) {
                    if (scope.orderDataModule.DataStore.SelectedOrder == undefined) {
                        return false;
                    }
                    var OrderID = -1;
                    switch (scope.orderDataModule.DataStore.SelectedOrderType) {
                        case scope.orderDataModule.getOrderTypes.tableOrder:
                            OrderID = scope.orderDataModule.DataStore.SelectedOrder.OrderID;
                            TableNo = scope.orderDataModule.DataStore.SelectedOrder.TableNo;
                            scope.orderDataModule.headerText = "Order ID : " + OrderID + " Table No : " + TableNo;
                            break;
                        case scope.orderDataModule.getOrderTypes.deliveryOrder:
                            OrderID = scope.orderDataModule.DataStore.SelectedOrder.OrderID;
                            //let DeliveryID = scope.orderDataModule.DataStore.SelectedOrder.DeliveryID;
                            scope.orderDataModule.headerText = "Order ID : " + OrderID + " Delivery Order";
                            break;
                        case scope.orderDataModule.getOrderTypes.tabOrder:
                            OrderID = scope.orderDataModule.DataStore.SelectedOrder.OrderID;
                            //let TabID = scope.orderDataModule.DataStore.SelectedOrder.TabID;
                            scope.orderDataModule.headerText = "Order ID : " + OrderID + " Tab Order";
                            break;
                        case scope.orderDataModule.getOrderTypes.takeoutOrder:
                            OrderID = scope.orderDataModule.DataStore.SelectedOrder.OrderID;
                            //let TakeoutID = scope.orderDataModule.DataStore.SelectedOrder.TakeoutID;
                            scope.orderDataModule.headerText = "Order ID : " + OrderID + " Takeout Order";
                            break;
                        default :
                            break;
                    }
                    // alert(scope.orderDataModule.DataStore.SelectedOrder.TableNo);
                });

                this.createNewOrder = function(orderType) {
                    if(this.DataStore.SelectedOrderType == "N") {return -1;}
                    if(!(orderType == "T" || orderType == "F" || orderType == "D")) {return -1;}

                    this.DataStore.SelectedOrder = {
                        NewOrder: "",
                        OrderID: "New Order",
                        OrderType: orderType
                    };
                };

                this.createNewReservation = function() {
                    this.DataStore.SelectedReservation = {
                        NewReservation: ""
                    };
                };

                // Initializer
                (function _InitializerFunc(This) {
                    _MajorFoodsDataLoader(This);
                    This.getOrdersData('N');
                })(this);

            })(scope, CloudDaoService, filterFilter);


            scope.odrMiddleViewNewOrder = undefined;
            scope.odrShowNewOrderPanel = function () {
                if (scope.odrMiddleViewNewOrder != undefined) {
                    scope.odrMiddleViewNewOrder();
                }
            };
            scope.odrSetNewOrderPanelFunc = function (func) {
                if (func != undefined) {
                    scope.odrMiddleViewNewOrder = func;
                }
            };

            scope.panelMiddleHeaderText = "";
            scope.panelMiddleHeaderTextChangeVal = function (val) {
                scope.panelMiddleHeaderText = val;
            };

            scope.orderLeftPanelUiHandler = new (function(){
                var _this = this;
                var _mainViewUrlsAr = [
                    "views/order/panelLeft/panelLeft/subViewOneView.html",
                    "views/order/panelLeft/panelLeft/subViewTwoView.html"
                ];
                var _toggleMainView = function(urlID) {
                    if(urlID === undefined || urlID >= _mainViewUrlsAr.length) {
                        urlID = 0;
                    }
                        _this.SelectedMainView = _mainViewUrlsAr[urlID];
                };
                this.SelectedMainView = _mainViewUrlsAr[0];
                this.ToggleMainView = (indx)=>{_toggleMainView(indx);};
            })();

            scope.buttonDisableHandler = new (function(scope){
                var This = this;
                var _DisableState = {disabled: "disabled", enabled: ""};
//buttonDisableHandler.DisableMiddlePanelGuestCountWidget
                This.DisableLeftPanelSaveBtn = _DisableState.disabled;
                This.DisableLeftPanelPaymentBtn = _DisableState.enabled;
                This.DisableMiddlePanelReorderBtn = _DisableState.disabled;
                This.DisableMiddlePanelSplitBtn = (scope.orderDataModule.DataStore.SelectedOrderType == "N")?_DisableState.enabled: _DisableState.disabled;
                This.DisableMiddlePanelGuestCountWidget = This.DisableMiddlePanelSplitBtn;

                scope.$watch("orderDataModule.DataStore.SelectedFoodItemsAr", function (newVal, oldVal) {
                    if (newVal !== undefined || newVal != null) {
                        var newElem = newVal.find(function (elem, indx, arr) {
                            if ("NewOrderDetail" in elem) {
                                return elem;
                            }
                        });
                        if (newElem !== undefined && scope.orderDataModule.DataStore.SelectedOrder != null && scope.orderDataModule.DataStore.SelectedOrder !== undefined) {
                            This.DisableLeftPanelSaveBtn = _DisableState.enabled;
                            This.DisableLeftPanelPaymentBtn = _DisableState.disabled;
                            This.DisableMiddlePanelReorderBtn = _DisableState.disabled;
                            if(scope.orderDataModule.DataStore.SelectedOrderType == "N") {
                                This.DisableMiddlePanelSplitBtn = _DisableState.disabled;
                            }
                        } else if (scope.orderDataModule.DataStore.SelectedOrder != null && scope.orderDataModule.DataStore.SelectedOrder !== undefined) {
                            This.DisableLeftPanelSaveBtn = _DisableState.disabled;
                            This.DisableLeftPanelPaymentBtn = _DisableState.enabled;
                            This.DisableMiddlePanelReorderBtn = _DisableState.enabled;
                            if(scope.orderDataModule.DataStore.SelectedOrderType == "N") {
                                This.DisableMiddlePanelSplitBtn = _DisableState.enabled;
                            }
                        }
                        This.DisableMiddlePanelGuestCountWidget = (scope.orderDataModule.DataStore.SelectedOrderType == "N")?_DisableState.enabled:_DisableState.disabled;
                    }

                }, true);

                scope.$watch("orderDataModule.DataStore.SelectedOrderType", function(newVal, oldVal) {
                    This.DisableMiddlePanelSplitBtn = (scope.orderDataModule.DataStore.SelectedOrderType == "N") ? _DisableState.enabled : _DisableState.disabled;
                    This.DisableMiddlePanelGuestCountWidget = This.DisableMiddlePanelSplitBtn;
                });

                scope.$watch("orderDataModule.DataStore.SelectedOrder", function(newVal, oldVal){

                });


            })(scope);

        }
    });
    cloudPOS.ng.application.controller('OrderController', [
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
        'LoadingScreenService',
        cloudPOS.controllers.OrderController
    ]).run(function ($log) {
        $log.info("OrderController initialized");
    });
}(cloudPOS.controllers || {}));