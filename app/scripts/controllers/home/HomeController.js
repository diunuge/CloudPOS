(function (module) {
    cloudPOS.controllers = _.extend(module, {
        HomeController: function (scope, $rootScope, localStorageService,
                                     uiConfigService, $http, CloudDaoService,
                                     filterFilter, MasterDataStorageHandler, BillCalculations02,
                                     TransactionHandlerService, CommonMessages, $mdDialog) {

            /// Operations that involve data manipulation goes here.
            scope.HomeDataModule = new (function() {

                var HomeModuleThis = this;

                /// Contains current orders related to the user.
                this.CurrentOrders = [];

                /// console.error(scope.SystemSettings);

                /// Used to handle selected order.
                /// Temporarily cache order's data in the memory for a new order.
                this.SelectedOrder = {
                    OrderCategory: "",
                    Order: {},
                    Reservation: {ReservationID: 0},
                    OrderDetails: [],
                    MultipleOrders: [],
                    Splits: [],
                    Payments: [],
                    GuestDetails: {},
                    GuestAddressList: [],
                    CoverNumber: "0",
                    PricesSummary: {
                        NoOfItems: "0",
                        NetTotal: "0",
                        ServiceCharge: "0",
                        TaxTotal: "0",
                        DiscountTotal: "0",
                        GrandTotal: "0"
                    }
                };

                this.FreezScreen = function () {
                    scope.Navigation.DisableNavigationButtons = true;
                };

                this.UnfreezScreen = function () {
                    HomeModuleThis.SelectedOrder.Order = {};
                    HomeModuleThis.SelectedOrder.OrderDetails = [];
                    scope.UrlFactory.UrlExchanger.HomePage.MiddlePanel.BodyArea.ToOrderView();
                    scope.UrlFactory.UrlExchanger.HomePage.LeftPanel.BodyArea.ToOrderDetailView();
                    scope.Navigation.DisableNavigationButtons = false;
                };

                /// Perform tax calculation on orders, food items
                this.BillCalculations = (function () {
                    var billCal = {};
                    var isInit = false;
                    var ServiceCharge = {};
                    var Taxes = [];
                    var TaxCodes = [];
                    var Discounts = [];

                    var Init = function () {

                        /// Retrieve service charge
                        var serviceCharge = JSON.parse(MasterDataStorageHandler.DataStorageHandler.GetAdminData()).ServiceCharge;
                        console.log("__________________________________");
                        console.log(serviceCharge);
                        ServiceCharge = (serviceCharge !== undefined && Array.isArray(serviceCharge)) ? serviceCharge[0] : {
                            Rate: 0,
                            ScId: 0
                        };

                        /// Retrieve taxes
                        var taxes = JSON.parse(MasterDataStorageHandler.DataStorageHandler.GetAdminData()).Taxes;
                        Taxes = (taxes !== undefined && Array.isArray(taxes)) ? taxes : [];

                        /// Retrieve discounts
                        var discounts = JSON.parse(MasterDataStorageHandler.DataStorageHandler.GetAdminData()).Discounts;
                        Discounts = (discounts !== undefined && Array.isArray(discounts)) ? discounts : [];

                        var taxCodes = JSON.parse(MasterDataStorageHandler.DataStorageHandler.GetAdminData()).TaxCodes;
                        TaxCodes = (taxCodes !== undefined && Array.isArray(taxCodes)) ? taxCodes : [];
                    };

                    billCal.Calculate = function () {
                        if (isInit == false) {
                            Init();
                            isInit = true;
                        }

                        var order = $.extend({}, HomeModuleThis.SelectedOrder.Order);
                        var orderDetails = filterFilter(HomeModuleThis.SelectedOrder.OrderDetails, function (elem) {
                            return (elem.OrderDetailID == 0);
                        });

                        orderDetails = (orderDetails === undefined) ? [] : orderDetails;

                        order.TotalItems = orderDetails.length;

                        BillCalculations02.SetOrder(order, orderDetails);
                        BillCalculations02.SetDiscounts(Discounts);
                        /// billCalculation.SetTaxes(DataModule.Taxes);
                        BillCalculations02.SetTaxes(TaxCodes);
                        BillCalculations02.SetServiceCharge(ServiceCharge);
                        BillCalculations02.Execute();

                        SetPricesSummary(HomeModuleThis.SelectedOrder.Order, order);
                    };

                    return billCal;
                })();

                /// Defines JSON format for Order, OrderDetails, Split, Payments
                this.DataFormat = {};

                /// Order json format
                /// The OrderId of a new order is 0.
                this.DataFormat.Order = {
                    OrderID: "0",
                    GuestID: "0",
                    ReservationId: "0",
                    ResId: "2000",
                    NetPrice: "0",
                    DiscountID: 0,
                    DiscountPrice: "0",
                    TaxID: "0",
                    TaxPrice: "0",
                    VatClaimID: "0",
                    VatClaimPrice: "0",
                    ServiceChargeID: "0",
                    ServiceChargePrice: "0",
                    TotalPrice: "0",
                    TotItem: "0",
                    OrderType: "T",
                    Status: "1",
                    UserId: "1",
                    TableNo: "0",
                    OrderCancellationReason: "null",
                    CancelUserID: "0",
                    IsBillDiscountEnabled: "false",
                    DeliveryCharges: "0",
                    LineDiscountPrice: "0",
                    OrderToken: "null",
                    IsHeaderServiceChargeOn: "false"
                };

                /// OrderDetail json format - foodItem
                this.DataFormat.OrderDetail = {
                    "OrderDetailID": "0",
                    "OrderID": "0",
                    "FoodId": 0,
                    "ItemId": 0,
                    "GuestID": "0",
                    "ResId": "2000",
                    "Quantity": "1",
                    "NetPrice": 0,
                    "DiscountID": 0,
                    "DiscountPrice": "0",
                    "TaxID": "0",
                    "TaxPrice": 0,
                    "VatClaimID": "0",
                    "VatClaimPrice": "0",
                    "ServiceChargeID": 0,
                    "ServiceChargePrice": 0,
                    "TotalPrice": 0,
                    "Remarks": "",
                    "Status": "C",
                    "Tag": "0",
                    "IsCompliment": "false",
                    "UserId": 0,
                    "OrderReservationID": "0",
                    "LineDiscountID": "0",
                    "LineDiscountPrice": "0",
                    "CoverNumber": "0",
                    "ModifierRefID": "0",
                    "IsNet": "false",
                    "IsLineVatOn": "true",
                    "IsLineOtherTaxOn": "true",
                    "IsLineServiceChargeOn": "true",
                    "IsDayEnd": "false",
                    "IsQuantityBasedOrder": "false",
                    "FoodSize": "1",
                    "FoodPrice": 0,
                    "IsModifier": "false",
                    "FoodName": ""
                };

                /// Guest information
                this.DataFormat.Guest = {
                    "GuestID": "0",
                    "Title": "1",
                    "Description": "",
                    "FirstName": "",
                    "LastName": "",
                    "Mobile": "",
                    "Email": "",
                    "Status": "1",
                    "IsNewGuest": "false",
                    "OrderType": "",
                    "SelectedAddressID": "0",
                    "RiderID": "0",
                    "GuestAddressList": null,
                    "FoodComment": ""
                };

                /// Contains address information of the guest.
                this.DataFormat.GuestAddress = {
                    "AddressID": "0",
                    "GuestId": "0",
                    "Location": "",
                    "Address1": "No 384, New Negombo Road,",
                    "Address2": "Wattala, Negombo",
                    "City": "Wattala",
                    "State": "Wattala",
                    "PostalCodeID": "0",
                    "Country": "",
                    "WorkPlace": "",
                    "ZoneCode": "10250",
                    "DeliveryRate": "10",
                    "IsSelected": "false",
                    "Status": "1"
                };

                /// Handles the data flow.
                /// Data flow handling variables.
                /// These variables are used to disable or enable components of the UI. These limitations are only applicable
                /// in the home panel
                this.FlowHandlerVariables = {
                    isPaymentEnabled: true,
                    isSplitEnabled: true,
                    isPrintReceiptEnabled: true,
                    isReorderEnabled: true,
                    isNewOrderEnabled: true,
                    isOrderDetailsRemoveEnabled: true,
                    isOrderSaveEnabled: true,
                    isInPayment: false
                };

                /// Holds order categories and their corresponding IDs
                this.OrderCategories = {
                    DiningOrder: {Code: "N", Name: "Dining Order", OrderCategoryId: "0"},
                    TakeoutOrder: {Code: "F", Name: "Takeout Order", OrderCategoryId: "1"},
                    DeliveryOrder: {Code: "D", Name: "Delivery Order", OrderCategoryId: "3"},
                    TabOrder: {Code: "T", Name: "Tab Order", OrderCategoryId: "2"}
                };

                /// Enable properties to be accessed withing inner functions.
                var selectedOrder = this.SelectedOrder;
                var flowHandlerVariables = this.FlowHandlerVariables;

                var SetPricesSummary = function (newVal, secondVal) {
                    /// console.log("___________________________________");
                    /// console.log(secondVal);
                    /// console.log(secondVal.NetPrice);
                    scope.HomeDataModule.SelectedOrder.PricesSummary.NetTotal = Number(newVal.NetPrice) + ((secondVal === undefined) ? 0 : Number(secondVal.NetPrice));
                    scope.HomeDataModule.SelectedOrder.PricesSummary.ServiceCharge = newVal.ServiceChargePrice + ((secondVal === undefined) ? 0 : secondVal.ServiceChargePrice);
                    scope.HomeDataModule.SelectedOrder.PricesSummary.GrandTotal = newVal.TotalPrice + ((secondVal === undefined) ? 0 : secondVal.TotalPrice);
                    scope.HomeDataModule.SelectedOrder.PricesSummary.NoOfItems = newVal.TotalItems + ((secondVal === undefined) ? 0 : secondVal.TotalItems);
                    scope.HomeDataModule.SelectedOrder.PricesSummary.TaxTotal = newVal.TaxPrice + ((secondVal === undefined) ? 0 : secondVal.TaxPrice);
                    scope.HomeDataModule.SelectedOrder.PricesSummary.DiscountTotal = Number(newVal.DiscountPrice) + Number(newVal.LineDiscountPrice) + ((secondVal === undefined) ? 0 : (secondVal.DiscountPrice + secondVal.LineDiscountPrice));
                };

                /// Loads order details
                this.LoadOrderDetails = function (orderID, orderCategory, callback) {
                    scope.HomeDataModule.OrdersData.LoadOrders(orderCategory, function (orders) {
                        let order = orders.find(function (elem) {
                            return elem.OrderID == orderID;
                        });

                        if (order !== undefined) {
                            HomeModuleThis.SelectedOrder.Order = order;
                            HomeModuleThis.GetOrderDetails(function (orderDetails) {
                                callback(orderDetails);
                            });
                        }
                    });
                };

                /// Check whether a new order has been placed
                /// and set values of the FlowHandlerVariables.
                scope.$watch('HomeDataModule.SelectedOrder.Order', function (newVal, oldVal) {
       /*             if (newVal.OrderId == 0) {
                        flowHandlerVariables.isPaymentEnabled = false;
                        flowHandlerVariables.isSplitEnabled = false;
                        flowHandlerVariables.isPrintReceiptEnabled = false;
                        flowHandlerVariables.isReorderEnabled = false;
                        flowHandlerVariables.isOrderSaveEnabled = false;
                    }
                    else if (HomeModuleThis.SelectedOrder.OrderDetails.length > 0) {
                        flowHandlerVariables.isPaymentEnabled = true;
                        flowHandlerVariables.isSplitEnabled = HomeModuleThis.SelectedOrder.OrderCategory === HomeModuleThis.OrderCategories.DiningOrder;
                        flowHandlerVariables.isPrintReceiptEnabled = false;
                        flowHandlerVariables.isReorderEnabled = true;
                        flowHandlerVariables.isOrderSaveEnabled = false;
                    }*/

                    if (newVal!== undefined && newVal.OrderID == 0) {
                        HomeModuleThis.FreezScreen();
                    }

                    SetPricesSummary(newVal);
                    /// console.log(newVal);
                });

                /// Check whether a new orderDetail has been added to the order
                /// and set values of the FlowHandlerVariables.
                scope.$watch('HomeDataModule.SelectedOrder.OrderDetails', function (newVal, oldVal) {

                    let isNewOrderDetailAvai = HomeModuleThis.SelectedOrder.OrderDetails.find(function (elem) {
                        return (elem.OrderDetailID == 0);
                    });

                    if (isNewOrderDetailAvai !== undefined) {
                        HomeModuleThis.FlowHandlerVariables.isPaymentEnabled = false;
                        HomeModuleThis.FlowHandlerVariables.isSplitEnabled = false;
                        HomeModuleThis.FlowHandlerVariables.isPrintReceiptEnabled = false;
                        HomeModuleThis.FlowHandlerVariables.isReorderEnabled = false;
                        HomeModuleThis.FlowHandlerVariables.isOrderSaveEnabled = true;
                        HomeModuleThis.FreezScreen();
                    }
                    else if (newVal.length > 0) {
                        HomeModuleThis.FlowHandlerVariables.isPaymentEnabled = true;
                        HomeModuleThis.FlowHandlerVariables.isSplitEnabled = HomeModuleThis.SelectedOrder.OrderCategory === HomeModuleThis.OrderCategories.DiningOrder;
                        HomeModuleThis.FlowHandlerVariables.isPrintReceiptEnabled = true;
                        HomeModuleThis.FlowHandlerVariables.isReorderEnabled = true;
                        HomeModuleThis.FlowHandlerVariables.isOrderSaveEnabled = false;
                        /// alert("Order Details Have Been Changed");
                    }
                    else {
                        HomeModuleThis.FlowHandlerVariables.isPaymentEnabled = false;
                        HomeModuleThis.FlowHandlerVariables.isSplitEnabled = HomeModuleThis.SelectedOrder.OrderCategory === HomeModuleThis.OrderCategories.DiningOrder;
                        HomeModuleThis.FlowHandlerVariables.isPrintReceiptEnabled = false;
                        HomeModuleThis.FlowHandlerVariables.isReorderEnabled = false;
                        HomeModuleThis.FlowHandlerVariables.isOrderSaveEnabled = false;
                    }

                    /// alert("Order Details Have Been Changed - true");
                    HomeModuleThis.BillCalculations.Calculate();
                    /// SetPricesSummary(HomeModuleThis.SelectedOrder.Order);
                }, true);

                scope.$watch('HomeDataModule.SelectedOrder.OrderDetails', function (newVal, oldVal) {
                    /// HomeModuleThis.BillCalculations.Calculate();
                    /// alert("Order details changed");
                    if (newVal !== undefined && Array.isArray(newVal) && newVal.length > 0) {
                        HomeModuleThis.FlowHandlerVariables.isPaymentEnabled = true;
                        HomeModuleThis.FlowHandlerVariables.isSplitEnabled = HomeModuleThis.SelectedOrder.OrderCategory === HomeModuleThis.OrderCategories.DiningOrder;
                        HomeModuleThis.FlowHandlerVariables.isPrintReceiptEnabled = true;
                        HomeModuleThis.FlowHandlerVariables.isReorderEnabled = true;
                        HomeModuleThis.FlowHandlerVariables.isOrderSaveEnabled = false;
                    }
                    else if (newVal !== undefined && Array.isArray(newVal) && newVal.length == 0) {
                        HomeModuleThis.FlowHandlerVariables.isPaymentEnabled = false;
                        HomeModuleThis.FlowHandlerVariables.isSplitEnabled = HomeModuleThis.SelectedOrder.OrderCategory === HomeModuleThis.OrderCategories.DiningOrder;
                        HomeModuleThis.FlowHandlerVariables.isPrintReceiptEnabled = false;
                        HomeModuleThis.FlowHandlerVariables.isReorderEnabled = false;
                        HomeModuleThis.FlowHandlerVariables.isOrderSaveEnabled = false;
                    }
                    console.log(HomeModuleThis.FlowHandlerVariables);
                    /// SetPricesSummary(HomeModuleThis.SelectedOrder.Order);
                });

                /// Clear selectedOrder object and
                /// create a new order in it.
                this.AddNewOrder = function (orderCategory, reservationId, orderID) {

                    /// alert(reservationId);
                    if ((orderCategory.Code == HomeModuleThis.OrderCategories.DiningOrder.Code && reservationId !== undefined) ||
                        orderCategory.Code == HomeModuleThis.OrderCategories.TakeoutOrder.Code ||
                        orderCategory.Code == HomeModuleThis.OrderCategories.DeliveryOrder.Code ||
                        orderCategory.Code == HomeModuleThis.OrderCategories.TabOrder.Code) {

                        var UserID = JSON.parse(MasterDataStorageHandler.DataStorageHandler.GetLoginHelpingData()).UserID;
                        /// console.error(JSON.parse(MasterDataStorageHandler.DataStorageHandler.GetLoginHelpingData()));

                        this.DeselectOrder();
                        /// alert(orderID);
                        var order = Object.assign({}, this.DataFormat.Order);
                        order.OrderID = (orderID === undefined) ? "0" : orderID;
                        order.OrderType = orderCategory.Code;
                        ///order.Tables.TableId = table.TableId;
                        order.ReservationId = (reservationId !== undefined) ? reservationId : "0";
                        this.SelectedOrder.OrderCategory = orderCategory;
                        this.SelectedOrder.Order = order;
                        this.SelectedOrder.Order.UserId = UserID;
                        this.SelectedOrder.OrderDetails = [];
                        this.SelectedOrder.GuestDetails = Object.assign({}, this.DataFormat.Guest);
                        this.SelectedOrder.GuestDetails.OrderType = orderCategory.Code;

                        switch (orderCategory) {
                            case HomeModuleThis.OrderCategories.TakeoutOrder:
                                order.IsHeaderServiceChargeOn = (scope.SystemSettings.SettingsDto.SystemSettings.FastFoodServiceCharge.Value);
                                break;
                            case HomeModuleThis.OrderCategories.DeliveryOrder:
                                order.IsHeaderServiceChargeOn = (scope.SystemSettings.SettingsDto.SystemSettings.DeliveryServiceCharge.Value);
                                break;
                            default:
                                order.IsHeaderServiceChargeOn = true;
                        }

                        if(orderCategory.Code == HomeModuleThis.OrderCategories.DeliveryOrder.Code) {
                           /// alert("");
                            let guestAddress = Object.assign({}, HomeModuleThis.DataFormat.GuestAddress);
                            this.SelectedOrder.GuestDetails.GuestAddressList = [];
                            this.SelectedOrder.GuestDetails.GuestAddressList.push(guestAddress);
                            console.log(this.SelectedOrder.GuestDetails.GuestAddressList);
                        }

                        if (orderID !== undefined && orderID > 0) {
                            scope.HomeDataModule.GetOrderDetails();
                        }
                    }
                };

                /// Deselect the selected order.
                /// if new order details or orderDetail remarks have been updated,
                /// discards all of them.
                this.DeselectOrder = function () {

                    this.SelectedOrder.Order = {};
                    this.SelectedOrder.OrderDetails = [];
                    this.SelectedOrder.GuestDetails = {};
                    this.SelectedOrder.Splits = [];
                    this.SelectedOrder.Payments = [];
                    this.SelectedOrder.OrderCategory = {};

                    HomeModuleThis.FlowHandlerVariables.isPaymentEnabled = false;
                    HomeModuleThis.FlowHandlerVariables.isSplitEnabled = false;
                    HomeModuleThis.FlowHandlerVariables.isPrintReceiptEnabled = false;
                    HomeModuleThis.FlowHandlerVariables.isReorderEnabled = false;
                    HomeModuleThis.FlowHandlerVariables.isOrderSaveEnabled = false;

                    HomeModuleThis.UnfreezScreen();

                    /// Redirect user to the home view's order panel
                    scope.UrlFactory.UrlExchanger.HomePage.MiddlePanel.BodyArea.ToOrderView();
                    scope.UrlFactory.UrlExchanger.HomePage.LeftPanel.BodyArea.ToOrderDetailView();
                };

                /// Creates a newOrderDetail for the SelectedOrder.
                this.AddNewOrderDetail = function (newOrderDetail, isReorder) {

                    if (this.SelectedOrder.Order.OrderID === undefined) {
                        console.log("An order has to be added first in order to add orderDetails");
                        comSingleButtonErrorAlert("Order Panel", "Cannot add food items without creating an order", "Got it!");
                        return -1;
                    }
                    var addFoodItem = function (foodPrice) {
                        var orderDetail = Object.assign({}, HomeModuleThis.DataFormat.OrderDetail);
                        var userID = JSON.parse(MasterDataStorageHandler.DataStorageHandler.GetLoginHelpingData()).UserID;

                        userID = (userID===undefined) ? 0 : userID;

                        orderDetail.OrderDetailID = "0";
                        orderDetail.FoodId = newOrderDetail.FoodId.toString();
                        orderDetail.Name = newOrderDetail.Name;
                        orderDetail.Remarks = "";
                        orderDetail.Price = (foodPrice===undefined) ? newOrderDetail.Price.toString() : foodPrice;
                        orderDetail.CoverNumber = Number(HomeModuleThis.SelectedOrder.CoverNumber);
                        orderDetail.CoverNo = Number(HomeModuleThis.SelectedOrder.CoverNumber);
                        orderDetail.Quantity = 1;
                        orderDetail.FoodPrice = (foodPrice===undefined) ? newOrderDetail.Price : foodPrice;
                        orderDetail.IsNet = false;
                        orderDetail.NetPrice = (Number(orderDetail.Price) * orderDetail.Quantity).toString();
                        orderDetail.IsLineVatOn = newOrderDetail.IsTax1On;
                        orderDetail.IsLineOtherTaxOn = newOrderDetail.IsTax2On;
                        orderDetail.IsLineServiceChargeOn = newOrderDetail.ServiceChargeOn;
                        orderDetail.FoodCatId = newOrderDetail.FoodCatId;
                        orderDetail.FoodTypeId = newOrderDetail.FoodTypeId;
                        orderDetail.ItemId = newOrderDetail.ItemId;
                        orderDetail.UserId = userID;

                        /// alert(newOrderDetail.ServiceChargeOn);
                        console.error(orderDetail);

                        /// Set flow handling variables
                        HomeModuleThis.FlowHandlerVariables.isPaymentEnabled = true;
                        HomeModuleThis.FlowHandlerVariables.isOrderSaveEnabled = false;

                        /// console.log(this.SelectedOrder.OrderDetails);
                        /// orderDetail.Qty = newOrderDetail.Qty;
                        HomeModuleThis.SelectedOrder.OrderDetails.push(orderDetail);
                    };

                    var foodTypes = JSON.parse(MasterDataStorageHandler.DataStorageHandler.GetMasterFoodsData()).FoodSubCategories;
                    var foodType = foodTypes.find(function (elem) {
                        return elem.FoodTypeId == newOrderDetail.FoodTypeId && elem.Name.search(/open food/i) > -1;
                    });

                    if (foodType === undefined ||
                        (isReorder !== undefined && isReorder == true)) {
                        addFoodItem();
                    }
                    else {
                        $mdDialog.show({
                            controller: DialogController,
                            templateUrl: 'views/directives/FoodPriceDirective.html',
                            parent: angular.element(document.body),
                            clickOutsideToClose: true,
                            fullscreen: false
                        })
                            .then(function (foodPrice) {
                                /// alert("Food Price : " + foodPrice);
                                addFoodItem(foodPrice);
                            }, function () {

                            });
                    }

                    function DialogController($scope, $mdDialog) {
                        $scope.FoodPrice = 0;
                        $scope.confirm = function() {
                            if ($scope.FoodPrice==0) {
                                comSingleButtonInfoAlert("Food Price",
                                "Please enter food price", "Got it!");
                            } else if ($scope.FoodPrice < 0 || isNaN(Number($scope.FoodPrice))) {
                                comSingleButtonInfoAlert("Food Price",
                                    "Please enter valid food price", "Got it!");
                            }
                            else {
                                $mdDialog.hide($scope.FoodPrice);
                            }
                        };

                        $scope.$watch(()=>$scope.FoodPrice, function (newVal, oldVal) {
                            if (isNaN(Number(newVal))) {
                                $scope.FoodPrice = (isNaN(Number(oldVal))) ? 0 : oldVal;
                            }
                        });

                        $scope.cancel = function() {
                            $mdDialog.cancel();
                        };
                    }
                };

                /// Remove an orderDetail by using the index of the
                /// orderDetail array
                this.OrderDetailRemoval = new (function (outerThis) {

                    var This = this;

                    var RemovingOrderDetail = null;

                    this.RemoveOrderDetail = function (index) {
        /*                if (outerThis.SelectedOrder.OrderDetails.length > 0 && outerThis.SelectedOrder.OrderDetails.length > index) {
                            if (outerThis.SelectedOrder.OrderDetails[index].OrderDetailID == 0) {
                                outerThis.SelectedOrder.OrderDetails.splice(index, 1);
                                outerThis.FlowHandlerVariables.isOrderSaveEnabled = outerThis.SelectedOrder.OrderDetails.length != 0;
                            }
                            else {
                                alert("Cannot delete without permission of an admin");
                                This.OpenPermissionRetrieval = true;
                                RemovingOrderDetail = outerThis.SelectedOrder.OrderDetails[index];
                            }
                        }*/

                        /// alert("dffd");

                        RemovingOrderDetail = outerThis.SelectedOrder.OrderDetails[index];
                        if (RemovingOrderDetail.OrderDetailID != 0) {
                            This.OpenPermissionRetrieval = true;
                        }
                        else {
                            outerThis.SelectedOrder.OrderDetails.splice(index, 1);
                        }
                    };

                    this.Users = (function () {
                        TransactionHandlerService.Execute.Users.ReadAll((response)=>{
                            if ("Error" in response) {

                            }
                            else {
                                let userID = JSON.parse(MasterDataStorageHandler.DataStorageHandler.GetLoginHelpingData()).UserID;
                                /// alert("UserID : " + userID);

                                /// console.error(response);
                                for (let i = 0; i < response.length; i++) {
                                    if (response[i].UserId == userID && !scope.SystemSettings.SettingsDto.SystemSettings.SameUserAuthorization.Value) {
                                        response.splice(i, 1);
                                    }
                                }

                                This.Users = response;
                            }
                        });
                    })();

                    this.UserLevels = (function () {
                        TransactionHandlerService.Execute.UserLevel.ReadAll(function (response) {
                            /// console.error(response);
                            This.UserLevels = response.UserLevels;
                        });
                    })();

                    this.PRCallback = function (selectedUser, password) {

                        if ((selectedUser !== undefined && password !== undefined) &&
                            (selectedUser != null || password != null)) {
                            var RestaurantID = JSON.parse(MasterDataStorageHandler.DataStorageHandler.GetLoginHelpingData()).RestaurantId;
                            /// /// /// alert(RestaurantID);
                            TransactionHandlerService.Execute.AuthenticateUser(selectedUser.UserId,
                                password, RestaurantID, function (response) {
                                    if ("Error" in response) {

                                    }
                                    else {
                                        /// TransactionHandlerService.Config.SetSessionKey(response.);
                                        console.log(response);
                                        console.log(response.data.SessionKey);
                                        if (response.data.IsSuccessFull) {
                                            This.OpenOrderDetailRemoval = true;
                                        }
                                        else {
                                            /// alert("Username or password is wrong");
                                            comSingleButtonErrorAlert("Authentication", "The password is incorrect", "Got it!");
                                        }
                                    }
                                });
                        }
                        else if (selectedUser !== undefined && password !== undefined && selectedUser == null && password == null) {
                            console.error("");
                            console.error(selectedUser);
                            console.error(password);
                            comSingleButtonInfoAlert("Authentication", "Please select a user", "Got it!");
                        }
                    };

                    this.OpenPermissionRetrieval = false;

                    this.OpenOrderDetailRemoval = false;

                    this.OrderDetailRemovalRemarks = [{msg: "Test 01"}, {msg: "Test 02"}];

                    this.PermissionRetrievalCallback = function (isConfirmed, credentials) {
                        if (isConfirmed && credentials != null) {
                            var RestaurantID = JSON.parse(MasterDataStorageHandler.DataStorageHandler.GetLoginHelpingData()).RestaurantId;
                            TransactionHandlerService.Execute.AuthenticateUser(credentials.Username,
                                credentials.Password, RestaurantID, function (response) {
                                    if ("Error" in response) {

                                    }
                                    else {
                                        /// TransactionHandlerService.Config.SetSessionKey(response.);
                                        console.log(response);
                                        console.log(response.data.SessionKey);
                                        TransactionHandlerService.Config.SetSessionKey(response.data.SessionKey);
                                        This.OpenOrderDetailRemoval = true;
                                    }
                                });
                        }
                    };

                    this.OrderDetailRemovalCallback = function (isConfirmed, response) {

                        if (isConfirmed && response != null) {

                            let status = (response.search(/not served/i)==-1) ? "S" : "D";
                            RemovingOrderDetail.Status = status;
                            RemovingOrderDetail.Updated = "";
                            RemovingOrderDetail.Remarks = response;
                            console.error(status);
                            outerThis.UpdateOrder(outerThis.SelectedOrder.OrderDetails);
                        }
                    };

                })(this);

                /// Add or Remove food remarks from a foodItem (orderDetail)
                this.FoodRemarksManagement = (function (outerThis, scope, transactionHandler) {
                    var foodRemarksManagement = {};

                    var foodTypes = (function () {
                        let foodT = JSON.parse(MasterDataStorageHandler.DataStorageHandler.GetMasterFoodsData()).FoodSubCategories;
                        let foodType = null;
                        return (foodT!== undefined && foodT != null && Array.isArray(foodT)) ? foodT : [];
                    })();

                    /// Selected order detail
                    var selectedOrderDetail = null;

                    /// Food remarks of the currently selected order detail
                    foodRemarksManagement.CurrentFoodRemarks = "";

                    /// Quantity of the order detail
                    foodRemarksManagement.CurrentQuantity = 1;

                    /// Boolean value used to open or close food remarks popup
                    foodRemarksManagement.IsFoodRemarksPopupOpen = true;

                    /// Food remarks array
                    foodRemarksManagement.FoodRemarksList = [];

                    foodRemarksManagement.IsOpenFood = false;

                    foodRemarksManagement.Price = 0;

                    /// Open food remarks popup
                    foodRemarksManagement.OpenPopup = function (item) {
                        if (item.OrderDetailID == 0) {
                            let foodTypeID = item.FoodTypeId;
                            foodRemarksManagement.IsOpenFood = foodTypes.find(function (elem) {
                                return elem.FoodTypeId == foodTypeID && elem.Name.search(/open food/i) > -1;
                            });

                            selectedOrderDetail = item;
                            foodRemarksManagement.CurrentFoodRemarks = item.Remarks;
                            foodRemarksManagement.CurrentQuantity = item.Quantity;
                            foodRemarksManagement.IsFoodRemarksPopupOpen = true;
                        }
                    };

                    /// Close food remarks popup
                    foodRemarksManagement.ClosePopup = function () {

                    };

                    /// Callback for the popup
                    foodRemarksManagement.Callback = function (isConfirmed, foodRemarks, quantity) {

                        quantity = (quantity === undefined) ? 1 : quantity;

                        if (isConfirmed) {
                            selectedOrderDetail.Remarks = foodRemarks;
                            selectedOrderDetail.Updated = "";
                            selectedOrderDetail.Quantity = quantity;
                            selectedOrderDetail.Price = Number(selectedOrderDetail.Price) * quantity;
                            selectedOrderDetail.TotalPrice = Number(selectedOrderDetail.Price) * quantity;

                            console.log(selectedOrderDetail);
                        }
                    };

                    /// Initialize the object
                    (function (This) {

                        /// Retrieve food remarks from the server.
                        transactionHandler.Execute.FoodRemarks.ReadAll(function (response) {
                            console.log(response);
                            This.FoodRemarksList = response;
                        });

                        /// initially close the popup.
                        This.IsFoodRemarksPopupOpen = false;

                    })(foodRemarksManagement);

                    return foodRemarksManagement;
                })(this, scope, TransactionHandlerService);

                /// Store master data of foods in the memory
                /// retrieve from the local storage and store them on the browser memory
                this.FoodsMasterData = {
                    FoodCategories: [],
                    FoodSubCategories: [],
                    FoodItems: [],
                    FilteredFoodSubCategories: [],
                    FilteredFoodItems: [],

                    /// Filter out food sub categories using a category id.
                    FilterSubCategories: function (categoryId) {

                        var This = HomeModuleThis.FoodsMasterData;
                        var curOrderCategory = HomeModuleThis.SelectedOrder.OrderCategory;
                        var orderCategories = HomeModuleThis.OrderCategories;
                        var mealTypes = scope.ReferenceData.MealTypes;
                        var results = filterFilter(This.FoodSubCategories, function (elem) {
                            let response = false;

                            /// console.error(elem.MealTypeId);
                            /// console.error(mealTypes);

                            if (elem.MealTypeId !== mealTypes.ALL.MealTypeID) {
                                switch(curOrderCategory.Code) {
                                    case orderCategories.DiningOrder.Code:
                                        if (elem.MealTypeId == mealTypes.TABLEDELIVERY.MealTypeID ||
                                            elem.MealTypeId == mealTypes.TABLETAKEAWAY.MealTypeID ||
                                            elem.MealTypeId == mealTypes.Table.MealTypeID) {
                                            response = true;
                                        }

                                        console.error(elem.MealTypeId);

                                        break;
                                    case orderCategories.DeliveryOrder.Code:
                                        if (elem.MealTypeId == mealTypes.TABLEDELIVERY.MealTypeID ||
                                            elem.MealTypeId == mealTypes.DELIVERYTAKEAWAY.MealTypeID ||
                                            elem.MealTypeId == mealTypes.Delivery.MealTypeID) {
                                            response = true;
                                        }

                                        break;
                                    case orderCategories.TabOrder.Code:
                                            response = true;

                                        break;
                                    case orderCategories.TakeoutOrder.Code:
                                        if (elem.MealTypeId == mealTypes.TABLETAKEAWAY.MealTypeID ||
                                            elem.MealTypeId == mealTypes.DELIVERYTAKEAWAY.MealTypeID ||
                                            elem.MealTypeId == mealTypes.TakeAway.MealTypeID) {
                                            response = true;
                                        }

                                        break;
                                    default:
                                }
                            }
                            else {
                                response = true;
                            }

                            return (response && elem.FoodCatId == categoryId);
                        }) ;

                        console.log(results);

                        This.FilteredFoodSubCategories = (results === undefined) ? [] : results;

                        if (This.FilteredFoodSubCategories.length > 0) {
                            This.FilterFoodItems(This.FilteredFoodSubCategories[0]);
                        }
                        else {
                            This.FilteredFoodItems = [];
                        }
                    },

                    /// Filter out food items according to food sub category id.
                    FilterFoodItems: function (subCategory) {

                        console.log(subCategory.FoodTypeId);

                        var This = HomeModuleThis.FoodsMasterData;
                        var results = filterFilter(This.FoodItems,
                            function (elem) {
                                return (elem.FoodTypeId == subCategory.FoodTypeId);
                            });

                        console.log(results);

                        This.FilteredFoodItems = (results === undefined) ? [] : results;

                        /// Manually trigger digest cycle
                        scope.$applyAsync();
                    },

                    Init: function () {
                        var foodMasterData = JSON.parse(MasterDataStorageHandler.DataStorageHandler.GetMasterFoodsData());

                        if(foodMasterData != null && "FoodItems" in foodMasterData && "FoodSubCategories" in foodMasterData &&
                            "FoodCategories" in foodMasterData) {
                            this.FoodCategories = foodMasterData.FoodCategories;
                            this.FoodSubCategories = foodMasterData.FoodSubCategories;
                            this.FoodItems = foodMasterData.FoodItems;
                            if (this.FoodCategories.length > 0) {
                                HomeModuleThis.FoodsMasterData.FilterSubCategories(this.FoodCategories[0].FoodCatId);
                            }
                        }
                        else {
                            /// do something!
                        }
                    }
                };

                /// Retrieve data about orders from the local storage
                /// and store them in the browser's memory
                this.GetOrdersData = function () {

                    let ordersData = JSON.parse(MasterDataStorageHandler.DataStorageHandler.GetOrdersData());
                    let orderCategoriesTemp = ordersData.OrderCategories;
                    var orderCategories = this.OrderCategories;

                    for (let i = 0; i < ordersData.OrderCategories.length; i++) {

                        switch (orderCategoriesTemp[i].Code) {
                            case "N" :
                                orderCategories.DiningOrder = orderCategories[i];
                                break;
                            case "D" :
                                orderCategories.DeliveryOrder = orderCategories[i];
                                break;
                            case "F" :
                                orderCategories.TakeoutOrder = orderCategories[i];
                                break;
                            case "T" :
                                orderCategories.TabOrder = orderCategories[i];
                                break;
                            default:
                                orderCategories = {};
                        }
                    }
                };

                /// Retrieve data about orders from the database
                /// and filter them out and store in separate variables on the memory.
                /// This also clears selectedOrder object.
                /// CurrentOrders - contains current orders loaded from the database
                /// OrderCategory - contains order category object that has been used to get orders from the database
                this.OrdersData = {
                    CurrentOrders: [],
                    OrderCategory: HomeModuleThis.OrderCategories.DiningOrder,
                    LoadOrders: function (orderCategory, callback) {

                            var This = scope.HomeDataModule.OrdersData;
                            This.OrderCategory = orderCategory;
                            scope.HomeDataModule.SelectedOrder.OrderCategory = orderCategory;
                            HomeModuleThis.DeselectOrder();

                            console.log(orderCategory);

                            TransactionHandlerService.Execute.Order.ReadByOrderCategoryId(function (response) {
                                let filteredOrders = [];
                                let curDate = new Date(Date.now());
                                response.OrderHeaderResponse = (response.OrderHeaderResponse == null) ? [] : response.OrderHeaderResponse;
                                /// console.log(response);
                                response.OrderHeaderResponse.forEach(function (elem) {
                                    if (elem.OrderDate.length > 0) {
                                        let orderDate = new Date(Number(elem.OrderDate.substr(6, 13)));
                                        /*   if (curDate.getFullYear() == orderDate.getFullYear() &&
                                         curDate.getMonth() == orderDate.getMonth() &&
                                         curDate.getDate() == orderDate.getDate()) {

                                         }*/
                                        filteredOrders.push(elem);
                                    }
                                });

                                This.CurrentOrders = filteredOrders;
                                if (callback !== undefined) {
                                    callback(filteredOrders);
                                }
                            }, orderCategory.OrderCategoryId);
                    }
                };

                /// Retrieve order details from the database by using an order id.
                this.GetOrderDetails = function (callback) {

                    if(this.SelectedOrder.Order.OrderID === undefined) {
                        return 0;
                    }
                    console.log(scope.HomeDataModule);

                    if(this.SelectedOrder.Order.ServiceChargePrice > 0) {
                        this.SelectedOrder.Order.IsHeaderServiceChargeOn = true;
                    }

                    var UserID = JSON.parse(MasterDataStorageHandler.DataStorageHandler.GetLoginHelpingData()).UserID;

                    TransactionHandlerService.Execute.Order.ReadById(function (response) {
                        /// console.error(response);
                        var mergedList = [];

                        /// console.error("ERRRRRRRRRRRR");

                        response.OrderDetailResponseDto.forEach(function (item) {

                            /// let UserID =

                            let foodId = (item.hasOwnProperty("FoodID")) ? item.FoodID : "0";
                            /// console.log(item);
                            let foodItem = scope.HomeDataModule.FoodsMasterData.FoodItems.find((elem)=>{
                                return elem.FoodId == foodId;
                            });

                            if(foodItem !== undefined && item.Status.trim() !== "S" && item.Status.trim() !== "D") {
                                /// console.warn(item);
                                /// alert(item.Status);
                                /// item = Object.assign(item, foodItem);
                                item.Name = foodItem.Name;
                                item.Price = item.NetPrice;
                                item.FoodCatId = foodItem.FoodCatId;
                                item.FoodTypeId = foodItem.FoodTypeId;
                                item.IsLineServiceChargeOn = foodItem.ServiceChargeOn;
                                item.IsLineOtherTaxOn = foodItem.IsTax2On;
                                item.IsLineVatOn = foodItem.IsTax1On;
                                item.UserId = UserID;
                                item.UserID = UserID;
                                mergedList.push(item);
                                /// console.warn(item);
                            }
                            else {
                                console.warn("Undefined element in the array");
                                /// Write something to handle the problem
                            }
                        });

         /*               if (HomeModuleThis.SelectedOrder.OrderCategory === HomeModuleThis.OrderCategories.DiningOrder &&
                            HomeModuleThis.SelectedOrder.OrderDetails.length > 0) {

                            /// HomeModuleThis.FlowHandlerVariables.isPaymentEnabled = true;
                            /// HomeModuleThis.FlowHandlerVariables.isSplitEnabled = true;
                        }*/

                        /// console.error(mergedList);

                        HomeModuleThis.SelectedOrder.OrderDetails = mergedList;
                        console.log(HomeModuleThis.SelectedOrder.OrderDetails);

                        if (callback !== undefined) {
                            callback(mergedList);
                        }

                    }, this.SelectedOrder.Order.OrderID);
                };

                /// Sends order information to the server and creates a new order
                this.CreateOrder = {

                    /// Creates a dining order
                    CreateTakeoutOrder: function (callback) {

                   /*     if (scope.HomeDataModule.SelectedOrder.GuestDetails.GuestId == 0) {
                            let guests = undefined;
                            let defaultGuest = undefined;
                            guests = JSON.parse(MasterDataStorageHandler.DataStorageHandler.GetAdminData()).Guests;

                            defaultGuest = filterFilter(guests, function (elem) {
                                return (elem.GuestId == 0);
                            });

                            if (defaultGuest !== undefined) {
                                alert("Default guest not found!");
                                console.warn(CommonMessages.WarnMessages.defaultGuestNotFount);
                                return -1;
                            }
                            else {
                                let temp = scope.HomeDataModule.SelectedOrder.GuestDetails;
                                temp.GuestID = defaultGuest.GuestId;
                                temp.Title = defaultGuest.Title;
                                temp.Description = defaultGuest.Description;
                                temp.FirstName = defaultGuest.FirstName;
                                temp.LastName = defaultGuest.LastName;
                                temp.Mobile = defaultGuest.Mobile;
                                temp.Email = defaultGuest.Email;
                                temp.Status = defaultGuest.Status;
                            }
                        }*/

                        /// alert("Create Order");

                        /// console.log(HomeModuleThis.SelectedOrder);

                        TransactionHandlerService.Execute.Order.Create(
                            function (response) {
                                if (callback != undefined) {
                                    callback(response);
                                }
                                console.log(response);
                            },
                            HomeModuleThis.SelectedOrder.Order,
                            HomeModuleThis.SelectedOrder.OrderDetails,
                            /// HomeModuleThis.SelectedOrder.GuestDetails,
                        false, false, false);
                    }
                };

                /// Update a changed order.
                /// Sends updated orderDetails (food items) or discount and tax details to the server.
                this.UpdateOrder = function () {

                    var orderDetails = [];

                    if (!Array.isArray(orderDetails)) {return -1}

                    let newOrderDetails = filterFilter(HomeModuleThis.SelectedOrder.OrderDetails, function (elem) {
                        return (elem.OrderDetailID == 0 && !("Updated" in elem));
                    });

                    /// console.error(newOrderDetails);

                    let updatedOrderDetails = filterFilter(HomeModuleThis.SelectedOrder.OrderDetails, function (elem) {
                        return ("Updated" in elem);
                    });

                    console.error(updatedOrderDetails);

                    var orderHeader = HomeModuleThis.SelectedOrder.Order;
                    var orderID = orderHeader.OrderID;

                    newOrderDetails = (newOrderDetails === undefined) ? [] : newOrderDetails;
                    updatedOrderDetails = (updatedOrderDetails === undefined) ? [] : updatedOrderDetails;

                    if (newOrderDetails.length == 0 && updatedOrderDetails.length == 0) {
                        return false;
                    }

                    /// console.error(updatedOrderDetails);
                     orderDetails = orderDetails.concat(newOrderDetails);
                     orderDetails = orderDetails.concat(updatedOrderDetails);

                    console.error(orderHeader);

                    TransactionHandlerService.Execute.Order.UpdateById(
                        function (response) {
                            console.error(response);

                            scope.HomeDataModule.OrdersData.LoadOrders(scope.HomeDataModule.OrdersData.OrderCategory, function (orders) {
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
                                            comSingleButttonSuccessAlert("Updated Successfully",
                                                "Order updated successfully",
                                                "Got it!")
                                            /// console.log(scope.UiHandlers);
                                            /// scope.UiHandlers.HomePageUi.LeftPanel.ToggleMainBodyArea();
                                        }
                                    });
                                }
                            });
                        },
                        orderID,
                        orderHeader,
                        orderDetails,
                        null,
                        false, false, false);
                };

                /// Perform initial tasks.
                /// Override the middle view of the header view.
                (function () {
                    scope.HeaderViewMiddlePanel.Data = {
                        TableNo: "",
                        OrderId: "",
                        OrderData: HomeModuleThis.SelectedOrder,
                        PricesSummary: {}
                    };

                    scope.HeaderViewMiddlePanel.Data.PricesSummary = HomeModuleThis.SelectedOrder.PricesSummary;

                    scope.UrlFactory.ResetUrlFactory.ResetHomePage();
                    scope.UrlFactory.UrlExchanger.HeaderView.MiddlePanel.ToOrderInfoView();
                })();

                /// testing purposes only.
                this.FoodsMasterData.Init();
                //this.GetOrdersData();
                /// this.HomeDataModule.OrdersData.LoadOrders(1);
            })();

            /// UI handlers goes here.
            /// UiHandlers global object
            scope.UiHandlers = {HomePageUi: {

            }};
        }
    });
    cloudPOS.ng.application.controller('HomeController', [
        '$scope',
        '$rootScope',
        'localStorageService',
        'UIConfigService',
        '$http',
        'CloudDaoService',
        'filterFilter',
        'MasterDataStorageHandler',
        'BillCalculations02',
        'TransactionHandlerService',
        'CommonMessages',
        '$mdDialog',
        cloudPOS.controllers.HomeController
    ]).run(function ($log) {
        $log.info("HomeController initialized");
    });
}(cloudPOS.controllers || {}));
