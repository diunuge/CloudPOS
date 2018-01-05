(function (module) {
    cloudPOS.directives = _.extend(module, {

        UsersSelectionDirective: function () {

            return {
                restrict: "E",
                scope: {
                    callback: "=",
                    showup: "=",

                    /// Options to be displayed on the list
                    options: "="
                },
                templateUrl: "views/directives/usersSelectionView.html",
                link: function ($scope, elem, attrs) {

                    /// Selected item
                    var selectedOption = null;

                    /// Background window
                    var bgFrame = elem.find(".bgFrame");

                    /// Select a particular user from the list
                    $scope.SelectOption = function (e, option) {
                        selectedOption = option;
                        ListBox(e);
                    };

                    /// Open the popup model box
                    $scope.OpenPopup = function () {
                        bgFrame.css("display", "flex");
                        bgFrame.css("position", "fixed");
                    };

                    /// Close the popup model box
                    $scope.ClosePopup = function (isConfirmed) {
                        bgFrame.css("display", "none");

                        if (isConfirmed == true) {
                            $scope.callback(isConfirmed, selectedOption);
                        }
                        else {
                            $scope.callback(isConfirmed, null);
                        }

                        $scope.showup = false;
                    };

                    /// List box controlling function
                    var ListBox = function (e) {
                        elem.find(".listview>.list").removeClass("active");
                        $(e.currentTarget).addClass("active");
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

cloudPOS.ng.application.directive("usersSelectionDirective", [

    cloudPOS.directives.UsersSelectionDirective]).run(function ($log) {
    $log.info("UsersSelectionDirective initialized");
});