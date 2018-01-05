(function (module) {
    cloudPOS.directives = _.extend(module, {

        TaxDiscountModelBoxDirective: function (filterFilter, BillCalculations, BillCalculations02) {

            return {
                restrict: "E",
                scope: {
                    callback: "=",
                    showup: "=",
                    orderDetails: "=",
                    orderHeader: "=",
                    taxes: "=",
                    discounts: "=",
                    serviceCharge: "="
                },
                templateUrl: "views/directives/taxDiscountModelBoxView.html",
                link: function ($scope, elem, attrs) {

                    var isValid = false;

                    /// Validate the isolated scope
                    (function () {

                        var isInvalid = false;

                        /// Validate orderDetails array
                        $scope.$watch("orderDetails", function (newVal) {
                            if (!Array.isArray(newVal)) {
                                isInvalid = true;
                            }
                        });

                        /// Validate discounts array
                        $scope.$watch("discounts", function (newVal) {
                            if(!Array.isArray(newVal)){
                                isInvalid = true;
                            }
                        });

                        /// Set validity checking variables
                        if (!isInvalid) {
                            isValid = true
                        }

                    })();

                    /// Main Group
                    $scope.Group = {
                        GroupName: "",
                        NetTotal: 0,
                        TotalAmount: 0,
                        TotalTax: 0,
                        ServiceCharge: 0,
                        TotalDiscount: 0,
                        FullDiscountID: 0,
                        FullDiscountPrice: 0,
                        Items: []
                    };

                    /// SubGroup
                    var SubGroup = {
                        SubGroupName: "",
                        Items: [],
                        NetPrice: 0.0,
                        IsNetPrice: false,
                        DiscountAmount: 0.0
                    };

                    $scope.FilteredOrderDetails = [];

                    /// Toggle IsNet boolean value
                    $scope.NetPriceToggle = function (e, item) {
                        let isNet = item.IsNetPrice;

                        console.log(item);

                        /// $(e.currentTarget).find("SPAN").html() === "ON";
                        /// $(e.currentTarget).find("SPAN").html((isNet) ? "OFF" : "ON");

                        for (let i = 0; i < item.Items.length; i++) {
                            item.Items[i].IsNet = !isNet;
                        }

                        item.IsNetPrice = !isNet;

                        BillCalculations02.Execute();

                        switch($scope.Group.GroupName) {
                            case "FoodCategory":
                                GroupFoodItems("FoodCategory" , "FoodCatId");
                                break;
                            case "FoodType":
                                GroupFoodItems("FoodType" , "FoodCatId");
                                break;
                            case "FoodItem":
                                GroupFoodItems("FoodItem" , "FoodCatId");
                                break;
                            default:
                        }
                    };

                    /// Toggle Vat
                    $scope.ToggleVAT = function (e) {
                        $(e.currentTarget).find("SPAN").html((BillCalculations02.IsVatOn == true) ? "OFF" : "ON");
                        BillCalculations02.IsVatOn = !BillCalculations02.IsVatOn;
                        BillCalculations02.Execute();
                    };

                    /// Toggle SC boolean value
                    $scope.ToggleServiceCharge = function (e, item) {

                        let isHeaderServiceChargeOn = !(($scope.orderHeader.IsHeaderServiceChargeOn === undefined) ? false : $scope.orderHeader.IsHeaderServiceChargeOn);

                        $(e.currentTarget).find("SPAN").html((isHeaderServiceChargeOn == true) ? "OFF" : "ON");

                        $scope.orderHeader.IsHeaderServiceChargeOn = isHeaderServiceChargeOn;

                        BillCalculations02.Execute();
                    };

                    /// Handles the operations of the popup
                    $scope.DiscountPopup = (function(){

                        var response = {};

                        var ClickedItem = null;

                        /// Boolean value which is required by popup
                        response.OpenPopupStatus = false;

                        /// Callback for popup window
                        response.Callback = function (isConfirmed, option) {

                            if (isConfirmed == true && option != null && ClickedItem != null) {
                                /// console.error(option);
                                /// console.error(ClickedItem);

                                for (let i1 = 0; i1 < ClickedItem.Items.length; i1++) {

                                    let items = ClickedItem.Items[i1];
                                    items.LineDiscountID = option.DiscountID;
                                }

                                BillCalculations02.Execute();

                                switch($scope.Group.GroupName) {
                                    case "FoodCategory":
                                        $scope.GroupByFoodCategory();
                                        break;
                                    case "FoodType":
                                        $scope.GroupByFoodType();
                                        break;
                                    case "FoodItems":
                                        $scope.GroupByFoodItem();
                                        break;
                                    default:
                                }

                                console.error($scope.orderDetails);
                            }
                            else if (isConfirmed && option != null) {

                                var orderHeader = $scope.orderHeader;
                                var orderDetails = $scope.orderDetails;

                                orderHeader.DiscountID = option.DiscountID;

                                console.log($scope.orderHeader);

                                for (let i = 0; i < orderDetails.length; i++) {
                                    orderDetails[i].DiscountID = option.DiscountID;
                                }

                                BillCalculations02.Execute();
                            }
                        };

                        /// Used to open the popup window
                        response.OpenPopup = function (item) {

                            ClickedItem = item;
                            response.OpenPopupStatus = true;
                        };

                        return response;
                    })();

                    /// Group food items by their FoodTypeIDs or FoodCategoryIDs
                    var GroupFoodItems = function (groupName, propertyName) {
                        if (!isValid) {
                            return false;
                        }
                        /// console.log($scope.orderDetails);

                        var orderDetails = $scope.orderDetails;
                        var tempPropertyIDs = [];
                        var totalAmount = 0;
                        var totalTax = 0;
                        var serviceCharge = 0;
                        var totalDiscount = 0;
                        var netTotal = 0;

                        $scope.Group.GroupName = groupName;
                        $scope.Group.Items = [];
                        $scope.Group.FullDiscountPrice = 0;
                        $scope.Group.TotalAmount = 0;
                        $scope.Group.ServiceCharge = 0;
                        $scope.Group.TotalDiscount = 0;
                        $scope.Group.TotalTax = 0;

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
                            let subGroup = $.extend({}, SubGroup);
                            subGroup.Items = [];
                            subGroup.SubGroupName = tempPropertyIDs[i1];
                            for (let i2 = 0; i2 < orderDetails.length; i2++) {
                                if (tempPropertyIDs[i1] == orderDetails[i2][propertyName]) {
                                    subGroup.Items.push(orderDetails[i2]);
                                    subGroup.IsNetPrice = orderDetails[i2].IsNet;
                                    subGroup.NetPrice += Number(orderDetails[i2].NetPrice);
                                    subGroup.DiscountAmount += Number(orderDetails[i2].LineDiscountPrice);
                                    totalDiscount += Number(orderDetails[i2].LineDiscountPrice);
                                    totalAmount += Number(orderDetails[i2].TotalPrice);
                                    totalTax += Number(orderDetails[i2].TaxPrice);
                                    serviceCharge += Number(orderDetails[i2].ServiceChargePrice);
                                    netTotal += Number(orderDetails[i2].NetPrice);
                                }
                            }

                            $scope.Group.Items.push(subGroup);
                        }

                        $scope.Group.TotalAmount = totalAmount;
                        $scope.Group.TotalTax = totalTax;
                        $scope.Group.ServiceCharge = serviceCharge;
                        $scope.Group.NetTotal = netTotal;
                        $scope.Group.TotalDiscount = totalDiscount;
                    };

                    /// Filter food items by food category and
                    /// set IsNet values of all the items to false
                    $scope.GroupByFoodCategory = function () {
                        if (!isValid) {return false;}

                        GroupFoodItems("FoodCategory" , "FoodCatId");
                        SetIsNet(false);
                        BillCalculations02.Execute();
                        GroupFoodItems("FoodCategory" , "FoodCatId");
                    };

                    /// Filter food items by food category and
                    /// set IsNet values of all the items to false
                    $scope.GroupByFoodType = function () {
                        if (!isValid) {return false;}

                        GroupFoodItems("FoodType", "FoodTypeId");
                        SetIsNet(false);
                        BillCalculations.Execute();
                        GroupFoodItems("FoodType", "FoodTypeId");
                    };

                    $scope.GroupByFoodItem = function () {
                        if (!isValid) {return false;}

                        GroupFoodItems("FoodItems", "FoodId");
                    };

                    /// Set IsNet property of Groups to the specified value
                    var SetIsNet = function (isNet) {

                        for (let i1 = 0; i1 < $scope.Group.Items.length; i1++) {

                            let subGroups = $scope.Group.Items[i1];
                            for (let i2 = 0; i2 < subGroups.Items.length; i2++) {
                                subGroups.Items[i2].IsNet = isNet;
                            }
                        }
                    };

                    /// Confirms discounts added by users
                    $scope.ConfirmDiscounts = function () {
                        $scope.callback();
                    };

                    /// Perform initialization tasks
                    (function (scope) {

                        /// Initialize BillCalculations
                        (function () {
                            /// BillCalculations.SetServiceCharge(scope.serviceCharge);
                            /// BillCalculations.SetOrder(scope.orderHeader, scope.orderDetails);
                            /// BillCalculations02.SetTaxes(scope.taxes);

                            BillCalculations02.SetOrder(scope.orderHeader, scope.orderDetails);
                            BillCalculations02.SetServiceCharge(scope.serviceCharge);
                            BillCalculations02.SetDiscounts(scope.discounts);
                            BillCalculations02.Execute();

                            /// BillCalculations.SetTaxes(scope.taxes);
                            /// BillCalculations.SetDiscountRates([], scope.discounts);
                            /// console.log(scope.orderDetails);
                            /// BillCalculations.Execute();
                        })();
                    })($scope);
                }
            };
        }
    });
}(cloudPOS.directives || {}));

cloudPOS.ng.application.directive("taxDiscountModelBox", [
    'filterFilter',
    'BillCalculations',
    'BillCalculations02',
    cloudPOS.directives.TaxDiscountModelBoxDirective]).run(function ($log) {
    $log.info("TaxDiscountModelBoxDirective initialized");
});