(function (module) {
    cloudPOS.controllers = _.extend(module, {
        DiscountPanelController: function (scope, sessionManager, $rootScope, localStorageService, $idle, uiConfigService,
                                           $http, filterFilter, MasterDataStorageHandler,
                                           CommonMessages, TransactionHandler, billCalculation) {

            scope.DiscountPanelDataModule = (function (scope) {
                var DataModule = {};

                DataModule.Group = {
                    GroupName: "",
                    SubGroups: []
                };

                DataModule.SubGroup = {
                    SubGroupName: "",
                    Items: []
                };

                DataModule.Discounts = (function () {
                    var discounts = JSON.parse(MasterDataStorageHandler.DataStorageHandler.GetAdminData()).Discounts;

                    if (discounts !== undefined && Array.isArray(discounts)) {
                        let zeroDiscount = {DisRate: 0, Description: "0% Default"};
                        discounts.splice(0,0, zeroDiscount);
                        /*for (let i = 0; i < discounts.length; i++) {
                            if (discounts[i].DisRate === 0) {
                                let discount = discounts.splice(i, 1);
                                discount[0].Description = "0% Default";
                                discounts.splice(0,0, discount[0]);
                                break;
                            }
                        }*/
                    }

                    return (discounts !== undefined && Array.isArray(discounts)) ? discounts : [];
                })();

                /// Retrieve taxes from the local storage
                DataModule.Taxes = (function () {
                    var taxes = JSON.parse(MasterDataStorageHandler.DataStorageHandler.GetAdminData()).Taxes;
                    return (taxes !== undefined && Array.isArray(taxes)) ? taxes : [];
                })();

                DataModule.TaxCodes = (function () {
                    var taxCodes = JSON.parse(MasterDataStorageHandler.DataStorageHandler.GetAdminData()).TaxCodes;
                    return (taxCodes !== undefined && Array.isArray(taxCodes)) ? taxCodes : [];
                })();

                /// Retrieve service charge from the local storage
                DataModule.ServiceCharge = (function () {
                    var serviceCharge = JSON.parse(MasterDataStorageHandler.DataStorageHandler.GetAdminData()).ServiceCharge;
                    console.log("__________________________________");
                     console.log(serviceCharge);
                    return (serviceCharge !== undefined && Array.isArray(serviceCharge)) ? serviceCharge[0] : {
                        Rate: 0,
                        ScId: 0
                    };
                })();

                DataModule.Order = {
                    OrderHeader: null,
                    OrderDetails: null
                };

                /// Reloads the current order
                DataModule.ReloadOrder = function () {

                    DataModule.Order.OrderDetails = (function ($scope) {
                        var orderDetails = $scope.HomeDataModule.SelectedOrder.OrderDetails;
                        orderDetails = (orderDetails !== undefined) ? orderDetails : [];
                        var responseList = [];

                        for (let i = 0; i < orderDetails.length; i++) {
                            let item = $.extend({}, orderDetails[i]);
                            responseList.push(item);
                        }

                        console.log(responseList);

                        return responseList;
                    })(scope);

                    DataModule.Order.OrderHeader = (function ($scope) {
                        var orderHeader = $scope.HomeDataModule.SelectedOrder.Order;
                        return $.extend({}, (orderHeader !== undefined) ? orderHeader : {});
                    })(scope);

                    DataModule.FilterByFoodItems();
                };

                /// Watch for changes in order details
                scope.$watch("HomeDataModule.SelectedOrder.OrderDetails", function (newVal) {
                    DataModule.ReloadOrder();
                    DataModule.FilterByFoodItems();
                });

                /// Callback for discount panel
                DataModule.Callback = (function (scope) {
                    var callback = function () {
                        /// scope.OrderHeader.Status = "1";
                        /// scope.OrderHeader.NetPrice = 300;

                        TransactionHandler.Execute.Order.UpdateById(
                            function (response) {
                                console.log(response);
                            },
                            DataModule.Order.OrderHeader.OrderID,
                            DataModule.Order.OrderHeader,
                            DataModule.Order.OrderDetails,
                            null,
                            false, false, false);
                    };
                    return callback;
                })(scope);

                DataModule.FilterByFoodItems = function () {
                    DataModule.Group.GroupName = "FoodItem";
                    DataModule.Group.SubGroups = [];

                    let subGroup = $.extend({}, DataModule.SubGroup);
                    subGroup.Items = [];
                    subGroup.SubGroupName = "FoodItem";
                    DataModule.Order.OrderDetails.forEach(function (elem) {
                        subGroup.Items.push(elem);
                    });

                    DataModule.Group.SubGroups.push(subGroup);
                };

                DataModule.FilterByCategory = function () {
                    GroupFoodItems("Category", "FoodCatId");
                };

                DataModule.FilterBySubCategory = function () {
                    GroupFoodItems("SubCategory", "FoodTypeId");
                };

                var GroupFoodItems = function (groupName, propertyName) {

                    var orderDetails = DataModule.Order.OrderDetails;
                    var tempPropertyIDs = [];

                    DataModule.Group.GroupName = groupName;
                    DataModule.Group.SubGroups = [];

                    /// Filter food
                    orderDetails.forEach(function (elem) {
                        if (elem.hasOwnProperty(propertyName)) {
                            let item = tempPropertyIDs.find(function (id) {
                                return (id == Number(elem[propertyName]))
                            });

                            if (item === undefined) {
                                tempPropertyIDs.push(Number(elem[propertyName]));
                            }
                        }
                    });

                    for (let i1 = 0; i1 < tempPropertyIDs.length; i1++) {
                        let subGroup = $.extend({}, DataModule.SubGroup);
                        subGroup.Items = [];

                        if (groupName.toUpperCase() == "CATEGORY") {
                            subGroup.SubGroupName = GetCategoryName(tempPropertyIDs[i1]);
                        }
                        else {
                            subGroup.SubGroupName = GetSubCategoryName(tempPropertyIDs[i1]);
                        }

                        /// subGroup.SubGroupName = tempPropertyIDs[i1];
                        for (let i2 = 0; i2 < orderDetails.length; i2++) {
                            if (tempPropertyIDs[i1] == orderDetails[i2][propertyName]) {
                                subGroup.Items.push(orderDetails[i2]);
                            }
                        }

                        DataModule.Group.SubGroups.push(subGroup);
                    }
                };

                var GetSubCategoryName = function (subCatId) {
                    var foodSubCategories = JSON.parse(MasterDataStorageHandler.DataStorageHandler.GetMasterFoodsData()).FoodSubCategories;
                    var foodSubCategory = foodSubCategories.find(function (elem) {
                        return (elem.FoodTypeId == subCatId);
                    });

                    return (foodSubCategory === undefined) ? "" : foodSubCategory.Name;
                };

                var GetCategoryName = function (catId) {
                    var foodCategories = JSON.parse(MasterDataStorageHandler.DataStorageHandler.GetMasterFoodsData()).FoodCategories;
                    var foodCategory = foodCategories.find(function (elem) {
                        return (elem.FoodCatId == catId);
                    });

                    return (foodCategory === undefined) ? "" : foodCategory.Description;
                };

                var CalculateTheBill = function () {
                    var orderDetail = DataModule.Order.OrderDetails[0];
                    /// orderDetail.IsNet = false;
                    /// orderDetail.IsLineServiceChargeOn = true;
                    /// orderDetail.IsLineOtherTaxOn = true;

                    billCalculation.SetOrder(DataModule.Order.OrderHeader, DataModule.Order.OrderDetails);
                    billCalculation.SetDiscounts(DataModule.Discounts);
                    /// billCalculation.SetTaxes(DataModule.Taxes);
                    billCalculation.SetTaxes(DataModule.TaxCodes);
                    billCalculation.SetServiceCharge(DataModule.ServiceCharge);
                    /// billCalculation.SetSelectedTax();
                    billCalculation.Execute();
                };


                DataModule.DiscountSelection = {

                    IsDiscountListOpen: false,

                    SelectedItem: undefined,

                    IsHeaderDiscount: 0,

                    DiscountCallback: function (isSelected, selectedDiscount) {
                        var selectedItem = DataModule.DiscountSelection.SelectedItem;
                        if (isSelected && selectedDiscount !== undefined &&
                            selectedItem !== undefined && !DataModule.DiscountSelection.IsHeaderDiscount) {

                            if (selectedItem.SubGroupName === undefined) {
                                selectedItem.LineDiscountID = selectedDiscount.DiscountID;
                                selectedItem.IsCompliment = (selectedDiscount.DisRate===100);

                                /// alert(selectedDiscount.DiscountID);
                                CalculateTheBill();
                            }
                            else {
                                selectedItem.Items.forEach(function (elem) {
                                    elem.LineDiscountID = selectedDiscount.DiscountID;
                                    elem.IsCompliment = (selectedDiscount.DisRate===100);
                                });

                                CalculateTheBill();
                            }

                            /// console.error(selectedItem);
                        }
                        else if (DataModule.DiscountSelection.IsHeaderDiscount &&
                            isSelected && selectedDiscount) {
                            DataModule.Order.OrderHeader.DiscountID = selectedDiscount.DiscountID;

                            DataModule.Order.OrderDetails.forEach(function (elem) {
                                elem.DiscountID = selectedDiscount.DiscountID;
                                elem.IsCompliment = (selectedDiscount.DisRate===100);
                            });
                            CalculateTheBill();
                        }

                        /// console.error(DataModule.Order.OrderDetails);
                    },

                    OpenDiscountPopup: function (item, isHeaderDis) {

                        if (item === undefined) {
                            return false;
                        }

                        DataModule.DiscountSelection.IsHeaderDiscount = (isHeaderDis === undefined) ? false : isHeaderDis;
                        DataModule.DiscountSelection.IsDiscountListOpen = true;
                        DataModule.DiscountSelection.SelectedItem = item;

                        ///     console.log(item);
                    },

                    GetDiscountRate: function (discountID) {
                        let discount = DataModule.Discounts.find(function (elem) {
                            return (elem.DiscountID == discountID);
                        });

                        return (discount === undefined) ? 0 : discount.DisRate;
                    }
                };

                DataModule.ConfirmDiscount = function () {
                    console.error(DataModule.Order.OrderHeader);
                    TransactionHandler.Execute.Order.UpdateById(
                        function (response) {

                            console.error("Order Update.....");
                            console.error(response);

                            var orderID = response.Id;
                            console.error(scope.HomeDataModule.SelectedOrder.OrderCategory);
                            scope.HomeDataModule.OrdersData.LoadOrders(scope.HomeDataModule.SelectedOrder.OrderCategory, function (orders) {

                                console.error("Orders Loading.....");
                                console.error(orders);

                                let order = orders.find(function (elem) {
                                    return elem.OrderID == orderID;
                                });

                                if (order !== undefined) {
                                    scope.HomeDataModule.RightPanel.RetrieveOrderDetails(order, function (orderDetails) {
                                        console.error("Order details Loading.....");
                                        console.error(orderDetails);

                                        /// console.log(scope.HomeDataModule.OrdersData.OrderCategory);
                                        if (orderDetails !== undefined &&
                                            Array.isArray(orderDetails) &&
                                            orderDetails.length > 0) {

                                            comSingleButttonSuccessAlert("Discount Panel", "Discount successfully added to the order", "Got it!");

                                            /// console.log(scope.UiHandlers);
                                        }
                                    });
                                }
                            });

                            console.log(response);
                        },
                        DataModule.Order.OrderHeader.OrderID,
                        DataModule.Order.OrderHeader,
                        DataModule.Order.OrderDetails,
                        null,
                        false, false, false);
                };

                DataModule.PermissionRetrieval = (function () {
                    var permissionRe = {};

                    permissionRe.IsPopupOpen = false;

                    permissionRe.Users = (function () {
                        TransactionHandler.Execute.Users.ReadAll(function (response) {
                            console.log(response);
                            DataModule.PermissionRetrieval.Users = response;
                        });
                    })();

                    permissionRe.UserLevels = (function () {
                        TransactionHandler.Execute.UserLevel.ReadAll(function (response) {
                            /// console.error(response);
                            DataModule.PermissionRetrieval.UserLevels = response.UserLevels;
                        });
                    })();

                    permissionRe.Callback = function (selectedUser, password) {
                        if (selectedUser !== undefined && password !== undefined) {

                            var RestaurantID = JSON.parse(MasterDataStorageHandler.DataStorageHandler.GetLoginHelpingData()).RestaurantId;

                            TransactionHandler.Execute.AuthenticateUser(selectedUser.UserId,
                                password, RestaurantID, function (response) {
                                    if ("Error" in response) {

                                    }
                                    else {

                                        console.log(response);
                                        console.log(response.data.SessionKey);
                                        if (response.data.IsSuccessFull) {
                                            TransactionHandler.Config.SetSessionKey(response.data.SessionKey);
                                            DataModule.ConfirmDiscount();
                                            /// Callback(response.data);
                                        }
                                        else {
                                            alert("Username or password is wrong");
                                        }
                                    }
                                });
                        }
                    };

                    permissionRe.OpenPopup = function () {
                        permissionRe.IsPopupOpen = true;
                    };

                    return permissionRe;
                })();

                DataModule.NetPriceToggle = function (foodItem) {
                    foodItem.IsNet = !(foodItem.IsNet);
                    foodItem.LineDiscountID = 0;
                    CalculateTheBill();
                };

                DataModule.ServiceChargeToggle = function () {

                    var serviceChargeTog = function () {
                        DataModule.Order.OrderHeader.IsHeaderServiceChargeOn = (DataModule.Order.OrderHeader.IsHeaderServiceChargeOn === undefined) ?
                            false : !(DataModule.Order.OrderHeader.IsHeaderServiceChargeOn);
                        DataModule.Order.OrderHeader.ServiceChargeID = (DataModule.Order.OrderHeader.IsHeaderServiceChargeOn) ?
                            DataModule.ServiceCharge.ScId : 0;
                        CalculateTheBill();
                    };

                    switch (DataModule.Order.OrderHeader.OrderType) {
                        case scope.HomeDataModule.OrderCategories.DeliveryOrder.Code:
                            if (!scope.SystemSettings.SettingsDto.SystemSettings.DeliveryServiceCharge.Value) {
                                DataModule.Order.OrderHeader.IsHeaderServiceChargeOn = false;
                                CalculateTheBill();
                                comSingleButtonInfoAlert("Discount Panel", "Service charge has been deactivated.", "Got it!");
                            }
                            else {
                                serviceChargeTog();
                            }
                            break;
                        case scope.HomeDataModule.OrderCategories.TakeoutOrder.Code:
                            if (!scope.SystemSettings.SettingsDto.SystemSettings.FastFoodServiceCharge.Value) {
                                DataModule.Order.OrderHeader.IsHeaderServiceChargeOn = false;
                                CalculateTheBill();
                                comSingleButtonInfoAlert("Discount Panel", "Service charge has been deactivated.", "Got it!");
                            }
                            else {
                                serviceChargeTog();
                            }
                            break;
                        case scope.HomeDataModule.OrderCategories.DiningOrder.Code:
                            serviceChargeTog();
                            break;
                        case scope.HomeDataModule.OrderCategories.TabOrder.Code:
                            serviceChargeTog();
                            break;
                        default:
                    }
                };

                DataModule.VAT = {
                    IsVatOn: false,

                    VatToggle: function () {
                        DataModule.VAT.Init();
                        DataModule.Order.OrderDetails.forEach(function (elem) {
                            elem.IsLineVatOn = !(DataModule.VAT.IsVatOn);
                        });

                        DataModule.VAT.IsVatOn = !DataModule.VAT.IsVatOn;
                        CalculateTheBill();
                    },

                    Init: function () {
                        if (DataModule.Order.OrderDetails.length > 0) {
                            DataModule.VAT.IsVatOn = (DataModule.Order.OrderDetails[0].IsLineVatOn===undefined) ?
                                false : DataModule.Order.OrderDetails[0].IsLineVatOn;
                        }
                    }
                };

                /// Initialization
                (function () {
                    /// DataModule.VatToggle();
                    /// CalculateTheBill();
                    DataModule.ReloadOrder();
                    DataModule.FilterByFoodItems();
                    /// DataModule.ServiceChargeToggle();
                    /// CalculateTheBill();
                })();

                return DataModule;
            })(scope);

            /// Init
            (function () {
                console.error("");
                scope.DiscountPanelDataModule.ServiceChargeToggle();
                scope.DiscountPanelDataModule.ServiceChargeToggle();
            })();
        }
    });
    cloudPOS.ng.application.controller('DiscountPanelController', [
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
        'BillCalculations02',
        cloudPOS.controllers.DiscountPanelController
    ]).run(function ($log) {
        $log.info("DiscountPanelController initialized");
    });
}(cloudPOS.controllers || {}));
