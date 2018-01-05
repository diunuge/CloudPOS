(function (module) {
    cloudPOS.directives = _.extend(module, {
        FoodRemarksSelectionPanelDirective: function () {
            return {
                restrict: 'E',
                scope: {
                    showup: "=",
                    callback: "=",
                    options: "=",
                    currentfoodremarks: "=",
                    currentquantity: "=",
                    isOpenFood: "=",
                    price: "="
                },
                templateUrl: 'views/directives/foodRemarksSelectionPanelView.html',
                link: function($scope, elem, attrs) {

                    /// Main background frame
                    var bgFrame = elem.find(".bgFrame");

                    /// FoodRemarks
                    $scope.FoodRemarks = "";

                    /// Open the popup model box
                    $scope.OpenPopup = function () {
                        bgFrame.css("display", "flex");
                        bgFrame.css("position", "fixed");
                    };

                    /// Add food remarks from the list to the food remarks
                    $scope.AddFoodRemark = function (remark) {
                        if ($scope.FoodRemarks.length > 0) {
                            $scope.FoodRemarks += ", " + remark;
                        }
                        else {
                            $scope.FoodRemarks = remark;
                        }
                    };

                    /// Close the popup model box
                    $scope.ClosePopup = function (isConfirmed) {
                        bgFrame.css("display", "none");

                        if (isConfirmed == true) {
                            $scope.callback(isConfirmed, $scope.FoodRemarks, $scope.currentquantity);
                        }
                        else {
                            $scope.callback(isConfirmed, null, null);
                        }

                        $scope.showup = false;
                    };

                    /// Increment quantity by one
                    $scope.IncrementQty = function () {
                        $scope.currentquantity =  Number($scope.currentquantity) + 1;
                    };

                    /// Decrement quantity by one
                    $scope.DecrementQty = function () {
                        if ($scope.currentquantity > 1) {
                            $scope.currentquantity = Number($scope.currentquantity) - 1;
                        }
                    };

                    /// If showup paramter is true, open the popup, other wise close it
                    $scope.$watch("showup", function (newVal) {
                        if (newVal !== undefined) {
                            if (newVal) {
                                $scope.FoodRemarks = "";
                                $scope.OpenPopup();
                            }
                            else {
                               /// $scope.ClosePopup(false);
                            }
                        }
                    });

                    ///
                    $scope.$watch("currentfoodremarks", function () {
                        $scope.FoodRemarks = $scope.currentfoodremarks;
                    });
                }
            };
        }
    });
}(cloudPOS.directives || {}));

cloudPOS.ng.application.directive("foodRemarksSelectionPanel", [
    cloudPOS.directives.FoodRemarksSelectionPanelDirective]).run(function ($log) {
    $log.info("FoodRemarksSelectionPanel initialized");
});