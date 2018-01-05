(function (module) {
    cloudPOS.controllers = _.extend(module, {
        HomeLeftPanelController: function (scope, location, sessionManager, translate, $rootScope, localStorageService, keyboardManager, $idle, tmhDynamicLocale,
                                  uiConfigService, $http, CloudDaoService, filterFilter,
                                  MasterDataStorageHandler, CommonMessages,
                                  TransactionHandlerService, ObjectFactoryService, ValidationService) {

            /// UI handlers goes here.
            /// UiHandlers global object
            /// scope.UiHandlers = {HomePageUi: {}};

            scope.LeftPanelDataModule = (function (dataModule, scope) {
                var DataModule = dataModule;

                DataModule.AdvanceDeposit = {
                    GuestID: 0,
                    Email: "",
                    FirstName: "",
                    LastName: "",
                    Title: "",
                    Remarks: "",
                    Description: "",
                    SelectedGuest: null,
                    CreateGuest: function (callback) {
                        if (DataModule.AdvanceDeposit.GuestID > 0 &&
                            DataModule.AdvanceDeposit.Email != ""
                            && DataModule.AdvanceDeposit.FirstName.length > 0 &&
                            DataModule.AdvanceDeposit.LastName.length > 0) {
                            let guestDto = ObjectFactoryService.Objects.Admin.GetGuestDto().guest;
                            let defaultAddressDto = ObjectFactoryService.Objects.Admin.GetGuestAddressDto();
                            guestDto.GuestId = DataModule.AdvanceDeposit.GuestID;
                            guestDto.Title = DataModule.AdvanceDeposit.Title;
                            guestDto.FirstName = DataModule.AdvanceDeposit.FirstName;
                            guestDto.LastName = DataModule.AdvanceDeposit.LastName;
                            guestDto.Mobile = DataModule.AdvanceDeposit.GuestID;
                            guestDto.PhoneNumber = DataModule.AdvanceDeposit.GuestID;
                            guestDto.Email = DataModule.AdvanceDeposit.Email;
                            guestDto.GuestAddressList = [defaultAddressDto];
                            guestDto.Description = DataModule.AdvanceDeposit.Description;

                            console.log(guestDto);

                            TransactionHandlerService.Execute.Guests.Create(function (response) {
                                if (callback !== undefined) {
                                    callback(response);
                                }

                                if (response.IsSuccessFull) {
                                    comSingleButttonSuccessAlert("Guest Creation", "Guest created successfully!", "Got it!");
                                }

                                console.log(response);
                            }, {guest: guestDto});
                        }
                        else if (DataModule.AdvanceDeposit.SelectedGuest != null) {
                            comSingleButtonErrorAlert("Guest Creation", "Guest already exists", "Got it!");
                        }
                        else if (!ValidationService.PhoneNumberValidation(DataModule.AdvanceDeposit.GuestID)) {
                            comSingleButtonErrorAlert("Guest Creation", "Please provide a valid phone number", "Got it!");
                        }
                        else {
                            comSingleButtonErrorAlert("Guest Creation", "Must provide all the required fields", "Got it!");
                        }
                    }
                };

                DataModule.UnfreazScreen = function () {

                };

                return DataModule;
            })(scope.LeftPanelDataModule || {}, scope);

            scope.HomeDataModule.LeftPanelDataModule = scope.LeftPanelDataModule;

            console.log(scope.LeftPanelDataModule);

            /// LeftPanel ui handlers
            scope.UiHandlers.HomePageUi.LeftPanel = {

                /// Toggles order details view and payment view.
                ToggleMainBodyArea: function () {
                    if (scope.UrlFactory.UrlHolders.HomePageLeftPanelBodyArea == scope.UrlFactory.UrlsObject.HomeViewLeftPanelOrderDetailDisplayView) {
                        /// scope.UrlFactory.UrlExchanger.HomePage.LeftPanel.PaymentOptions.ToCashView();
                        scope.UrlFactory.UrlExchanger.HomePage.LeftPanel.BodyArea.ToBillDisplayView();
                        /// scope.UrlFactory.UrlExchanger.HomePage.MiddlePanel.BodyArea.ToMultipleOptionsPanelView();
                        scope.UrlFactory.UrlExchanger.HomePage.MiddlePanel.BodyArea.ToPaymentPanelView();
                        scope.HomeDataModule.FlowHandlerVariables.isInPayment = true;
                    } else if (scope.UrlFactory.UrlHolders.HomePageLeftPanelBodyArea == scope.UrlFactory.UrlsObject.HomeViewLeftPanelBillDisplayingPanel ||
                        scope.UrlFactory.UrlHolders.HomePageLeftPanelBodyArea == scope.UrlFactory.UrlsObject.HomeViewLeftPanelGuestCreationPanel) {
                        scope.UrlFactory.UrlExchanger.HomePage.LeftPanel.BodyArea.ToOrderDetailView();
                        scope.UrlFactory.UrlExchanger.HomePage.MiddlePanel.BodyArea.ToOrderView();
                        scope.HomeDataModule.FlowHandlerVariables.isInPayment = false;
                    }
                },

                /// Toggles order view and split view.
                ToggleOrderSplit: function () {
                    if (scope.UrlFactory.UrlHolders.HomePageMiddlePanelBodyArea == scope.UrlFactory.UrlsObject.HomeViewMiddlePanelOrderView) {
                        scope.UrlFactory.UrlExchanger.HomePage.MiddlePanel.BodyArea.ToSplitView();
                    } else if (scope.UrlFactory.UrlHolders.HomePageMiddlePanelBodyArea == scope.UrlFactory.UrlsObject.HomeViewMiddlePanelSplitView) {
                        scope.UrlFactory.UrlExchanger.HomePage.MiddlePanel.BodyArea.ToOrderView();
                    }
                },

                ToDiscountPanel: function () {
                    if (scope.UrlFactory.UrlHolders.HomePageMiddlePanelBodyArea != scope.UrlFactory.UrlsObject.HomeViewMiddlePanelDiscountPanel) {
                        scope.UrlFactory.UrlExchanger.HomePage.MiddlePanel.BodyArea.ToDiscountView();
                        scope.UrlFactory.UrlExchanger.HomePage.LeftPanel.BodyArea.ToOrderDetailView();
                    }
                    else {
                        scope.UrlFactory.UrlExchanger.HomePage.LeftPanel.BodyArea.ToOrderDetailView();
                        scope.UrlFactory.UrlExchanger.HomePage.MiddlePanel.BodyArea.ToOrderView();
                    }
                },

                /// Defines the behavior of the save/payment button.
                SavePaymentButton: function () {

                    var selectedOrder = scope.HomeDataModule.SelectedOrder;
                    var orderCategories = scope.HomeDataModule.OrderCategories;
                    var flowHandlers = scope.HomeDataModule.FlowHandlerVariables;
                    console.log(scope.HomeDataModule.FlowHandlerVariables);
                    console.log(flowHandlers.isOrderSaveEnabled);
                    console.log(flowHandlers.isNewOrderEnabled);
                    console.log(flowHandlers.isOrderDetailsRemoveEnabled);
                    console.log(flowHandlers.isPrintReceiptEnabled);
                    console.log(flowHandlers.isPaymentEnabled);

                    if (scope.HomeDataModule.FlowHandlerVariables.isOrderSaveEnabled == false &&
                        scope.HomeDataModule.FlowHandlerVariables.isPaymentEnabled == true) {
                        scope.HomeDataModule.FlowHandlerVariables.isInPayment = true;
                         /// alert("Payment Enabled");
                        this.ToggleMainBodyArea();
                        return false;
                    }

                    console.log(scope.HomeDataModule.FlowHandlerVariables);

                    /// Send an update request to the server, if order already exists
                    if (scope.HomeDataModule.SelectedOrder.Order.OrderID != 0 && scope.HomeDataModule.SelectedOrder.Order.OrderID !== undefined) {
                        /// alert("Save Payment Update");
                        scope.HomeDataModule.UpdateOrder();
                        return false;
                    }

                    if (scope.HomeDataModule.SelectedOrder.Order.OrderID === undefined) {
                        /// alert("Payment");
                        this.ToggleMainBodyArea();
                        return false;
                    }

                    /// alert("Hit");

                    switch (selectedOrder.OrderCategory.Code) {
                        case orderCategories.DiningOrder.Code:
                            /// /// alert("Dining Order");
                            let guests = undefined;
                            let defaultGuest = undefined;

                            guests = JSON.parse(MasterDataStorageHandler.DataStorageHandler.GetAdminData()).Guests;

                            defaultGuest = filterFilter(guests, function (elem) {
                                return (elem.GuestId == 0);
                            });

                            if (defaultGuest !== undefined) {
                                scope.HomeDataModule.CreateOrder.CreateTakeoutOrder(function (response) {
                                    var orderID = response.Id;

                                    if (scope.HomeDataModule.SelectedOrder.OrderCategory ===
                                        scope.HomeDataModule.OrderCategories.DiningOrder &&
                                        scope.SystemSettings.SettingsDto.SystemSettings.CloseTableOrderOnSave.Value) {
                                        scope.HomeDataModule.DeselectOrder();
                                        return false;
                                    }

                                    scope.HomeDataModule.OrdersData.LoadOrders(scope.HomeDataModule.SelectedOrder.OrderCategory, function (orders) {
                                        let order = orders.find(function (elem) {
                                            return elem.OrderID == orderID;
                                        });

                                        if (order !== undefined) {
                                            scope.HomeDataModule.RightPanel.RetrieveOrderDetails(order, function (orderDetails) {
                                                console.log(scope.HomeDataModule.OrdersData.OrderCategory);
                                                if (orderDetails !== undefined &&
                                                    Array.isArray(orderDetails) &&
                                                    orderDetails.length > 0) {
                                                    /// Do Something!!!
                                                    /// alert("Order Saved Successfully");
                                                    console.log(scope.UiHandlers);
                                                    /// scope.UiHandlers.HomePageUi.LeftPanel.ToggleMainBodyArea();
                                                }
                                            });
                                        }
                                    });
                                });
                            }
                            else {
                                console.warn(CommonMessages.WarnMessages.defaultGuestNotFount);
                                return -1;
                            }
                            break;
                        case orderCategories.DeliveryOrder.Code:
                            /// alert("Delivery Order");
                            /*scope.UrlFactory.UrlExchanger.HomePage.MiddlePanel.BodyArea.NewOrderView.BodyArea.ToDeliveryOrderView();
                            scope.UrlFactory.UrlExchanger.HomePage.MiddlePanel.BodyArea.ToNewOrderView();*/

                            scope.HomeDataModule.CreateOrder.CreateTakeoutOrder(function (response) {
                                var orderID = response.Id;
                                /// alert("Order Created");

                                if (response.IsSuccessFull && !scope.SystemSettings.SettingsDto.SystemSettings.CloseDeliveryOrderOnSave.Value) {
                                    scope.HomeDataModule.LoadOrderDetails(orderID, scope.HomeDataModule.SelectedOrder.OrderCategory,
                                        function (orderDetails) {

                                        });
                                }
                                else if (response.IsSuccessFull) {
                                    comSingleButttonSuccessAlert("Delivery Order Created Successfully", "Delivery order created successfully." +
                                    " Order ID : " + response.Id, "Got it!");
                                    scope.HomeDataModule.DeselectOrder();
                                }
                            });

                            break;
                        case orderCategories.TakeoutOrder.Code:
                            /// alert("Takeout Orderrr");

                            scope.UrlFactory.UrlExchanger.HomePage.MiddlePanel.BodyArea.NewOrderView.BodyArea.ToTakeoutOrderView();
                            scope.UrlFactory.UrlExchanger.HomePage.MiddlePanel.BodyArea.ToNewOrderView();

                           /* $.Dialog({
                                title: "Takeout Order",
                                content: "Do You Want To Save The Order Or Directly Go To The Payments?",
                                actions: [
                                    {
                                        title: "Save",
                                        onclick: function(el){
                                            $(el).data('dialog').close();
                                            scope.UrlFactory.UrlExchanger.HomePage.MiddlePanel.BodyArea.NewOrderView.BodyArea.ToTakeoutOrderView();
                                            scope.UrlFactory.UrlExchanger.HomePage.MiddlePanel.BodyArea.ToNewOrderView();
                                        }
                                    },
                                    {
                                        title: "Payment",
                                        onclick: function (el) {
                                            $(el).data('dialog').close();
                                            scope.HomeDataModule.CreateOrder.CreateTakeoutOrder(function (response) {
                                                if (response.IsSuccessFull) {
                                                    let orderID = response.Id;

                                                    scope.HomeDataModule.OrdersData.LoadOrders(scope.HomeDataModule.OrderCategories.TakeoutOrder, function (orders) {
                                                        let order = orders.find(function (elem) {
                                                            return elem.OrderID == orderID;
                                                        });

                                                        if (order !== undefined) {
                                                            scope.HomeDataModule.RightPanel.RetrieveOrderDetails(order, function (orderDetails) {
                                                                if (orderDetails !== undefined &&
                                                                    Array.isArray(orderDetails) &&
                                                                    orderDetails.length > 0) {
                                                                    /// Do Something!!!
                                                                    /// alert("Order Saved Successfully");
                                                                    scope.UiHandlers.HomePageUi.LeftPanel.ToggleMainBodyArea();
                                                                }
                                                            });
                                                        }
                                                    });
                                                }

                                            });
                                        }
                                    }
                                ],
                                options: {
                                    "type": "info",
                                    "modal": false
                                }
                            });*/

                            break;
                        case orderCategories.TabOrder.Code:
                            /// alert("Tab Order");
                            scope.UrlFactory.UrlExchanger.HomePage.MiddlePanel.BodyArea.NewOrderView.BodyArea.ToTabOrderView();
                            scope.UrlFactory.UrlExchanger.HomePage.MiddlePanel.BodyArea.ToNewOrderView();

                       /*     $.Dialog({
                                title: "Tab Order",
                                content: "Do You Want To Save The Order Or Directly Go To The Payments?",
                                actions: [
                                    {
                                        title: "Save",
                                        onclick: function(el){
                                            $(el).data('dialog').close();
                                            scope.UrlFactory.UrlExchanger.HomePage.MiddlePanel.BodyArea.NewOrderView.BodyArea.ToTabOrderView();
                                            scope.UrlFactory.UrlExchanger.HomePage.MiddlePanel.BodyArea.ToNewOrderView();
                                        }
                                    },
                                    {
                                        title: "Payment",
                                        onclick: function (el) {
                                            $(el).data('dialog').close();
                                            scope.HomeDataModule.CreateOrder.CreateTakeoutOrder(function (response) {
                                                if (response.IsSuccessFull) {
                                                    let orderID = response.Id;

                                                    scope.HomeDataModule.OrdersData.LoadOrders(scope.HomeDataModule.OrderCategories.TabOrder, function (orders) {
                                                        let order = orders.find(function (elem) {
                                                            return elem.OrderID == orderID;
                                                        });

                                                        if (order !== undefined) {
                                                            scope.HomeDataModule.RightPanel.RetrieveOrderDetails(order, function (orderDetails) {
                                                                if (orderDetails !== undefined &&
                                                                    Array.isArray(orderDetails) &&
                                                                    orderDetails.length > 0) {
                                                                    /// Do Something!!!
                                                                    /// alert("Order Saved Successfully");
                                                                    scope.UiHandlers.HomePageUi.LeftPanel.ToggleMainBodyArea();
                                                                }
                                                            });
                                                        }
                                                    });
                                                }
                                            });
                                        }
                                    }
                                ],
                                options: {
                                    "type": "info",
                                    "modal": false
                                }
                            });*/

                            break;
                        default:
                    }
                }
            };

            /// Handles bottomMenu button's enable and disable behaviors
            /// according to flowHandlerVariables object's properties
            scope.$watch("HomeDataModule.FlowHandlerVariables", function (newVal) {
                /// alert("Flow handlers changed");

              BottomMenuHandler(newVal);
                /// /// alert("Flow Handler Variables Have Been Changed");

            }, true);

            scope.$watch("HomeDataModule.SelectedOrder.OrderDetails", function (newVal) {
                /// /// alert("Reference changed");
            });

            var BottomMenuHandler = function (newVal) {
                if (newVal.isPrintReceiptEnabled) {
                    $("#LeftPanelBottomMenuPrintBtn").removeAttr("disabled");
                }
                else {
                    $("#LeftPanelBottomMenuPrintBtn").attr("disabled", "");
                }

                if (newVal.isReorderEnabled) {
                    $("#LeftPanelBottomMenuReorderBtn").removeAttr("disabled");
                }
                else {
                    $("#LeftPanelBottomMenuReorderBtn").attr("disabled", "");
                }

                if (newVal.isSplitEnabled) {
                    $("#LeftPanelBottomMenuSplitOrderBtn").removeAttr("disabled");
                }
                else {
                    $("#LeftPanelBottomMenuSplitOrderBtn").attr("disabled", "");
                }

                if (newVal.isPaymentEnabled
                    || newVal.isOrderSaveEnabled) {
                    $("#LeftPanelBottomMenuSavePaymentBtn").removeAttr("disabled");

                    if (newVal.isPaymentEnabled) {

                        $("#LeftPanelBottomMenuSavePaymentBtn").find("span").removeClass("mif-floppy-disk");
                        $("#LeftPanelBottomMenuSavePaymentBtn").find("span").addClass("mif-money");
                    }
                    else {
                        $("#LeftPanelBottomMenuSavePaymentBtn").find("span").removeClass("mif-money");
                        $("#LeftPanelBottomMenuSavePaymentBtn").find("span").addClass("mif-floppy-disk");
                    }
                }
                else {
                    $("#LeftPanelBottomMenuSavePaymentBtn").removeAttr("disabled");
                    $("#LeftPanelBottomMenuSavePaymentBtn").find("span").removeClass("mif-floppy-disk");
                    $("#LeftPanelBottomMenuSavePaymentBtn").find("span").addClass("mif-money");
                    /// $("#LeftPanelBottomMenuSavePaymentBtn").attr("disabled", "");
                }
            };

            scope.LeftPanelDataModule = (function (dataModule, scope) {
                var DataModule = dataModule;

                DataModule.Reorder = (function (dataModule) {
                    var Reorder = {};
                    var FoodItems = (function () {

                    })();
                    var AddNewOrderDetail = scope.HomeDataModule.AddNewOrderDetail;
                    var CurrentOrderID = (scope.HomeDataModule.SelectedOrder.Order.OrderID !== undefined) ?
                        scope.HomeDataModule.SelectedOrder.Order.OrderID : 0;
                    console.log(scope.HomeDataModule.SelectedOrder.Order);

                    var RetrieveReorderingItems = function (callback, orderID) {
                        var reorderingItems = [];

                        TransactionHandlerService.Execute.Reorder.ReadAll(function (response) {
                            if (response.OrderDetailResponse !== undefined) {
                                console.log(response);
                                reorderingItems = response.OrderDetailResponse;
                                callback(reorderingItems);
                            }
                            else {
                                console.error("Unexpected response");
                            }
                        }, orderID);
                    };

                    var RetrieveFoodItems = function () {
                        let foods = JSON.parse(MasterDataStorageHandler.DataStorageHandler.GetMasterFoodsData()).FoodItems;
                        return (foods !== undefined && Array.isArray(foods)) ? foods : [];
                    };

                    Reorder.Reorder = function () {
                        let reorderingItems = [];
                        let reorderingFoodItems = [];
                        let currentOrderID = (scope.HomeDataModule.SelectedOrder.Order.OrderID !== undefined) ?
                            scope.HomeDataModule.SelectedOrder.Order.OrderID : 0;
                        let foodItems = RetrieveFoodItems();

                        RetrieveReorderingItems(function (items) {
                            if (items !== undefined && Array.isArray(items)) {
                                console.log(CurrentOrderID);
                                console.log(items);
                                items.forEach(function (reorderingItem) {

                                    console.log("Reordering Item");
                                    console.log(reorderingItem);
                                    console.log(foodItems);
                                    foodItems.forEach(function(foodItem){
                                        if (reorderingItem.FoodId == foodItem.FoodId) {
                                            /// alert("Found");
                                            reorderingFoodItems.push(foodItem);
                                        }
                                    });
                                });

                                reorderingFoodItems.forEach(function (foodItem) {
                                    scope.HomeDataModule.AddNewOrderDetail(foodItem, true);
                                });
                            }
                        }, currentOrderID);
                    };

                    return Reorder;
                })(DataModule);

                /// Init
                (function () {
                    BottomMenuHandler(scope.HomeDataModule.FlowHandlerVariables);
                })();

                return DataModule;
            })(scope.LeftPanelDataModule || {}, scope);
        }
    });
    cloudPOS.ng.application.controller('HomeLeftPanelController', [
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
        'MasterDataStorageHandler',
        'CommonMessages',
        'TransactionHandlerService',
        'ObjectFactoryService',
        'ValidationService',
        cloudPOS.controllers.HomeLeftPanelController
    ]).run(function ($log) {
        $log.info("HomeLeftPanelController initialized");
    });
}(cloudPOS.controllers || {}));
