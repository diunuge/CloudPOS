(function (module) {
    cloudPOS.directives = _.extend(module, {
        PermissionRetrievalDialogBoxDirective: function () {
            return {
                restrict: 'E',
                scope: {
                    showup: "=",
                    callback: "=?"
                },
                templateUrl: 'views/directives/permissionRetrievalDialogBoxView.html',
                link: function($scope, elem, attrs) {

                    /// Main background frame
                    var bgFrame = elem.find(".bgFrame");

                    $scope.Credentials = {Password: "", Username: ""};

                    /// Response that return to the callback
                    $scope.Response = "This is a test";

                    /// Open the popup model box
                    $scope.OpenPopup = function () {
                        bgFrame.css("display", "flex");
                        bgFrame.css("position", "fixed");
                    };

                    /// Selects an item from the list
                    $scope.SelectOption = function (e, item) {
                        $scope.Response += ($scope.Response == "") ? item.msg : ", " + item.msg;
                    };

                    /// Retrieve the state of the order detail from the user
                    $scope.OrderDetailState = function (state) {

                    };

                    /// Close the popup model box
                    $scope.ClosePopup = function (isConfirmed) {
                        bgFrame.css("display", "none");

                        if (isConfirmed == true) {
                            $scope.callback(isConfirmed, $scope.Credentials);
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

cloudPOS.ng.application.directive("permissionRetrievalDialogBox", [
    cloudPOS.directives.PermissionRetrievalDialogBoxDirective]).run(function ($log) {
    $log.info("PermissionRetrievalDialogBoxDirective initialized");
});