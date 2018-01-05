(function (module) {
    cloudPOS.directives = _.extend(module, {
        NumericKeyPadDirective: function (filter) {
            return {
                restrict: 'E',
                scope: {
                    value: "=",
                    dueAmount: "=",
                    total: "=",
                    isSecondKeypadOn: "=?",
                    keypadLock: "=?"
                },
                templateUrl: 'views/directives/numericKeyPadView.html',
                link: function(scope, elem, attrs){

                    scope.DueAmountValue = 0;

                    scope.KeyPress = function (value) {
                        scope.value = (Number(scope.value) * 10) + Number(value);
                    };

                    scope.AddValue = function (value) {
                        scope.value = Number(scope.value) + Number(value);
                    };

                    scope.Clear = function () {
                        scope.value = 0;
                    };

                    scope.Backspace = function () {
                        scope.value = Math.floor(Number(scope.value) / 10);
                    };

                    scope.DueAmountToggle = function () {
                        if (Number(scope.value) >= Number(scope.dueAmount)) {
                            scope.value = 0;
                            scope.DueAmountValue = Number(filter("currency")(scope.dueAmount, "", 2));
                        }
                        else {
                            scope.value = Number(filter("currency")(scope.dueAmount, "", 2));
                            scope.DueAmountValue = 0;
                        }
                    };

                    scope.$watch("value", function (newVal) {
                        if (Number(newVal) >= Number(scope.dueAmount)) {
                            scope.DueAmountValue = 0;
                        }
                        else {
                            scope.DueAmountValue = (scope.dueAmount < 0) ? 0 : scope.dueAmount;
                        }
                    });

                    scope.$watch("dueAmount", function (newVal) {
                        if (!isNaN(Number(newVal))) {
                            scope.DueAmountValue = (scope.dueAmount < 0) ? 0 : scope.dueAmount;
                        }
                    });
                }
            };
        }
    });
}(cloudPOS.directives || {}));

cloudPOS.ng.application.directive("numericKeyPadDirective", [
    '$filter',
    cloudPOS.directives.NumericKeyPadDirective
]).run(function ($log) {
    $log.info("NumericKeyPadDirective initialized");
});