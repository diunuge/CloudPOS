(function (module) {
    cloudPOS.directives = _.extend(module, {
        PermissionRetrievalDirective: function (filterFilter) {
            return {
                restrict: 'E',
                scope: {
                    users: "=",
                    userLevels: "=",
                    callback: "=",
                    managementLevelUsers: "=?",
                    show: "="
                },
                templateUrl: 'views/directives/permissionRetrievalView.html',
                link: function($scope, elem, attrs) {
                    $scope.FilteredUsers = [];
                    $scope.Password = "";

                    $scope.UserClick = function (e, user) {
                        $(e.currentTarget).parent().find("button").removeClass("active");
                        $(e.currentTarget).addClass("active");
                        SelectedUser = user;
                    };

                    $scope.Confirm = function () {
                        if (SelectedUser != null && $scope.Password != "") {
                            $scope.callback(SelectedUser, $scope.Password);
                            $scope.show = false;
                        }
                        else {
                            $scope.callback(null, null);
                        }
                    };

                    $scope.Cancel = function () {
                        $scope.show = false;
                        $scope.callback();
                    };

                    var SelectedUser = null;
                    var FilterUsers = function () {

                        var managementUserLevel = filterFilter($scope.userLevels, function (elem) {
                            return elem.UserLevelName.toUpperCase() == "ADMINISTRATOR" ||
                            elem.UserLevelName.toUpperCase() == "MANAGER";
                        });

                        managementUserLevel = (managementUserLevel === undefined) ? [] : managementUserLevel;

                        var fil = filterFilter($scope.users, function (elem) {

                            for (let i in managementUserLevel) {
                                if (managementUserLevel[i].UserLevelId == elem.UserLevel) {
                                    return true;
                                }
                            }
                        });

                        /// console.error(fil);
                        $scope.FilteredUsers = fil;
                    };

                    $scope.$watch("show", function (newVal) {
                        if (newVal) {
                            $scope.Password = "";
                            $(elem).css("display", "flex");
                        }
                        else {
                            $(elem).css("display", "none");
                        }
                    });

                    $scope.$watch("users", function (newVal) {
                        console.log(newVal);
                        if(Array.isArray($scope.userLevels) && $scope.userLevels.length > 0) {
                            FilterUsers();
                        }
                    });

                    $scope.$watch("userLevels", function (newVal) {
                        console.log(newVal);
                        if(Array.isArray($scope.users) && $scope.users.length > 0) {
                            FilterUsers();
                        }
                    });
                }
            };
        }
    });
}(cloudPOS.directives || {}));

cloudPOS.ng.application.directive("permissionRetrievalDirective", [
    'filterFilter',
    cloudPOS.directives.PermissionRetrievalDirective]).run(function ($log) {
    $log.info("PermissionRetrievalDirective initialized");
});