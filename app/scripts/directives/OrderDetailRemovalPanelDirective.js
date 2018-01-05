(function (module) {
    cloudPOS.directives = _.extend(module, {
        OrderDetailRemovalPanelDirective: function () {
            return {
                restrict: 'E',
                scope: {
                    showup: "=",
                    callback: "=",
                    options: "="
                },
                templateUrl: 'views/directives/orderDetailRemovalPanelView.html',
                link: function($scope, elem, attrs) {

                    /// Main background frame
                    var bgFrame = elem.find(".bgFrame");

                    var orderDetailState = "Not Served";

                    /// Response that return to the callback
                    $scope.Response = "";

                    /// Open the popup model box
                    $scope.OpenPopup = function () {
                        bgFrame.css("display", "flex");
                        bgFrame.css("position", "fixed");
                        $scope.Response = "";
                    };

                    /// Selects an item from the list
                    $scope.SelectOption = function (e, item) {
                        $scope.Response += ($scope.Response == "") ? item.msg : ", " + item.msg;
                    };

                    /// Retrieve the state of the order detail from the user
                    $scope.OrderDetailState = function (state) {
                        orderDetailState = state;
                    };

                    /// Close the popup model box
                    $scope.ClosePopup = function (isConfirmed) {
                        bgFrame.css("display", "none");

                        if (isConfirmed == true) {
                            $scope.Response += "," + orderDetailState;
                            $scope.callback(isConfirmed, $scope.Response);
                        }
                        else {
                            $scope.callback(isConfirmed, null);
                        }

                        $scope.showup = false;
                    };

                    /// Watch showup parameter,
                    /// and open the popup
                    $scope.$watch("showup", function (newVal, oldVal) {
                        if (newVal !== undefined) {
                            if (newVal) {
                                $scope.OpenPopup();
                            }
                            else {
                                $scope.ClosePopup(false);
                            }
                        }
                    });
                }
            };
        }
    });
}(cloudPOS.directives || {}));

cloudPOS.ng.application.directive("orderDetailRemovalPanel", [
    cloudPOS.directives.OrderDetailRemovalPanelDirective]).run(function ($log) {
    $log.info("OrderDetailRemovalPanelDirective initialized");
});